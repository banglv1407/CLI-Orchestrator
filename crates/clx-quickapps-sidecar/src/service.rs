use std::{fs, path::PathBuf, process::Command};

use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use serde::Serialize;
use serde_json::Value;

use crate::{
    icon_extractor::{self, IconBytes},
    registry::{make_icon_cache_key, QuickApp, QuickAppRegistry},
};

const MAX_ICON_SOURCE_BYTES: u64 = 512 * 1024;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct QuickAppDto {
    id: String,
    name: String,
    command: String,
    args: Vec<String>,
    working_dir: Option<String>,
    icon_path: Option<String>,
    order: i32,
    icon_data_url: Option<String>,
    icon_missing: bool,
    group: Option<String>,
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

pub struct QuickAppsService {
    registry: QuickAppRegistry,
}

impl QuickAppsService {
    pub fn new() -> Result<Self, String> {
        Ok(Self {
            registry: QuickAppRegistry::new().map_err(|error| error.to_string())?,
        })
    }

    pub fn dispatch(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.quickapps.list" => serde_json::to_value(self.list()?).map_err(|e| e.to_string()),
            "clx.quickapps.upsert" => {
                let app: QuickApp = serde_json::from_value(
                    params
                        .get("app")
                        .cloned()
                        .ok_or_else(|| "app is required".to_string())?,
                )
                .map_err(|error| format!("invalid Quick App: {error}"))?;
                serde_json::to_value(self.upsert(app)?).map_err(|e| e.to_string())
            }
            "clx.quickapps.delete" => {
                let id = required_string(&params, "id")?;
                self.registry.delete(id).map_err(|e| e.to_string())?;
                Ok(Value::Null)
            }
            "clx.quickapps.reextractIcons" => {
                serde_json::to_value(self.reextract()?).map_err(|e| e.to_string())
            }
            "clx.quickapps.launch" => {
                let id = required_string(&params, "id")?;
                Ok(Value::from(self.launch(id)?))
            }
            _ => Err("unknown Quick Apps method".into()),
        }
    }

    fn list(&self) -> Result<Vec<QuickAppDto>, String> {
        self.registry.reload().map_err(|error| error.to_string())?;
        let apps = self.registry.list().map_err(|error| error.to_string())?;
        Ok(apps
            .iter()
            .map(|app| {
                let (missing, url) = project_icon(&self.registry, app);
                QuickAppDto::from(app, missing, url)
            })
            .collect())
    }

    fn upsert(&self, app: QuickApp) -> Result<QuickAppDto, String> {
        let saved = self
            .registry
            .upsert(app)
            .map_err(|error| error.to_string())?;
        let (missing, url) = project_icon(&self.registry, &saved);
        Ok(QuickAppDto::from(&saved, missing, url))
    }

    fn reextract(&self) -> Result<Vec<QuickAppDto>, String> {
        let apps = self.registry.list().map_err(|error| error.to_string())?;
        Ok(apps
            .iter()
            .map(|app| {
                if let Some(key) = make_icon_cache_key(app) {
                    let cache = icon_extractor::derive_icon_path(self.registry.icons_dir(), &key);
                    let _ = fs::remove_file(cache);
                }
                let (missing, url) = project_icon(&self.registry, app);
                QuickAppDto::from(app, missing, url)
            })
            .collect())
    }

    fn launch(&self, id: &str) -> Result<u32, String> {
        let app = self
            .registry
            .get(id)
            .map_err(|error| error.to_string())?
            .ok_or_else(|| format!("Quick App not found: {id}"))?;
        let mut command = Command::new(&app.command);
        command.args(&app.args);
        if let Some(directory) = app.working_dir.filter(|value| !value.is_empty()) {
            command.current_dir(directory);
        }
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            command.creation_flags(0x00000008 | 0x08000000);
        }
        command
            .spawn()
            .map(|child| child.id())
            .map_err(|error| error.to_string())
    }
}

fn required_string<'a>(params: &'a Value, key: &str) -> Result<&'a str, String> {
    params
        .get(key)
        .and_then(Value::as_str)
        .filter(|value| !value.is_empty())
        .ok_or_else(|| format!("{key} is required"))
}

fn project_icon(registry: &QuickAppRegistry, app: &QuickApp) -> (bool, Option<String>) {
    let Some(cache_key) = make_icon_cache_key(app) else {
        return (true, None);
    };
    let cache_path = icon_extractor::derive_icon_path(registry.icons_dir(), &cache_key);

    if let Some(user_icon) = app.icon_path.as_ref().filter(|path| !path.is_empty()) {
        let path = PathBuf::from(user_icon);
        let metadata = fs::metadata(&path).ok();
        if metadata
            .as_ref()
            .is_some_and(|value| value.is_file() && value.len() <= MAX_ICON_SOURCE_BYTES)
        {
            if let Ok(bytes) = fs::read(&path) {
                let extension = path
                    .extension()
                    .and_then(|value| value.to_str())
                    .unwrap_or_default()
                    .to_ascii_lowercase();
                let mime = match extension.as_str() {
                    "png" => "image/png",
                    "jpg" | "jpeg" => "image/jpeg",
                    "ico" => "image/x-icon",
                    _ => "application/octet-stream",
                };
                return (
                    false,
                    Some(format!("data:{mime};base64,{}", BASE64.encode(bytes))),
                );
            }
        }
        return (true, None);
    }

    if let Ok(bytes) = fs::read(&cache_path) {
        let missing = bytes.as_slice() == icon_extractor::transparent_png();
        return (
            missing,
            Some(format!("data:image/png;base64,{}", BASE64.encode(bytes))),
        );
    }

    let raw_target = PathBuf::from(&app.command);
    let target = resolve_lnk(&raw_target).unwrap_or(raw_target);
    let IconBytes(bytes) = icon_extractor::extract_icon(&target);
    let missing = bytes.as_slice() == icon_extractor::transparent_png();
    if icon_extractor::write_to_cache(&cache_path, &bytes).is_err() {
        return (missing, None);
    }
    (
        missing,
        Some(format!("data:image/png;base64,{}", BASE64.encode(bytes))),
    )
}

#[cfg(windows)]
fn resolve_lnk(path: &PathBuf) -> Option<PathBuf> {
    if !path
        .extension()
        .and_then(|value| value.to_str())
        .is_some_and(|value| value.eq_ignore_ascii_case("lnk"))
    {
        return None;
    }
    let bytes = fs::read(path).ok()?;
    if bytes.len() < 0x50 || bytes[0..4] != [0x4c, 0, 0, 0] {
        return None;
    }
    let flags = u32::from_le_bytes(bytes[0x14..0x18].try_into().ok()?);
    let mut offset = 0x4c;
    if flags & 0x01 != 0 {
        let size = u16::from_le_bytes(bytes.get(offset..offset + 2)?.try_into().ok()?) as usize;
        offset += 2 + size;
    }
    if flags & 0x04 == 0 {
        return None;
    }
    let link_info_size =
        u32::from_le_bytes(bytes.get(offset..offset + 4)?.try_into().ok()?) as usize;
    if offset + link_info_size > bytes.len() {
        return None;
    }
    let relative =
        u32::from_le_bytes(bytes.get(offset + 0x10..offset + 0x14)?.try_into().ok()?) as usize;
    let start = offset + relative;
    let end = bytes.get(start..)?.iter().position(|byte| *byte == 0)?;
    let target = PathBuf::from(std::str::from_utf8(bytes.get(start..start + end)?).ok()?);
    target.is_file().then_some(target)
}

#[cfg(not(windows))]
fn resolve_lnk(_path: &PathBuf) -> Option<PathBuf> {
    None
}
