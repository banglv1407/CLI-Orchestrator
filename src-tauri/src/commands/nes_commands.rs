// NES Tauri commands — config, server health probe, ROM boundary, and room
// lifecycle (US-042). Signaling/WebRTC/media commands arrive with US-045.

use crate::core::nes_client;
use crate::core::nes_identity;
use crate::core::nes_types::{
    NesConnectionBundleV1, NesInviteEnvelopeV1, NesRelayConfigV1, NesRomOpenResult,
    NesRoomDirectoryEntryV1,
};

#[tauri::command]
pub fn nes_get_config() -> Result<NesRelayConfigV1, String> {
    NesRelayConfigV1::load()
}

/// Best-effort probe of the configured session service `/health/live`.
#[tauri::command]
pub async fn nes_test_server(config: NesRelayConfigV1) -> Result<(), String> {
    let base = config.service_base_url.trim().trim_end_matches('/');
    if base.is_empty() {
        return Err("No NES service URL configured".to_string());
    }
    let url = format!("{base}/health/live");
    let mut builder = reqwest::Client::builder().timeout(std::time::Duration::from_secs(5));
    if let Some(proxy_cfg) = config.proxy.as_ref() {
        if let Some(proxy) = proxy_cfg.reqwest_proxy(None)? {
            builder = builder.proxy(proxy);
        }
    }
    let client = builder
        .build()
        .map_err(|e| format!("Failed to build HTTP client: {e}"))?;
    let resp = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Server unreachable: {e}"))?;
    if resp.status().is_success() {
        Ok(())
    } else {
        Err(format!("Server returned HTTP {}", resp.status()))
    }
}

#[tauri::command]
pub fn nes_save_config(mut config: NesRelayConfigV1) -> Result<(), String> {
    if let Ok(existing) = NesRelayConfigV1::load() {
        if let Some(new_proxy) = config.proxy.as_mut() {
            if new_proxy.secret.is_none() {
                if let Some(existing_proxy) = existing.proxy.as_ref() {
                    new_proxy.secret = existing_proxy.secret.clone();
                }
            }
        }
    }
    // SSH hop: (re)start the dynamic SOCKS5 listener when the config enables it.
    if let Some(proxy) = config.proxy.as_ref() {
        if proxy.is_enabled() && proxy.kind == crate::core::buzz_proxy::BuzzProxyKind::Ssh {
            let proxy_clone = proxy.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = crate::core::buzz_proxy::run_ssh_socks_listener(proxy_clone).await {
                    eprintln!("NES SSH proxy hop failed to start: {e}");
                }
            });
        }
    }
    config.save()
}

#[tauri::command]
pub fn nes_open_rom(path: String) -> Result<NesRomOpenResult, String> {
    crate::core::nes_rom::open_rom(&path)
}

/// Derive the Nostr public key from the Buzz identity (for display and for the
/// room-bound pubkey checks). Never returns the private key.
#[tauri::command]
pub fn nes_get_pubkey() -> Result<String, String> {
    nes_identity::derive_pubkey()
}

#[tauri::command]
pub async fn nes_create_room_and_invite(
    config: NesRelayConfigV1,
    guest_pubkey: String,
) -> Result<(NesConnectionBundleV1, NesInviteEnvelopeV1), String> {
    nes_client::create_room(&config, &guest_pubkey).await
}

#[tauri::command]
pub async fn nes_create_public_room(
    config: NesRelayConfigV1,
    host_rom_name: String,
) -> Result<NesConnectionBundleV1, String> {
    nes_client::create_public_room(&config, &host_rom_name).await
}

#[tauri::command]
pub async fn nes_list_rooms(
    config: NesRelayConfigV1,
) -> Result<Vec<NesRoomDirectoryEntryV1>, String> {
    nes_client::list_rooms(&config).await
}

#[tauri::command]
pub async fn nes_join_room(
    config: NesRelayConfigV1,
    room_id: String,
) -> Result<NesConnectionBundleV1, String> {
    nes_client::join_room(&config, &room_id).await
}

#[tauri::command]
pub async fn nes_accept_invite(
    config: NesRelayConfigV1,
    token: String,
) -> Result<NesConnectionBundleV1, String> {
    nes_client::accept_invite(&config, &token).await
}

