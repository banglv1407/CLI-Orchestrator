use std::{
    collections::HashMap,
    io::Write,
    path::Path,
    sync::{Arc, Mutex},
};

use serde::Serialize;
use tauri::AppHandle;
use thiserror::Error;
use tokio::sync::RwLock;
use uuid::Uuid;

use crate::{
    core::{
        events::{emit_status, CliStatusEvent},
        execution_engine::ResolvedCommand,
    },
    runners::interactive_runner,
};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionInfo {
    pub id: String,
    pub cli_name: String,
    pub status: String,
    pub working_dir: Option<String>,
    pub project_tag: Option<String>,
}

struct Session {
    id: String,
    cli_name: String,
    working_dir: Option<String>,
    project_tag: Option<String>,
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    child: Arc<Mutex<Box<dyn portable_pty::Child + Send>>>,
    status: Arc<Mutex<String>>,
    log_file: Arc<Mutex<Option<std::fs::File>>>,
    /// Prevent the MasterPty from being dropped (kills session on Windows).
    _master: Arc<Mutex<Box<dyn portable_pty::MasterPty + Send>>>,
}

#[derive(Debug, Error)]
pub enum SessionError {
    #[error("session not found: {0}")]
    SessionNotFound(String),
    #[error("session is not running: {0} (status: {1})")]
    SessionInactive(String, String),
    #[error("interactive runner error: {0}")]
    Runner(String),
    #[error("lock poisoned")]
    LockPoisoned,
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
}

pub struct SessionManager {
    sessions: Arc<RwLock<HashMap<String, Arc<Session>>>>,
}

impl SessionManager {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub async fn create_session(
        &self,
        app: AppHandle,
        cli_name: String,
        working_dir: Option<String>,
        project_tag: Option<String>,
        command: ResolvedCommand,
    ) -> Result<SessionInfo, SessionError> {
        let session_id = format!("{}-{}", cli_name, Uuid::new_v4().as_simple());
        let (spawn_command, startup_input) = prepare_interactive_spawn_command(&cli_name, command);

        let log_cwd = spawn_command.cwd.clone();
        let handle = interactive_runner::start_interactive_session(
            app.clone(),
            session_id.clone(),
            cli_name.clone(),
            spawn_command,
        )
        .map_err(|error| SessionError::Runner(error.to_string()))?;

        let mut log_file = open_session_log(&cli_name, &session_id);
        if let Some(ref mut file) = log_file {
            let cwd = log_cwd.as_deref().unwrap_or_else(|| Path::new("unknown"));
            let _ = writeln!(
                file,
                "# Session: {} | {} | `{}`\n",
                cli_name,
                session_id,
                cwd.display()
            );
        }

        if let Some(input) = startup_input {
            let mut writer = handle
                .writer
                .lock()
                .map_err(|_| SessionError::LockPoisoned)?;
            writer.write_all(input.as_bytes())?;
            writer.flush()?;
        }

        let session = Arc::new(Session {
            id: session_id.clone(),
            cli_name: cli_name.clone(),
            working_dir: working_dir.clone(),
            project_tag: project_tag.clone(),
            writer: handle.writer,
            child: handle.child,
            status: handle.status,
            log_file: Arc::new(Mutex::new(log_file)),
            _master: handle._master,
        });

        {
            let mut guard = self.sessions.write().await;
            guard.insert(session_id.clone(), session);
        }

        emit_status(
            &app,
            CliStatusEvent {
                session_id: Some(session_id.clone()),
                run_id: None,
                cli_name: cli_name.clone(),
                status: "started".to_string(),
                message: Some("interactive session started".to_string()),
                exit_code: None,
            },
        );

        Ok(SessionInfo {
            id: session_id,
            cli_name,
            status: "running".to_string(),
            working_dir,
            project_tag,
        })
    }

    pub async fn send_input(&self, session_id: &str, input: &str) -> Result<(), SessionError> {
        let session = {
            let guard = self.sessions.read().await;
            guard.get(session_id).cloned()
        }
        .ok_or_else(|| SessionError::SessionNotFound(session_id.to_string()))?;

        let status = session
            .status
            .lock()
            .map_err(|_| SessionError::LockPoisoned)?
            .clone();
        if status != "running" {
            return Err(SessionError::SessionInactive(
                session_id.to_string(),
                status,
            ));
        }

        if let Ok(mut log_guard) = session.log_file.lock() {
            if let Some(ref mut file) = *log_guard {
                let _ = writeln!(
                    file,
                    "**🧑 User:** `{}`",
                    input.trim_end_matches('\n').trim_end_matches('\r')
                );
            }
        }

        let mut writer = session
            .writer
            .lock()
            .map_err(|_| SessionError::LockPoisoned)?;
        if let Err(error) = writer.write_all(input.as_bytes()) {
            if let Ok(mut status_guard) = session.status.lock() {
                *status_guard = "error".to_string();
            }
            return Err(SessionError::Io(error));
        }
        if let Err(error) = writer.flush() {
            if let Ok(mut status_guard) = session.status.lock() {
                *status_guard = "error".to_string();
            }
            return Err(SessionError::Io(error));
        }

        Ok(())
    }

