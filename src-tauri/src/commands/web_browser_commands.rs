use crate::{
    app_state::AppState,
    core::{
        web_browser::{self, BrowserBounds, WebBrowserConfig, CONTENT_LABEL_PREFIX},
        web_browser_relay::{BrowserRelayPool, BrowserRouteLease},
        web_browser_store::{self as store, BrowserSettings, WebHistoryEntry},
    },
};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use tauri::{
    webview::{DownloadEvent, NewWindowResponse, PageLoadEvent, WebviewBuilder},
    AppHandle, Emitter, Manager, PhysicalPosition, PhysicalSize, State, Webview, WebviewUrl,
};
use tokio_util::sync::CancellationToken;

fn browser_root(state: &AppState) -> Result<std::path::PathBuf, String> {
    if let Some(directory) = std::env::var_os("CLX_WEB_BROWSER_DATA_DIR") {
        let directory = std::path::PathBuf::from(directory);
        if directory.is_absolute() {
            return Ok(directory);
        }
        return Err("Could not read Web settings.".into());
    }
    Ok(state.registry.data_dirs().root_dir)
}

#[derive(Default)]
pub struct WebBrowserState(
    tokio::sync::Mutex<BrowserSessions>,
    tokio::sync::Mutex<BrowserRelayPool>,
    tokio::sync::Mutex<()>,
);
#[derive(Default)]
struct BrowserSessions {
    views: HashMap<String, BrowserSession>,
    pending: HashMap<String, CancellationToken>,
    selected: Option<String>,
    visible: bool,
    bounds: Option<BrowserBounds>,
    viewport_revision: u64,
}
struct BrowserSession {
    label: String,
    page: Arc<Mutex<BrowserPage>>,
    route: Option<Arc<BrowserRouteLease>>,
    config: WebBrowserConfig,
    recorded_navigation: Option<u64>,
}
#[derive(Clone, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BrowserPage {
    session_id: String,
    url: String,
    title: String,
    loading: bool,
    visible: bool,
    navigation_id: u64,
    route_key: String,
    error: Option<String>,
    download: Option<String>,
}

pub async fn shell_reloaded(app: AppHandle) {
    let browser = app.state::<WebBrowserState>();
    let views = {
        let mut state = browser.0.lock().await;
        for (_, token) in state.pending.drain() {
            token.cancel();
        }
        state.selected = None;
        state.visible = false;
        state.bounds = None;
        state.viewport_revision = 0;
        std::mem::take(&mut state.views)
    };
    for (_, session) in views {
        if let Some(view) = app.get_webview(&session.label) {
            let _ = view.close();
        }
    }
}

fn trusted_shell(caller: &Webview) -> Result<(), String> {
    if caller.label() != "main" {
        return Err("Web controls are available only in the CLX window.".into());
    }
    let url = caller
        .url()
        .map_err(|_| "Could not verify the CLX window.")?;
    let local = url.scheme() == "tauri" && url.host_str() == Some("localhost")
        || matches!(url.scheme(), "http" | "https") && url.host_str() == Some("tauri.localhost");
    let development = cfg!(debug_assertions)
        && caller
            .app_handle()
            .config()
            .build
            .dev_url
            .as_ref()
            .is_some_and(|dev| dev.origin() == url.origin());
    if local || development {
        Ok(())
    } else {
        Err("Web controls are available only in the CLX window.".into())
    }
}
fn allowed_navigation(app: &AppHandle, url: &tauri::Url) -> bool {
    web_browser::navigation_allowed(url)
        && !app
            .config()
            .build
            .dev_url
            .as_ref()
            .is_some_and(|dev| dev.origin() == url.origin())
}
fn notify(app: &AppHandle, page: &Arc<Mutex<BrowserPage>>, update: impl FnOnce(&mut BrowserPage)) {
    if let Ok(mut state) = page.lock() {
        update(&mut state);
        let _ = app.emit_to("main", "web-browser-state", state.clone());
    }
}
fn bounds_in_window(caller: &Webview, bounds: BrowserBounds) -> Result<BrowserBounds, String> {
    let bounds = bounds.validate()?;
    let size = caller
        .window()
        .inner_size()
        .map_err(|_| "The Web viewport is not visible.")?;
    if bounds.x >= size.width as f64 || bounds.y >= size.height as f64 {
        return Err("The Web viewport is not visible.".into());
    }
    Ok(BrowserBounds {
        width: bounds.width.min(size.width as f64 - bounds.x),
        height: bounds.height.min(size.height as f64 - bounds.y),
        ..bounds
    })
}
fn apply_bounds(view: &Webview, bounds: BrowserBounds) -> Result<(), String> {
    view.set_bounds(tauri::Rect {
        position: PhysicalPosition::new(bounds.x.round() as i32, bounds.y.round() as i32).into(),
        size: PhysicalSize::new(bounds.width.round() as u32, bounds.height.round() as u32).into(),
    })
    .map_err(|_| "Could not resize the website.".to_string())
}

