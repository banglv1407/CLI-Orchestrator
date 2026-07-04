use serde::{Serialize, Deserialize};
use tauri::{AppHandle, Emitter};

pub const CLI_OUTPUT_EVENT: &str = "cli-output";
pub const CLI_STATUS_EVENT: &str = "cli-status";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CliOutputEvent {
    pub session_id: Option<String>,
    pub run_id: Option<String>,
    pub cli_name: String,
    pub chunk: String,
    pub stream: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CliStatusEvent {
    pub session_id: Option<String>,
    pub run_id: Option<String>,
    pub cli_name: String,
    pub status: String,
    pub message: Option<String>,
    pub exit_code: Option<i32>,
}

pub fn emit_output(app: &AppHandle, payload: CliOutputEvent) {
    let _ = app.emit(CLI_OUTPUT_EVENT, payload);
}

pub fn emit_status(app: &AppHandle, payload: CliStatusEvent) {
    let _ = app.emit(CLI_STATUS_EVENT, payload);
}
