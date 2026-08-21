use serde_json::Value;

pub struct NesService {
    config_path: std::path::PathBuf,
}

impl NesService {
    pub fn new() -> Self {
        let data_dir = dirs::config_dir()
            .unwrap_or_else(|| std::path::PathBuf::from("."))
            .join("clx");
        Self {
            config_path: data_dir.join("nes_config.json"),
        }
    }

    pub async fn handle_call(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.nes.getConfig" => {
                let content = std::fs::read_to_string(&self.config_path).unwrap_or_default();
                let config: Value = serde_json::from_str(&content).unwrap_or(Value::Object(Default::default()));
                Ok(config)
            }
            "clx.nes.saveConfig" => {
                let dir = self.config_path.parent().unwrap();
                std::fs::create_dir_all(dir).map_err(|e| e.to_string())?;
                let json = serde_json::to_string_pretty(&params).map_err(|e| e.to_string())?;
                std::fs::write(&self.config_path, json).map_err(|e| e.to_string())?;
                Ok(Value::Bool(true))
            }
            "clx.nes.testServer" | "clx.nes.openRom" | "clx.nes.getPubkey"
            | "clx.nes.createPrivateRoom" | "clx.nes.createPublicRoom"
            | "clx.nes.listRooms" | "clx.nes.joinRoom" | "clx.nes.acceptInvite"
            | "clx.nes.refreshConnection" | "clx.nes.leaveRoom" | "clx.nes.endRoom" => {
                // ponytail: stub — full NES relay logic migrated from Core nes_client.rs when needed
                Err(format!("clx.nes method {} not yet implemented in sidecar", method))
            }
            _ => Err(format!("Unknown nes method: {}", method)),
        }
    }
}
