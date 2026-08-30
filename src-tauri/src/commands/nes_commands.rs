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
    let mut builder = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5));
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
pub fn nes_save_config(config: NesRelayConfigV1) -> Result<(), String> {
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
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let save_dir = home.join(".ai-cli-manager").join("nes-saves");
    std::fs::create_dir_all(&save_dir).map_err(|e| format!("Failed to create save dir: {e}"))?;
    let file_name = format!("{}_{}.state", rom_sha256, slot);
    let path = save_dir.join(file_name);
    std::fs::write(&path, state_json).map_err(|e| format!("Failed to write save state: {e}"))
}

#[tauri::command]
pub fn nes_load_state(rom_sha256: String, slot: String) -> Result<String, String> {
    if !rom_sha256.chars().all(|c| c.is_ascii_hexdigit()) || rom_sha256.len() != 64 {
        return Err("Invalid ROM SHA256".to_string());
    }
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let path = home.join(".ai-cli-manager").join("nes-saves").join(format!("{}_{}.state", rom_sha256, slot));
    if !path.exists() {
        return Err("No saved state found for this slot".to_string());
    }
    std::fs::read_to_string(&path).map_err(|e| format!("Failed to read save state: {e}"))
}

#[tauri::command]
pub fn nes_has_state(rom_sha256: String, slot: String) -> Result<bool, String> {
    if !rom_sha256.chars().all(|c| c.is_ascii_hexdigit()) || rom_sha256.len() != 64 {
        return Ok(false);
    }
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let path = home.join(".ai-cli-manager").join("nes-saves").join(format!("{}_{}.state", rom_sha256, slot));
    Ok(path.exists())
}