#[tauri::command]
pub async fn web_browser_preview(
    caller: Webview,
    app: AppHandle,
    browser: State<'_, WebBrowserState>,
    session_id: String,
) -> Result<Option<String>, String> {
    trusted_shell(&caller)?;
    let label = {
        let sessions = browser.0.lock().await;
        let Some(session) = sessions.views.get(&session_id) else {
            return Ok(None);
        };
        let page = session
            .page
            .lock()
            .map_err(|_| "Could not read Web state.")?;
        if page.loading || page.error.is_some() {
            return Ok(None);
        }
        session.label.clone()
    };
    let Some(view) = app.get_webview(&label) else {
        return Ok(None);
    };
    #[cfg(windows)]
    {
        let Some(bytes) = windows::capture_preview(&view).await? else {
            return Ok(None);
        };
        tokio::task::spawn_blocking(move || {
            use base64::Engine;
            let image = image::load_from_memory(&bytes)
                .map_err(|_| "Could not create the web preview.")?
                .thumbnail(400, 240);
            let mut resized = std::io::Cursor::new(Vec::new());
            image
                .write_to(&mut resized, image::ImageFormat::Png)
                .map_err(|_| "Could not create the web preview.")?;
            Ok(Some(format!(
                "data:image/png;base64,{}",
                base64::engine::general_purpose::STANDARD.encode(resized.into_inner())
            )))
        })
        .await
        .map_err(|_| "Could not create the web preview.".to_string())?
    }
    #[cfg(not(windows))]
    {
        let _ = view;
        Ok(None)
    }
}

#[tauri::command]
pub async fn web_browser_connection_key(
    caller: Webview,
    config: WebBrowserConfig,
) -> Result<String, String> {
    trusted_shell(&caller)?;
    config.validated()?.route_key()
}

#[tauri::command]
pub async fn web_browser_probe_fingerprint(
    caller: Webview,
    config: WebBrowserConfig,
    host: String,
    port: u16,
) -> Result<String, String> {
    trusted_shell(&caller)?;
    let host = crate::core::ssh_fingerprint::validate_address(&host, port)?.to_string();
    let config = config.validated()?;
    let route = crate::core::web_browser_chain::ProxyChain::new(config.route_hops()).await?;
    let stream = tokio::time::timeout(
        std::time::Duration::from_secs(15),
        route.origin(&crate::core::web_browser_chain::Endpoint { host, port }),
    )
    .await
    .map_err(|_| "Web connection timed out")?
    .map_err(|error| format!("Web connection failed: {error}"))?;
    crate::core::ssh_fingerprint::probe_ssh_stream(stream).await
}

