use std::path::PathBuf;

use base64_encode::encode_base64;
use serde::Serialize;
use tauri::{AppHandle, State};

use crate::{
    app_state::AppState,
    core::{
        icon_extractor::{self, IconBytes},
        quickapp_registry::{QuickApp, QuickAppRegistry},
    },
};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QuickAppDto {
    pub id: String,
    pub name: String,
    pub command: String,
    pub args: Vec<String>,
    pub working_dir: Option<String>,
    pub icon_path: Option<String>,
    pub order: i32,
    pub icon_data_url: Option<String>,
    /// True when the icon is the transparent placeholder (extraction failed).
    pub icon_missing: bool,
    pub group: Option<String>,
}

impl QuickAppDto {
    fn from(app: &QuickApp, icon_missing: bool, icon_data_url: Option<String>) -> Self {
        Self {
            id: app.id.clone(),
            name: app.name.clone(),
            command: app.command.clone(),
            args: app.args.clone(),
            working_dir: app.working_dir.clone(),
            icon_path: app.icon_path.clone(),
            order: app.order,
            icon_data_url,
            icon_missing,
            group: app.group.clone(),
        }
    }
}

mod base64_encode {
    pub fn encode_base64(data: &[u8]) -> String {
        const TABLE: &[u8; 64] =
            b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let mut out = String::with_capacity((data.len() + 2) / 3 * 4);
        let mut chunks = data.chunks_exact(3);
        for chunk in &mut chunks {
            let b0 = chunk[0];
            let b1 = chunk[1];
            let b2 = chunk[2];
            out.push(TABLE[(b0 >> 2) as usize] as char);
            out.push(TABLE[((b0 << 4 | b1 >> 4) & 0x3F) as usize] as char);
            out.push(TABLE[((b1 << 2 | b2 >> 6) & 0x3F) as usize] as char);
            out.push(TABLE[(b2 & 0x3F) as usize] as char);
        }
        let rem = chunks.remainder();
        match rem.len() {
            0 => {}
            1 => {
                let b0 = rem[0];
                out.push(TABLE[(b0 >> 2) as usize] as char);
                out.push(TABLE[((b0 << 4) & 0x3F) as usize] as char);
                out.push('=');
                out.push('=');
            }
            2 => {
                let b0 = rem[0];
                let b1 = rem[1];
                out.push(TABLE[(b0 >> 2) as usize] as char);
                out.push(TABLE[((b0 << 4 | b1 >> 4) & 0x3F) as usize] as char);
                out.push(TABLE[((b1 << 2) & 0x3F) as usize] as char);
                out.push('=');
            }
            _ => unreachable!(),
        }
        out
    }
}

fn read_icon_file_bytes(path: &PathBuf) -> Option<Vec<u8>> {
    std::fs::read(path).ok()
}

/// On Windows, try to resolve a .lnk shortcut to its target executable path.
#[cfg(windows)]
fn resolve_lnk(path: &PathBuf) -> Option<PathBuf> {
    if path
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.eq_ignore_ascii_case("lnk"))
        != Some(true)
    {
        return None;
    }
    // Use the Windows Shell API via a simple COM-free approach:
    // Read the .lnk file and extract the target path manually.
    // We use the lnk crate if available, otherwise fall back to a raw parse.
    // Simple fallback: try to find the target by reading raw bytes.
    // The target path is at offset 0x4C in the .lnk file (after the header).
    let bytes = std::fs::read(path).ok()?;
    if bytes.len() < 0x4C + 4 {
        return None;
    }
    // LNK magic: 4C 00 00 00
    if bytes[0..4] != [0x4C, 0x00, 0x00, 0x00] {
        return None;
    }
    // LinkFlags at offset 0x14 (4 bytes, LE)
    let link_flags = u32::from_le_bytes([bytes[0x14], bytes[0x15], bytes[0x16], bytes[0x17]]);
    // Bit 0 (HasLinkTargetIDList): offset to IDList block
    let has_id_list = (link_flags & 0x01) != 0;
    let mut offset: usize = 0x4C;
    if has_id_list {
        if offset + 2 > bytes.len() {
            return None;
        }
        let id_list_size = u16::from_le_bytes([bytes[offset], bytes[offset + 1]]) as usize;
        offset += 2 + id_list_size;
    }
    // Now at LinkInfo structure
    // Bit 2 of LinkFlags (HasLinkInfo)
    let has_link_info = (link_flags & 0x04) != 0;
    if !has_link_info {
        // Fall back to StringData – look for HasName or LocalBasePath
        return None;
    }
    if offset + 4 > bytes.len() {
        return None;
    }
    let link_info_size = u32::from_le_bytes([
        bytes[offset],
        bytes[offset + 1],
        bytes[offset + 2],
        bytes[offset + 3],
    ]) as usize;
    if offset + link_info_size > bytes.len() {
        return None;
    }
    // LocalBasePathOffset at 0x10 within LinkInfo
    if offset + 0x10 + 4 > bytes.len() {
        return None;
    }
    let local_base_path_offset = u32::from_le_bytes([
        bytes[offset + 0x10],
        bytes[offset + 0x11],
        bytes[offset + 0x12],
        bytes[offset + 0x13],
    ]) as usize;
    let abs_path_start = offset + local_base_path_offset;
    if abs_path_start >= bytes.len() {
        return None;
    }
    // Read null-terminated string
    let end = bytes[abs_path_start..].iter().position(|&b| b == 0)?;
    let path_bytes = &bytes[abs_path_start..abs_path_start + end];
    let path_str = std::str::from_utf8(path_bytes).ok()?;
    let resolved = PathBuf::from(path_str);
    if resolved.exists() {
        Some(resolved)
    } else {
        None
    }
}

