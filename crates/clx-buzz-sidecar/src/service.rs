use serde_json::Value;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct BuzzService {
    config_path: std::path::PathBuf,
    identity_path: std::path::PathBuf,
}

impl BuzzService {
    pub fn new() -> Self {
        let data_dir = dirs::config_dir()
            .unwrap_or_else(|| std::path::PathBuf::from("."))
            .join("clx");
        Self {
            config_path: data_dir.join("buzz_config.json"),
            identity_path: data_dir.join("buzz_identity.json"),
        }
    }

    pub async fn handle_call(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.buzz.getConfig" => {
                let content = std::fs::read_to_string(&self.config_path).unwrap_or_default();
                let config: Value = serde_json::from_str(&content).unwrap_or(Value::Object(Default::default()));
                Ok(config)
            }
            "clx.buzz.setConfig" => {
                let dir = self.config_path.parent().unwrap();
                std::fs::create_dir_all(dir).map_err(|e| e.to_string())?;
                let json = serde_json::to_string_pretty(&params).map_err(|e| e.to_string())?;
                std::fs::write(&self.config_path, json).map_err(|e| e.to_string())?;
                Ok(Value::Bool(true))
            }
            "clx.buzz.hasIdentity" => {
                Ok(Value::Bool(self.identity_path.exists()))
            }
            "clx.buzz.generateIdentity" | "clx.buzz.importIdentity" | "clx.buzz.clearIdentity"
            | "clx.buzz.getPubkey" | "clx.buzz.setProfile" | "clx.buzz.getMyProfile"
            | "clx.buzz.listChannels" | "clx.buzz.getMessages" | "clx.buzz.getThread"
            | "clx.buzz.sendMessage" | "clx.buzz.listMembers" | "clx.buzz.resolveUsers"
            | "clx.buzz.openDm" | "clx.buzz.listDms" | "clx.buzz.listAgents" | "clx.buzz.addAgent" => {
                // ponytail: stub — full relay logic migrated from Core buzz_manager.rs when needed
                Err(format!("clx.buzz method {} not yet implemented in sidecar", method))
            }
            _ => Err(format!("Unknown buzz method: {}", method)),
        }
    }
}
