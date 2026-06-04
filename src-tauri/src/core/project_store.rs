use std::{collections::HashMap, fs, path::PathBuf, sync::RwLock};

use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::core::cli_registry::CliRegistry;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectTag {
    pub tag: String,
    pub path: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ProjectTagFile {
    #[serde(default)]
    tags: Vec<ProjectTag>,
    #[serde(default)]
    last_working_dir: Option<String>,
}

impl Default for ProjectTagFile {
    fn default() -> Self {
        Self {
            tags: Vec::new(),
            last_working_dir: None,
        }
    }
}

#[derive(Debug, Error)]
pub enum ProjectStoreError {
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("json error: {0}")]
    Json(#[from] serde_json::Error),
    #[error("lock poisoned")]
    LockPoisoned,
    #[error("project tag cannot be empty")]
    EmptyTag,
    #[error("working directory does not exist: {0}")]
    InvalidPath(String),
}

pub struct ProjectStore {
    file_path: PathBuf,
    tags: RwLock<HashMap<String, String>>,
    last_working_dir: RwLock<Option<String>>,
}

impl ProjectStore {
    pub fn new(registry: &CliRegistry) -> Result<Self, ProjectStoreError> {
        let projects_dir = registry.data_dirs().root_dir.join("projects");
        fs::create_dir_all(&projects_dir)?;

        let file_path = projects_dir.join("tags.json");
        if !file_path.exists() {
            let initial = serde_json::to_string_pretty(&ProjectTagFile::default())?;
            fs::write(&file_path, initial)?;
        }

        let store = Self {
            file_path,
            tags: RwLock::new(HashMap::new()),
            last_working_dir: RwLock::new(None),
        };
        store.reload()?;

        Ok(store)
    }

    pub fn reload(&self) -> Result<(), ProjectStoreError> {
        let raw = fs::read_to_string(&self.file_path)?;
        let file = serde_json::from_str::<ProjectTagFile>(&raw)?;

        let mut next = HashMap::new();
        for item in file.tags {
            let tag = item.tag.trim().to_string();
            if !tag.is_empty() {
                next.insert(tag, item.path);
            }
        }
        let normalized_last_working_dir = file
            .last_working_dir
            .and_then(|value| normalize_optional_path(Some(value)));

        {
            let mut guard = self
                .tags
                .write()
                .map_err(|_| ProjectStoreError::LockPoisoned)?;
            *guard = next;
        }
        {
            let mut guard = self
                .last_working_dir
                .write()
                .map_err(|_| ProjectStoreError::LockPoisoned)?;
            *guard = normalized_last_working_dir;
        }
        Ok(())
    }

    pub fn list(&self) -> Result<Vec<ProjectTag>, ProjectStoreError> {
        let guard = self
            .tags
            .read()
            .map_err(|_| ProjectStoreError::LockPoisoned)?;
        let mut rows = guard
            .iter()
            .map(|(tag, path)| ProjectTag {
                tag: tag.clone(),
                path: path.clone(),
            })
            .collect::<Vec<_>>();

        rows.sort_by(|left, right| left.tag.cmp(&right.tag));
        Ok(rows)
    }

    pub fn upsert(&self, tag: String, path: String) -> Result<Vec<ProjectTag>, ProjectStoreError> {
        let normalized_tag = tag.trim().to_string();
        if normalized_tag.is_empty() {
            return Err(ProjectStoreError::EmptyTag);
        }

        let normalized_path = normalize_required_path(path)?;

        {
            let mut guard = self
                .tags
                .write()
                .map_err(|_| ProjectStoreError::LockPoisoned)?;
            guard.insert(normalized_tag, normalized_path.clone());
        }
        {
            let mut guard = self
                .last_working_dir
                .write()
                .map_err(|_| ProjectStoreError::LockPoisoned)?;
            *guard = Some(normalized_path);
        }

        self.persist()?;
        self.list()
    }

    pub fn get_last_working_dir(&self) -> Result<Option<String>, ProjectStoreError> {
        let guard = self
            .last_working_dir
            .read()
            .map_err(|_| ProjectStoreError::LockPoisoned)?;
        Ok(guard.clone())
    }

    pub fn set_last_working_dir(
        &self,
        path: Option<String>,
    ) -> Result<Option<String>, ProjectStoreError> {
        let normalized = match normalize_optional_path(path) {
            Some(value) => Some(normalize_required_path(value)?),
            None => None,
        };

        {
            let mut guard = self
                .last_working_dir
                .write()
                .map_err(|_| ProjectStoreError::LockPoisoned)?;
            *guard = normalized.clone();
        }

        self.persist()?;
        Ok(normalized)
    }

    fn persist(&self) -> Result<(), ProjectStoreError> {
        let tags = self.list()?;
        let last_working_dir = self.get_last_working_dir()?;
        let file = ProjectTagFile {
            tags,
            last_working_dir,
        };
        let json = serde_json::to_string_pretty(&file)?;
        fs::write(&self.file_path, json)?;
        Ok(())
    }
}

fn normalize_optional_path(raw: Option<String>) -> Option<String> {
    raw.and_then(|value| {
        let trimmed = value.trim().to_string();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed)
        }
    })
}

fn normalize_required_path(raw: String) -> Result<String, ProjectStoreError> {
    let normalized_path = raw.trim().to_string();
    let dir = PathBuf::from(&normalized_path);
    if !dir.is_dir() {
        return Err(ProjectStoreError::InvalidPath(normalized_path));
    }

    Ok(dir.to_string_lossy().to_string())
}
