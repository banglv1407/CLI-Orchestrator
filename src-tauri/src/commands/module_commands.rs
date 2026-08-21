use clx_module_contracts::ModuleSnapshot;
use serde_json::Value;
use tauri::State;

use crate::app_state::AppState;

#[tauri::command]
pub fn module_catalog(state: State<'_, AppState>) -> Vec<ModuleSnapshot> {
    state.modules.catalog()
}

#[tauri::command]
pub async fn module_set_enabled(
    state: State<'_, AppState>,
    module_id: String,
    enabled: bool,
) -> Result<ModuleSnapshot, String> {
    state.modules.set_enabled(&module_id, enabled).await
}

#[tauri::command]
pub async fn module_call(
    state: State<'_, AppState>,
    module_id: String,
    method: String,
    params: Value,
) -> Result<Value, String> {
    state.modules.call(&module_id, &method, params).await
}

#[tauri::command]
pub async fn module_restart(
    state: State<'_, AppState>,
    module_id: String,
) -> Result<ModuleSnapshot, String> {
    state.modules.restart(&module_id).await
}
