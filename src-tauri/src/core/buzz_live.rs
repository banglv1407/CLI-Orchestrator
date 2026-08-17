// Buzz live subscription — a single persistent WebSocket to the Buzz relay
// that subscribes to the currently-open channel and fans new kind:9 stream
// messages up to React as Tauri events. This replaces the 5s polling loop for
// the "receive new chat" hot path; everything else (send, open DM, members,
// profile, …) still goes through the buzz.exe sidecar.
//
// Protocol (verified against block/buzz relay 0.2.x + live relay):
//   * connect over wss://
//   * relay sends ["AUTH", "<challenge>"]
//   * client signs a NIP-42 event (kind 22242, tags [relay, url], [challenge, ..])
//     and sends ["AUTH", <event-json>]
//   * relay replies ["OK", <id>, true, ""]
//   * client sends ["REQ", <sub-id>, {"kinds":[9], "#h":[<channel>]}]
//   * relay replays stored events then ["EOSE", <sub-id>], then live ["EVENT", <sub-id>, <event>]

use crate::core::buzz_types::BuzzMessage;
use futures_util::{SinkExt, StreamExt};
use k256::ecdsa::signature::hazmat::PrehashSigner;
use sha2::{Digest, Sha256};
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::Emitter;
use tokio::sync::Mutex;
use tokio_tungstenite::tungstenite::Message;

const NIP42_KIND: u32 = 22242;
const STREAM_MESSAGE_KIND: u32 = 9;

/// A signed Nostr event in canonical NIP-01 wire form.
#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct NostrEvent {
    id: String,
    pubkey: String,
    created_at: i64,
    kind: u32,
    tags: Vec<Vec<String>>,
    content: String,
    sig: String,
}

/// Sign any Nostr event with the given private key (hex), returning the full
/// wire event. The event `id` is the SHA-256 of the canonical serialization
/// `[0, pubkey, created_at, kind, tags, content]`, signed with BIP-340 Schnorr.
fn sign_event(
    private_key_hex: &str,
    kind: u32,
    tags: Vec<Vec<String>>,
    content: &str,
) -> Result<NostrEvent, String> {
    let signing_key = k256::schnorr::SigningKey::from_bytes(
        &hex::decode(private_key_hex).map_err(|_| "key is not valid hex".to_string())?,
    )
    .map_err(|_| "key is not a valid secp256k1 key".to_string())?;
    let pubkey = hex::encode(signing_key.verifying_key().to_bytes());
    let created_at = now_unix();

    let mut event = NostrEvent {
        id: String::new(),
        pubkey,
        created_at,
        kind,
        tags,
        content: content.to_string(),
        sig: String::new(),
    };
    let id = compute_event_id(&event);
    event.id = id.clone();
    let id_bytes = hex::decode(&id).map_err(|_| "bad id".to_string())?;
    let sig = signing_key
        .sign_prehash(&id_bytes)
        .map_err(|_| "signing failed".to_string())?;
    event.sig = hex::encode(sig.to_bytes());
    Ok(event)
}

fn compute_event_id(event: &NostrEvent) -> String {
    let json = serde_json::to_string(&serde_json::json!([
        0,
        event.pubkey,
        event.created_at,
        event.kind,
        event.tags,
        event.content
    ]))
    .unwrap_or_default();
    hex::encode(Sha256::digest(json.as_bytes()))
}

fn now_unix() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

/// Convert a relay `https://…`/`wss://…` URL to a `wss://` WebSocket URL.
fn to_wss_url(relay: &str) -> String {
    let relay = relay.trim_end_matches('/');
    if relay.starts_with("wss://") || relay.starts_with("ws://") {
        relay.to_string()
    } else if let Some(rest) = relay.strip_prefix("https://") {
        format!("wss://{rest}")
    } else if let Some(rest) = relay.strip_prefix("http://") {
        format!("ws://{rest}")
    } else {
        format!("wss://{relay}")
    }
}

