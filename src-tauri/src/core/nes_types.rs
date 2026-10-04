// NES relay types — versioned DTOs for the CLX NES multiplayer workspace.
// US-044 scope: config + ROM payload only. Room/signaling DTOs arrive with
// US-042/US-045.

use serde::{Deserialize, Serialize};
use std::path::PathBuf;

use super::buzz_proxy::BuzzProxyConfig;

pub const NES_RELAY_CONFIG_SCHEMA_VERSION: u32 = 1;

/// Persisted client configuration. Only this shape is allowed on disk.
/// Signaling tickets, invitations, room IDs, diagnostics,
/// and peer connection state are never persisted.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesRelayConfigV1 {
    #[serde(alias = "schemaVersion")]
    pub schema_version: u32,
    #[serde(alias = "serviceBaseUrl")]
    pub service_base_url: String,
    /// Optional outbound hop: SSH dynamic SOCKS5 or HTTP CONNECT.
    #[serde(default)]
    pub proxy: Option<BuzzProxyConfig>,
}

impl Default for NesRelayConfigV1 {
    fn default() -> Self {
        Self {
            schema_version: NES_RELAY_CONFIG_SCHEMA_VERSION,
            service_base_url: String::new(),
            proxy: None,
        }
    }
}

impl NesRelayConfigV1 {
    pub fn load() -> Result<Self, String> {
        let path = Self::config_path()?;
        if path.exists() {
            let content = std::fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read NES config: {e}"))?;
            serde_json::from_str(&content).map_err(|e| format!("Failed to parse NES config: {e}"))
        } else {
            Ok(Self::default())
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let path = Self::config_path()?;
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create config dir: {e}"))?;
        }
        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize NES config: {e}"))?;
        std::fs::write(&path, content).map_err(|e| format!("Failed to write NES config: {e}"))
    }

    fn config_path() -> Result<PathBuf, String> {
        #[cfg(test)]
        {
            if let Some(path) = std::env::var_os("CLX_NES_CONFIG") {
                return Ok(PathBuf::from(path));
            }
        }
        let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
        Ok(home.join(".ai-cli-manager").join("nes.json"))
    }
}

/// ROM metadata used for local diagnostics only. Never sent to Buzz or the
/// game server, and never persisted. `name` is the file stem, not a path.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesRomPayloadV1 {
    pub name: String,
    pub size_bytes: u64,
    pub sha256: String,
    /// "nes" or "snes" — detected from ROM content, not extension.
    pub console: String,
}

/// Result of opening a ROM: metadata plus the ROM bytes (base64) handed to the
/// frontend so JSNES can load them. The bytes live only in host memory.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesRomOpenResult {
    pub payload: NesRomPayloadV1,
    pub data_b64: String,
}

// ── US-042 room/session DTOs ────────────────────────────────────────────────
// These mirror the shared nes-protocol crate types. We re-export them from the
// client boundary so Tauri commands return the shared wire type directly.

pub use nes_protocol::{NesConnectionBundleV1, NesInviteEnvelopeV1, NesRoomDirectoryEntryV1};