#[tauri::command]
pub async fn nes_refresh_connection(
    config: NesRelayConfigV1,
    room_id: String,
) -> Result<NesConnectionBundleV1, String> {
    nes_client::refresh_connection(&config, &room_id).await
}

#[tauri::command]
pub async fn nes_leave_room(config: NesRelayConfigV1, room_id: String) -> Result<(), String> {
    nes_client::leave_room(&config, &room_id).await
}

#[tauri::command]
pub async fn nes_end_room(config: NesRelayConfigV1, room_id: String) -> Result<(), String> {
    nes_client::end_room(&config, &room_id).await
}

#[tauri::command]
pub fn nes_save_state(rom_sha256: String, slot: String, state_json: String) -> Result<(), String> {
    if !rom_sha256.chars().all(|c| c.is_ascii_hexdigit()) || rom_sha256.len() != 64 {
        return Err("Invalid ROM SHA256".to_string());
    }
    let slot = slot.trim().to_ascii_lowercase();
    if !matches!(slot.as_str(), "1" | "2" | "3" | "auto") {
        return Err("Invalid save slot".to_string());
    }
    validate_state_envelope(&state_json)?;

    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let save_dir = home.join(".ai-cli-manager").join("nes-saves");
    std::fs::create_dir_all(&save_dir).map_err(|e| format!("Failed to create save dir: {e}"))?;
    let file_name = format!("{}_{}.state", rom_sha256, slot);
    let path = save_dir.join(&file_name);
    let tmp_path = save_dir.join(format!("{file_name}.tmp"));

    // Atomic write: a crash mid-write must never leave a truncated state file
    // behind — a half-written snapshot loaded later can hang or crash the core.
    std::fs::write(&tmp_path, &state_json)
        .map_err(|e| format!("Failed to write save state: {e}"))?;
    if let Err(e) = std::fs::rename(&tmp_path, &path) {
        // Windows rename onto an existing file can transiently fail; fall back
        // to replace-after-remove rather than truncating in place.
        let _ = std::fs::remove_file(&path);
        std::fs::rename(&tmp_path, &path).map_err(|e2| {
            let _ = std::fs::remove_file(&tmp_path);
            format!("Failed to commit save state: {e} / {e2}")
        })?;
    }
    Ok(())
}

#[tauri::command]
pub fn nes_load_state(rom_sha256: String, slot: String) -> Result<String, String> {
    if !rom_sha256.chars().all(|c| c.is_ascii_hexdigit()) || rom_sha256.len() != 64 {
        return Err("Invalid ROM SHA256".to_string());
    }
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let path = home
        .join(".ai-cli-manager")
        .join("nes-saves")
        .join(format!("{}_{}.state", rom_sha256, slot));
    if !path.exists() {
        return Err("No saved state found for this slot".to_string());
    }
    let state_json =
        std::fs::read_to_string(&path).map_err(|e| format!("Failed to read save state: {e}"))?;
    // Reject corrupt/huge payloads before the frontend feeds them to the core.
    validate_state_envelope(&state_json)?;
    Ok(state_json)
}

#[tauri::command]
pub fn nes_has_state(rom_sha256: String, slot: String) -> Result<bool, String> {
    if !rom_sha256.chars().all(|c| c.is_ascii_hexdigit()) || rom_sha256.len() != 64 {
        return Ok(false);
    }
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let path = home
        .join(".ai-cli-manager")
        .join("nes-saves")
        .join(format!("{}_{}.state", rom_sha256, slot));
    if !path.exists() {
        return Ok(false);
    }
    match std::fs::read_to_string(&path) {
        Ok(state_json) => Ok(validate_state_envelope(&state_json).is_ok()),
        Err(_) => Ok(false),
    }
}

/// Maximum accepted save-state payload (JSNES snapshots are ~1.1 MB, SNES
/// EmulatorJS states ~0.8 MB — this only rejects runaway/garbage files).
const SAVE_STATE_MAX_BYTES: usize = 8 * 1024 * 1024;

