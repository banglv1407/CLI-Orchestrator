/// Companion configuration — stored at ~/.ai-cli-manager/companion.json
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompanionConfig {
    pub base_url: String,
    pub model: String,
    pub api_key: String,
    #[serde(default)]
    pub stream: bool,
    #[serde(default = "default_system_prompt")]
    pub custom_prompt: String,
    #[serde(default)]
    pub custom_headers: HashMap<String, String>,
    #[serde(default)]
    pub actions_enabled: bool,
}

fn default_system_prompt() -> String {
    "You are a helpful AI companion for CLX, a desktop CLI orchestrator. \
     Answer questions about the app's features and help the user navigate. \
     Be concise and practical.".to_string()
}

impl Default for CompanionConfig {
    fn default() -> Self {
        Self {
            base_url: "https://api.openai.com/v1".to_string(),
            model: "gpt-4o-mini".to_string(),
            api_key: String::new(),
            stream: true,
            custom_prompt: default_system_prompt(),
            custom_headers: HashMap::new(),
            actions_enabled: false,
        }
    }
}

impl CompanionConfig {
    pub fn config_path() -> PathBuf {
        let base = dirs_next().unwrap_or_else(|| PathBuf::from("."));
        base.join(".ai-cli-manager").join("companion.json")
    }

    pub fn load() -> Result<Self, String> {
        let path = Self::config_path();
        if !path.exists() {
            return Ok(Self::default());
        }
        let content = std::fs::read_to_string(&path).map_err(|e| format!("read config: {}", e))?;
        serde_json::from_str(&content).map_err(|e| format!("parse config: {}", e))
    }

    pub fn save(&self) -> Result<(), String> {
        let path = Self::config_path();
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| format!("mkdir: {}", e))?;
        }
        let json = serde_json::to_string_pretty(self).map_err(|e| format!("serialize: {}", e))?;
        std::fs::write(&path, json).map_err(|e| format!("write config: {}", e))
    }
}

fn dirs_next() -> Option<PathBuf> {
    dirs::home_dir()
}

/// Masked config view — returned to the frontend, never exposes full API key.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompanionConfigView {
    pub base_url: String,
    pub model: String,
    pub api_key_present: bool,
    pub stream_enabled: bool,
    pub custom_prompt: String,
    pub custom_headers: Vec<MaskedHeader>,
    pub actions_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MaskedHeader {
    pub name: String,
    pub masked: bool,
}

impl From<&CompanionConfig> for CompanionConfigView {
    fn from(c: &CompanionConfig) -> Self {
        Self {
            base_url: c.base_url.clone(),
            model: c.model.clone(),
            api_key_present: !c.api_key.is_empty(),
            stream_enabled: c.stream,
            custom_prompt: c.custom_prompt.clone(),
            custom_headers: c
                .custom_headers
                .iter()
                .map(|(name, _value)| MaskedHeader {
                    name: name.clone(),
                    masked: true,
                })
                .collect(),
            actions_enabled: c.actions_enabled,
        }
    }
}

/// Update payload from frontend — secret fields are optional.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompanionConfigUpdate {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub api_key: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stream_enabled: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub custom_prompt: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub custom_headers: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub clear_api_key: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub clear_custom_headers: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub actions_enabled: Option<bool>,
}