#[cfg(not(windows))]
fn resolve_lnk(_path: &PathBuf) -> Option<PathBuf> {
    None
}

fn project_icon(registry: &QuickAppRegistry, app: &QuickApp) -> (bool, Option<String>) {
    let cache_key = match crate::core::quickapp_registry::make_icon_cache_key(app) {
        Some(k) => k,
        None => return (true, None),
    };
    let cache_path = icon_extractor::derive_icon_path(registry.icons_dir(), &cache_key);

    // Honor user-supplied icon path verbatim (PNG, ICO, JPG).
    if let Some(user_icon) = &app.icon_path {
        if !user_icon.is_empty() {
            let p = PathBuf::from(user_icon);
            if p.is_file() {
                let bytes = read_icon_file_bytes(&p);
                if let Some(bytes) = bytes {
                    let mime = match p.extension().and_then(|e| e.to_str()) {
                        Some("png") => "image/png",
                        Some("jpg") | Some("jpeg") => "image/jpeg",
                        Some("ico") => "image/x-icon",
                        _ => "application/octet-stream",
                    };
                    let url = format!("data:{};base64,{}", mime, encode_base64(&bytes));
                    return (false, Some(url));
                }
                return (true, None);
            } else {
                return (true, None);
            }
        }
    }

    if cache_path.is_file() {
        if let Some(bytes) = read_icon_file_bytes(&cache_path) {
            let missing = bytes.as_slice() == icon_extractor::transparent_png();
            let url = format!("data:image/png;base64,{}", encode_base64(&bytes));
            return (missing, Some(url));
        }
    }

    // Extract and cache on demand.
    // Resolve .lnk shortcuts to their target executable so we get the real icon.
    let raw_target = PathBuf::from(&app.command);
    let target = resolve_lnk(&raw_target).unwrap_or(raw_target);
    let IconBytes(bytes) = icon_extractor::extract_icon(&target);
    let missing = bytes.as_slice() == icon_extractor::transparent_png();
    if let Err(err) = icon_extractor::write_to_cache(&cache_path, &bytes) {
        eprintln!(
            "[quickapps] failed to write icon cache {}: {}",
            cache_path.display(),
            err
        );
        return (missing, None);
    }
    let url = format!("data:image/png;base64,{}", encode_base64(&bytes));
    (missing, Some(url))
}

#[tauri::command]
pub fn list_quickapps(state: State<'_, AppState>) -> Result<Vec<QuickAppDto>, String> {
    state
        .quickapps
        .reload()
        .map_err(|error| error.to_string())?;
    let apps = state.quickapps.list().map_err(|error| error.to_string())?;
    let mut out = Vec::with_capacity(apps.len());
    for app in apps.iter() {
        let (missing, url) = project_icon(&state.quickapps, app);
        out.push(QuickAppDto::from(app, missing, url));
    }
    Ok(out)
}

#[tauri::command]
pub fn upsert_quickapp(state: State<'_, AppState>, app: QuickApp) -> Result<QuickAppDto, String> {
    let saved = state
        .quickapps
        .upsert(app)
        .map_err(|error| error.to_string())?;
    let (missing, url) = project_icon(&state.quickapps, &saved);
    Ok(QuickAppDto::from(&saved, missing, url))
}

#[tauri::command]
pub fn delete_quickapp(state: State<'_, AppState>, id: String) -> Result<(), String> {
    state
        .quickapps
        .delete(&id)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn reextract_icons(state: State<'_, AppState>) -> Result<Vec<QuickAppDto>, String> {
    let apps = state.quickapps.list().map_err(|error| error.to_string())?;
    let mut out = Vec::with_capacity(apps.len());
    for app in apps.iter() {
        let key = crate::core::quickapp_registry::make_icon_cache_key(app);
        if let Some(k) = key {
            let cache_path = icon_extractor::derive_icon_path(state.quickapps.icons_dir(), &k);
            if cache_path.is_file() {
                let _ = std::fs::remove_file(&cache_path);
            }
        }
        let (missing, url) = project_icon(&state.quickapps, app);
        out.push(QuickAppDto::from(app, missing, url));
    }
    Ok(out)
}

#[tauri::command]
pub fn launch_quickapp(
    app_handle: AppHandle,
    state: State<'_, AppState>,
    id: String,
) -> Result<u32, String> {
    let app = state
        .quickapps
        .get(&id)
        .map_err(|error| error.to_string())?
        .ok_or_else(|| format!("quickapp not found: {id}"))?;

    use std::process::Command;
    let mut cmd = Command::new(&app.command);
    if !app.args.is_empty() {
        cmd.args(&app.args);
    }
    if let Some(dir) = &app.working_dir {
        if !dir.is_empty() {
            cmd.current_dir(dir);
        }
    }
    // Detach the child so the launcher doesn't block or surface a console window.
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const DETACHED_PROCESS: u32 = 0x00000008;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(DETACHED_PROCESS | CREATE_NO_WINDOW);
    }
    let child = cmd.spawn().map_err(|error| error.to_string())?;
    let pid = child.id();
    let _ = app_handle; // suppress unused warning if no-op
    Ok(pid)
}
