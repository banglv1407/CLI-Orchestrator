use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::sync::Mutex;

// ── Shared state for abort support ──
pub struct ApiProxyState {
    pub cancel_tokens:
        Mutex<std::collections::HashMap<String, tokio_util::sync::CancellationToken>>,
}

impl ApiProxyState {
    pub fn new() -> Self {
        Self {
            cancel_tokens: Mutex::new(std::collections::HashMap::new()),
        }
    }
}

pub type SharedApiProxyState = Arc<ApiProxyState>;

// ── DTOs ──
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiProxyRequest {
    pub method: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: Option<String>,
    pub request_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiProxyResponse {
    pub status: u16,
    pub status_text: String,
    pub headers: Vec<(String, String)>,
    pub body: String,
    pub duration: u64,
    pub request_id: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiProxyStreamChunk {
    pub request_id: String,
    pub chunk: String,
    pub event_type: String, // "start", "data", "done", "error"
    pub status: Option<u16>,
    pub status_text: Option<String>,
    pub headers: Option<Vec<(String, String)>>,
    pub error: Option<String>,
}

const STREAM_EVENT: &str = "api-proxy-stream";

fn build_request(client: &reqwest::Client, request: &ApiProxyRequest) -> reqwest::RequestBuilder {
    let method = request.method.to_uppercase();
    let mut req = match method.as_str() {
        "GET" => client.get(&request.url),
        "POST" => client.post(&request.url),
        "PUT" => client.put(&request.url),
        "DELETE" => client.delete(&request.url),
        "PATCH" => client.patch(&request.url),
        "HEAD" => client.head(&request.url),
        _ => client.get(&request.url),
    };

    for (key, value) in &request.headers {
        req = req.header(key.as_str(), value.as_str());
    }

    if let Some(body) = &request.body {
        if !body.is_empty() {
            req = req.body(body.clone());
        }
    }

    req
}

// ── Non-streaming request (returns full response) ──
#[tauri::command]
pub async fn api_proxy_request(request: ApiProxyRequest) -> Result<ApiProxyResponse, String> {
    let start = std::time::Instant::now();

    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(false)
        .timeout(std::time::Duration::from_secs(60))
        .build()
        .map_err(|e| format!("Failed to build HTTP client: {}", e))?;

    let req = build_request(&client, &request);
    let response = req.send().await.map_err(|e| {
        if e.is_timeout() {
            "Request timed out after 60s".to_string()
        } else if e.is_connect() {
            format!("Connection failed: {}", e)
        } else {
            format!("Request error: {}", e)
        }
    })?;

    let status = response.status().as_u16();
    let status_text = response
        .status()
        .canonical_reason()
        .unwrap_or("Unknown")
        .to_string();
    let headers: Vec<(String, String)> = response
        .headers()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();
    let body = response.text().await.unwrap_or_default();
    let duration = start.elapsed().as_millis() as u64;

    Ok(ApiProxyResponse {
        status,
        status_text,
        headers,
        body,
        duration,
        request_id: request.request_id.clone(),
    })
}

// ── Streaming request (SSE / long-poll) ──
#[tauri::command]
pub async fn api_proxy_stream(
    app: AppHandle,
    state: tauri::State<'_, SharedApiProxyState>,
    request: ApiProxyRequest,
) -> Result<String, String> {
    let request_id = request
        .request_id
        .clone()
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let cancel = tokio_util::sync::CancellationToken::new();
    {
        let mut tokens = state.cancel_tokens.lock().await;
        tokens.insert(request_id.clone(), cancel.clone());
    }

    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(false)
        .timeout(std::time::Duration::from_secs(300)) // 5min for streaming
        .build()
        .map_err(|e| format!("Failed to build HTTP client: {}", e))?;

    let req = build_request(&client, &request);

    let rid = request_id.clone();
    let app_handle = app.clone();
    // Clone Arc to avoid borrow issues
    let state_ref = state.inner().clone();
    tokio::spawn(async move {
        let cancel_ref = cancel.clone();
        tokio::select! {
            _ = cancel_ref.cancelled() => {
                let _ = app_handle.emit(STREAM_EVENT, ApiProxyStreamChunk {
                    request_id: rid.clone(),
                    chunk: String::new(),
                    event_type: "error".to_string(),
                    status: None, status_text: None, headers: None,
                    error: Some("Request cancelled".to_string()),
                });
            }
            result = do_stream(req, &rid, &app_handle) => {
                if let Err(err_msg) = result {
                    let _ = app_handle.emit(STREAM_EVENT, ApiProxyStreamChunk {
                        request_id: rid.clone(),
                        chunk: String::new(),
                        event_type: "error".to_string(),
                        status: None, status_text: None, headers: None,
                        error: Some(err_msg),
                    });
                }
            }
        }
        // Cleanup token
        let mut tokens = state_ref.cancel_tokens.lock().await;
        tokens.remove(&rid);
    });

    Ok(request_id)
}

async fn do_stream(
    req: reqwest::RequestBuilder,
    request_id: &str,
    app: &AppHandle,
) -> Result<(), String> {
    let response = req.send().await.map_err(|e| {
        if e.is_timeout() {
            "Request timed out".to_string()
        } else if e.is_connect() {
            format!("Connection failed: {}", e)
        } else {
            format!("Request error: {}", e)
        }
    })?;

    let status = response.status().as_u16();
    let status_text = response
        .status()
        .canonical_reason()
        .unwrap_or("Unknown")
        .to_string();
    let headers: Vec<(String, String)> = response
        .headers()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();

    // Emit "start" event with status + headers
    let _ = app.emit(
        STREAM_EVENT,
        ApiProxyStreamChunk {
            request_id: request_id.to_string(),
            chunk: String::new(),
            event_type: "start".to_string(),
            status: Some(status),
            status_text: Some(status_text),
            headers: Some(headers),
            error: None,
        },
    );

    // Read stream via bytes_stream() - works for SSE and any continuous stream
    use futures_util::StreamExt;
    let mut stream = response.bytes_stream();
    while let Some(item) = stream.next().await {
        match item {
            Ok(bytes) => {
                if !bytes.is_empty() {
                    let text = String::from_utf8_lossy(&bytes).to_string();
                    let _ = app.emit(
                        STREAM_EVENT,
                        ApiProxyStreamChunk {
                            request_id: request_id.to_string(),
                            chunk: text,
                            event_type: "data".to_string(),
                            status: None,
                            status_text: None,
                            headers: None,
                            error: None,
                        },
                    );
                }
            }
            Err(e) => {
                let _ = app.emit(
                    STREAM_EVENT,
                    ApiProxyStreamChunk {
                        request_id: request_id.to_string(),
                        chunk: String::new(),
                        event_type: "error".to_string(),
                        status: None,
                        status_text: None,
                        headers: None,
                        error: Some(format!("Stream error: {}", e)),
                    },
                );
                return Ok(());
            }
        }
    }

    // Emit "done"
    let _ = app.emit(
        STREAM_EVENT,
        ApiProxyStreamChunk {
            request_id: request_id.to_string(),
            chunk: String::new(),
            event_type: "done".to_string(),
            status: None,
            status_text: None,
            headers: None,
            error: None,
        },
    );

    Ok(())
}

// ── Abort ──
#[tauri::command]
pub async fn api_proxy_abort(
    state: tauri::State<'_, SharedApiProxyState>,
    request_id: String,
) -> Result<(), String> {
    let mut tokens = state.cancel_tokens.lock().await;
    if let Some(token) = tokens.remove(&request_id) {
        token.cancel();
        Ok(())
    } else {
        Err(format!("No active request with id: {}", request_id))
    }
}