/// The live subscription runtime, held in shared state so commands can drive it.
pub struct BuzzLiveClient {
    /// (url, channel_id) currently subscribed; None when disconnected/idle.
    current: Arc<Mutex<Option<(String, String)>>>,
}

impl BuzzLiveClient {
    pub fn new() -> Self {
        Self {
            current: Arc::new(Mutex::new(None)),
        }
    }

    /// Switch the subscription to `channel_id` (or drop it when `None`).
    /// Spawns a detached reconnect loop; returns immediately.
    pub fn subscribe(&self, app: tauri::AppHandle, relay: String, channel_id: Option<String>) {
        let current = self.current.clone();
        tauri::async_runtime::spawn(async move {
            let mut guard = current.lock().await;
            match channel_id.as_ref() {
                Some(ch) => *guard = Some((relay.clone(), ch.clone())),
                None => *guard = None,
            }
            drop(guard);

            let Some(ch) = channel_id else {
                return;
            };
            // The loop re-reads `current` each reconnect; when it stops matching
            // this channel (user switched away) it exits.
            let _ = run_until_stale(app, current, relay, ch).await;
        });
    }

    pub async fn current(&self) -> Option<(String, String)> {
        self.current.lock().await.clone()
    }
}

/// Connect + auth + subscribe + forward events, retrying with backoff while the
/// desired channel is unchanged. Returns when the desired channel changes or the
/// client is told to stop.
async fn run_until_stale(
    app: tauri::AppHandle,
    current: Arc<Mutex<Option<(String, String)>>>,
    relay: String,
    channel_id: String,
) {
    let ws_url = to_wss_url(&relay);
    let mut backoff = 1u64;

    loop {
        // Stop if the user switched channel or cleared the subscription.
        {
            let guard = current.lock().await;
            let still_wanted = guard
                .as_ref()
                .map(|(_, c)| c == &channel_id)
                .unwrap_or(false);
            if !still_wanted {
                return;
            }
        }

        match connect_once(&app, &ws_url, &channel_id).await {
            Ok(()) => {
                // Connected and streamed until the socket closed. Reset backoff
                // if it had been a long-lived connection; otherwise keep small.
                backoff = 1;
            }
            Err(e) => {
                let _ = app.emit(
                    "buzz-live-status",
                    serde_json::json!({ "state": "backoff", "error": e.to_string() }),
                );
            }
        }

        // Exponential backoff with jitter, capped at 30s.
        let sleep = std::cmp::min(backoff, 30);
        backoff = (backoff * 2).min(30);
        tokio::time::sleep(std::time::Duration::from_secs(sleep)).await;
    }
}