#[tauri::command]
pub async fn web_browser_get_config(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
) -> Result<WebBrowserConfig, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    Ok(store::load_settings(&browser_root(&state)?)?.current)
}
#[tauri::command]
pub async fn web_browser_get_settings(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
) -> Result<BrowserSettings, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    store::load_settings(&browser_root(&state)?)
}
#[tauri::command]
pub async fn web_browser_save_config(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
    config: WebBrowserConfig,
) -> Result<WebBrowserConfig, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    store::save_current(&browser_root(&state)?, &config)
}
#[tauri::command]
pub async fn web_browser_save_profile(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
    id: Option<String>,
    name: String,
    config: WebBrowserConfig,
) -> Result<BrowserSettings, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    store::upsert_profile(&browser_root(&state)?, id.as_deref(), &name, &config)
}
#[tauri::command]
pub async fn web_browser_delete_profile(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
    id: String,
) -> Result<BrowserSettings, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    store::delete_profile(&browser_root(&state)?, &id)
}
#[tauri::command]
pub async fn web_browser_get_history(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
) -> Result<Vec<WebHistoryEntry>, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    store::load_history(&browser_root(&state)?)
}
#[tauri::command]
pub async fn web_browser_delete_history(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
    id: Option<String>,
) -> Result<Vec<WebHistoryEntry>, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    if id.is_none() {
        let mut sessions = browser.0.lock().await;
        for session in sessions.views.values_mut() {
            if let Ok(page) = session.page.lock() {
                session.recorded_navigation = Some(page.navigation_id);
            }
        }
    }
    store::remove_history(&browser_root(&state)?, id.as_deref())
}
#[tauri::command]
pub async fn web_browser_record_history(
    caller: Webview,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
    session_id: String,
) -> Result<Vec<WebHistoryEntry>, String> {
    trusted_shell(&caller)?;
    let _guard = browser.2.lock().await;
    let (entry, create, navigation) = {
        let sessions = browser.0.lock().await;
        let Some(session) = sessions.views.get(&session_id) else {
            return store::load_history(&browser_root(&state)?);
        };
        let page = session
            .page
            .lock()
            .map_err(|_| "Could not read Web state.")?;
        if page.loading || page.error.is_some() || page.url.is_empty() {
            return store::load_history(&browser_root(&state)?);
        }
        let entry = WebHistoryEntry {
            id: format!("{session_id}:{}", page.navigation_id),
            url: page.url.clone(),
            title: page.title.clone(),
            visited_at: chrono::Utc::now().timestamp_millis(),
            profile_id: session.config.profile_id.clone(),
            route_key: session.config.route_key()?,
            connection_kind: if session.config.hops.len() > 1 {
                "chain".into()
            } else {
                session
                    .config
                    .hop
                    .as_ref()
                    .map_or("direct", |hop| hop.kind.as_str())
                    .to_string()
            },
        };
        (
            entry,
            session
                .recorded_navigation
                .is_none_or(|previous| previous < page.navigation_id),
            page.navigation_id,
        )
    };
    let history = store::record_history(&browser_root(&state)?, entry, create)?;
    if let Some(session) = browser.0.lock().await.views.get_mut(&session_id) {
        session.recorded_navigation = Some(navigation);
    }
    Ok(history)
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct OpenBrowserRequest {
    session_id: String,
    config: WebBrowserConfig,
    bounds: BrowserBounds,
    #[serde(default)]
    replace_session_id: Option<String>,
}

#[tauri::command]
pub async fn web_browser_open(
    caller: Webview,
    app: AppHandle,
    state: State<'_, AppState>,
    browser: State<'_, WebBrowserState>,
    request: OpenBrowserRequest,
) -> Result<BrowserPage, String> {
    trusted_shell(&caller)?;
    let id = uuid::Uuid::parse_str(&request.session_id)
        .map_err(|_| "Invalid Web session.")?
        .to_string();
    let config = request.config.validated()?;
    let url = web_browser::website_url(&config.url)?;
    if !allowed_navigation(&app, &url) {
        return Err("Enter a valid HTTP or HTTPS website URL.".into());
    }
    let bounds = bounds_in_window(&caller, request.bounds)?;
    let profile = config.profile_directory(&browser_root(&state)?)?;
    std::fs::create_dir_all(&profile).map_err(|_| "Could not create the Web browser profile.")?;
    let cancel = CancellationToken::new();
    {
        let mut sessions = browser.0.lock().await;
        if sessions.views.contains_key(&id) || sessions.pending.contains_key(&id) {
            return Err("Invalid Web session.".into());
        }
        if sessions.views.len() + sessions.pending.len() >= 32
            && !request
                .replace_session_id
                .as_ref()
                .is_some_and(|previous| sessions.views.contains_key(previous))
        {
            return Err("Close a web tab before opening another.".into());
        }
        sessions.pending.insert(id.clone(), cancel.clone());
        if sessions.selected.is_none() {
            sessions.selected = Some(id.clone());
            sessions.visible = true;
            sessions.bounds = Some(bounds);
        }
    }
    let prepared = tokio::select! {
        _ = cancel.cancelled() => Err("Opening the web tab was cancelled.".to_string()),
        result = async {
            let native_proxy = config.native_proxy()?;
            let route = if native_proxy.is_none() {
                let hops = config.route_hops();
                if !hops.is_empty() { Some(Arc::new(browser.1.lock().await.acquire_route(config.route_key()?, hops).await?)) } else { None }
            } else { None };
            let proxy = native_proxy.or_else(|| route.as_ref().map(|route| route.proxy_url()));
            Ok::<_, String>((route, proxy))
        } => result,
    };
    let (route, proxy) = match prepared {
        Ok(prepared) => prepared,
        Err(error) => {
            browser.0.lock().await.pending.remove(&id);
            return Err(error);
        }
    };
    let mut sessions = browser.0.lock().await;
    if !sessions.pending.contains_key(&id) || cancel.is_cancelled() {
        return Err("Opening the web tab was cancelled.".into());
    }
    if let Some(previous) = request
        .replace_session_id
        .as_ref()
        .and_then(|previous| sessions.views.remove(previous))
    {
        if let Some(view) = app.get_webview(&previous.label) {
            if view.close().is_err() {
                sessions.pending.remove(&id);
                return Err("Could not close the previous website.".into());
            }
        }
    }
    let label = format!("{CONTENT_LABEL_PREFIX}{id}");
    let page = Arc::new(Mutex::new(BrowserPage {
        session_id: id.clone(),
        url: url.to_string(),
        loading: true,
        route_key: config.route_key()?,
        ..Default::default()
    }));
    let navigation_app = app.clone();
    let navigation_page = page.clone();
    let load_app = app.clone();
    let load_page = page.clone();
    let title_app = app.clone();
    let title_page = page.clone();
    let popup_app = app.clone();
    let popup_id = id.clone();
    let download_app = app.clone();
    let download_page = page.clone();
    let mut builder = WebviewBuilder::new(&label, WebviewUrl::External(url))
        .data_directory(profile)
        .focused(false)
        .disable_drag_drop_handler()
        .on_navigation(move |url| {
            let allowed = allowed_navigation(&navigation_app, url);
            if !allowed {
                notify(&navigation_app, &navigation_page, |page| {
                    page.error = Some("Only HTTP and HTTPS websites can be opened.".into());
                    page.loading = false;
                });
            }
            allowed
        })
        .on_page_load(move |_, payload| {
            notify(&load_app, &load_page, |page| {
                page.url = payload.url().to_string();
                page.loading = matches!(payload.event(), PageLoadEvent::Started);
                if page.loading {
                    page.navigation_id = page.navigation_id.saturating_add(1);
                    page.error = None;
                    page.download = None;
                }
            });
        })
        .on_document_title_changed(move |_, title| {
            notify(&title_app, &title_page, |page| page.title = title)
        })
        .on_new_window(move |url, _| {
            if allowed_navigation(&popup_app, &url) {
                let _ = popup_app.emit_to(
                    "main",
                    "web-browser-new-tab",
                    serde_json::json!({"sourceSessionId":popup_id,"url":url.as_str()}),
                );
            }
            NewWindowResponse::Deny
        })
        .on_download(move |_, event| {
            if let DownloadEvent::Finished { path, success, .. } = event {
                notify(&download_app, &download_page, |page| {
                    page.loading = false;
                    if success {
                        page.download = path.and_then(|path| {
                            path.file_name()
                                .map(|name| name.to_string_lossy().into_owned())
                        });
                    } else {
                        page.error = Some("The download failed.".into());
                    }
                });
            }
            true
        });
    #[cfg(windows)]
    {
        builder = builder.additional_browser_args(&config.browser_arguments(proxy.as_ref())?);
    }
    if let Some(proxy) = proxy {
        builder = builder.proxy_url(proxy);
    }
    let created = caller.window().add_child(
        builder,
        PhysicalPosition::new(bounds.x.round() as i32, bounds.y.round() as i32),
        PhysicalSize::new(bounds.width.round() as u32, bounds.height.round() as u32),
    );
    let view = match created {
        Ok(view) => view,
        Err(error) => {
            sessions.pending.remove(&id);
            return Err(format!("Could not open the website: {error}"));
        }
    };
    let _ = view.hide();
    // Do not hold the session lock while dispatching native asynchronous setup.
    drop(sessions);
    #[cfg(windows)]
    if let Err(error) = windows::install_hooks(&view, app.clone(), page.clone()).await {
        let _ = view.close();
        browser.0.lock().await.pending.remove(&id);
        return Err(error);
    }
    let mut sessions = browser.0.lock().await;
    if sessions.pending.remove(&id).is_none() || cancel.is_cancelled() {
        let _ = view.close();
        return Err("Opening the web tab was cancelled.".into());
    }
    let selected = sessions.selected.as_deref() == Some(&id) && sessions.visible;
    if selected {
        for session in sessions.views.values() {
            if let Some(previous) = app.get_webview(&session.label) {
                let _ = previous.hide();
            }
        }
        let shown = apply_bounds(&view, sessions.bounds.unwrap_or(bounds)).and_then(|_| {
            view.show()
                .map_err(|_| "Could not show the website.".to_string())
        });
        if let Err(error) = shown {
            let _ = view.close();
            return Err(error);
        }
    }
    let snapshot = {
        let mut page = page.lock().map_err(|_| "Could not read Web state.")?;
        page.visible = selected;
        page.clone()
    };
    sessions.views.insert(
        id,
        BrowserSession {
            label,
            page,
            route,
            config,
            recorded_navigation: None,
        },
    );
    Ok(snapshot)
}

#[tauri::command]
pub async fn web_browser_set_viewport(
    caller: Webview,
    app: AppHandle,
    browser: State<'_, WebBrowserState>,
    session_id: String,
    bounds: Option<BrowserBounds>,
    visible: bool,
    revision: Option<u64>,
) -> Result<(), String> {
    trusted_shell(&caller)?;
    uuid::Uuid::parse_str(&session_id).map_err(|_| "Invalid Web session.")?;
    let bounds = if visible {
        Some(bounds_in_window(
            &caller,
            bounds.ok_or("The Web viewport is not visible.")?,
        )?)
    } else {
        bounds
    };
    let mut sessions = browser.0.lock().await;
    if let Some(revision) = revision {
        if revision < sessions.viewport_revision {
            return Ok(());
        }
        sessions.viewport_revision = revision;
    }
    if visible {
        sessions.selected = Some(session_id.clone());
        sessions.visible = true;
        sessions.bounds = bounds;
    } else if sessions.selected.as_deref() == Some(&session_id) {
        sessions.visible = false;
    }
    for (id, session) in &sessions.views {
        if let Some(view) = app.get_webview(&session.label) {
            if visible && id == &session_id {
                apply_bounds(&view, bounds.unwrap())?;
                view.show().map_err(|_| "Could not show the website.")?;
            } else if visible || id == &session_id {
                view.hide().map_err(|_| "Could not hide the website.")?;
            }
        }
    }
    Ok(())
}

#[derive(Clone, Copy, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum BrowserAction {
    Back,
    Forward,
    Reload,
    Stop,
}
#[tauri::command]
pub async fn web_browser_action(
    caller: Webview,
    app: AppHandle,
    browser: State<'_, WebBrowserState>,
    session_id: String,
    action: BrowserAction,
) -> Result<(), String> {
    trusted_shell(&caller)?;
    let (label, page, route) = {
        let sessions = browser.0.lock().await;
        let active = sessions
            .views
            .get(&session_id)
            .ok_or("Open a website first.")?;
        (
            active.label.clone(),
            active.page.clone(),
            active.route.clone(),
        )
    };
    if let Some(route) = route {
        route.clear_error();
    }
    let view = app.get_webview(&label).ok_or("Open a website first.")?;
    #[cfg(windows)]
    windows::navigate(&view, action).await?;
    #[cfg(not(windows))]
    match action {
        BrowserAction::Back => view.eval("history.back()"),
        BrowserAction::Forward => view.eval("history.forward()"),
        BrowserAction::Reload => view.reload(),
        BrowserAction::Stop => view.eval("window.stop()"),
    }
    .map_err(|_| "Could not navigate the website.")?;
    if matches!(action, BrowserAction::Stop) {
        notify(&app, &page, |page| page.loading = false);
    }
    Ok(())
}
#[tauri::command]
pub async fn web_browser_navigate(
    caller: Webview,
    app: AppHandle,
    browser: State<'_, WebBrowserState>,
    session_id: String,
    url: String,
) -> Result<(), String> {
    trusted_shell(&caller)?;
    let url = web_browser::website_url(&url)?;
    if !allowed_navigation(&app, &url) {
        return Err("Enter a valid HTTP or HTTPS website URL.".into());
    }
    let (label, route) = {
        let sessions = browser.0.lock().await;
        let active = sessions
            .views
            .get(&session_id)
            .ok_or("Open a website first.")?;
        (active.label.clone(), active.route.clone())
    };
    if let Some(route) = route {
        route.clear_error();
    }
    app.get_webview(&label)
        .ok_or("Open a website first.")?
        .navigate(url)
        .map_err(|_| "Could not navigate the website.".into())
}
#[tauri::command]
pub async fn web_browser_snapshot(
    caller: Webview,
    app: AppHandle,
    browser: State<'_, WebBrowserState>,
    session_id: String,
) -> Result<Option<BrowserPage>, String> {
    trusted_shell(&caller)?;
    let (label, page, route) = {
        let sessions = browser.0.lock().await;
        let Some(active) = sessions.views.get(&session_id) else {
            return Ok(None);
        };
        (
            active.label.clone(),
            active.page.clone(),
            active.route.clone(),
        )
    };
    let view = app.get_webview(&label);
    let url = view.as_ref().and_then(|view| view.url().ok());
    #[cfg(windows)]
    let visible = if let Some(view) = &view {
        windows::visibility(view).await?
    } else {
        false
    };
    let mut page = page.lock().map_err(|_| "Could not read Web state.")?;
    // A proxy also sees subresources and Chromium background requests. Their
    // failures must not turn a successfully loaded document into a failed visit.
    if let Some(error) = route.as_ref().and_then(|route| route.take_error()) {
        if page.error.is_some() {
            page.error = Some(format!("Web connection failed: {error}"));
        }
    }
    #[cfg(windows)]
    {
        page.visible = visible;
    }
    if !page.loading {
        if let Some(url) = url.filter(|url| allowed_navigation(&app, url)) {
            if page.url != url.as_str() {
                page.navigation_id = page.navigation_id.saturating_add(1);
                page.url = url.to_string();
            }
        }
    }
    Ok(Some(page.clone()))
}
#[tauri::command]
pub async fn web_browser_close(
    caller: Webview,
    app: AppHandle,
    browser: State<'_, WebBrowserState>,
    session_id: String,
) -> Result<(), String> {
    trusted_shell(&caller)?;
    let session = {
        let mut sessions = browser.0.lock().await;
        if let Some(token) = sessions.pending.remove(&session_id) {
            token.cancel();
        }
        if sessions.selected.as_deref() == Some(&session_id) {
            sessions.selected = None;
            sessions.visible = false;
        }
        sessions.views.remove(&session_id)
    };
    if let Some(session) = session {
        if let Some(view) = app.get_webview(&session.label) {
            view.close().map_err(|_| "Could not close the website.")?;
        }
    }
    Ok(())
}

