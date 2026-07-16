use axum::{
    body::Body,
    extract::State,
    http::{header, HeaderMap, HeaderName, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    routing::post,
    Json, Router,
};
use bytes::Bytes;
use futures_util::{stream, StreamExt};
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
    #[serde(default)]
    pub normalized_response_json: String,
    #[serde(default)]
    pub response_truncated: bool,
}

// ── OpenAI types ──────────────────────────────────────────────

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: serde_json::Value,
    #[serde(flatten)]
    pub extra: serde_json::Map<String, serde_json::Value>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ChatCompletionRequest {
    pub model: String,
    pub messages: Vec<ChatMessage>,
    #[serde(default)]
    pub stream: bool,
    #[serde(default)]
    pub temperature: Option<f32>,
    #[serde(default)]
    pub max_tokens: Option<u32>,
    #[serde(flatten)]
    pub extra: serde_json::Map<String, serde_json::Value>,
}

// ── State ─────────────────────────────────────────────────────

pub struct ProxyState {
    pub counter: AtomicU64,
    pub config: RwLock<ProxyConfig>,
    pub logs: Mutex<Vec<ProxyLogEntry>>,
    persist_config: bool,
}

impl ProxyState {
    pub fn new(config: ProxyConfig) -> Self {
        Self {
            counter: AtomicU64::new(0),
            config: RwLock::new(config),
            logs: Mutex::new(Vec::with_capacity(100)),
            persist_config: true,
        }
    }

    #[cfg(test)]
    fn without_persistence(config: ProxyConfig) -> Self {
        Self {
            counter: AtomicU64::new(0),
            config: RwLock::new(config),
            logs: Mutex::new(Vec::with_capacity(100)),
            persist_config: false,
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

async fn rotate_failed_backend(state: &Arc<ProxyState>, backend_name: &str) {
    let config_to_save = {
        let mut config = state.config.write().await;
        if let Some(index) = config
            .backends
            .iter()
            .position(|backend| backend.name == backend_name)
        {
            let backend = config.backends.remove(index);
            config.backends.push(backend);
        }
        state.persist_config.then(|| config.clone())
    };

    if let Some(config) = config_to_save {
        let _ = config.save();
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

fn extract_stream_token_usage(response_body: &str) -> (u32, u32, u32) {
    for line in response_body.lines().rev() {
        let data = line.strip_prefix("data:").map(str::trim).unwrap_or(line);
        if data.is_empty() || data == "[DONE]" {
            continue;
        }
        let usage = extract_token_usage(data);
        if usage != (0, 0, 0) {
            return usage;
        }
    }
    (0, 0, 0)
}

/// Build the normalized response for the OFF path. The OFF path captures
/// the raw bytes and only assembles once at the end. We reuse the same
/// `StreamAssembler` so the final inspector view is identical to the
/// `Done` event the ON path would have emitted.
fn compute_normalized_for_off(raw: &str) -> String {
    let mut assembler = crate::core::stream_assembler::StreamAssembler::default();
    assembler.push(raw.as_bytes());
    serde_json::to_string(assembler.normalized()).unwrap_or_default()
}

// ── SSE helpers ────────────────────────────────────────────────

fn build_upstream_body(
    request: &ChatCompletionRequest,
    backend: &ProxyBackend,
) -> serde_json::Value {
    let mut body = request.extra.clone();
    body.insert("model".to_string(), serde_json::json!(backend.model));
    body.insert("messages".to_string(), serde_json::json!(request.messages));
    body.insert("stream".to_string(), serde_json::json!(request.stream));
    body.insert(
        "temperature".to_string(),
        serde_json::json!(request.temperature.unwrap_or(0.7)),
    );
    body.insert(
        "max_tokens".to_string(),
        serde_json::json!(request.max_tokens.unwrap_or(4096)),
    );
    serde_json::Value::Object(body)
}

fn chat_completions_url(base_url: &str) -> String {
    let base_url = base_url.trim_end_matches('/');
    if base_url.ends_with("/chat/completions") {
        base_url.to_string()
    } else if base_url.ends_with("/v1") {
        format!("{base_url}/chat/completions")
    } else {
        format!("{base_url}/v1/chat/completions")
    }
}

const MAX_STREAM_LOG_BYTES: usize = 256 * 1024;

fn append_stream_log_preview(preview: &mut Vec<u8>, chunk: &[u8]) {
    let remaining = MAX_STREAM_LOG_BYTES.saturating_sub(preview.len());
    preview.extend_from_slice(&chunk[..chunk.len().min(remaining)]);
}

fn streaming_response(
    upstream: reqwest::Response,
    state: Arc<ProxyState>,
    backend: ProxyBackend,
    request_json: String,
    log_id: u64,
    started_at: std::time::Instant,
) -> Response {
    let status = upstream.status();
    let status_code = status.as_u16();
    let (sender, receiver) = tokio::sync::mpsc::channel::<Result<Bytes, std::io::Error>>(16);

    tokio::spawn(async move {
        let mut upstream_stream = upstream.bytes_stream();
        let mut preview = Vec::new();
        let mut stream_error: Option<String> = None;

        while let Some(item) = upstream_stream.next().await {
            match item {
                Ok(chunk) => {
                    append_stream_log_preview(&mut preview, &chunk);
                    if sender.send(Ok(chunk)).await.is_err() {
                        stream_error = Some("Downstream client disconnected".to_string());
                        break;
                    }
                }
                Err(error) => {
                    let message = error.to_string();
                    stream_error = Some(message.clone());
                    let _ = sender
                        .send(Err(std::io::Error::other(message)))
                        .await;
                    break;
                }
            }
        }

        let response_json = String::from_utf8_lossy(&preview).into_owned();
        let (prompt_tokens, completion_tokens, total_tokens) =
            extract_stream_token_usage(&response_json);
        let normalized_response_json = compute_normalized_for_off(&response_json);
        state
            .add_log(ProxyLogEntry {
                id: log_id,
                timestamp: chrono::Local::now().format("%H:%M:%S").to_string(),
                backend: backend.name,
                model: backend.model,
                request_json,
                response_json,
                status: status_code,
                duration_ms: started_at.elapsed().as_millis() as u64,
                success: stream_error.is_none(),
                error_msg: stream_error,
                prompt_tokens,
                completion_tokens,
                total_tokens,
                normalized_response_json,
                response_truncated: false,
            })
            .await;
    });

    let body_stream = stream::unfold(receiver, |mut receiver| async move {
        receiver.recv().await.map(|item| (item, receiver))
    });

    Response::builder()
        .status(status)
        .header(header::CONTENT_TYPE, "text/event-stream")
        .header(header::CACHE_CONTROL, "no-cache")
        .header("x-accel-buffering", "no")
        .body(Body::from_stream(body_stream))
        .unwrap_or_else(|error| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": { "message": error.to_string(), "type": "internal_error" }
                })),
            )
                .into_response()
        })
}

