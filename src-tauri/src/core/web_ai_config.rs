use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WebAiProfile {
    pub id: String,
    pub name: String,
    pub user_agent: Option<String>,
    pub partition: String,
    pub default_url: String,
    pub allow_navigation_rules: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WebAiConfig {
    pub profiles: Vec<WebAiProfile>,
    pub preferred_profile_id: Option<String>,
}

impl Default for WebAiConfig {
    fn default() -> Self {
        Self {
            profiles: vec![
                WebAiProfile {
                    id: "chatgpt-default".to_string(),
                    name: "ChatGPT".to_string(),
                    user_agent: Some("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36".to_string()),
                    partition: "chatgpt".to_string(),
                    default_url: "https://chatgpt.com".to_string(),
                    allow_navigation_rules: vec![
                        "chatgpt.com".to_string(),
                        "openai.com".to_string(),
                        "auth0.com".to_string(),
                    ],
                },
                WebAiProfile {
                    id: "claude-default".to_string(),
                    name: "Claude".to_string(),
                    user_agent: Some("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36".to_string()),
                    partition: "claude".to_string(),
                    default_url: "https://claude.ai".to_string(),
                    allow_navigation_rules: vec![
                        "claude.ai".to_string(),
                        "anthropic.com".to_string(),
                    ],
                },
                WebAiProfile {
                    id: "gemini-default".to_string(),
                    name: "Gemini".to_string(),
                    user_agent: Some("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36".to_string()),
                    partition: "gemini".to_string(),
                    default_url: "https://gemini.google.com".to_string(),
                    allow_navigation_rules: vec![
                        "gemini.google.com".to_string(),
                        "google.com".to_string(),
                        "googleusercontent.com".to_string(),
                        "gstatic.com".to_string(),
                    ],
                },
            ],
            preferred_profile_id: Some("chatgpt-default".to_string()),
        }
    }
}

impl WebAiConfig {
    pub fn load() -> Result<Self, String> {
        let path = Self::config_path()?;
        if path.exists() {
            let content = std::fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read web-ai config: {}", e))?;
            serde_json::from_str(&content)
                .map_err(|e| format!("Failed to parse web-ai config: {}", e))
        } else {
            let config = Self::default();
            let _ = config.save();
            Ok(config)
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let path = Self::config_path()?;
        if let Some(parent) = path.parent() {
            let _ = std::fs::create_dir_all(parent);
        }
        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize web-ai config: {}", e))?;
        std::fs::write(&path, content).map_err(|e| format!("Failed to write web-ai config: {}", e))
    }

    fn config_path() -> Result<PathBuf, String> {
        let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
        Ok(home.join(".ai-cli-manager").join("web-ai.json"))
    }
}

pub fn is_url_allowed(url: &str, rules: &[String]) -> bool {
    if rules.is_empty() {
        return true;
    }
    for rule in rules {
        let clean_rule = rule.replace("*", "");
        if url.contains(&clean_rule) {
            return true;
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_url_allowed() {
        let rules = vec!["chatgpt.com".to_string(), "openai.com".to_string()];

        assert!(is_url_allowed("https://chatgpt.com/c/123", &rules));
        assert!(is_url_allowed("https://api.openai.com/v1", &rules));
        assert!(!is_url_allowed("https://google.com", &rules));

        // Empty rules should allow everything
        assert!(is_url_allowed("https://google.com", &[]));
    }
}
