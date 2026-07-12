use tauri::State;

use crate::{
    app_state::AppState,
    core::proxy_server::{ProxyBackend, ProxyConfig, ProxyLogEntry, ProxyStatus},
};

#[tauri::command]
pub async fn proxy_status(state: State<'_, AppState>) -> Result<ProxyStatus, String> {
    Ok(state.proxy_server.status().await)
}

#[tauri::command]
pub async fn proxy_start(state: State<'_, AppState>) -> Result<ProxyStatus, String> {
    let result = state.proxy_server.start().await?;
    let mut config = state.proxy_server.state.config.write().await;
    config.enabled = true;
    config.save()?;
    drop(config);
    Ok(result)
}

#[tauri::command]
pub async fn proxy_stop(state: State<'_, AppState>) -> Result<ProxyStatus, String> {
    let result = state.proxy_server.stop().await?;
    let mut config = state.proxy_server.state.config.write().await;
    config.enabled = false;
    config.save()?;
    drop(config);
    Ok(result)
}

#[tauri::command]
pub async fn proxy_get_config(state: State<'_, AppState>) -> Result<ProxyConfig, String> {
    let config = state.proxy_server.state.config.read().await;
    Ok(config.clone())
}

#[tauri::command]
pub async fn proxy_save_config(
    state: State<'_, AppState>,
    config: ProxyConfig,
) -> Result<ProxyConfig, String> {
    config.save()?;
    let mut current = state.proxy_server.state.config.write().await;
    *current = config.clone();
    Ok(config)
}

#[tauri::command]
pub async fn proxy_add_backend(
    state: State<'_, AppState>,
    backend: ProxyBackend,
) -> Result<ProxyConfig, String> {
    let mut config = state.proxy_server.state.config.write().await;
    config.backends.retain(|b| b.name != backend.name);
    config.backends.push(backend);
    config.save()?;
    Ok(config.clone())
}

#[tauri::command]
pub async fn proxy_remove_backend(
    state: State<'_, AppState>,
    name: String,
) -> Result<ProxyConfig, String> {
    let mut config = state.proxy_server.state.config.write().await;
    config.backends.retain(|b| b.name != name);
    config.save()?;
    Ok(config.clone())
}

#[tauri::command]
pub async fn proxy_get_logs(state: State<'_, AppState>) -> Result<Vec<ProxyLogEntry>, String> {
    Ok(state.proxy_server.state.get_logs().await)
}
