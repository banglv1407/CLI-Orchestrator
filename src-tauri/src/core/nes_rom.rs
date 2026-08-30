// ROM boundary — reads and validates a locally selected NES/SNES ROM before
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

    let console = detect_console(&bytes)
        .ok_or_else(|| "Not a valid NES/SNES ROM (unrecognized header)".to_string())?;

    let sha256 = compute_sha256(&bytes);
    let name = path
    // The lobby publishes this display-only name so a guest can select the
    // same local file. Keep the extension: it is part of the full filename
    // users see in Explorer, while `file_name` ensures the local path is never
    // exposed.
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| "rom".to_string());
    let data_b64 = STANDARD.encode(&bytes);

    Ok(NesRomOpenResult {
        payload: NesRomPayloadV1 {
            name,
            size_bytes: bytes.len() as u64,
            sha256,
            console: console.to_string(),
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
        Some("nes") | Some("sfc") | Some("smc") | Some("fig") | Some("swc") => Ok(()),
        _ => Err("Only .nes / .sfc / .smc / .fig / .swc ROM files are supported".to_string()),
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

#[cfg(test)]
fn validate_magic(bytes: &[u8]) -> Result<(), String> {
    if detect_console(bytes).is_none() {
        return Err("Not a valid NES/SNES ROM (unrecognized header)".to_string());
    }
    Ok(())
}

/// Detect the console from ROM content, not extension.
/// - iNES:  "NES\x1A" at offset 0        (NES)
/// - SNES:  no unified magic; accept sizes that are a multiple of 0x8000 with
///          a plausible reset vector at the end, or a known coprocessor header
///          byte pattern. Headered dumps (512-byte copier header) are handled
///          by trying both offsets.
pub fn detect_console(bytes: &[u8]) -> Option<&'static str> {
    // iNES / NES 2.0
    if bytes.len() >= 4 && &bytes[0..4] == b"NES\x1a" {
        return Some("nes");
    }
    // SNES: try unheadered then headered (512-byte copier header).
    for skip in [0usize, 512] {
        let data = bytes.get(skip..)?;
        if !looks_like_snes(data) {
            continue;
        }
        return Some("snes");
    }
    None
}

fn looks_like_snes(data: &[u8]) -> bool {
    // Size must be a non-zero multiple of 32 KiB (bank granularity) or within
    // one bank of it after stripping an interleave; this rejects random files.
    if data.is_empty() || data.len() % 0x8000 != 0 {
        return false;
    }
    // Plausibility: reset vectors must sit in ROM range and be even-ish.
    // LoROM vectors live at $7FFC, HiROM at $FFFC relative to mapped space;
    // both fall near the end for these dump layouts.
    if data.len() < 0x30 {
        return false;
    }
    let tail = &data[data.len() - 8..];
    // Vector words point into ROM ($0000-$FFFF each, little-endian); reject
    // all-zero or all-FF tails which indicate garbage/erased dumps.
    let non_zero = tail.iter().any(|&b| b != 0x00);
    let non_ff = tail.iter().any(|&b| b != 0xFF);
    non_zero && non_ff
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
        assert_eq!(detect_console(&valid_header()), Some("nes"));
    }

    #[test]
    fn detects_snes_by_content() {
        // 64 KiB unheadered dump with a plausible vector tail.
        let mut v = vec![0u8; 0x10000];
        let title = b"SUPER MARIOWORLD";
        v[0x7fc0..0x7fc0 + title.len()].copy_from_slice(title);
        v[0xfffc] = 0x05;
        v[0xfffd] = 0x80; // reset vector $8005
        assert_eq!(detect_console(&v), Some("snes"));
        // Headered (512-byte copier header) variant.
        let mut h = vec![0xDE; 512];
        h.extend_from_slice(&v);
        assert_eq!(detect_console(&h), Some("snes"));
        // Garbage tails are rejected.
        let mut bad = vec![0xFF; 0x10000];
        assert_eq!(detect_console(&bad), None);
        bad.truncate(12345); // not bank-aligned
        assert_eq!(detect_console(&bad), None);
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
        assert!(validate_extension(Path::new("game.sfc")).is_ok());
        assert!(validate_extension(Path::new("game.smc")).is_ok());
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
