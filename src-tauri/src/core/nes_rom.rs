// NES ROM boundary — reads and validates a locally selected .nes file before
// returning its bytes to the frontend. This is the only place ROM bytes cross
// the Rust boundary. Nothing here persists the path or bytes, and no log/error
// ever includes ROM path, name, bytes, or hash.

use crate::core::nes_types::{NesRomOpenResult, NesRomPayloadV1};
use base64::{engine::general_purpose::STANDARD, Engine as _};
use sha2::{Digest, Sha256};
use std::path::Path;

/// Hard cap on ROM size (16 MiB per plan). Rejected before reading.
pub const MAX_ROM_SIZE: u64 = 16 * 1024 * 1024;

/// Open and validate a ROM selected by the host. Returns metadata + base64
/// bytes on success, or a typed error that never leaks ROM information.
pub fn open_rom(path: &str) -> Result<NesRomOpenResult, String> {
    let path = Path::new(path);
    validate_extension(path)?;

    let metadata = std::fs::metadata(path).map_err(|e| format!("Cannot read ROM file: {e}"))?;
    if !metadata.is_file() {
        return Err("Selected ROM path is not a file".to_string());
    }
    validate_size(metadata.len())?;

    let bytes = std::fs::read(path).map_err(|e| format!("Failed to read ROM: {e}"))?;
    // Defend against a file that shrank between metadata and read.
    validate_size(bytes.len() as u64)?;
    validate_magic(&bytes)?;

    let sha256 = compute_sha256(&bytes);
    let name = path
        .file_stem()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| "rom".to_string());
    let data_b64 = STANDARD.encode(&bytes);

    Ok(NesRomOpenResult {
        payload: NesRomPayloadV1 {
            name,
            size_bytes: bytes.len() as u64,
            sha256,
        },
        data_b64,
    })
}

fn validate_extension(path: &Path) -> Result<(), String> {
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_ascii_lowercase());
    match ext.as_deref() {
        Some("nes") => Ok(()),
        _ => Err("Only .nes files are supported".to_string()),
    }
}

fn validate_size(size: u64) -> Result<(), String> {
    if size == 0 {
        return Err("ROM file is empty".to_string());
    }
    if size > MAX_ROM_SIZE {
        return Err("ROM file exceeds the 16 MiB limit".to_string());
    }
    Ok(())
}

fn validate_magic(bytes: &[u8]) -> Result<(), String> {
    // iNES signature: 0x4E 0x45 0x53 0x1A == "NES\x1A"
    if bytes.len() < 4
        || bytes[0] != 0x4e
        || bytes[1] != 0x45
        || bytes[2] != 0x53
        || bytes[3] != 0x1a
    {
        return Err("Not a valid NES ROM (missing iNES signature)".to_string());
    }
    Ok(())
}

pub fn compute_sha256(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    hex::encode(hasher.finalize())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid_header() -> Vec<u8> {
        let mut v = vec![0u8; 16];
        v[0] = 0x4e; // N
        v[1] = 0x45; // E
        v[2] = 0x53; // S
        v[3] = 0x1a; // \x1A
        v
    }

    #[test]
    fn accepts_valid_magic() {
        assert!(validate_magic(&valid_header()).is_ok());
    }

    #[test]
    fn rejects_bad_magic() {
        let mut v = valid_header();
        v[0] = 0x00;
        assert!(validate_magic(&v).is_err());
        assert!(validate_magic(&[0x4e, 0x45, 0x53]).is_err()); // too short
    }

    #[test]
    fn rejects_empty_and_oversized() {
        assert!(validate_size(0).is_err());
        assert!(validate_size(MAX_ROM_SIZE + 1).is_err());
        assert!(validate_size(MAX_ROM_SIZE).is_ok());
    }

    #[test]
    fn extension_validation() {
        assert!(validate_extension(Path::new("game.nes")).is_ok());
        assert!(validate_extension(Path::new("GAME.NES")).is_ok());
        assert!(validate_extension(Path::new("game.zip")).is_err());
        assert!(validate_extension(Path::new("game")).is_err());
    }

    #[test]
    fn sha256_is_stable_and_hex() {
        let digest = compute_sha256(b"hello");
        assert_eq!(digest.len(), 64);
        assert!(digest.chars().all(|c| c.is_ascii_hexdigit()));
        assert_eq!(digest, compute_sha256(b"hello"));
        assert_ne!(digest, compute_sha256(b"hello!"));
    }
}
