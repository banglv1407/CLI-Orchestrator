use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
    sync::RwLock,
};

use serde::{Deserialize, Deserializer, Serialize, Serializer};
use thiserror::Error;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CliMode {
    Interactive,
}

impl Serialize for CliMode {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str("interactive")
    }
}

impl<'de> Deserialize<'de> for CliMode {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let raw = String::deserialize(deserializer)?;
        match raw.trim().to_ascii_lowercase().as_str() {
            "interactive" | "oneshot" | "stream" => Ok(CliMode::Interactive),
            other => Err(serde::de::Error::custom(format!(
                "unsupported cli mode: {}",
                other
            ))),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CliDefinition {
    pub name: String,
    pub command: String,
    #[serde(default)]
    pub args: Vec<String>,
    pub mode: CliMode,
    #[serde(default)]
    pub env: HashMap<String, String>,
    #[serde(
        default,
        rename = "defaultWorkingDir",
        alias = "default_working_dir",
        skip_serializing_if = "Option::is_none"
    )]
    pub default_working_dir: Option<String>,
    #[serde(
        default,
        rename = "savedDirectories",
        alias = "saved_directories",
        skip_serializing_if = "Vec::is_empty"
    )]
    pub saved_directories: Vec<CliSavedDirectory>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CliSavedDirectory {
    pub tag: String,
    pub path: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DetectedCli {
    pub name: String,
    pub command: String,
    pub path: String,
    pub suggested_mode: CliMode,
}

#[allow(dead_code)]
#[derive(Debug, Clone)]
pub struct DataDirs {
    pub root_dir: PathBuf,
    pub clis_dir: PathBuf,
    pub logs_dir: PathBuf,
    pub sessions_dir: PathBuf,
}

#[derive(Debug, Error)]
pub enum RegistryError {
    #[error("unable to resolve user home directory")]
    MissingHomeDirectory,
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("json error: {0}")]
    Json(#[from] serde_json::Error),
    #[error("lock poisoned")]
    LockPoisoned,
    #[error("invalid CLI name")]
    InvalidCliName,
    #[error("CLI command cannot be empty")]
    InvalidCommand,
    #[error("project tag cannot be empty")]
    EmptyProjectTag,
    #[error("working directory does not exist: {0}")]
    InvalidWorkingDirectory(String),
    #[error("CLI already exists: {0}")]
    CliAlreadyExists(String),
    #[error("CLI not found: {0}")]
    CliNotFound(String),
}

pub struct CliRegistry {
    dirs: DataDirs,
    clis: RwLock<HashMap<String, CliDefinition>>,
}

impl CliRegistry {
    pub fn new() -> Result<Self, RegistryError> {
        let dirs = Self::ensure_data_dirs()?;
        let registry = Self {
            dirs,
            clis: RwLock::new(HashMap::new()),
        };

        registry.seed_defaults_if_empty()?;
        registry.reload()?;

        Ok(registry)
    }

    pub fn reload(&self) -> Result<(), RegistryError> {
        let loaded = Self::load_configs(&self.dirs.clis_dir)?;
        let mut guard = self.clis.write().map_err(|_| RegistryError::LockPoisoned)?;
        *guard = loaded;
        Ok(())
    }

    pub fn list(&self) -> Result<Vec<CliDefinition>, RegistryError> {
        let guard = self.clis.read().map_err(|_| RegistryError::LockPoisoned)?;
        let mut clis = guard.values().cloned().collect::<Vec<_>>();
        clis.sort_by(|left, right| left.name.cmp(&right.name));
        Ok(clis)
    }

    pub fn get(&self, name: &str) -> Result<Option<CliDefinition>, RegistryError> {
        let guard = self.clis.read().map_err(|_| RegistryError::LockPoisoned)?;
        Ok(guard.get(name).cloned())
    }

    pub fn detect_installed_clis(&self) -> Vec<DetectedCli> {
        let known = vec![
            "qwen",
            "gemini",
            "codex",
            "aider",
            "claude-code",
            "opencode",
        ];

        known
            .into_iter()
            .filter_map(|name| {
                which::which(name).ok().map(|path| DetectedCli {
                    name: name.to_string(),
                    command: name.to_string(),
                    path: path.to_string_lossy().to_string(),
                    suggested_mode: CliMode::Interactive,
                })
            })
            .collect()
    }

    pub fn data_dirs(&self) -> DataDirs {
        self.dirs.clone()
    }

    pub fn upsert(
        &self,
        cli: CliDefinition,
        original_name: Option<String>,
    ) -> Result<CliDefinition, RegistryError> {
        let mut normalized = cli.clone();
        normalized.name = normalized.name.trim().to_string();
        normalized.command = normalized.command.trim().to_string();

        if normalized.name.is_empty() {
            return Err(RegistryError::InvalidCliName);
        }
        if normalized.command.is_empty() {
            return Err(RegistryError::InvalidCommand);
        }

        {
            let guard = self.clis.read().map_err(|_| RegistryError::LockPoisoned)?;
            let is_rename = original_name
                .as_deref()
                .map(str::trim)
                .map(|value| value != normalized.name)
                .unwrap_or(true);
            if is_rename && guard.contains_key(&normalized.name) {
                return Err(RegistryError::CliAlreadyExists(normalized.name));
            }
        }

        if let Some(old_name) = original_name {
            let old_trimmed = old_name.trim();
            if !old_trimmed.is_empty() && old_trimmed != normalized.name {
                let old_path = self
                    .dirs
                    .clis_dir
                    .join(Self::file_name_for_cli(old_trimmed));
                if old_path.exists() {
                    fs::remove_file(old_path)?;
                }
            }
        }

        let target_path = self
            .dirs
            .clis_dir
            .join(Self::file_name_for_cli(&normalized.name));
        let payload = serde_json::to_string_pretty(&normalized)?;
        fs::write(target_path, payload)?;
        self.reload()?;

        Ok(normalized)
    }

    pub fn delete(&self, name: &str) -> Result<(), RegistryError> {
        let trimmed = name.trim();
        if trimmed.is_empty() {
            return Err(RegistryError::InvalidCliName);
        }

        let file_path = self.dirs.clis_dir.join(Self::file_name_for_cli(trimmed));
        if !file_path.exists() {
            return Err(RegistryError::CliNotFound(trimmed.to_string()));
        }

        fs::remove_file(file_path)?;
        self.reload()?;
        Ok(())
    }

    pub fn save_project_tag(
        &self,
        cli_name: &str,
        tag: String,
        path: String,
    ) -> Result<CliDefinition, RegistryError> {
        let trimmed_cli_name = cli_name.trim();
        if trimmed_cli_name.is_empty() {
            return Err(RegistryError::InvalidCliName);
        }

        let normalized_tag = tag.trim().to_string();
        if normalized_tag.is_empty() {
            return Err(RegistryError::EmptyProjectTag);
        }

        let normalized_path = path.trim().to_string();
        if normalized_path.is_empty() {
            return Err(RegistryError::InvalidWorkingDirectory(normalized_path));
        }
        let dir = PathBuf::from(&normalized_path);
        if !dir.is_dir() {
            return Err(RegistryError::InvalidWorkingDirectory(normalized_path));
        }

        let mut cli = self
            .get(trimmed_cli_name)?
            .ok_or_else(|| RegistryError::CliNotFound(trimmed_cli_name.to_string()))?;
        let persisted_path = dir.to_string_lossy().to_string();

        if let Some(entry) = cli
            .saved_directories
            .iter_mut()
            .find(|item| item.path == persisted_path)
        {
            entry.tag = normalized_tag;
        } else {
            cli.saved_directories.push(CliSavedDirectory {
                tag: normalized_tag,
                path: persisted_path,
            });
        }
        cli.saved_directories
            .sort_by(|left, right| left.tag.cmp(&right.tag));

        let original_name = cli.name.clone();
        self.upsert(cli, Some(original_name))
    }

    fn ensure_data_dirs() -> Result<DataDirs, RegistryError> {
        let home = dirs::home_dir().ok_or(RegistryError::MissingHomeDirectory)?;
        let root_dir = home.join(".ai-cli-manager");
        let clis_dir = root_dir.join("clis");
        let logs_dir = root_dir.join("logs");
        let sessions_dir = root_dir.join("sessions");

        fs::create_dir_all(&clis_dir)?;
        fs::create_dir_all(&logs_dir)?;
        fs::create_dir_all(&sessions_dir)?;

        Ok(DataDirs {
            root_dir,
            clis_dir,
            logs_dir,
            sessions_dir,
        })
    }

    fn load_configs(clis_dir: &Path) -> Result<HashMap<String, CliDefinition>, RegistryError> {
        let mut configs = HashMap::new();

        for entry in fs::read_dir(clis_dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.extension().and_then(|value| value.to_str()) != Some("json") {
                continue;
            }

            let raw = fs::read_to_string(&path)?;
            match serde_json::from_str::<CliDefinition>(&raw) {
                Ok(cli) => {
                    if !cli.name.trim().is_empty() {
                        configs.insert(cli.name.clone(), cli);
                    }
                }
                Err(error) => {
                    eprintln!(
                        "failed to parse CLI config {}: {}",
                        path.to_string_lossy(),
                        error
                    );
                }
            }
        }

        Ok(configs)
    }

    fn seed_defaults_if_empty(&self) -> Result<(), RegistryError> {
        let has_configs = fs::read_dir(&self.dirs.clis_dir)?
            .filter_map(Result::ok)
            .map(|entry| entry.path())
            .any(|path| path.extension().and_then(|value| value.to_str()) == Some("json"));

        if has_configs {
            return Ok(());
        }

        for cli in Self::default_cli_configs() {
            let path = self.dirs.clis_dir.join(Self::file_name_for_cli(&cli.name));
            let json = serde_json::to_string_pretty(&cli)?;
            fs::write(path, json)?;
        }

        Ok(())
    }

    fn default_cli_configs() -> Vec<CliDefinition> {
        vec![
            CliDefinition {
                name: "qwen".to_string(),
                command: "qwen".to_string(),
                args: vec!["code".to_string(), "{prompt}".to_string()],
                mode: CliMode::Interactive,
                env: HashMap::new(),
                default_working_dir: None,
                saved_directories: Vec::new(),
            },
            CliDefinition {
                name: "gemini".to_string(),
                command: "gemini".to_string(),
                args: vec!["{prompt}".to_string()],
                mode: CliMode::Interactive,
                env: HashMap::new(),
                default_working_dir: None,
                saved_directories: Vec::new(),
            },
            CliDefinition {
                name: "codex".to_string(),
                command: "codex".to_string(),
                args: vec!["{prompt}".to_string()],
                mode: CliMode::Interactive,
                env: HashMap::new(),
                default_working_dir: None,
                saved_directories: Vec::new(),
            },
            CliDefinition {
                name: "aider".to_string(),
                command: "aider".to_string(),
                args: vec![],
                mode: CliMode::Interactive,
                env: HashMap::new(),
                default_working_dir: None,
                saved_directories: Vec::new(),
            },
            CliDefinition {
                name: "claude-code".to_string(),
                command: "claude-code".to_string(),
                args: vec![],
                mode: CliMode::Interactive,
                env: HashMap::new(),
                default_working_dir: None,
                saved_directories: Vec::new(),
            },
            CliDefinition {
                name: "opencode".to_string(),
                command: "opencode".to_string(),
                args: vec![],
                mode: CliMode::Interactive,
                env: HashMap::new(),
                default_working_dir: None,
                saved_directories: Vec::new(),
            },
        ]
    }

    fn file_name_for_cli(name: &str) -> String {
        let mut safe = name
            .chars()
            .map(|value| {
                if value.is_ascii_alphanumeric() || value == '-' || value == '_' {
                    value
                } else {
                    '_'
                }
            })
            .collect::<String>();

        if safe.is_empty() {
            safe = "cli".to_string();
        }

        format!("{safe}.json")
    }
}
