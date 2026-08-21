use std::{
    collections::{HashMap, VecDeque},
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};

use futures_util::StreamExt;
use reqwest::{Client, Method, RequestBuilder, Url};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tokio::runtime::Runtime;
use tokio_util::sync::CancellationToken;

const MAX_RESPONSE_BYTES: usize = 4 * 1024 * 1024;
const MAX_STREAM_BYTES: usize = 16 * 1024 * 1024;
const MAX_STREAM_EVENTS: usize = 256;
const MAX_EVENT_BYTES: usize = 12 * 1024;
const MAX_POLL_EVENTS: usize = 32;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct ApiRequest {
    method: String,
    url: String,
    #[serde(default)]
    headers: Vec<(String, String)>,
    body: Option<String>,
    request_id: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ApiResponse {
    status: u16,
    status_text: String,
    headers: Vec<(String, String)>,
    body: String,
    duration: u64,
    request_id: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct StreamEvent {
    request_id: String,
    chunk: String,
    event_type: &'static str,
    status: Option<u16>,
    status_text: Option<String>,
    headers: Option<Vec<(String, String)>>,
    error: Option<String>,
}

struct StreamEntry {
    events: VecDeque<StreamEvent>,
    active: bool,
    cancel: CancellationToken,
}

type Streams = Arc<Mutex<HashMap<String, StreamEntry>>>;

pub struct ApiClientService {
    runtime: Runtime,
    client: Client,
    streams: Streams,
}

impl ApiClientService {
    pub fn new() -> Result<Self, String> {
        let runtime = Runtime::new().map_err(|error| error.to_string())?;
        let client = Client::builder()
            .danger_accept_invalid_certs(false)
            .build()
            .map_err(|error| format!("failed to build HTTP client: {error}"))?;
        Ok(Self {
            runtime,
            client,
            streams: Arc::new(Mutex::new(HashMap::new())),
        })
    }

    pub fn dispatch(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.api-client.request" => {
                let request = parse_request(params)?;
                serde_json::to_value(
                    self.runtime
                        .block_on(execute_request(self.client.clone(), request))?,
                )
                .map_err(|error| error.to_string())
            }
            "clx.api-client.streamStart" => self.stream_start(parse_request(params)?),
            "clx.api-client.streamPoll" => self.stream_poll(request_id(params)?),
            "clx.api-client.streamAbort" => self.stream_abort(request_id(params)?),
            _ => Err(format!("unsupported API Client method: {method}")),
        }
    }

    fn stream_start(&self, request: ApiRequest) -> Result<Value, String> {
        validate_request(&request)?;
        let request_id = request
            .request_id
            .clone()
            .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
        if request_id.len() > 128 || request_id.is_empty() {
            return Err("requestId must contain 1 to 128 characters".into());
        }
        let cancel = CancellationToken::new();
        {
            let mut streams = self
                .streams
                .lock()
                .map_err(|_| "stream state lock poisoned".to_string())?;
            if streams.contains_key(&request_id) {
                return Err("requestId is already active".into());
            }
            streams.insert(
                request_id.clone(),
                StreamEntry {
                    events: VecDeque::new(),
                    active: true,
                    cancel: cancel.clone(),
                },
            );
        }
        let client = self.client.clone();
        let streams = self.streams.clone();
        let task_id = request_id.clone();
        self.runtime.spawn(async move {
            let outcome = tokio::select! {
                _ = cancel.cancelled() => Err("Request cancelled".to_string()),
                result = tokio::time::timeout(
                    Duration::from_secs(300),
                    execute_stream(client, request, &task_id, &streams),
                ) => match result {
                    Ok(value) => value,
                    Err(_) => Err("Request timed out after 300s".into()),
                },
            };
            if let Err(error) = outcome {
                push_event(
                    &streams,
                    &task_id,
                    StreamEvent {
                        request_id: task_id.clone(),
                        chunk: String::new(),
                        event_type: "error",
                        status: None,
                        status_text: None,
                        headers: None,
                        error: Some(error),
                    },
                );
            }
            mark_inactive(&streams, &task_id);
        });
        Ok(json!({ "requestId": request_id }))
    }

    fn stream_poll(&self, request_id: String) -> Result<Value, String> {
        let mut streams = self
            .streams
            .lock()
            .map_err(|_| "stream state lock poisoned".to_string())?;
        let Some(entry) = streams.get_mut(&request_id) else {
            return Ok(json!({ "events": [], "active": false }));
        };
        let events: Vec<_> = entry
            .events
            .drain(..entry.events.len().min(MAX_POLL_EVENTS))
            .collect();
        let active = entry.active;
        if !active && entry.events.is_empty() {
            streams.remove(&request_id);
        }
        Ok(json!({ "events": events, "active": active }))
    }

    fn stream_abort(&self, request_id: String) -> Result<Value, String> {
        let mut streams = self
            .streams
            .lock()
            .map_err(|_| "stream state lock poisoned".to_string())?;
        let entry = streams
            .remove(&request_id)
            .ok_or_else(|| format!("No active request with id: {request_id}"))?;
        entry.cancel.cancel();
        Ok(json!({ "aborted": true }))
    }
}

