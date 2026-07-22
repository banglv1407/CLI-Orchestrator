use crate::{app_state::AppState, core::web_ai_config::{is_url_allowed, WebAiConfig, WebAiProfile}};
use std::sync::atomic::Ordering;
use tauri::webview::WebviewBuilder;
use tauri::{AppHandle, LogicalPosition, LogicalSize, Manager, State, WebviewUrl};

#[derive(serde::Deserialize)]
pub struct WebAiRect {
    pub x: f64,
    pub y: f64,
    pub w: f64,
    pub h: f64,
}

#[tauri::command]
pub async fn web_ai_load_profiles() -> Result<WebAiConfig, String> {
    WebAiConfig::load()
}

#[tauri::command]
pub async fn web_ai_save_profiles(config: WebAiConfig) -> Result<(), String> {
    config.save()
}

#[tauri::command]
pub async fn web_ai_spawn_profile(
    app: AppHandle,
    state: State<'_, AppState>,
    profile: WebAiProfile,
    rect: WebAiRect,
) -> Result<(), String> {
    let generation = state.web_ai_generation.fetch_add(1, Ordering::SeqCst) + 1;
    let _operation = state.web_ai_operation.lock().await;
    if let Some(existing) = app.get_webview("web-ai-viewer") {
        let _ = existing.close();
        tokio::time::sleep(tokio::time::Duration::from_millis(150)).await;
    }
    if state.web_ai_generation.load(Ordering::SeqCst) != generation {
        return Ok(());
    }

    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let data_dir = home
        .join(".ai-cli-manager")
        .join("web-ai-profiles")
        .join(&profile.partition);

    let main_win = app.get_window("main").ok_or("Main window not found")?;

    let mut builder = WebviewBuilder::new(
        "web-ai-viewer",
        WebviewUrl::External(profile.default_url.parse().unwrap()),
    )
    .data_directory(data_dir);

    if let Some(ref ua) = profile.user_agent {
        builder = builder.user_agent(ua);
    }

    let rules = profile.allow_navigation_rules.clone();
    builder = builder.on_navigation(move |url: &tauri::Url| {
        let url_str = url.as_str();
        let allowed = is_url_allowed(url_str, &rules);
        if !allowed {
            eprintln!("Blocked navigation to disallowed URL: {}", url_str);
        }
        allowed
    });

    let _webview = main_win
        .add_child(
            builder,
            LogicalPosition::new(rect.x, rect.y),
            LogicalSize::new(rect.w, rect.h),
        )
        .map_err(|e| format!("Failed to embed child Webview: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn web_ai_reposition(app: AppHandle, rect: WebAiRect) -> Result<(), String> {
    if let Some(webview) = app.get_webview("web-ai-viewer") {
        let _ = webview.set_position(LogicalPosition::new(rect.x, rect.y));
        let _ = webview.set_size(LogicalSize::new(rect.w, rect.h));
    }
    Ok(())
}

#[tauri::command]
pub async fn web_ai_set_visible(app: AppHandle, visible: bool) -> Result<(), String> {
    if let Some(webview) = app.get_webview("web-ai-viewer") {
        if visible {
            let _ = webview.show();
        } else {
            let _ = webview.hide();
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn web_ai_close(app: AppHandle, state: State<'_, AppState>) -> Result<(), String> {
    state.web_ai_generation.fetch_add(1, Ordering::SeqCst);
    let _operation = state.web_ai_operation.lock().await;
    if let Some(webview) = app.get_webview("web-ai-viewer") {
        let _ = webview.close();
    }
    Ok(())
}

#[tauri::command]
pub async fn web_ai_clear_data() -> Result<(), String> {
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let data_dir = home.join(".ai-cli-manager").join("web-ai-profiles");
    if data_dir.exists() {
        std::fs::remove_dir_all(&data_dir).map_err(|e| format!("Failed to clear data: {}", e))?;
    }
    Ok(())
}
