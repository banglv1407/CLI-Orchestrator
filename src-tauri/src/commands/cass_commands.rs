use serde::Deserialize;
use tauri::State;

use crate::{
    app_state::AppState,
    core::cass_index::{CassIndexStats, CassIndexSummary, CassSearchResult},
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CassSearchRequest {
    pub query: String,
    pub limit: Option<usize>,
    pub refresh: Option<bool>,
}

#[tauri::command]
pub async fn cass_index_logs(state: State<'_, AppState>) -> Result<CassIndexSummary, String> {
    state
        .cass_index
        .index_logs()
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn cass_stats(state: State<'_, AppState>) -> Result<CassIndexStats, String> {
    state.cass_index.stats().map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn cass_search(
    state: State<'_, AppState>,
    request: CassSearchRequest,
) -> Result<Vec<CassSearchResult>, String> {
    if request.refresh.unwrap_or(false) {
        state
            .cass_index
            .index_logs()
            .map_err(|error| error.to_string())?;
    }

    let limit = request.limit.unwrap_or(20);
    state
        .cass_index
        .search(&request.query, limit)
        .map_err(|error| error.to_string())
}