#[cfg(target_os = "windows")]
mod windows {
    use super::*;
    use ::windows::Win32::{
        System::Com::{STATFLAG_NONAME, STATSTG, STREAM_SEEK_SET},
        UI::Shell::SHCreateMemStream,
    };
    use webview2_com::{
        AcceleratorKeyPressedEventHandler, CapturePreviewCompletedHandler,
        Microsoft::Web::WebView2::Win32::{
            ICoreWebView2NavigationCompletedEventArgs2, COREWEBVIEW2_KEY_EVENT_KIND_KEY_DOWN,
            COREWEBVIEW2_KEY_EVENT_KIND_SYSTEM_KEY_DOWN,
            COREWEBVIEW2_WEB_ERROR_STATUS_OPERATION_CANCELED,
        },
        NavigationCompletedEventHandler,
    };
    use windows_core::Interface;

    pub async fn capture_preview(view: &Webview) -> Result<Option<Vec<u8>>, String> {
        let (send, receive) = tokio::sync::oneshot::channel();
        view.with_webview(move |platform| {
            let start=(||->Result<(),webview2_com::Error> { unsafe {
                let mut visible=Default::default();platform.controller().IsVisible(&mut visible)?;
                if !visible.as_bool() {return Ok(())}
                let stream=SHCreateMemStream(None).ok_or(webview2_com::Error::CallbackError("preview stream".into()))?;
                let captured=stream.clone();
                let completed=CapturePreviewCompletedHandler::create(Box::new(move |status| {
                    let result=(||->Result<Vec<u8>,String> {
                        status.map_err(|_|"Could not create the web preview.")?;
                        let mut stat=STATSTG::default();captured.Stat(&mut stat,STATFLAG_NONAME).map_err(|_|"Could not create the web preview.")?;
                        if stat.cbSize>16*1024*1024 {return Err("Could not create the web preview.".into())}
                        captured.Seek(0,STREAM_SEEK_SET,None).map_err(|_|"Could not create the web preview.")?;
                        let mut bytes=vec![0;stat.cbSize as usize];let mut read=0;
                        captured.Read(bytes.as_mut_ptr().cast(),bytes.len() as u32,Some(&mut read)).ok().map_err(|_|"Could not create the web preview.")?;
                        bytes.truncate(read as usize);Ok(bytes)
                    })();
                    let _=send.send(result);Ok(())
                }));
                platform.controller().CoreWebView2()?.CapturePreview(webview2_com::Microsoft::Web::WebView2::Win32::COREWEBVIEW2_CAPTURE_PREVIEW_IMAGE_FORMAT_PNG,&stream,&completed)?;
                Ok(())
            }})();
            let _=start;
        }).map_err(|_|"Could not create the web preview.")?;
        match tokio::time::timeout(std::time::Duration::from_secs(3), receive).await {
            Ok(Ok(Ok(bytes))) => Ok(Some(bytes)),
            _ => Ok(None),
        }
    }