    pub async fn resize_session(
        &self,
        session_id: &str,
        rows: u16,
        cols: u16,
    ) -> Result<(), SessionError> {
        let session = {
            let guard = self.sessions.read().await;
            guard.get(session_id).cloned()
        }
        .ok_or_else(|| SessionError::SessionNotFound(session_id.to_string()))?;

        let master = session
            ._master
            .lock()
            .map_err(|_| SessionError::LockPoisoned)?;
        master
            .resize(portable_pty::PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|error| {
                SessionError::Io(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    error.to_string(),
                ))
            })?;

        Ok(())
    }

    pub async fn stop_session(
        &self,
        app: &AppHandle,
        session_id: &str,
    ) -> Result<(), SessionError> {
        let session = {
            let mut guard = self.sessions.write().await;
            guard.remove(session_id)
        }
        .ok_or_else(|| SessionError::SessionNotFound(session_id.to_string()))?;

        {
            let mut status = session
                .status
                .lock()
                .map_err(|_| SessionError::LockPoisoned)?;
            *status = "stopped".to_string();
        }

        {
            let mut child = session
                .child
                .lock()
                .map_err(|_| SessionError::LockPoisoned)?;
            let _ = child.kill();
        }

        emit_status(
            app,
            CliStatusEvent {
                session_id: Some(session_id.to_string()),
                run_id: None,
                cli_name: session.cli_name.clone(),
                status: "stopped".to_string(),
                message: Some("session stopped by user".to_string()),
                exit_code: None,
            },
        );

        Ok(())
    }

    pub async fn list_sessions(&self) -> Vec<SessionInfo> {
        let guard = self.sessions.read().await;
        guard
            .values()
            .map(|session| {
                let status = session
                    .status
                    .lock()
                    .map(|value| value.clone())
                    .unwrap_or_else(|_| "error".to_string());

                SessionInfo {
                    id: session.id.clone(),
                    cli_name: session.cli_name.clone(),
                    status,
                    working_dir: session.working_dir.clone(),
                    project_tag: session.project_tag.clone(),
                }
            })
            .collect()
    }
}

fn prepare_interactive_spawn_command(
    cli_name: &str,
    command: ResolvedCommand,
) -> (ResolvedCommand, Option<String>) {
    #[cfg(target_os = "windows")]
    {
        if should_bootstrap_via_cmd_shell(cli_name, &command) {
            return build_windows_shell_bootstrap(command);
        }
    }

    (command, None)
}

#[cfg(target_os = "windows")]
fn should_bootstrap_via_cmd_shell(cli_name: &str, command: &ResolvedCommand) -> bool {
    if cli_name.eq_ignore_ascii_case("shell") {
        return false;
    }

    let normalized = command.command.trim().to_ascii_lowercase();
    !(normalized == "cmd"
        || normalized.ends_with("cmd.exe")
        || normalized.ends_with("powershell.exe")
        || normalized.ends_with("pwsh.exe"))
}

#[cfg(target_os = "windows")]
fn build_windows_shell_bootstrap(command: ResolvedCommand) -> (ResolvedCommand, Option<String>) {
    let mut command_line_parts = Vec::with_capacity(command.args.len() + 1);
    command_line_parts.push(quote_windows_cmd_arg(&command.command));
    command_line_parts.extend(command.args.iter().map(|arg| quote_windows_cmd_arg(arg)));

    let startup_input = format!("{}\r\n", command_line_parts.join(" "));
    let shell_command = ResolvedCommand {
        command: "cmd.exe".to_string(),
        args: vec!["/D".to_string(), "/Q".to_string(), "/K".to_string()],
        env: command.env.clone(),
        cwd: command.cwd.clone(),
    };

    (shell_command, Some(startup_input))
}

#[cfg(target_os = "windows")]
fn quote_windows_cmd_arg(value: &str) -> String {
    let needs_quotes = value.is_empty()
        || value.chars().any(|ch| {
            ch.is_whitespace() || matches!(ch, '"' | '^' | '&' | '|' | '<' | '>' | '(' | ')' | '%')
        });

    if !needs_quotes {
        return value.to_string();
    }

    let escaped = value.replace('"', "\"\"");
    format!("\"{}\"", escaped)
}

fn open_session_log(cli_name: &str, session_id: &str) -> Option<std::fs::File> {
    let _ = (cli_name, session_id);
    None
}
