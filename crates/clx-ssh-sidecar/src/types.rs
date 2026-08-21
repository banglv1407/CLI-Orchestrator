use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshConnection {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub auth_type: String, // "password" | "key"
    pub password: Option<String>,
    pub key_path: Option<String>,
    pub passphrase: Option<String>,
    pub remote_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshServerConfig {
    pub enabled: bool,
    pub port: u16,
    pub username: String,
    pub password: Option<String>,
    pub authorized_keys: Vec<String>,
    pub allow_pty: bool,
    pub idle_timeout_secs: u64,
}

impl Default for SshServerConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            port: 2222,
            username: "clx".to_string(),
            password: None,
            authorized_keys: Vec::new(),
            allow_pty: true,
            idle_timeout_secs: 3600,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshServerStatus {
    pub running: bool,
    pub port: u16,
    pub active_sessions: usize,
    pub logs: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshFileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: Option<String>,
}