/// Verify a save-state payload before it is persisted or handed to an
/// emulator core. Two envelopes are accepted:
/// - SNES (EmulatorJS): `{"t":"clx-snes-state-v1","d":"<base64>"}`
/// - NES (JSNES): `toJSON()` shape with cpu/mmap/ppu/papu objects
fn validate_state_envelope(state_json: &str) -> Result<(), String> {
    if state_json.len() > SAVE_STATE_MAX_BYTES {
        return Err(format!(
            "Save state too large ({} bytes, max {SAVE_STATE_MAX_BYTES})",
            state_json.len()
        ));
    }
    if state_json.is_empty() {
        return Err("Save state is empty".to_string());
    }
    let value: serde_json::Value = serde_json::from_str(state_json)
        .map_err(|e| format!("Save state is not valid JSON: {e}"))?;
    let obj = value
        .as_object()
        .ok_or_else(|| "Save state is not a JSON object".to_string())?;

    // SNES envelope: base64 blob with a sane size and alphabet.
    if obj.get("t").and_then(|v| v.as_str()) == Some("clx-snes-state-v1") {
        let d = obj
            .get("d")
            .and_then(|v| v.as_str())
            .ok_or_else(|| "SNES save state missing base64 payload".to_string())?;
        if (d.len() * 3) / 4 < 64 * 1024 || d.len() % 4 != 0 || d.len() > SAVE_STATE_MAX_BYTES {
            return Err("SNES save state payload has an invalid size".to_string());
        }
        if !d
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || matches!(b, b'+' | b'/' | b'='))
        {
            return Err("SNES save state payload is not base64".to_string());
        }
        return Ok(());
    }

    // NES envelope: the JSNES toJSON() shape.
    for key in ["cpu", "mmap", "ppu", "papu"] {
        let Some(part) = obj.get(key) else {
            return Err(format!("NES save state is missing '{key}'"));
        };
        if !part.is_object() {
            return Err(format!("NES save state field '{key}' is malformed"));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::validate_state_envelope;
    use super::SAVE_STATE_MAX_BYTES;

    fn snes_payload(len: usize) -> String {
        // Valid base64 decodes to len*3/4 bytes; 823 KB is the real state size.
        let b64 = "A".repeat(len);
        serde_json::json!({ "t": "clx-snes-state-v1", "d": b64 }).to_string()
    }

    #[test]
    fn accepts_nes_envelope() {
        let good = serde_json::json!({
            "cpu": {"mem": []},
            "mmap": {"joy1StrobeState": 0},
            "ppu": {"vramMem": []},
            "papu": {"sampleRate": 44100},
            "controllers": {}
        })
        .to_string();
        assert!(validate_state_envelope(&good).is_ok());
    }

    #[test]
    fn rejects_incomplete_nes_envelope() {
        assert!(validate_state_envelope(r#"{"cpu":{}}"#).is_err());
        assert!(validate_state_envelope(r#"{"cpu":{},"mmap":{},"ppu":[]}"#).is_err());
        assert!(validate_state_envelope("not json").is_err());
        assert!(validate_state_envelope("").is_err());
    }

    #[test]
    fn accepts_real_sized_snes_envelope() {
        // 823432 bytes -> 1_097_912 base64 chars (rounded up to %4)
        let b64_len = 1_097_912;
        let payload = snes_payload(b64_len);
        assert!(validate_state_envelope(&payload).is_ok());
    }

    #[test]
    fn rejects_short_or_malformed_snes_envelope() {
        // Decoded < 64 KiB must be rejected
        assert!(validate_state_envelope(&snes_payload(4096)).is_err());
        // Base64 length not a multiple of 4
        let bad =
            serde_json::json!({ "t": "clx-snes-state-v1", "d": "A".repeat(4097) }).to_string();
        assert!(validate_state_envelope(&bad).is_err());
        // Not base64 alphabet
        let bad2 =
            serde_json::json!({ "t": "clx-snes-state-v1", "d": "!!".repeat(4096) }).to_string();
        assert!(validate_state_envelope(&bad2).is_err());
        // Foreign tag
        let bad3 = serde_json::json!({ "t": "retroarch-v1", "d": "A".repeat(4096) }).to_string();
        assert!(validate_state_envelope(&bad3).is_err());
    }

    #[test]
    fn rejects_oversized_payload() {
        let huge = "A".repeat(SAVE_STATE_MAX_BYTES + 1);
        let payload = serde_json::json!({ "t": "clx-snes-state-v1", "d": huge }).to_string();
        assert!(validate_state_envelope(&payload).is_err());
    }
}
