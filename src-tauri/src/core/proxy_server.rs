use axum::{
    extract::State,
    http::{HeaderMap, HeaderName, HeaderValue, StatusCode},
    response::IntoResponse,
    routing::post,
    Json, Router,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use tokio::sync::{Mutex, RwLock};
use tower_http::cors::CorsLayer;

// ── Config types ──────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyBackend {
    pub name: String,
    pub url: String,
    pub api_key: String,
    pub model: String,
    pub weight: u32,
    pub max_retries: u32,
    pub headers: HashMap<String, String>,
    pub custom_user_agent: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyConfig {
    pub port: u16,
    pub backends: Vec<ProxyBackend>,
    pub enabled: bool,
}

impl Default for ProxyConfig {
    fn default() -> Self {
        Self {
            port: 9876,
            backends: vec![],
            enabled: false,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyStatus {
    pub running: bool,
    pub port: u16,
    pub active_backends: usize,
    pub total_requests: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyLogEntry {
    pub id: u64,
    pub timestamp: String,
    pub backend: String,
    pub model: String,
    pub request_json: String,
    pub response_json: String,
    pub status: u16,
    pub duration_ms: u64,
    pub success: bool,
    pub error_msg: Option<String>,
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

// ── OpenAI types ──────────────────────────────────────────────

#[derive(Debug, Deserialize, Serialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub struct ChatCompletionRequest {
    pub model: String,
    pub messages: Vec<ChatMessage>,
    #[serde(default)]
    pub stream: bool,
    #[serde(default)]
    pub temperature: Option<f32>,
    #[serde(default)]
    pub max_tokens: Option<u32>,
}

// ── State ─────────────────────────────────────────────────────

pub struct ProxyState {
    pub counter: AtomicU64,
    pub config: RwLock<ProxyConfig>,
    pub logs: Mutex<Vec<ProxyLogEntry>>,
}

impl ProxyState {
    pub fn new(config: ProxyConfig) -> Self {
        Self {
            counter: AtomicU64::new(0),
            config: RwLock::new(config),
            logs: Mutex::new(Vec::with_capacity(100)),
        }
    }

    pub async fn add_log(&self, entry: ProxyLogEntry) {
        let mut logs = self.logs.lock().await;
        while logs.len() >= 100 {
            logs.remove(0);
        }
        logs.push(entry);
    }

    pub async fn get_logs(&self) -> Vec<ProxyLogEntry> {
        self.logs.lock().await.clone()
    }
}

// ── Manager ───────────────────────────────────────────────────

pub struct ProxyServer {
    pub state: Arc<ProxyState>,
    shutdown_tx: Mutex<Option<tokio::sync::oneshot::Sender<()>>>,
}

impl ProxyServer {
    pub fn new(config: ProxyConfig) -> Self {
        Self {
            state: Arc::new(ProxyState::new(config)),
            shutdown_tx: Mutex::new(None),
        }
    }

    pub async fn status(&self) -> ProxyStatus {
        let config = self.state.config.read().await;
        let shutdown = self.shutdown_tx.lock().await;
        ProxyStatus {
            running: shutdown.is_some(),
            port: config.port,
            active_backends: config.backends.len(),
            total_requests: self.state.counter.load(Ordering::Relaxed),
        }
    }

    pub async fn start(&self) -> Result<ProxyStatus, String> {
        {
            let mut shutdown = self.shutdown_tx.lock().await;
            if shutdown.is_some() {
                return Err("Proxy is already running".to_string());
            }
            let config = self.state.config.read().await;
            if config.backends.is_empty() {
                return Err("No backends configured".to_string());
            }
            let (tx, rx) = tokio::sync::oneshot::channel::<()>();
            *shutdown = Some(tx);
            let server_state = self.state.clone();
            let port = config.port;
            tokio::spawn(async move {
                let app = Router::new()
                    .route("/v1/chat/completions", post(handle_chat_completion))
                    .layer(CorsLayer::permissive())
                    .with_state(server_state);
                let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{}", port))
                    .await
                    .expect("Failed to bind proxy port");
                axum::serve(listener, app)
                    .with_graceful_shutdown(async { let _ = rx.await; })
                    .await
                    .ok();
            });
        }
        Ok(self.status().await)
    }

    pub async fn stop(&self) -> Result<ProxyStatus, String> {
        let opt = {
            let mut shutdown = self.shutdown_tx.lock().await;
            shutdown.take()
        };
        match opt {
            Some(tx) => {
                let _ = tx.send(());
                Ok(self.status().await)
            }
            None => Err("Proxy is not running".to_string()),
        }
    }
}

// ── SSE helpers ────────────────────────────────────────────────

fn strip_sse_artifacts(body: &str) -> String {
    let trimmed = body.trim();
    if let Some(pos) = trimmed.rfind("data: [DONE]") {
        return trimmed[..pos].trim_end().to_string();
    }
    let lines: Vec<&str> = trimmed.lines().collect();
    // Take all lines until the first non-JSON "data: " line
    let mut clean = Vec::new();
    for line in &lines {
        if line.starts_with("data: ") && !line.starts_with("data: {") {
            break;
        }
        clean.push(*line);
    }
    if clean.is_empty() { trimmed.to_string() } else { clean.join("\n") }
}

fn extract_first_json(body: &str) -> Option<serde_json::Value> {
    let clean = strip_sse_artifacts(body);
    if let Ok(v) = serde_json::from_str(&clean) {
        return Some(v);
    }
    if let Some(start) = clean.find('{') {
        let mut depth = 0i32;
        for (i, ch) in clean[start..].char_indices() {
            if ch == '{' { depth += 1; }
            if ch == '}' {
                depth -= 1;
                if depth == 0 {
                    let end = start + i + 1;
                    if let Ok(v) = serde_json::from_str(&clean[start..end]) {
                        return Some(v);
                    }
                    break;
                }
            }
        }
    }
    None
}

fn extract_token_usage(response_json: &str) -> (u32, u32, u32) {
    if let Ok(v) = serde_json::from_str::<serde_json::Value>(response_json) {
        if let Some(usage) = v.get("usage") {
            let pt = usage.get("prompt_tokens").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            let ct = usage.get("completion_tokens").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            let tt = usage.get("total_tokens").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            return (pt, ct, tt);
        }
    }
    (0, 0, 0)
}

// ── Handler ───────────────────────────────────────────────────

async fn handle_chat_completion(
    State(state): State<Arc<ProxyState>>,
    Json(request): Json<ChatCompletionRequest>,
) -> impl IntoResponse {
    state.counter.fetch_add(1, Ordering::Relaxed);

    if request.stream {
        return (
            StatusCode::NOT_IMPLEMENTED,
            Json(serde_json::json!({
                "error": { "message": "Streaming not supported in MVP", "type": "not_implemented" }
            })),
        );
    }

    let mut config = state.config.write().await;
    let total = config.backends.len();
    if total == 0 {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(serde_json::json!({
                "error": { "message": "No backends configured", "type": "service_unavailable" }
            })),
        );
    }

    let client = Client::new();

    let mut attempts = 0;
    loop {
        if attempts >= total { break; }
        attempts += 1;

        let backend = match config.backends.first() {
            Some(b) => b.clone(),
            None => break,
        };

        let max_retries = backend.max_retries.max(1);
        let mut backend_success = false;

        for retry in 0..max_retries {
            let target_url = format!("{}/v1/chat/completions", backend.url.trim_end_matches('/'));

            let mut headers = HeaderMap::new();
            headers.insert(
                HeaderName::from_static("authorization"),
                format!("Bearer {}", backend.api_key)
                    .parse().unwrap_or_else(|_| HeaderValue::from_static("")),
            );
            headers.insert(
                HeaderName::from_static("content-type"),
                "application/json".parse().unwrap_or_else(|_| HeaderValue::from_static("application/json")),
            );
            for (k, v) in &backend.headers {
                if let (Ok(name), Ok(value)) = (HeaderName::from_bytes(k.as_bytes()), v.parse()) {
                    headers.insert(name, value);
                }
            }
            if let Some(ua) = &backend.custom_user_agent {
                headers.insert(
                    HeaderName::from_static("user-agent"),
                    ua.parse().unwrap_or_else(|_| HeaderValue::from_static("CliProxyAI/1.0")),
                );
            }

            let body = serde_json::json!({
                "model": backend.model,
                "messages": request.messages,
                "temperature": request.temperature.unwrap_or(0.7),
                "max_tokens": request.max_tokens.unwrap_or(4096),
            });

            let start = std::time::Instant::now();
            let result = client
                .post(&target_url)
                .headers(headers)
                .json(&body)
                .send()
                .await;
            let duration_ms = start.elapsed().as_millis() as u64;

            match result {
                Ok(resp) => {
                    let status_code = resp.status().as_u16();
                    let body_text = resp.text().await.unwrap_or_default();
                    let request_json = serde_json::to_string(&body).unwrap_or_default();
                    let log_id = state.counter.load(Ordering::Relaxed);

                    // Success
                    if status_code >= 200 && status_code < 300 {
                        let clean_body = strip_sse_artifacts(&body_text);
                        let parsed: Result<serde_json::Value, _> = serde_json::from_str(&clean_body);
                        let response_json = if let Ok(ref json) = parsed {
                            serde_json::to_string(json).unwrap_or_default()
                        } else {
                            clean_body.clone()
                        };
                        let (pt, ct, tt) = extract_token_usage(&response_json);

                        state.add_log(ProxyLogEntry {
                            id: log_id,
                            timestamp: chrono::Local::now().format("%H:%M:%S").to_string(),
                            backend: backend.name.clone(),
                            model: backend.model.clone(),
                            request_json,
                            response_json: response_json.clone(),
                            status: status_code,
                            duration_ms,
                            success: true,
                            error_msg: None,
                            prompt_tokens: pt,
                            completion_tokens: ct,
                            total_tokens: tt,
                        }).await;

                        let _ = config.save();

                        let response = match parsed {
                            Ok(json) => {
                                let mut resp = json;
                                if resp.get("model").is_none() {
                                    resp["model"] = serde_json::json!(backend.model);
                                }
                                (StatusCode::OK, Json(resp))
                            }
                            Err(_) => {
                                let extracted = extract_first_json(&body_text);
                                match extracted {
                                    Some(json) => {
                                        let mut resp = json;
                                        if resp.get("model").is_none() {
                                            resp["model"] = serde_json::json!(backend.model);
                                        }
                                        (StatusCode::OK, Json(resp))
                                    }
                                    None => (
                                        StatusCode::OK,
                                        Json(serde_json::json!({
                                            "id": "proxy-1",
                                            "object": "chat.completion",
                                            "created": 0,
                                            "model": backend.model,
                                            "choices": [{
                                                "index": 0,
                                                "message": { "role": "assistant", "content": clean_body },
                                                "finish_reason": "stop"
                                            }]
                                        })),
                                    ),
                                }
                            }
                        };
                        return response;
                    }

                    // Non-success HTTP
                    state.add_log(ProxyLogEntry {
                        id: log_id,
                        timestamp: chrono::Local::now().format("%H:%M:%S").to_string(),
                        backend: backend.name.clone(),
                        model: backend.model.clone(),
                        request_json,
                        response_json: body_text.clone(),
                        status: status_code,
                        duration_ms,
                        success: false,
                        error_msg: Some(format!("HTTP {}", status_code)),
                        prompt_tokens: 0, completion_tokens: 0, total_tokens: 0,
                    }).await;

                    if retry + 1 < max_retries {
                        eprintln!("Backend {} returned {} — retry {}/{}", backend.name, status_code, retry + 1, max_retries);
                        continue;
                    }
                    eprintln!("Backend {} returned {} after {} retries — rotating", backend.name, status_code, max_retries);
                    config.backends.rotate_left(1);
                    let _ = config.save();
                    backend_success = false;
                }

                Err(e) => {
                    let err_msg = format!("{}", e);
                    let request_json = serde_json::to_string(&body).unwrap_or_default();
                    state.add_log(ProxyLogEntry {
                        id: state.counter.load(Ordering::Relaxed),
                        timestamp: chrono::Local::now().format("%H:%M:%S").to_string(),
                        backend: backend.name.clone(),
                        model: backend.model.clone(),
                        request_json,
                        response_json: String::new(),
                        status: 0,
                        duration_ms,
                        success: false,
                        error_msg: Some(err_msg.clone()),
                        prompt_tokens: 0, completion_tokens: 0, total_tokens: 0,
                    }).await;

                    if retry + 1 < max_retries {
                        eprintln!("Backend {} failed: {} — retry {}/{}", backend.name, e, retry + 1, max_retries);
                        continue;
                    }
                    eprintln!("Backend {} failed after {} retries — rotating", backend.name, max_retries);
                    config.backends.rotate_left(1);
                    let _ = config.save();
                    backend_success = false;
                }
            }
        } // retry loop

        if backend_success { break; }
        if config.backends.is_empty() { break; }
    } // backend loop

    (
        StatusCode::BAD_GATEWAY,
        Json(serde_json::json!({
            "error": { "message": "All backends failed", "type": "bad_gateway" }
        })),
    )
}

// ── Config persistence ────────────────────────────────────────

impl ProxyConfig {
    pub fn load() -> Result<Self, String> {
        let path = Self::config_path()?;
        if path.exists() {
            let content = std::fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read config: {}", e))?;
            serde_json::from_str(&content)
                .map_err(|e| format!("Failed to parse config: {}", e))
        } else {
            Ok(Self::default())
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let path = Self::config_path()?;
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create config dir: {}", e))?;
        }
        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;
        std::fs::write(&path, content)
            .map_err(|e| format!("Failed to write config: {}", e))
    }

    fn config_path() -> Result<std::path::PathBuf, String> {
        let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
        Ok(home.join(".ai-cli-manager").join("proxy.json"))
    }
}
