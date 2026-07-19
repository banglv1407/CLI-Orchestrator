use tauri::State;

use crate::{app_state::AppState, core::system_log::SystemLogEntry};

#[tauri::command]
pub async fn get_system_logs(
    state: State<'_, AppState>,
    limit: Option<usize>,
) -> Result<Vec<SystemLogEntry>, String> {
    Ok(state.logger.get_logs(limit.unwrap_or(200)).await)
}
