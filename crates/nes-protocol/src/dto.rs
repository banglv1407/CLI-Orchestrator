//! Versioned DTOs shared by the desktop client and the session service.
//!
//! Every struct that crosses the wire carries an explicit `schema_version` or
//! lives inside an envelope with one. Unknown versions must fail closed on the
//! receiving side (see `signaling.rs` and the service handlers).

use serde::{Deserialize, Serialize};

pub const NES_PROTOCOL_VERSION: u32 = 1;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum NesRole {
    Host,
    Guest,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum RoomState {
    Idle,
    Creating,
    Waiting,
    Negotiating,
    Connected,
    Reconnecting,
    Ended,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesRoomSnapshotV1 {
    pub schema_version: u32,
    pub room_id: String,
    pub host_pubkey: String,
    /// Display-only host filename, never a local path or ROM hash.
    pub host_rom_name: String,
    /// Empty while a public room is waiting for player 2.
    pub guest_pubkey: Option<String>,
    pub state: RoomState,
    pub created_at: i64,
    pub expires_at: i64,
}

/// Safe room-directory projection. Invitation tokens, signaling tickets, and
/// ROM metadata never appear in the public lobby.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesRoomDirectoryEntryV1 {
    pub schema_version: u32,
    pub room_id: String,
    pub host_pubkey: String,
    pub host_rom_name: String,
    pub state: RoomState,
    pub participant_count: u8,
    pub joinable: bool,
    pub created_at: i64,
    pub expires_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesInviteEnvelopeV1 {
    pub schema_version: u32,
    pub token: String,
    pub host_pubkey: String,
    pub expires_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesConnectionBundleV1 {
    pub schema_version: u32,
    pub role: NesRole,
    pub room: NesRoomSnapshotV1,
    pub signal_url: String,
    pub ticket: String,
    pub ticket_expires_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesDiagnosticsV1 {
    pub schema_version: u32,
    pub room_id: String,
    pub current_frame: u64,
    pub buffered_frames: u8,
    pub state_hash_match: Option<bool>,
    pub state: RoomState,
}
