//! NIP-98 HTTP authorization middleware + replay cache.

use axum::{
    body::Body,
    extract::{Request, State},
    http::{request::Parts, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};
use nes_protocol::nip98::{verify_nip98, Nip98Event};
use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::state::AppState;

const REPLAY_CACHE_WINDOW_SECS: i64 = 120;

#[derive(Default)]
pub struct ReplayCache {
    seen: Mutex<HashMap<String, i64>>,
}

impl ReplayCache {
    pub fn new() -> Self {
        Self::default()
    }

    /// Returns true if the event id was already seen within the replay window.
    /// Records the id otherwise.
    pub fn check_and_record(&self, event_id: &str) -> bool {
        let now = now_unix();
        let mut seen = self.seen.lock().unwrap();
        seen.retain(|_, &mut ts| now.saturating_sub(ts) < REPLAY_CACHE_WINDOW_SECS);
        if seen.contains_key(event_id) {
            return true;
        }
        seen.insert(event_id.to_string(), now);
        false
    }
}

fn now_unix() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

/// NIP-98 auth middleware: verify the Authorization header against the request
/// method + URL + body, enforce replay protection, then inject the verified
/// pubkey as a request extension for downstream handlers.
pub async fn nip98_auth(State(state): State<AppState>, req: Request, next: Next) -> Response {
    let (parts, body) = req.into_parts();
    let bytes = match axum::body::to_bytes(body, usize::MAX).await {
        Ok(b) => b,
        Err(_) => return (StatusCode::BAD_REQUEST, "could not read request body").into_response(),
    };
    let payload = bytes.to_vec();
    let method = parts.method.as_str().to_string();
    let url = full_url(&parts);
    let auth_header = parts
        .headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let pubkey = match verify_request(auth_header, &url, &method, &payload, &state) {
        Ok(pk) => pk,
        Err((status, msg)) => return (status, msg).into_response(),
    };

    let mut req = Request::from_parts(parts, Body::from(bytes));
    req.extensions_mut().insert(pubkey);
    next.run(req).await
}

fn verify_request(
    auth_header: &str,
    url: &str,
    method: &str,
    payload: &[u8],
    state: &AppState,
) -> Result<String, (StatusCode, String)> {
    // Accept "Nostr <base64url(json)>" or raw JSON.
    let event_json = if let Some(rest) = auth_header.strip_prefix("Nostr ") {
        let trimmed = rest.trim();
        if trimmed.starts_with('{') {
            trimmed.to_string()
        } else {
            use base64::Engine as _;
            base64::engine::general_purpose::URL_SAFE_NO_PAD
                .decode(trimmed)
                .map_err(|e| {
                    (
                        StatusCode::BAD_REQUEST,
                        format!("invalid authorization encoding: {e}"),
                    )
                })
                .and_then(|b| {
                    String::from_utf8(b)
                        .map_err(|e| (StatusCode::BAD_REQUEST, format!("invalid UTF-8: {e}")))
                })?
        }
    } else {
        auth_header.to_string()
    };
    if event_json.is_empty() {
        return Err((
            StatusCode::UNAUTHORIZED,
            "missing Authorization header".into(),
        ));
    }
    let event: Nip98Event = serde_json::from_str(&event_json)
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("invalid event JSON: {e}")))?;
    verify_nip98(&event, url, method, payload, now_unix())
        .map_err(|e| (StatusCode::UNAUTHORIZED, e.to_string()))?;

    if state.replay().check_and_record(&event.id) {
        return Err((StatusCode::UNAUTHORIZED, "replayed event".into()));
    }
    Ok(event.pubkey)
}

fn full_url(parts: &Parts) -> String {
    // Behind the reverse proxy, `x-forwarded-proto`/`x-forwarded-host` carry
    // the external origin and are trusted at the proxy boundary. When absent
    // (direct connection, e.g. localhost testing), the scheme is plain HTTP.
    let scheme = parts
        .headers
        .get("x-forwarded-proto")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("http");
    let host = parts
        .headers
        .get("x-forwarded-host")
        .and_then(|v| v.to_str().ok())
        .or_else(|| parts.headers.get("host").and_then(|v| v.to_str().ok()))
        .unwrap_or("localhost");
    format!(
        "{scheme}://{host}{}",
        parts.uri.path_and_query().map(|p| p.as_str()).unwrap_or("")
    )
}
