use std::{
    fs::File,
    io::{Read, Write},
    path::Path,
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};

use tauri::AppHandle;
use thiserror::Error;

use crate::{
    core::{
        events::{emit_output, emit_status, CliOutputEvent, CliStatusEvent},
        execution_engine::ResolvedCommand,
    },
    terminal::pty_manager,
};

pub struct InteractiveSessionHandle {
    pub writer: Arc<Mutex<Box<dyn std::io::Write + Send>>>,
    pub child: Arc<Mutex<Box<dyn portable_pty::Child + Send>>>,
    pub status: Arc<Mutex<String>>,
    /// Prevent the MasterPty from being dropped (which kills the session on Windows).
    pub _master: Arc<Mutex<Box<dyn portable_pty::MasterPty + Send>>>,
}

#[derive(Debug, Error)]
pub enum InteractiveRunnerError {
    #[error("pty error: {0}")]
    Pty(String),
    #[error("unable to spawn reader thread: {0}")]
    ReaderThread(String),
}

pub fn start_interactive_session(
    app: AppHandle,
    session_id: String,
    cli_name: String,
    command: ResolvedCommand,
) -> Result<InteractiveSessionHandle, InteractiveRunnerError> {
    let pty_process = pty_manager::spawn_pty_process(&command)
        .map_err(|error| InteractiveRunnerError::Pty(error.to_string()))?;

    let writer = Arc::new(Mutex::new(pty_process.writer));
    let child = Arc::new(Mutex::new(pty_process.child));
    let status = Arc::new(Mutex::new("running".to_string()));
    let master = Arc::new(Mutex::new(pty_process._master));

    let thread_status = Arc::clone(&status);
    let thread_child = Arc::clone(&child);
    let thread_app = app.clone();
    let thread_session_id = session_id.clone();
    let thread_cli_name = cli_name.clone();
    let thread_cwd = command.cwd.clone();
    let mut log_file = open_session_log(&cli_name, &session_id);
    if let Some(ref mut file) = log_file {
        let cwd = thread_cwd.as_deref().unwrap_or_else(|| Path::new("unknown"));
        let _ = writeln!(file, "# Session: {} | {} | `{}`\n", cli_name, session_id, cwd.display());
    }

    thread::Builder::new()
        .name(format!("pty-reader-{}", &session_id))
        .spawn(move || {
            let mut reader = pty_process.reader;
            let mut buffer = vec![0_u8; 4096];
            let mut thread_log_file = log_file;
            let mut output_buffer = String::new();

            loop {
                match reader.read(&mut buffer) {
                    Ok(0) => {
                        if !output_buffer.is_empty() {
                            let line = output_buffer.trim_end_matches('\n').trim_end_matches('\r').to_string();
                            if !line.is_empty() {
                                write_log_line(&mut thread_log_file, &format!("**🤖 CLI:** `{}`", line));
                            }
                            output_buffer.clear();
                        }

                        let exit_status = {
                            let mut child_guard = match thread_child.lock() {
                                Ok(guard) => guard,
                                Err(_) => {
                                    write_log_line(
                                        &mut thread_log_file,
                                        &format!("**❌ Error:** session={} message=child lock poisoned", thread_session_id),
                                    );
                                    if let Ok(mut guard) = thread_status.lock() {
                                        *guard = "error".to_string();
                                    }

                                    emit_status(
                                        &thread_app,
                                        CliStatusEvent {
                                            session_id: Some(thread_session_id.clone()),
                                            run_id: None,
                                            cli_name: thread_cli_name.clone(),
                                            status: "error".to_string(),
                                            message: Some("child lock poisoned".to_string()),
                                            exit_code: None,
                                        },
                                    );
                                    break;
                                }
                            };

                            match child_guard.try_wait() {
                                Ok(status) => status,
                                Err(error) => {
                                    write_log_line(
                                        &mut thread_log_file,
                                        &format!(
                                            "**❌ Error:** session={} message=try_wait failed: {}",
                                            thread_session_id, error
                                        ),
                                    );
                                    if let Ok(mut guard) = thread_status.lock() {
                                        *guard = "error".to_string();
                                    }

                                    emit_status(
                                        &thread_app,
                                        CliStatusEvent {
                                            session_id: Some(thread_session_id.clone()),
                                            run_id: None,
                                            cli_name: thread_cli_name.clone(),
                                            status: "error".to_string(),
                                            message: Some(format!("try_wait failed: {}", error)),
                                            exit_code: None,
                                        },
                                    );
                                    break;
                                }
                            }
                        };

                        let Some(exit_status) = exit_status else {
                            thread::sleep(Duration::from_millis(25));
                            continue;
                        };

                        let already_stopped = thread_status
                            .lock()
                            .map(|guard| guard.as_str() == "stopped")
                            .unwrap_or(false);
                        if already_stopped {
                            break;
                        }

                        write_log_line(
                            &mut thread_log_file,
                            &format!("\n**Session ended:** `{:?}`\n", exit_status.exit_code()),
                        );
                        if let Ok(mut guard) = thread_status.lock() {
                            *guard = "completed".to_string();
                        }

                        emit_status(
                            &thread_app,
                            CliStatusEvent {
                                session_id: Some(thread_session_id.clone()),
                                run_id: None,
                                cli_name: thread_cli_name.clone(),
                                status: "completed".to_string(),
                                message: Some("interactive session ended".to_string()),
                                exit_code: Some(exit_status.exit_code() as i32),
                            },
                        );
                        break;
                    }
                    Ok(size) => {
                        let chunk = String::from_utf8_lossy(&buffer[..size]).to_string();
                        output_buffer.push_str(&chunk);

                        while let Some (newline_pos) = output_buffer.find('\n') {
                            let line = output_buffer[..newline_pos].to_string();
                            output_buffer.drain(..=newline_pos);
                            if !line.is_empty() || line.is_empty() {
                                write_log_line(&mut thread_log_file, &format!("**🤖 CLI:** `{}`", line));
                            }
                        }

                        emit_output(
                            &thread_app,
                            CliOutputEvent {
                                session_id: Some(thread_session_id.clone()),
                                run_id: None,
                                cli_name: thread_cli_name.clone(),
                                chunk,
                                stream: "stdout".to_string(),
                            },
                        );
                    }
                    Err(error) => {
                        if !output_buffer.is_empty() {
                            let line = output_buffer.trim_end_matches('\n').trim_end_matches('\r').to_string();
                            if !line.is_empty() {
                                write_log_line(&mut thread_log_file, &format!("**🤖 CLI:** `{}`", line));
                            }
                            output_buffer.clear();
                        }

                        write_log_line(
                            &mut thread_log_file,
                            &format!("**❌ Error:** session={} message={}", thread_session_id, error),
                        );
                        if let Ok(mut guard) = thread_status.lock() {
                            *guard = "error".to_string();
                        }

                        emit_status(
                            &thread_app,
                            CliStatusEvent {
                                session_id: Some(thread_session_id.clone()),
                                run_id: None,
                                cli_name: thread_cli_name.clone(),
                                status: "error".to_string(),
                                message: Some(error.to_string()),
                                exit_code: None,
                            },
                        );
                        break;
                    }
                }
            }
        })
        .map_err(|error| InteractiveRunnerError::ReaderThread(error.to_string()))?;

    Ok(InteractiveSessionHandle {
        writer,
        child,
        status,
        _master: master,
    })
}

fn open_session_log(cli_name: &str, session_id: &str) -> Option<File> {
    let _ = (cli_name, session_id);
    None
}

fn write_log_line(log_file: &mut Option<File>, line: &str) {
    if let Some(file) = log_file.as_mut() {
        let _ = writeln!(file, "{}", line);
    }
}
