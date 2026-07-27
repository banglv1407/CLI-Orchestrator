use serde::Serialize;
use crate::core::rtk_sanitizer::RtkSanitizer;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RtkStatusResponse {
    pub installed: bool,
    pub gain: Option<String>,
}

#[tauri::command]
pub async fn rtk_get_status() -> Result<RtkStatusResponse, String> {
    let installed = RtkSanitizer::is_rtk_installed();
    let gain = if installed {
        RtkSanitizer::get_rtk_gain()
    } else {
        None
    };

    Ok(RtkStatusResponse { installed, gain })
}