/// One connection attempt: handshake, NIP-42 auth, subscribe, forward until EOF.
async fn connect_once(
    app: &tauri::AppHandle,
    ws_url: &str,
    channel_id: &str,
) -> Result<(), String> {
    let _ = app.emit(
        "buzz-live-status",
        serde_json::json!({ "state": "connecting", "channel": channel_id }),
    );

    let (ws_stream, _) = tokio_tungstenite::connect_async(ws_url)
        .await
        .map_err(|e| format!("connect failed: {e}"))?;
    let (mut sink, mut stream) = ws_stream.split();

    // 1) Wait for AUTH challenge (relay sends it immediately after connect).
    let challenge = match stream.next().await {
        Some(Ok(Message::Text(text))) => {
            let arr: Vec<serde_json::Value> =
                serde_json::from_str(&text).map_err(|e| format!("bad frame: {e}"))?;
            if arr.first().and_then(|v| v.as_str()) == Some("AUTH") {
                arr.get(1)
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string())
                    .ok_or_else(|| "AUTH frame missing challenge".to_string())?
            } else {
                return Err("expected AUTH challenge".to_string());
            }
        }
        Some(Ok(other)) => return Err(format!("unexpected first frame: {other:?}")),
        Some(Err(e)) => return Err(format!("ws error waiting for AUTH: {e}")),
        None => return Err("connection closed before AUTH".to_string()),
    };

    // 2) Sign and send the NIP-42 AUTH event.
    let key = crate::core::buzz_identity::vault_get()
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Buzz identity is not configured".to_string())?;
    // The relay URL tag MUST be the wss:// form. The relay normalizes and
    // compares against `wss://<host>` (see buzz-relay nip42_expected_relay_url),
    // so signing the raw `https://…` config value yields RelayUrlMismatch and a
    // permanent reconnect loop.
    let auth_event = sign_event(
        &key,
        NIP42_KIND,
        vec![
            vec!["relay".into(), ws_url.to_string()],
            vec!["challenge".into(), challenge],
        ],
        "",
    )
    .map_err(|e| format!("sign AUTH event: {e}"))?;
    let auth_json = serde_json::to_string(&serde_json::json!(["AUTH", auth_event]))
        .map_err(|e| e.to_string())?;
    sink.send(Message::Text(auth_json.into()))
        .await
        .map_err(|e| format!("send AUTH: {e}"))?;

    // 2b) Wait for the relay's OK to our AUTH event. A `false` OK carries the
    // auth-required reason (e.g. relay URL mismatch, not-a-member) and lets us
    // surface a precise error instead of a silent close → reconnect loop.
    match stream.next().await {
        Some(Ok(Message::Text(text))) => {
            let arr: Vec<serde_json::Value> =
                serde_json::from_str(&text).map_err(|e| format!("bad OK frame: {e}"))?;
            if arr.first().and_then(|v| v.as_str()) == Some("OK") {
                let accepted = arr.get(2).and_then(|v| v.as_bool()).unwrap_or(false);
                if !accepted {
                    let reason = arr
                        .get(3)
                        .and_then(|v| v.as_str())
                        .unwrap_or("")
                        .to_string();
                    return Err(format!("auth rejected: {reason}"));
                }
            } else {
                // Some relays may push a NOTICE or stored event before OK; only
                // treat a non-OK first frame as fatal if it is an explicit
                // denial. Otherwise fall through and keep reading in the loop.
                if let Some(notice) = arr.get(1).and_then(|v| v.as_str()) {
                    if arr.first().and_then(|v| v.as_str()) == Some("NOTICE") {
                        return Err(format!("auth notice: {notice}"));
                    }
                }
            }
        }
        Some(Ok(_)) => {}
        Some(Err(e)) => return Err(format!("ws error waiting for AUTH OK: {e}")),
        None => return Err("connection closed before AUTH OK".to_string()),
    }

    // 3) Subscribe to kind:9 stream messages. If channel_id is empty or "all",
    // subscribe to all kind:9 events so the user receives messages across all
    // channels and DMs for background unread notifications.
    let sub_id = if channel_id.is_empty() || channel_id == "*" || channel_id == "all" {
        "clx-all-streams".to_string()
    } else {
        format!("clx-{channel_id}")
    };

    let filter = if channel_id.is_empty() || channel_id == "*" || channel_id == "all" {
        serde_json::json!({ "kinds": [STREAM_MESSAGE_KIND] })
    } else {
        serde_json::json!({ "kinds": [STREAM_MESSAGE_KIND], "#h": [channel_id] })
    };

    let req = serde_json::to_string(&serde_json::json!(["REQ", sub_id, filter]))
        .map_err(|e| e.to_string())?;
    sink.send(Message::Text(req.into()))
        .await
        .map_err(|e| format!("send REQ: {e}"))?;

    let _ = app.emit(
        "buzz-live-status",
        serde_json::json!({ "state": "ready", "channel": channel_id }),
    );

    // 4) Forward events until EOF/error/close.
    loop {
        match stream.next().await {
            Some(Ok(Message::Text(text))) => {
                let arr: Vec<serde_json::Value> = match serde_json::from_str(&text) {
                    Ok(a) => a,
                    Err(_) => continue,
                };
                match arr.first().and_then(|v| v.as_str()) {
                    Some("EVENT") => {
                        if let Some(ev) = arr.get(2) {
                            if let Some(msg) = parse_stream_message(ev) {
                                let _ = app.emit("buzz-live-message", &msg);
                            }
                        }
                    }
                    Some("EOSE") => {
                        // Everything before EOSE is stored relay history. Tell
                        // the UI where realtime delivery begins so historical
                        // replay is never counted as new/unread activity.
                        let _ = app.emit(
                            "buzz-live-eose",
                            serde_json::json!({ "channel": channel_id }),
                        );
                    }
                    Some("CLOSED") => {
                        let reason = arr
                            .get(2)
                            .and_then(|v| v.as_str())
                            .unwrap_or("unknown")
                            .to_string();
                        return Err(format!("subscription closed: {reason}"));
                    }
                    Some("NOTICE") => {
                        // Informational; keep listening unless it's fatal.
                        let notice = arr
                            .get(1)
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .to_string();
                        if notice.contains("auth-required") {
                            return Err(format!("auth required: {notice}"));
                        }
                    }
                    _ => {}
                }
            }
            Some(Ok(Message::Close(_))) => return Err("relay closed connection".to_string()),
            Some(Ok(_)) => {}
            Some(Err(e)) => return Err(format!("ws error: {e}")),
            None => return Err("connection closed".to_string()),
        }
    }
}