fn parse_request(params: Value) -> Result<ApiRequest, String> {
    serde_json::from_value(params).map_err(|error| format!("invalid API request: {error}"))
}

fn request_id(params: Value) -> Result<String, String> {
    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase", deny_unknown_fields)]
    struct RequestId {
        request_id: String,
    }
    let value: RequestId =
        serde_json::from_value(params).map_err(|error| format!("invalid request id: {error}"))?;
    if value.request_id.is_empty() || value.request_id.len() > 128 {
        return Err("requestId must contain 1 to 128 characters".into());
    }
    Ok(value.request_id)
}

fn validate_request(request: &ApiRequest) -> Result<(), String> {
    let url = Url::parse(&request.url).map_err(|error| format!("invalid URL: {error}"))?;
    if !matches!(url.scheme(), "http" | "https") {
        return Err("only http and https URLs are allowed".into());
    }
    Method::from_bytes(request.method.as_bytes()).map_err(|_| "invalid HTTP method".to_string())?;
    if request.body.as_ref().map_or(0, String::len) > MAX_RESPONSE_BYTES {
        return Err("request body exceeds 4 MiB".into());
    }
    if request.headers.len() > 256 {
        return Err("request has too many headers".into());
    }
    Ok(())
}

fn build_request(client: &Client, request: &ApiRequest) -> Result<RequestBuilder, String> {
    validate_request(request)?;
    let method =
        Method::from_bytes(request.method.as_bytes()).map_err(|_| "invalid HTTP method")?;
    let mut builder = client.request(method, &request.url);
    for (name, value) in &request.headers {
        builder = builder.header(name, value);
    }
    if let Some(body) = &request.body {
        if !body.is_empty() {
            builder = builder.body(body.clone());
        }
    }
    Ok(builder)
}

async fn execute_request(client: Client, request: ApiRequest) -> Result<ApiResponse, String> {
    let start = Instant::now();
    let request_id = request.request_id.clone();
    let future = async {
        let response = build_request(&client, &request)?
            .send()
            .await
            .map_err(request_error)?;
        let status = response.status();
        let headers = response_headers(&response);
        let mut body = Vec::new();
        let mut stream = response.bytes_stream();
        while let Some(item) = stream.next().await {
            let bytes = item.map_err(request_error)?;
            if body.len() + bytes.len() > MAX_RESPONSE_BYTES {
                return Err("response body exceeds 4 MiB".into());
            }
            body.extend_from_slice(&bytes);
        }
        Ok(ApiResponse {
            status: status.as_u16(),
            status_text: status.canonical_reason().unwrap_or("Unknown").into(),
            headers,
            body: String::from_utf8_lossy(&body).into_owned(),
            duration: start.elapsed().as_millis() as u64,
            request_id,
        })
    };
    tokio::time::timeout(Duration::from_secs(60), future)
        .await
        .map_err(|_| "Request timed out after 60s".to_string())?
}

async fn execute_stream(
    client: Client,
    request: ApiRequest,
    request_id: &str,
    streams: &Streams,
) -> Result<(), String> {
    let response = build_request(&client, &request)?
        .send()
        .await
        .map_err(request_error)?;
    let status = response.status();
    push_event(
        streams,
        request_id,
        StreamEvent {
            request_id: request_id.into(),
            chunk: String::new(),
            event_type: "start",
            status: Some(status.as_u16()),
            status_text: Some(status.canonical_reason().unwrap_or("Unknown").into()),
            headers: Some(response_headers(&response)),
            error: None,
        },
    );
    let mut total = 0_usize;
    let mut body = response.bytes_stream();
    while let Some(item) = body.next().await {
        let bytes = item.map_err(request_error)?;
        total = total.saturating_add(bytes.len());
        if total > MAX_STREAM_BYTES {
            return Err("stream exceeds 16 MiB".into());
        }
        for part in bytes.chunks(MAX_EVENT_BYTES) {
            push_event(
                streams,
                request_id,
                StreamEvent {
                    request_id: request_id.into(),
                    chunk: String::from_utf8_lossy(part).into_owned(),
                    event_type: "data",
                    status: None,
                    status_text: None,
                    headers: None,
                    error: None,
                },
            );
        }
    }
    push_event(
        streams,
        request_id,
        StreamEvent {
            request_id: request_id.into(),
            chunk: String::new(),
            event_type: "done",
            status: None,
            status_text: None,
            headers: None,
            error: None,
        },
    );
    Ok(())
}

