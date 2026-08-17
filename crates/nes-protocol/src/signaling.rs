//! Versioned NES room messages carried by the authenticated room WebSocket.
//!
//! Both clients run the same ROM locally. The wire carries only ROM hashes,
//! controller masks, synchronization hashes, and lifecycle controls. ROM
//! bytes, emulator snapshots, audio, and video are never accepted.

use serde::{Deserialize, Serialize};

use crate::{NesProtocolError, RoomState};

pub const SIGNAL_VERSION: u32 = 1;
pub const MAX_SIGNAL_PAYLOAD: usize = 1024;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum SignalType {
    RomReady,
    Input,
    StateHash,
    Pause,
    Resume,
    Reset,
    PeerLeft,
    End,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NesSignalEnvelopeV1 {
    pub v: u32,
    #[serde(rename = "type")]
    pub signal_type: SignalType,
    pub room_id: String,
    pub seq: u64,
    pub payload: serde_json::Value,
}

pub fn validate_envelope(envelope: &NesSignalEnvelopeV1) -> Result<(), NesProtocolError> {
    if envelope.v != SIGNAL_VERSION {
        return Err(NesProtocolError::UnknownVersion(envelope.v));
    }
    if envelope.room_id.is_empty() {
        return Err(NesProtocolError::MissingField("room_id"));
    }
    if let Ok(bytes) = serde_json::to_vec(&envelope.payload) {
        if bytes.len() > MAX_SIGNAL_PAYLOAD {
            return Err(NesProtocolError::PayloadTooLarge(
                bytes.len(),
                MAX_SIGNAL_PAYLOAD,
            ));
        }
    }

    match envelope.signal_type {
        SignalType::RomReady => {
            validate_allowed_fields(&envelope.payload, &["sha256"])?;
            validate_hex_field(&envelope.payload, "sha256", 64)
        }
        SignalType::Input => {
            validate_allowed_fields(&envelope.payload, &["epoch", "frame", "mask"])?;
            validate_epoch(&envelope.payload)?;
            validate_input(&envelope.payload)
        }
        SignalType::StateHash => {
            validate_allowed_fields(&envelope.payload, &["epoch", "frame", "hash"])?;
            validate_epoch(&envelope.payload)?;
            validate_frame(&envelope.payload)?;
            validate_hex_field(&envelope.payload, "hash", 8)
        }
        SignalType::Pause | SignalType::Resume | SignalType::Reset => {
            validate_allowed_fields(&envelope.payload, &["epoch"])?;
            validate_epoch(&envelope.payload)
        }
        SignalType::PeerLeft | SignalType::End => validate_allowed_fields(&envelope.payload, &[]),
        SignalType::Error => validate_allowed_fields(&envelope.payload, &["message"]),
    }
}

fn validate_allowed_fields(
    payload: &serde_json::Value,
    allowed: &[&str],
) -> Result<(), NesProtocolError> {
    let object = payload
        .as_object()
        .ok_or(NesProtocolError::MissingField("payload"))?;
    if object.keys().any(|key| !allowed.contains(&key.as_str())) {
        return Err(NesProtocolError::MissingField("unexpected payload field"));
    }
    Ok(())
}

fn validate_epoch(payload: &serde_json::Value) -> Result<(), NesProtocolError> {
    let epoch = payload
        .get("epoch")
        .and_then(|value| value.as_u64())
        .ok_or(NesProtocolError::MissingField("epoch"))?;
    if epoch == 0 {
        return Err(NesProtocolError::MissingField("epoch"));
    }
    Ok(())
}

fn validate_frame(payload: &serde_json::Value) -> Result<(), NesProtocolError> {
    let frame = payload
        .get("frame")
        .and_then(|value| value.as_u64())
        .ok_or(NesProtocolError::MissingField("frame"))?;
    if frame == 0 {
        return Err(NesProtocolError::MissingField("frame"));
    }
    Ok(())
}

fn validate_input(payload: &serde_json::Value) -> Result<(), NesProtocolError> {
    validate_frame(payload)?;
    let mask = payload
        .get("mask")
        .and_then(|value| value.as_u64())
        .ok_or(NesProtocolError::MissingField("mask"))?;
    if mask > u8::MAX as u64 {
        return Err(NesProtocolError::PayloadTooLarge(
            mask as usize,
            u8::MAX as usize,
        ));
    }
    crate::validate_bitmask(mask as u8)?;
    Ok(())
}

fn validate_hex_field(
    payload: &serde_json::Value,
    name: &'static str,
    length: usize,
) -> Result<(), NesProtocolError> {
    let value = payload
        .get(name)
        .and_then(|value| value.as_str())
        .ok_or(NesProtocolError::MissingField(name))?;
    if value.len() != length
        || !value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
    {
        return Err(NesProtocolError::MissingField(name));
    }
    Ok(())
}

pub fn room_state_serializes(state: RoomState) -> String {
    serde_json::to_string(&state).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn envelope(signal_type: SignalType, payload: serde_json::Value) -> NesSignalEnvelopeV1 {
        NesSignalEnvelopeV1 {
            v: 1,
            signal_type,
            room_id: "r1".into(),
            seq: 1,
            payload,
        }
    }

    #[test]
    fn accepts_rom_hash_and_input() {
        assert!(validate_envelope(&envelope(
            SignalType::RomReady,
            serde_json::json!({ "sha256": "a".repeat(64) }),
        ))
        .is_ok());
        assert!(validate_envelope(&envelope(
            SignalType::Input,
            serde_json::json!({ "epoch": 1, "frame": 1, "mask": 245 }),
        ))
        .is_ok());
    }

    #[test]
    fn rejects_rom_bytes_bad_hash_and_bad_input() {
        assert!(validate_envelope(&envelope(
            SignalType::RomReady,
            serde_json::json!({ "sha256": "a".repeat(64), "rom": "bytes" }),
        ))
        .is_err());
        assert!(validate_envelope(&envelope(
            SignalType::RomReady,
            serde_json::json!({ "sha256": "nope" }),
        ))
        .is_err());
        assert!(validate_envelope(&envelope(
            SignalType::Input,
            serde_json::json!({ "epoch": 1, "frame": 0, "mask": 256 }),
        ))
        .is_err());
    }

    #[test]
    fn rejects_oversized_payload_and_unknown_version() {
        let mut value = envelope(
            SignalType::Error,
            serde_json::json!({ "message": "x".repeat(MAX_SIGNAL_PAYLOAD + 1) }),
        );
        assert!(validate_envelope(&value).is_err());
        value.v = 99;
        assert!(matches!(
            validate_envelope(&value),
            Err(NesProtocolError::UnknownVersion(99))
        ));
    }
}
