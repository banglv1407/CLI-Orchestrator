use serde::{Deserialize, Serialize};
use std::path::PathBuf;

use super::buzz_proxy::BuzzProxyConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BuzzRelayConfig {
    #[serde(alias = "relay_url")]
    pub relay_url: String,
    #[serde(default, alias = "allow_insecure")]
    pub allow_insecure: bool,
    #[serde(default, alias = "identity_pubkey")]
    pub identity_pubkey: Option<String>,
    /// Optional outbound hop: SSH dynamic SOCKS5 or HTTP CONNECT.
    #[serde(default)]
    pub proxy: Option<BuzzProxyConfig>,
}

impl Default for BuzzRelayConfig {
    fn default() -> Self {
        Self {
            relay_url: "https://buzz.happyplatform.io.vn".to_string(),
            allow_insecure: false,
            identity_pubkey: None,
            proxy: None,
        }
    }
}

impl BuzzRelayConfig {
    pub fn load() -> Result<Self, String> {
        let path = Self::config_path()?;
        if path.exists() {
            let content = std::fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read Buzz config: {e}"))?;
            serde_json::from_str(&content).map_err(|e| format!("Failed to parse Buzz config: {e}"))
        } else {
            Ok(Self::default())
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let path = Self::config_path()?;
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create config dir: {e}"))?;
        }
        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize Buzz config: {e}"))?;
        std::fs::write(&path, content).map_err(|e| format!("Failed to write Buzz config: {e}"))
    }

    fn config_path() -> Result<PathBuf, String> {
        #[cfg(test)]
        {
            if let Some(path) = std::env::var_os("CLX_BUZZ_CONFIG") {
                return Ok(PathBuf::from(path));
            }
        }
        let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
        Ok(home.join(".ai-cli-manager").join("buzz.json"))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuzzChannel {
    pub channel_id: String,
    pub name: String,
    pub description: String,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuzzMessage {
    pub id: String,
    pub pubkey: String,
    pub content: String,
    pub created_at: i64,
    pub kind: u32,
    pub tags: Vec<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuzzUserProfile {
    pub pubkey: String,
    pub display_name: Option<String>,
    pub name: Option<String>,
    pub picture: Option<String>,
    pub about: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuzzMember {
    pub pubkey: String,
    pub role: String,
    pub display_name: Option<String>,
    pub picture: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuzzDmResult {
    pub dm_id: String,
    pub accepted: bool,
    pub event_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuzzDmConversation {
    pub dm_id: String,
    pub participants: Vec<String>,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuzzAgentConfig {
    pub agent_id: String,
    pub name: String,
    pub instructions: String,
    pub project_root: String,
    pub assigned_channels: Vec<String>,
    pub allowlist_pubkeys: Vec<String>,
    pub autostart: bool,
    pub status: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_buzz_relay_config_serde_and_persistence() {
        let unique = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let temp_dir = std::env::temp_dir().join(format!("buzz-test-{}", unique));
        std::fs::create_dir_all(&temp_dir).unwrap();
        let config_file = temp_dir.join("buzz.json");
        std::env::set_var("CLX_BUZZ_CONFIG", &config_file);

        let mut cfg = BuzzRelayConfig::default();
        cfg.relay_url = "wss://custom.relay.io".to_string();
        cfg.save().unwrap();

        let loaded = BuzzRelayConfig::load().unwrap();
        assert_eq!(loaded.relay_url, "wss://custom.relay.io");

        let json_snake = r#"{"relay_url": "wss://snake.relay.io", "allow_insecure": true}"#;
        let from_snake: BuzzRelayConfig = serde_json::from_str(json_snake).unwrap();
        assert_eq!(from_snake.relay_url, "wss://snake.relay.io");
        assert!(from_snake.allow_insecure);

        let json_camel = r#"{"relayUrl": "wss://camel.relay.io", "allowInsecure": false, "proxy": {"kind": "ssh", "host": "hop.io", "port": 22, "authMode": "key", "keyPath": "/path"}}"#;
        let from_camel: BuzzRelayConfig = serde_json::from_str(json_camel).unwrap();
        assert_eq!(from_camel.relay_url, "wss://camel.relay.io");
        assert!(!from_camel.allow_insecure);
        assert_eq!(from_camel.proxy.as_ref().unwrap().auth_mode, "key");
        assert_eq!(from_camel.proxy.as_ref().unwrap().key_path.as_deref(), Some("/path"));

        let json_snake_proxy = r#"{"relay_url": "wss://snake.relay.io", "allow_insecure": true, "proxy": {"kind": "ssh", "host": "hop.io", "port": 22, "auth_mode": "key", "key_path": "/path"}}"#;
        let from_snake_proxy: BuzzRelayConfig = serde_json::from_str(json_snake_proxy).unwrap();
        assert_eq!(from_snake_proxy.relay_url, "wss://snake.relay.io");
        assert_eq!(from_snake_proxy.proxy.as_ref().unwrap().auth_mode, "key");

        // Test nes relay config deserialization with camelCase
        let nes_json_camel = r#"{"schemaVersion": 1, "serviceBaseUrl": "https://nes.io", "proxy": null}"#;
        let nes_from_camel: crate::core::nes_types::NesRelayConfigV1 =
            serde_json::from_str(nes_json_camel).unwrap();
        assert_eq!(nes_from_camel.service_base_url, "https://nes.io");
        assert_eq!(nes_from_camel.schema_version, 1);

        std::env::remove_var("CLX_BUZZ_CONFIG");
        let _ = std::fs::remove_dir_all(&temp_dir);
    }
}
