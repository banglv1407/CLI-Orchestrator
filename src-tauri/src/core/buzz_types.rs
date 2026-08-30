use serde::{Deserialize, Serialize};

use super::buzz_proxy::BuzzProxyConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BuzzRelayConfig {
    pub relay_url: String,
    pub allow_insecure: bool,
    #[serde(default)]
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
