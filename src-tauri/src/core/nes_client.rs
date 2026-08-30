// NES session-service HTTP client — signs every authenticated request with a
// NIP-98 event derived from the Buzz identity, then calls the versioned REST
// API. Room/signaling DTOs come from the shared nes-protocol crate so the
// desktop and service stay on the same wire format.

use crate::core::nes_identity::sign_request;
use crate::core::nes_types::NesRelayConfigV1;
use nes_protocol::{NesConnectionBundleV1, NesInviteEnvelopeV1, NesRoomDirectoryEntryV1};
use serde_json::json;

fn service_base(config: &NesRelayConfigV1) -> Result<String, String> {
    let base = config.service_base_url.trim().trim_end_matches('/');
    if base.is_empty() {
        return Err("No NES service URL configured".to_string());
    }
    Ok(base.to_string())
}

/// HTTP client honoring the optional NES hop (SSH SOCKS5 / HTTP CONNECT).
fn client(config: &NesRelayConfigV1) -> Result<reqwest::Client, String> {
    let mut builder = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10));
    if let Some(proxy_cfg) = config.proxy.as_ref() {
        if let Some(proxy) = proxy_cfg.reqwest_proxy(None)? {
            builder = builder.proxy(proxy);
        }
    }
    builder
        .build()
        .map_err(|e| format!("Failed to build HTTP client: {e}"))
}

fn auth_header(
    client: &reqwest::Client,
    url: &str,
    method: &str,
    payload: &[u8],
) -> Result<String, String> {
    let event = sign_request(url, method, payload)?;
    let json = serde_json::to_string(&event).map_err(|e| e.to_string())?;
    let encoded = {
        use base64::Engine as _;
        base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(json.as_bytes())
    };
    let _ = client; // placeholder; auth header is string-based
    Ok(format!("Nostr {encoded}"))
}

async fn send_authed(
    config: &NesRelayConfigV1,
    method: reqwest::Method,
    path: &str,
    body: Option<serde_json::Value>,
) -> Result<reqwest::Response, String> {
    let base = service_base(config)?;
    let url = format!("{base}{path}");
    let payload = body
        .as_ref()
        .map(|b| serde_json::to_vec(b).unwrap_or_default())
        .unwrap_or_default();
    let method_str = method.as_str();
    let header = auth_header(&reqwest::Client::new(), &url, method_str, &payload)?;

    let client = client(config)?;
    let mut req = client.request(method, &url).header("authorization", header);
    if let Some(b) = body {
        req = req.json(&b);
    }
    req.send().await.map_err(|e| format!("Request failed: {e}"))
}

async fn send_public(
    config: &NesRelayConfigV1,
    method: reqwest::Method,
    path: &str,
) -> Result<reqwest::Response, String> {
    let base = service_base(config)?;
    let url = format!("{base}{path}");
    client(config)?
        .request(method, url)
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))
}

pub async fn create_room(
    config: &NesRelayConfigV1,
    guest_pubkey: &str,
) -> Result<(NesConnectionBundleV1, NesInviteEnvelopeV1), String> {
    let body = json!({ "guest_pubkey": guest_pubkey });
    let resp = send_authed(config, reqwest::Method::POST, "/v1/rooms", Some(body)).await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    let value: serde_json::Value = resp
        .json()
        .await
        .map_err(|e| format!("Bad response: {e}"))?;
    let bundle: NesConnectionBundleV1 =
        serde_json::from_value(value["bundle"].clone()).map_err(|e| format!("Bad bundle: {e}"))?;
    let invite: NesInviteEnvelopeV1 =
        serde_json::from_value(value["invite"].clone()).map_err(|e| format!("Bad invite: {e}"))?;
    Ok((bundle, invite))
}

pub async fn create_public_room(
    config: &NesRelayConfigV1,
    host_rom_name: &str,
) -> Result<NesConnectionBundleV1, String> {
    let resp = send_authed(
        config,
        reqwest::Method::POST,
        "/v1/rooms",
        Some(json!({ "host_rom_name": host_rom_name })),
    )
    .await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    let value: serde_json::Value = resp
        .json()
        .await
        .map_err(|e| format!("Bad response: {e}"))?;
    serde_json::from_value(value["bundle"].clone()).map_err(|e| format!("Bad bundle: {e}"))
}

pub async fn list_rooms(config: &NesRelayConfigV1) -> Result<Vec<NesRoomDirectoryEntryV1>, String> {
    let resp = send_public(config, reqwest::Method::GET, "/v1/rooms").await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    resp.json().await.map_err(|e| format!("Bad response: {e}"))
}

pub async fn join_room(
    config: &NesRelayConfigV1,
    room_id: &str,
) -> Result<NesConnectionBundleV1, String> {
    let resp = send_public(
        config,
        reqwest::Method::POST,
        &format!("/v1/rooms/{room_id}/join"),
    )
    .await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    resp.json().await.map_err(|e| format!("Bad response: {e}"))
}

pub async fn accept_invite(
    config: &NesRelayConfigV1,
    token: &str,
) -> Result<NesConnectionBundleV1, String> {
    let body = json!({ "room_id": "" });
    let resp = send_authed(
        config,
        reqwest::Method::POST,
        &format!("/v1/invites/{token}/accept"),
        Some(body),
    )
    .await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    let bundle: NesConnectionBundleV1 = resp
        .json()
        .await
        .map_err(|e| format!("Bad response: {e}"))?;
    Ok(bundle)
}

pub async fn refresh_connection(
    config: &NesRelayConfigV1,
    room_id: &str,
) -> Result<NesConnectionBundleV1, String> {
    let resp = send_authed(
        config,
        reqwest::Method::POST,
        &format!("/v1/rooms/{room_id}/refresh"),
        None,
    )
    .await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    resp.json().await.map_err(|e| format!("Bad response: {e}"))
}

pub async fn leave_room(config: &NesRelayConfigV1, room_id: &str) -> Result<(), String> {
    let resp = send_authed(
        config,
        reqwest::Method::POST,
        &format!("/v1/rooms/{room_id}/leave"),
        None,
    )
    .await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    Ok(())
}

pub async fn end_room(config: &NesRelayConfigV1, room_id: &str) -> Result<(), String> {
    let resp = send_authed(
        config,
        reqwest::Method::DELETE,
        &format!("/v1/rooms/{room_id}"),
        None,
    )
    .await?;
    if !resp.status().is_success() {
        return Err(format!("Server returned HTTP {}", resp.status()));
    }
    Ok(())
}
