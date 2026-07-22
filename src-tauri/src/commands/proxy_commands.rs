use tauri::{Emitter, State};

use crate::{
    app_state::AppState,
    core::{
        proxy_server::{ProxyBackend, ProxyConfig, ProxyLogEntry, ProxyStatus},
        proxy_usage_db::{self, ProxyBackendUsage},
    },
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
    mut backend: ProxyBackend,
) -> Result<ProxyConfig, String> {
    let mut config = state.proxy_server.state.config.write().await;

    // Assign UUID if missing or empty
    if backend.id.is_none() || backend.id.as_ref().unwrap().is_empty() {
        backend.id = Some(uuid::Uuid::new_v4().to_string());
    }

    let id_str = backend.id.as_ref().unwrap();
    // Retain backends that do NOT match this ID and do NOT match name
    config.backends.retain(|b| {
        let b_id_matches = b.id.as_ref() == Some(id_str);
        let b_name_matches = b.name == backend.name;
        !b_id_matches && !b_name_matches
    });

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
    config
        .backends
        .retain(|b| b.name != name && b.id.as_ref() != Some(&name));
    config.save()?;
    Ok(config.clone())
}

#[tauri::command]
pub async fn proxy_get_logs(state: State<'_, AppState>) -> Result<Vec<ProxyLogEntry>, String> {
    Ok(state.proxy_server.state.get_logs().await)
}

#[tauri::command]
pub async fn proxy_get_recent_logs(
    state: State<'_, AppState>,
    limit: Option<usize>,
) -> Result<Vec<ProxyLogEntry>, String> {
    Ok(state
        .proxy_server
        .state
        .get_recent_logs(limit.unwrap_or(10).clamp(1, 25))
        .await)
}

#[tauri::command]
pub async fn proxy_get_usage(id: String) -> Result<ProxyBackendUsage, String> {
    proxy_usage_db::get_usage(&id)
}

#[tauri::command]
pub async fn proxy_reset_usage(app: tauri::AppHandle, id: String) -> Result<(), String> {
    proxy_usage_db::reset_usage(&id)?;
    let _ = app.emit("proxy-usage-updated", id);
    Ok(())
}
