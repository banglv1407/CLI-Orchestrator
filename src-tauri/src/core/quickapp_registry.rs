use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
    sync::RwLock,
};

use serde::{Deserialize, Serialize};
use thiserror::Error;

/// A user-defined favorite application shown in the Quick Apps launcher.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuickApp {
    /// Stable id used as the JSON file name and React `key`.
    pub id: String,
    /// Display name shown on the tile.
    pub name: String,
    /// Executable or command path to launch.
    pub command: String,
    /// Optional CLI arguments to pass.
    #[serde(default)]
    pub args: Vec<String>,
    /// Optional working directory for the launched process.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub working_dir: Option<String>,
    /// Optional user-supplied icon path (overrides auto-extracted icon).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_path: Option<String>,
    /// Tile order; lower numbers render first.
    #[serde(default)]
    pub order: i32,
    /// Optional group name for organizing apps in the launcher.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group: Option<String>,
}

#[derive(Debug, Error)]
pub enum QuickAppError {
    #[error("unable to resolve user home directory")]
    MissingHomeDirectory,
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("json error: {0}")]
    Json(#[from] serde_json::Error),
    #[error("lock poisoned")]
    LockPoisoned,
    #[error("invalid id: must be non-empty and alphanumeric/dash/underscore")]
    InvalidId,
}

#[derive(Debug, Clone)]
pub struct DataDirs {
    pub root_dir: PathBuf,
    pub quickapps_dir: PathBuf,
    pub icons_dir: PathBuf,
}

pub struct QuickAppRegistry {
    dirs: DataDirs,
    apps: RwLock<HashMap<String, QuickApp>>,
}

fn ensure_dir(dir: &Path) -> Result<(), QuickAppError> {
    if !dir.exists() {
        fs::create_dir_all(dir)?;
    }
    Ok(())
}

fn quickapp_dirs() -> Result<DataDirs, QuickAppError> {
    let home = dirs::home_dir().ok_or(QuickAppError::MissingHomeDirectory)?;
    let root = home.join(".ai-cli-manager");
    let quickapps_dir = root.join("quickapps");
    let icons_dir = root.join("quickapp-icons");
    ensure_dir(&root)?;
    ensure_dir(&quickapps_dir)?;
    ensure_dir(&icons_dir)?;
    Ok(DataDirs {
        root_dir: root,
        quickapps_dir,
        icons_dir,
    })
}

fn validate_id(id: &str) -> Result<(), QuickAppError> {
    if id.is_empty() {
        return Err(QuickAppError::InvalidId);
    }
    if !id
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
    {
        return Err(QuickAppError::InvalidId);
    }
    Ok(())
}

impl QuickAppRegistry {
    pub fn new() -> Result<Self, QuickAppError> {
        let dirs = quickapp_dirs()?;
        let mut apps = HashMap::new();

        if dirs.quickapps_dir.is_dir() {
            for entry in fs::read_dir(&dirs.quickapps_dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.extension().and_then(|e| e.to_str()) != Some("json") {
                    continue;
                }
                match fs::read_to_string(&path) {
                    Ok(text) => match serde_json::from_str::<QuickApp>(&text) {
                        Ok(app) => {
                            apps.insert(app.id.clone(), app);
                        }
                        Err(err) => {
                            eprintln!(
                                "[quickapps] skipping {}: invalid json ({})",
                                path.display(),
                                err
                            );
                        }
                    },
                    Err(err) => {
                        eprintln!(
                            "[quickapps] skipping {}: read error ({})",
                            path.display(),
                            err
                        );
                    }
                }
            }
        }

        Ok(Self {
            dirs,
            apps: RwLock::new(apps),
        })
    }

    pub fn icons_dir(&self) -> &Path {
        &self.dirs.icons_dir
    }

    pub fn reload(&self) -> Result<(), QuickAppError> {
        let mut fresh: HashMap<String, QuickApp> = HashMap::new();
        if self.dirs.quickapps_dir.is_dir() {
            for entry in fs::read_dir(&self.dirs.quickapps_dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.extension().and_then(|e| e.to_str()) != Some("json") {
                    continue;
                }
                if let Ok(text) = fs::read_to_string(&path) {
                    if let Ok(app) = serde_json::from_str::<QuickApp>(&text) {
                        fresh.insert(app.id.clone(), app);
                    }
                }
            }
        }
        let mut guard = self.apps.write().map_err(|_| QuickAppError::LockPoisoned)?;
        *guard = fresh;
        Ok(())
    }

    pub fn list(&self) -> Result<Vec<QuickApp>, QuickAppError> {
        let guard = self.apps.read().map_err(|_| QuickAppError::LockPoisoned)?;
        let mut out: Vec<QuickApp> = guard.values().cloned().collect();
        out.sort_by(|a, b| {
            a.order
                .cmp(&b.order)
                .then_with(|| a.name.to_lowercase().cmp(&b.name.to_lowercase()))
        });
        Ok(out)
    }

    pub fn upsert(&self, mut app: QuickApp) -> Result<QuickApp, QuickAppError> {
        validate_id(&app.id)?;
        if app.command.trim().is_empty() {
            return Err(QuickAppError::InvalidId); // reused error enum member
        }
        let path = self.dirs.quickapps_dir.join(format!("{}.json", app.id));
        let mut guard = self.apps.write().map_err(|_| QuickAppError::LockPoisoned)?;

        // Existing icon cache should be invalidated when the command path changes.
        if let Some(prev) = guard.get(&app.id) {
            let icon_changed = prev.command != app.command
                || prev.icon_path.as_deref() != app.icon_path.as_deref();
            if icon_changed {
                if let Some(old) = make_icon_cache_key(prev) {
                    let _ = fs::remove_file(self.dirs.icons_dir.join(format!("{old}.png")));
                }
            }
            // Preserve order if the caller did not specify one.
            if app.order == 0 {
                app.order = prev.order;
            }
        }

        let json = serde_json::to_string_pretty(&app)?;
        fs::write(&path, json)?;
        guard.insert(app.id.clone(), app.clone());
        Ok(app)
    }

    pub fn delete(&self, id: &str) -> Result<(), QuickAppError> {
        validate_id(id)?;
        let path = self.dirs.quickapps_dir.join(format!("{id}.json"));
        if path.exists() {
            fs::remove_file(&path)?;
        }
        let mut guard = self.apps.write().map_err(|_| QuickAppError::LockPoisoned)?;
        if let Some(prev) = guard.remove(id) {
            if let Some(key) = make_icon_cache_key(&prev) {
                let _ = fs::remove_file(self.dirs.icons_dir.join(format!("{key}.png")));
            }
        }
        Ok(())
    }

    pub fn get(&self, id: &str) -> Result<Option<QuickApp>, QuickAppError> {
        let guard = self.apps.read().map_err(|_| QuickAppError::LockPoisoned)?;
        Ok(guard.get(id).cloned())
    }
}

/// Produces a stable cache key for an app's icon, derived from its command + icon
/// override. `None` means "do not use the cache" (e.g. both fields are empty).
pub fn make_icon_cache_key(app: &QuickApp) -> Option<String> {
    use sha2::{Digest, Sha256};
    let basis = if let Some(ic) = &app.icon_path {
        format!("icon::{ic}::cmd::{}", app.command)
    } else if !app.command.is_empty() {
        format!("cmd::{}", app.command)
    } else {
        return None;
    };
    let mut hasher = Sha256::new();
    hasher.update(basis.as_bytes());
    let digest = hasher.finalize();
    Some(hex::encode(&digest[..16]))
}
