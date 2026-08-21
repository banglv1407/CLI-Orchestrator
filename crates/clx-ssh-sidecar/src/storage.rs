use std::path::PathBuf;
use crate::types::{SshConnection, SshServerConfig};

pub fn data_dir() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("clx")
}

pub fn load_connections() -> Vec<SshConnection> {
    let path = data_dir().join("ssh_connections.json");
    if let Ok(content) = std::fs::read_to_string(path) {
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_connections(connections: &[SshConnection]) -> Result<(), String> {
    let dir = data_dir();
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join("ssh_connections.json");
    let json = serde_json::to_string_pretty(connections).map_err(|e| e.to_string())?;
    std::fs::write(path, json).map_err(|e| e.to_string())
}

pub fn load_server_config() -> SshServerConfig {
    let path = data_dir().join("ssh_server_config.json");
    if let Ok(content) = std::fs::read_to_string(path) {
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        SshServerConfig::default()
    }
}

pub fn save_server_config(config: &SshServerConfig) -> Result<(), String> {
    let dir = data_dir();
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join("ssh_server_config.json");
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    std::fs::write(path, json).map_err(|e| e.to_string())
}
