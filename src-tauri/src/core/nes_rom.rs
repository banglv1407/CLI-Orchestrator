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
/// - SNES: bank-aligned data with a plausible internal cartridge header.
///         A 512-byte copier prefix is skipped only for detection; the original
///         bytes and their SHA-256 remain unchanged for the core and netplay.
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
    if data.is_empty() || data.len() % 0x8000 != 0 {
        return false;
    }

    // Internal headers sit in the first mapped bank, not at EOF. Expanded and
    // translated dumps often end in 00/FF padding. Try LoROM, HiROM and their
    // extended layouts, as in Snes9x's memmap.cpp header scoring.
    [0x7fc0, 0xffc0, 0x407fc0, 0x40ffc0]
        .into_iter()
        .filter_map(|offset| data.get(offset..offset + 0x40))
        .any(|header| {
            // Slow/Fast LoROM, HiROM, SuperFX/S-DD1, SA-1, ExHiROM, SPC7110.
            let known_mapping = matches!(
                header[0x15],
                0x20..=0x23 | 0x25 | 0x30..=0x33 | 0x35 | 0x3a
            );
            let reset_vector = u16::from_le_bytes([header[0x3c], header[0x3d]]);
            let reset_in_rom = (0x8000..0xffff).contains(&reset_vector);
            // Fields encode powers of two in KiB. Do not compare the declared
            // size with the file length: ROM hacks can expand without fixing it.
            let plausible_sizes = (5..=14).contains(&header[0x17]) && header[0x18] <= 10;

            // Neither ASCII titles nor matching checksums are required: both
            // can change in translations. Mapping, sizes and reset location
            // together reject blank/random headers without excluding patches.
            known_mapping && reset_in_rom && plausible_sizes
        })
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

    fn snes_rom(size: usize, header_offset: usize, map_mode: u8, fill: u8) -> Vec<u8> {
        let mut bytes = vec![fill; size];
        let header = &mut bytes[header_offset..header_offset + 0x40];
        header.fill(0);
        header[..21].copy_from_slice(b"SYNTHETIC TEST ROM   ");
        header[0x15] = map_mode;
        header[0x16] = 0x02; // ROM + RAM + battery
        header[0x17] = 0x0c; // 4 MiB (may be stale after a translation expands it)
        header[0x18] = 0x03; // 8 KiB RAM
        header[0x1c..0x20].copy_from_slice(&[0xbc, 0x01, 0x43, 0xfe]);
        header[0x3c..0x3e].copy_from_slice(&0x8d56u16.to_le_bytes());
        bytes
    }

    #[test]
    fn detects_snes_mapped_headers_with_padded_tails() {
        for (size, offset, mode) in [
            (0x400000, 0x7fc0, 0x20),
            (0x400000, 0xffc0, 0x31),
            (0x600000, 0x407fc0, 0x32),
            (0x600000, 0x40ffc0, 0x35),
        ] {
            for fill in [0x00, 0xff] {
                let bytes = snes_rom(size, offset, mode, fill);
                assert_eq!(detect_console(&bytes), Some("snes"));
                let mut headered = vec![0; 512];
                headered.extend_from_slice(&bytes);
                assert_eq!(detect_console(&headered), Some("snes"));
            }
        }
    }

    #[test]
    fn detects_snes_coprocessor_headers() {
        for (offset, mode) in [(0x7fc0, 0x23), (0x7fc0, 0x32), (0xffc0, 0x3a)] {
            assert_eq!(
                detect_console(&snes_rom(0x200000, offset, mode, 0)),
                Some("snes")
            );
        }
    }

    #[test]
    fn accepts_translated_headers_with_stale_checksums_and_sizes() {
        let mut bytes = snes_rom(0x600000, 0x40ffc0, 0x35, 0);
        // A translation can change the title encoding and ROM size without
        // updating the checksum pair or original 4 MiB size declaration.
        bytes[0x40ffc0..0x40ffd5].fill(0x82);
        bytes[0x40ffdc..0x40ffe0].fill(0);
        assert_eq!(detect_console(&bytes), Some("snes"));
    }

    #[test]
    fn rejects_garbage_even_with_nonzero_tail() {
        for fill in [0, 0xff, 0x42] {
            let mut bytes = vec![fill; 0x10000];
            assert_eq!(detect_console(&bytes), None);
            bytes[0xfffc..0xfffe].copy_from_slice(&0x8005u16.to_le_bytes());
            assert_eq!(detect_console(&bytes), None);
        }
    }

    #[test]
    fn rejects_invalid_snes_headers_and_truncated_dumps() {
        for (field, value) in [(0x15, 0xff), (0x17, 0xff), (0x18, 0xff), (0x3d, 0x7f)] {
            let mut bytes = snes_rom(0x10000, 0x7fc0, 0x20, 0);
            bytes[0x7fc0 + field] = value;
            assert_eq!(detect_console(&bytes), None);
        }
        let mut bytes = snes_rom(0x10000, 0x7fc0, 0x20, 0);
        bytes.pop();
        assert_eq!(detect_console(&bytes), None);
        assert_eq!(detect_console(&[]), None);
        assert_eq!(detect_console(&vec![0; 512]), None);
        assert_eq!(detect_console(&vec![0; 0x7fff]), None);
    }

    #[test]
    fn nes_magic_takes_priority_over_snes_header() {
        let mut bytes = snes_rom(0x10000, 0x7fc0, 0x20, 0);
        bytes[..4].copy_from_slice(b"NES\x1a");
        assert_eq!(detect_console(&bytes), Some("nes"));
    }

    #[test]
    #[ignore = "Set CLX_TEST_ROM to a local SNES ROM; no ROM fixture is bundled"]
    fn opens_local_snes_rom_without_changing_bytes() {
        let path = std::env::var("CLX_TEST_ROM").expect("Set CLX_TEST_ROM");
        let original = std::fs::read(&path).expect("Read local ROM");
        let result = open_rom(&path).expect("Open local ROM");
        assert_eq!(result.payload.console, "snes");
        assert_eq!(result.payload.size_bytes, original.len() as u64);
        assert_eq!(result.payload.sha256, compute_sha256(&original));
        assert_eq!(STANDARD.decode(result.data_b64).unwrap(), original);
        assert_eq!(std::fs::read(path).unwrap(), original);
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