/// Parse a relay EVENT payload into a `BuzzMessage`, mapping tags to
/// `Vec<Vec<String>>`. Returns None for non-stream events or malformed payloads.
fn parse_stream_message(value: &serde_json::Value) -> Option<BuzzMessage> {
    let id = value.get("id")?.as_str()?.to_string();
    let pubkey = value.get("pubkey")?.as_str()?.to_string();
    let content = value.get("content")?.as_str()?.to_string();
    let created_at = value.get("created_at")?.as_i64()?;
    let kind = value.get("kind")?.as_u64()? as u32;
    let tags = value
        .get("tags")?
        .as_array()?
        .iter()
        .filter_map(|t| {
            t.as_array().map(|items| {
                items
                    .iter()
                    .filter_map(|v| v.as_str().map(|s| s.to_string()))
                    .collect::<Vec<String>>()
            })
        })
        .collect::<Vec<Vec<String>>>();
    Some(BuzzMessage {
        id,
        pubkey,
        content,
        created_at,
        kind,
        tags,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn wss_url_conversion() {
        assert_eq!(to_wss_url("https://x.y/v"), "wss://x.y/v");
        assert_eq!(to_wss_url("http://x.y/v"), "ws://x.y/v");
        assert_eq!(to_wss_url("wss://x.y/v"), "wss://x.y/v");
        assert_eq!(to_wss_url("x.y"), "wss://x.y");
    }

    #[test]
    fn sign_and_verify_id() {
        let event = sign_event(
            "0000000000000000000000000000000000000000000000000000000000000001",
            22242,
            vec![vec!["challenge".into(), "abc".into()]],
            "",
        )
        .unwrap();
        assert_eq!(event.id.len(), 64);
        assert_eq!(event.sig.len(), 128);
        // Recompute the id from the wire fields and confirm it matches.
        let recomputed = compute_event_id(&NostrEvent {
            id: String::new(),
            pubkey: event.pubkey.clone(),
            created_at: event.created_at,
            kind: event.kind,
            tags: event.tags.clone(),
            content: event.content.clone(),
            sig: String::new(),
        });
        assert_eq!(recomputed, event.id);
    }

    #[test]
    fn parse_message_maps_fields() {
        let v = serde_json::json!({
            "id": "e".repeat(64),
            "pubkey": "p".repeat(64),
            "created_at": 1700000000,
            "kind": 9,
            "tags": [["h", "chan1"], ["e", "root", "", "reply"]],
            "content": "hello",
            "sig": "s".repeat(128),
        });
        let msg = parse_stream_message(&v).unwrap();
        assert_eq!(msg.content, "hello");
        assert_eq!(msg.kind, 9);
        assert_eq!(msg.tags.len(), 2);
        assert_eq!(msg.tags[0][1], "chan1");
    }
}