// ── Handler ───────────────────────────────────────────────────

async fn handle_chat_completion(
    State(state): State<Arc<ProxyState>>,
    Json(request): Json<ChatCompletionRequest>,
) -> Response {
    let log_id = state.counter.fetch_add(1, Ordering::Relaxed) + 1;

    let backends = state.config.read().await.backends.clone();
    if backends.is_empty() {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(serde_json::json!({
                "error": { "message": "No backends configured", "type": "service_unavailable" }
            })),
        )
            .into_response();
    }

    let client = Client::new();

    for backend in backends {
        let max_retries = backend.max_retries.max(1);

        for retry in 0..max_retries {
            let target_url = chat_completions_url(&backend.url);

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

            let body = build_upstream_body(&request, &backend);

            let start = std::time::Instant::now();
            let result = client
                .post(&target_url)
                .headers(headers)
                .json(&body)
                .send()
                .await;

            match result {
                Ok(resp) => {
                    let status_code = resp.status().as_u16();
                    if (200..300).contains(&status_code) && request.stream {
                        let request_json = serde_json::to_string(&body).unwrap_or_default();
                        return streaming_response(
                            resp,
                            state.clone(),
                            backend.clone(),
                            request_json,
                            log_id,
                            start,
                        );
                    }
                    let body_text = resp.text().await.unwrap_or_default();
                    let request_json = serde_json::to_string(&body).unwrap_or_default();
                    let duration_ms = start.elapsed().as_millis() as u64;

                    // Success
                    if (200..300).contains(&status_code) {
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
                            normalized_response_json: response_json,
                            response_truncated: false,
                        }).await;

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
                        return response.into_response();
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
                        normalized_response_json: String::new(),
                        response_truncated: false,
                    }).await;

                    if retry + 1 < max_retries {
                        eprintln!("Backend {} returned {} — retry {}/{}", backend.name, status_code, retry + 1, max_retries);
                        continue;
                    }
                    eprintln!("Backend {} returned {} after {} retries — rotating", backend.name, status_code, max_retries);
                    rotate_failed_backend(&state, &backend.name).await;
                }

                Err(e) => {
                    let duration_ms = start.elapsed().as_millis() as u64;
                    let err_msg = format!("{}", e);
                    let request_json = serde_json::to_string(&body).unwrap_or_default();
                    state.add_log(ProxyLogEntry {
                        id: log_id,
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
                        normalized_response_json: String::new(),
                        response_truncated: false,
                    }).await;

                    if retry + 1 < max_retries {
                        eprintln!("Backend {} failed: {} — retry {}/{}", backend.name, e, retry + 1, max_retries);
                        continue;
                    }
                    eprintln!("Backend {} failed after {} retries — rotating", backend.name, max_retries);
                    rotate_failed_backend(&state, &backend.name).await;
                }
            }
        } // retry loop
    }

    (
        StatusCode::BAD_GATEWAY,
        Json(serde_json::json!({
            "error": { "message": "All backends failed", "type": "bad_gateway" }
        })),
    )
        .into_response()
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
        #[cfg(test)]
        {
            if let Some(path) = std::env::var_os("CLX_PROXY_CONFIG") {
                return Ok(std::path::PathBuf::from(path));
            }
        }
        let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
        Ok(home.join(".ai-cli-manager").join("proxy.json"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::Request;
    use futures_util::StreamExt;
    use std::convert::Infallible;
    use tokio::time::{sleep, timeout, Duration, Instant};
    use tower::ServiceExt;

    #[test]
    fn joins_openai_chat_completion_urls_without_duplicate_v1() {
        assert_eq!(
            chat_completions_url("https://example.test"),
            "https://example.test/v1/chat/completions"
        );
        assert_eq!(
            chat_completions_url("https://example.test/v1/"),
            "https://example.test/v1/chat/completions"
        );
        assert_eq!(
            chat_completions_url("https://example.test/v1/chat/completions"),
            "https://example.test/v1/chat/completions"
        );
    }

    async fn mock_streaming_upstream(
        State(captured): State<Arc<Mutex<Option<serde_json::Value>>>>,
        Json(body): Json<serde_json::Value>,
    ) -> Response {
        *captured.lock().await = Some(body);

        let chunks = stream::unfold(0, |index| async move {
            let (delay_ms, payload) = match index {
                0 => (
                    0,
                    "data: {\"id\":\"mock-1\",\"choices\":[{\"delta\":{\"content\":\"Hel\"}}]}\n\n",
                ),
                1 => (
                    150,
                    "data: {\"id\":\"mock-1\",\"choices\":[{\"delta\":{\"content\":\"lo\"}}],\"usage\":{\"prompt_tokens\":2,\"completion_tokens\":1,\"total_tokens\":3}}\n\n",
                ),
                2 => (0, "data: [DONE]\n\n"),
                _ => return None,
            };
            if delay_ms > 0 {
                sleep(Duration::from_millis(delay_ms)).await;
            }
            Some((
                Ok::<Bytes, Infallible>(Bytes::from_static(payload.as_bytes())),
                index + 1,
            ))
        });

        Response::builder()
            .status(StatusCode::OK)
            .header(header::CONTENT_TYPE, "text/event-stream")
            .body(Body::from_stream(chunks))
            .unwrap()
    }

    #[tokio::test]
    async fn streams_upstream_chunks_without_buffering_completion() {
        let captured = Arc::new(Mutex::new(None));
        let upstream_app = Router::new()
            .route("/v1/chat/completions", post(mock_streaming_upstream))
            .with_state(captured.clone());
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let upstream_address = listener.local_addr().unwrap();
        let upstream_task = tokio::spawn(async move {
            axum::serve(listener, upstream_app).await.unwrap();
        });

        let state = Arc::new(ProxyState::without_persistence(ProxyConfig {
            port: 0,
            enabled: true,
            backends: vec![ProxyBackend {
                name: "mock".to_string(),
                url: format!("http://{}", upstream_address),
                api_key: "test-key".to_string(),
                model: "configured-model".to_string(),
                weight: 1,
                max_retries: 1,
                headers: HashMap::new(),
                custom_user_agent: Some("clx-test".to_string()),
            }],
        }));
        let proxy_app = Router::new()
            .route("/v1/chat/completions", post(handle_chat_completion))
            .with_state(state.clone());
        let request_body = serde_json::json!({
            "model": "client-model",
            "messages": [{ "role": "user", "content": "hello" }],
            "stream": true,
            "top_p": 0.25
        });

        let started = Instant::now();
        let response = proxy_app
            .oneshot(
                Request::post("/v1/chat/completions")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(request_body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response.headers().get(header::CONTENT_TYPE).unwrap(),
            "text/event-stream"
        );
        assert!(started.elapsed() < Duration::from_millis(140));

        let mut response_stream = response.into_body().into_data_stream();
        let first = timeout(Duration::from_secs(1), response_stream.next())
            .await
            .unwrap()
            .unwrap()
            .unwrap();
        assert!(String::from_utf8_lossy(&first).contains("Hel"));

        let before_second = Instant::now();
        let second = timeout(Duration::from_secs(1), response_stream.next())
            .await
            .unwrap()
            .unwrap()
            .unwrap();
        assert!(before_second.elapsed() >= Duration::from_millis(100));
        assert!(String::from_utf8_lossy(&second).contains("lo"));

        let done = timeout(Duration::from_secs(1), response_stream.next())
            .await
            .unwrap()
            .unwrap()
            .unwrap();
        assert!(String::from_utf8_lossy(&done).contains("[DONE]"));
        assert!(response_stream.next().await.is_none());

        let upstream_request = captured.lock().await.clone().unwrap();
        assert_eq!(upstream_request["stream"], true);
        assert_eq!(upstream_request["model"], "configured-model");
        assert_eq!(upstream_request["top_p"], 0.25);

        let logs = state.get_logs().await;
        assert_eq!(logs.len(), 1);
        assert!(logs[0].success);
        assert!(logs[0].response_json.contains("[DONE]"));
        assert_eq!(logs[0].total_tokens, 3);

        upstream_task.abort();
    }

    #[tokio::test]
    async fn streamed_log_has_normalized_response_json() {
        let (upstream_app, upstream_address) = {
            let captured = Arc::new(Mutex::new(None));
            let app = Router::new()
                .route("/v1/chat/completions", post(mock_streaming_upstream))
                .with_state(captured.clone());
            let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
            let addr = listener.local_addr().unwrap();
            let task = tokio::spawn(async move {
                axum::serve(listener, app).await.unwrap();
            });
            (task, addr)
        };

        let state = Arc::new(ProxyState::without_persistence(ProxyConfig {
            port: 0,
            enabled: true,
            backends: vec![ProxyBackend {
                name: "mock".to_string(),
                url: format!("http://{}", upstream_address),
                api_key: "test-key".to_string(),
                model: "configured-model".to_string(),
                weight: 1,
                max_retries: 1,
                headers: HashMap::new(),
                custom_user_agent: Some("clx-test".to_string()),
            }],
        }));
        let proxy_app = Router::new()
            .route("/v1/chat/completions", post(handle_chat_completion))
            .with_state(state.clone());
        let request_body = serde_json::json!({
            "model": "client-model",
            "messages": [{ "role": "user", "content": "hi" }],
            "stream": true,
        });

        let response = proxy_app
            .oneshot(
                Request::post("/v1/chat/completions")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(request_body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let _ = response.into_body().into_data_stream().collect::<Vec<_>>().await;

        let logs = state.get_logs().await;
        assert_eq!(logs.len(), 1);
        assert!(logs[0].success);
        assert_eq!(
            serde_json::from_str::<serde_json::Value>(&logs[0].normalized_response_json)
                .unwrap()["choices"][0]["message"]["content"],
            serde_json::json!("Hello")
        );

        upstream_app.abort();
    }

    #[tokio::test]
    #[ignore = "requires the saved CliProxyAI config and live provider access"]
    async fn streams_with_saved_proxy_config() {
        let config = ProxyConfig::load().expect("saved proxy config should load");
        assert!(!config.backends.is_empty(), "at least one backend is required");
        let configured_keys: Vec<String> = config
            .backends
            .iter()
            .map(|backend| backend.api_key.clone())
            .filter(|key| !key.is_empty())
            .collect();
        let state = Arc::new(ProxyState::without_persistence(config));
        let proxy_app = Router::new()
            .route("/v1/chat/completions", post(handle_chat_completion))
            .with_state(state.clone());
        let request_body = serde_json::json!({
            "model": "use-configured-model",
            "messages": [{
                "role": "user",
                "content": "Reply with exactly STREAM_OK and no other text."
            }],
            "stream": true,
            "temperature": 0,
            "max_tokens": 32
        });

        let response = timeout(
            Duration::from_secs(120),
            proxy_app.oneshot(
                Request::post("/v1/chat/completions")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(request_body.to_string()))
                    .unwrap(),
            ),
        )
        .await
        .expect("live provider should return response headers")
        .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response.headers().get(header::CONTENT_TYPE).unwrap(),
            "text/event-stream"
        );

        let mut response_stream = response.into_body().into_data_stream();
        let mut chunks = 0usize;
        let mut response_body = Vec::new();
        while let Some(chunk) = timeout(Duration::from_secs(120), response_stream.next())
            .await
            .expect("live stream should continue")
        {
            let chunk = chunk.expect("live stream chunk should be readable");
            chunks += 1;
            response_body.extend_from_slice(&chunk);
        }

        let response_text = String::from_utf8_lossy(&response_body);
        assert!(chunks >= 2, "expected multiple streamed chunks, got {chunks}");
        assert!(response_text.contains("data:"));
        assert!(response_text.contains("[DONE]"));
        for key in configured_keys {
            assert!(!response_text.contains(&key));
        }

        let logs = state.get_logs().await;
        assert_eq!(logs.len(), 1);
        assert!(logs[0].success);
    }
}
