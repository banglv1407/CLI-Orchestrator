use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BuiltinLlmConfig {
    pub enabled: bool,
    pub model_path: Option<String>,
    pub tokenizer_path: Option<String>,
    pub max_tokens: u32,
    pub temperature: f64,
    pub repeat_penalty: f32,
    pub seed: u64,
    pub runtime: String,
    pub server_path: Option<String>,
    pub server_port: u16,
}

impl Default for BuiltinLlmConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            model_path: None,
            tokenizer_path: None,
            max_tokens: 256,
            temperature: 0.7,
            repeat_penalty: 1.1,
            seed: 42,
            runtime: "candle".to_string(),
            server_path: None,
            server_port: 8080,
        }
    }
}

impl BuiltinLlmConfig {
    fn config_path() -> PathBuf {
        dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("clx")
            .join("builtin_llm.json")
    }

    pub fn load() -> Self {
        let path = Self::config_path();
        if !path.exists() {
            return Self::default();
        }

        match fs::read_to_string(&path) {
            Ok(content) => serde_json::from_str(&content).unwrap_or_else(|_| Self::default()),
            Err(_) => Self::default(),
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let path = Self::config_path();
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }

        let content = serde_json::to_string_pretty(self).map_err(|e| e.to_string())?;
        fs::write(&path, content).map_err(|e| e.to_string())?;
        Ok(())
    }
}
