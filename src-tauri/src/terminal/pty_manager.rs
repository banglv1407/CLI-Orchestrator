use std::io::{Read, Write};

use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use thiserror::Error;

use crate::core::execution_engine::ResolvedCommand;

pub struct PtyProcess {
    pub child: Box<dyn portable_pty::Child + Send>,
    pub reader: Box<dyn Read + Send>,
    pub writer: Box<dyn Write + Send>,
    /// Keep the master PTY handle alive for the lifetime of the session.
    /// On Windows (ConPTY), dropping this handle closes the PTY pipe and
    /// terminates the child process immediately.
    pub _master: Box<dyn portable_pty::MasterPty + Send>,
}

#[derive(Debug, Error)]
pub enum PtyManagerError {
    #[error("failed to open pty: {0}")]
    OpenPty(String),
    #[error("failed to spawn pty command: {0}")]
    Spawn(String),
    #[error("failed to clone pty reader: {0}")]
    Reader(String),
    #[error("failed to take pty writer: {0}")]
    Writer(String),
}

pub fn spawn_pty_process(command: &ResolvedCommand) -> Result<PtyProcess, PtyManagerError> {
    let pty_system = native_pty_system();
    let pair = pty_system
        .openpty(PtySize {
            rows: 34,
            cols: 140,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|error| PtyManagerError::OpenPty(error.to_string()))?;

    let child = {
        let primary_builder = build_command_builder(command);
        match pair.slave.spawn_command(primary_builder) {
            Ok(child) => child,
            Err(primary_error) => {
                #[cfg(target_os = "windows")]
                {
                    let primary_message = primary_error.to_string();
                    if should_retry_with_cmd_fallback(command, &primary_message) {
                        let fallback_builder = build_windows_cmd_builder(command);
                        pair.slave
                            .spawn_command(fallback_builder)
                            .map_err(|fallback_error| {
                                PtyManagerError::Spawn(with_spawn_hint(format!(
                                    "{}; fallback via cmd.exe failed: {}",
                                    primary_message, fallback_error
                                )))
                            })?
                    } else {
                        return Err(PtyManagerError::Spawn(with_spawn_hint(primary_message)));
                    }
                }

                #[cfg(not(target_os = "windows"))]
                {
                    return Err(PtyManagerError::Spawn(with_spawn_hint(
                        primary_error.to_string(),
                    )));
                }
            }
        }
    };

    let reader = pair
        .master
        .try_clone_reader()
        .map_err(|error| PtyManagerError::Reader(error.to_string()))?;

    let writer = pair
        .master
        .take_writer()
        .map_err(|error| PtyManagerError::Writer(error.to_string()))?;

    Ok(PtyProcess {
        child,
        reader,
        writer,
        _master: pair.master,
    })
}

fn build_command_builder(command: &ResolvedCommand) -> CommandBuilder {
    let mut builder = CommandBuilder::new(&command.command);
    for arg in &command.args {
        builder.arg(arg);
    }
    apply_builder_context(&mut builder, command);
    builder
}

fn apply_builder_context(builder: &mut CommandBuilder, command: &ResolvedCommand) {
    seed_terminal_environment(builder);

    for (key, value) in &command.env {
        builder.env(key, value);
    }
    if let Some(cwd) = &command.cwd {
        builder.cwd(cwd);
    }
}

fn seed_terminal_environment(builder: &mut CommandBuilder) {
    // Preserve ALL user environment variables from the current user session
    // (PATH, tokens, API keys, NVM, Cargo, home directories, user configs, etc.)
    for (key, value) in std::env::vars() {
        if !key.is_empty() {
            builder.env(key, value);
        }
    }

    builder.env("TERM", "xterm-256color");
    builder.env("COLORTERM", "truecolor");
}

#[cfg(target_os = "windows")]
fn build_windows_cmd_builder(command: &ResolvedCommand) -> CommandBuilder {
    let mut builder = CommandBuilder::new("cmd.exe");
    builder.arg("/D");
    builder.arg("/K");
    builder.arg(&command.command);
    for arg in &command.args {
        builder.arg(arg);
    }
    apply_builder_context(&mut builder, command);
    builder
}

#[cfg(target_os = "windows")]
fn should_retry_with_cmd_fallback(command: &ResolvedCommand, message: &str) -> bool {
    let lower = message.to_ascii_lowercase();
    let should_retry = lower.contains("os error 193")
        || lower.contains("not a valid win32 application")
        || lower.contains("os error 2")
        || lower.contains("cannot find the file specified")
        || lower.contains("the system cannot find the file");
    if !should_retry {
        return false;
    }

    let normalized = command.command.trim().to_ascii_lowercase();
    !(normalized == "cmd"
        || normalized.ends_with("cmd.exe")
        || normalized.ends_with("powershell.exe")
        || normalized.ends_with("pwsh.exe"))
}

fn with_spawn_hint(message: String) -> String {
    #[cfg(target_os = "windows")]
    {
        if message.contains("os error 193") {
            return format!(
                "{message}. On Windows this often means the CLI entrypoint is a .cmd/.bat wrapper."
            );
        }
    }

    message
}