    // Read actual modifier state; website-created KeyboardEvents cannot dispatch
    // shell actions. These bindings keep the existing app shortcuts usable while
    // focus belongs to the native content WebView.
    #[link(name = "user32")]
    extern "system" {
        fn GetKeyState(key: i32) -> i16;
    }

    pub async fn visibility(view: &Webview) -> Result<bool, String> {
        let (send, receive) = tokio::sync::oneshot::channel();
        view.with_webview(move |platform| {
            let result = unsafe {
                let mut visible = Default::default();
                platform
                    .controller()
                    .IsVisible(&mut visible)
                    .map(|_| visible.as_bool())
                    .map_err(|_| "Could not read Web state.".to_string())
            };
            let _ = send.send(result);
        })
        .map_err(|_| "Could not read Web state.")?;
        receive
            .await
            .map_err(|_| "Could not read Web state.".to_string())?
    }

    pub async fn install_hooks(
        view: &Webview,
        app: AppHandle,
        page: Arc<Mutex<BrowserPage>>,
    ) -> Result<(), String> {
        let (send, receive) = tokio::sync::oneshot::channel();
        view.with_webview(move |platform| {
            let result = (|| -> Result<(), webview2_com::Error> {
                unsafe {
                    let controller = platform.controller();
                    let native = controller.CoreWebView2()?;
                    let navigation_app = app.clone();
                    let completed = NavigationCompletedEventHandler::create(Box::new(move |_, args| {
                        if let Some(args) = args {
                            let mut success = Default::default();
                            let mut status = Default::default();
                            args.IsSuccess(&mut success)?;
                            args.WebErrorStatus(&mut status)?;
                            let mut http_status = 0;
                            if let Ok(details) = args.cast::<ICoreWebView2NavigationCompletedEventArgs2>() {
                                let _ = details.HttpStatusCode(&mut http_status);
                            }
                            notify(&navigation_app, &page, |page| {
                                page.loading = false;
                                if success.as_bool() && !matches!(http_status, 502 | 503 | 504) { page.error = None; }
                                else if status != COREWEBVIEW2_WEB_ERROR_STATUS_OPERATION_CANCELED {
                                    page.error = Some("Could not load the website. Check its address and the selected connection.".into());
                                }
                            });
                        }
                        Ok(())
                    }));
                    let mut navigation_token = 0;
                    native.add_NavigationCompleted(&completed, &mut navigation_token)?;
                    let accelerator = AcceleratorKeyPressedEventHandler::create(Box::new(move |_, args| {
                        if let Some(args) = args {
                            let mut kind = Default::default();
                            let mut key = 0;
                            let mut physical = Default::default();
                            args.KeyEventKind(&mut kind)?;
                            args.VirtualKey(&mut key)?;
                            args.PhysicalKeyStatus(&mut physical)?;
                            if kind != COREWEBVIEW2_KEY_EVENT_KIND_KEY_DOWN && kind != COREWEBVIEW2_KEY_EVENT_KIND_SYSTEM_KEY_DOWN { return Ok(()); }
                            let control = GetKeyState(0x11) < 0;
                            let shift = GetKeyState(0x10) < 0;
                            let other = GetKeyState(0x12) < 0 || GetKeyState(0x5B) < 0 || GetKeyState(0x5C) < 0;
                            let shortcut = if control && !other {
                                match key {
                                    0xC0 if !shift => Some("newTerminal"),
                                    0x50 if !shift => Some("palette"),
                                    0x09 => Some(if shift { "previousTerminal" } else { "nextTerminal" }),
                                    _ => None,
                                }
                            } else { None };
                            if let Some(shortcut) = shortcut {
                                args.SetHandled(true)?;
                                if !physical.WasKeyDown.as_bool() { let _ = app.emit_to("main", "web-browser-shortcut", shortcut); }
                            }
                        }
                        Ok(())
                    }));
                    let mut accelerator_token = 0;
                    controller.add_AcceleratorKeyPressed(&accelerator, &mut accelerator_token)?;
                }
                Ok(())
            })();
            let _ = send.send(result.map_err(|error| format!("Could not open the website: {error}")));
        }).map_err(|error| format!("Could not open the website: {error}"))?;
        receive.await.map_err(|_| {
            "Could not open the website: native browser setup was interrupted".to_string()
        })?
    }

    pub async fn navigate(view: &Webview, action: BrowserAction) -> Result<(), String> {
        let (send, receive) = tokio::sync::oneshot::channel();
        view.with_webview(move |platform| {
            let result = (|| -> Result<(), webview2_com::Error> {
                unsafe {
                    let native = platform.controller().CoreWebView2()?;
                    match action {
                        BrowserAction::Back => {
                            let mut available = Default::default();
                            native.CanGoBack(&mut available)?;
                            if available.as_bool() {
                                native.GoBack()?;
                            }
                        }
                        BrowserAction::Forward => {
                            let mut available = Default::default();
                            native.CanGoForward(&mut available)?;
                            if available.as_bool() {
                                native.GoForward()?;
                            }
                        }
                        BrowserAction::Reload => native.Reload()?,
                        BrowserAction::Stop => native.Stop()?,
                    }
                }
                Ok(())
            })();
            let _ = send.send(result.map_err(|_| "Could not navigate the website.".to_string()));
        })
        .map_err(|_| "Could not navigate the website.")?;
        receive
            .await
            .map_err(|_| "Could not navigate the website.".to_string())?
    }
}