fn response_headers(response: &reqwest::Response) -> Vec<(String, String)> {
    response
        .headers()
        .iter()
        .map(|(name, value)| {
            (
                name.to_string(),
                value.to_str().unwrap_or("[non-UTF8 header]").to_string(),
            )
        })
        .collect()
}

fn request_error(error: reqwest::Error) -> String {
    if error.is_timeout() {
        "Request timed out".into()
    } else if error.is_connect() {
        format!("Connection failed: {error}")
    } else {
        format!("Request error: {error}")
    }
}

fn push_event(streams: &Streams, request_id: &str, event: StreamEvent) {
    let Ok(mut streams) = streams.lock() else {
        return;
    };
    let Some(entry) = streams.get_mut(request_id) else {
        return;
    };
    if entry.events.len() >= MAX_STREAM_EVENTS {
        entry.events.clear();
        entry.events.push_back(StreamEvent {
            request_id: request_id.into(),
            chunk: String::new(),
            event_type: "error",
            status: None,
            status_text: None,
            headers: None,
            error: Some("stream event queue exceeded 256 entries".into()),
        });
        entry.active = false;
        entry.cancel.cancel();
        return;
    }
    entry.events.push_back(event);
}

fn mark_inactive(streams: &Streams, request_id: &str) {
    if let Ok(mut streams) = streams.lock() {
        if let Some(entry) = streams.get_mut(request_id) {
            entry.active = false;
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{
        io::{Read, Write},
        net::TcpListener,
        thread,
    };

    use super::*;

    fn serve(response: &'static [u8]) -> String {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let address = listener.local_addr().unwrap();
        thread::spawn(move || {
            let (mut socket, _) = listener.accept().unwrap();
            let mut request = [0_u8; 2048];
            let _ = socket.read(&mut request);
            socket.write_all(response).unwrap();
        });
        format!("http://{address}/fixture")
    }

    fn request(url: String) -> Value {
        json!({"method":"GET","url":url,"headers":[],"body":null,"requestId":null})
    }

    #[test]
    fn rejects_non_http_urls() {
        let service = ApiClientService::new().unwrap();
        let error = service
            .dispatch(
                "clx.api-client.request",
                request("file:///secret.txt".into()),
            )
            .unwrap_err();
        assert!(error.contains("only http and https"));
    }

    #[test]
    fn performs_bounded_http_request() {
        let url = serve(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nok");
        let service = ApiClientService::new().unwrap();
        let response = service
            .dispatch("clx.api-client.request", request(url))
            .unwrap();
        assert_eq!(response["status"], 200);
        assert_eq!(response["body"], "ok");
    }

    #[test]
    fn streams_ordered_events_through_polling() {
        let url = serve(
            b"HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nContent-Length: 11\r\n\r\ndata: one\n\n",
        );
        let service = ApiClientService::new().unwrap();
        let started = service
            .dispatch("clx.api-client.streamStart", request(url))
            .unwrap();
        let request_id = started["requestId"].as_str().unwrap().to_string();
        let mut kinds = Vec::new();
        for _ in 0..100 {
            let polled = service
                .dispatch("clx.api-client.streamPoll", json!({"requestId":request_id}))
                .unwrap();
            kinds.extend(
                polled["events"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .filter_map(|event| event["eventType"].as_str().map(str::to_string)),
            );
            if !polled["active"].as_bool().unwrap() {
                break;
            }
            thread::sleep(Duration::from_millis(10));
        }
        assert_eq!(kinds.first().map(String::as_str), Some("start"));
        assert!(kinds.iter().any(|kind| kind == "data"));
        assert_eq!(kinds.last().map(String::as_str), Some("done"));
    }

    #[test]
    fn stream_abort_cancels_active_stream() {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let address = listener.local_addr().unwrap();
        thread::spawn(move || {
            let (mut socket, _) = listener.accept().unwrap();
            let mut request = [0_u8; 2048];
            let _ = socket.read(&mut request);
            let _ = socket.write_all(b"HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\n\r\n");
            for _ in 0..50 {
                if socket.write_all(b"data: chunk\n\n").is_err() {
                    break;
                }
                thread::sleep(Duration::from_millis(50));
            }
        });

        let url = format!("http://{address}/fixture");
        let service = ApiClientService::new().unwrap();
        let started = service
            .dispatch("clx.api-client.streamStart", request(url))
            .unwrap();
        let request_id = started["requestId"].as_str().unwrap().to_string();

        let aborted = service
            .dispatch("clx.api-client.streamAbort", json!({"requestId": request_id}))
            .unwrap();
        assert_eq!(aborted["aborted"], true);

        let polled = service
            .dispatch("clx.api-client.streamPoll", json!({"requestId": request_id}))
            .unwrap();
        assert_eq!(polled["active"], false);
        assert!(polled["events"].as_array().unwrap().is_empty());
    }
}
