use serde_json::Value;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::remote_monitoring::{MonitorConfig, SshRouteSession};
use crate::storage::{load_connections, load_server_config, save_connections, save_server_config};
use crate::types::{SshConnection, SshServerConfig, SshServerStatus};

pub struct SshService {
    running: Arc<Mutex<bool>>,
    logs: Arc<Mutex<Vec<String>>>,
}

impl SshService {
    pub fn new() -> Self {
        Self {
            running: Arc::new(Mutex::new(false)),
            logs: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub async fn handle_call(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.ssh.execCommand" => {
                let monitor: MonitorConfig = params
                    .get("monitor")
                    .and_then(|v| serde_json::from_value(v.clone()).ok())
                    .ok_or("monitor required")?;
                let target_secret = params
                    .get("targetSecret")
                    .and_then(Value::as_str)
                    .map(String::from);
                let jump_secret = params
                    .get("jumpSecret")
                    .and_then(Value::as_str)
                    .map(String::from);
                let command = params
                    .get("command")
                    .and_then(Value::as_str)
                    .ok_or("command required")?;

                let route = SshRouteSession::connect(&monitor, target_secret, jump_secret).await?;
                let output = route.exec_capture(command, None).await?;
                Ok(serde_json::to_value(&output).unwrap_or_default())
            }
            "clx.ssh.loadConnections" => {
                let conns = load_connections();
                Ok(serde_json::to_value(&conns).unwrap_or_default())
            }
            "clx.ssh.saveConnections" => {
                let conns: Vec<SshConnection> =
                    serde_json::from_value(params).map_err(|e| e.to_string())?;
                save_connections(&conns)?;
                Ok(serde_json::to_value(&conns).unwrap_or_default())
            }
            "clx.ssh.getServerConfig" => {
                let config = load_server_config();
                Ok(serde_json::to_value(&config).unwrap_or_default())
            }
            "clx.ssh.saveServerConfig" => {
                let config: SshServerConfig =
                    serde_json::from_value(params).map_err(|e| e.to_string())?;
                save_server_config(&config)?;
                Ok(serde_json::to_value(&config).unwrap_or_default())
            }
            "clx.ssh.getServerStatus" => {
                let running = *self.running.lock().await;
                let logs = self.logs.lock().await.clone();
                let config = load_server_config();
                let status = SshServerStatus {
                    running,
                    port: config.port,
                    active_sessions: 0,
                    logs,
                };
                Ok(serde_json::to_value(&status).unwrap_or_default())
            }
            "clx.ssh.startServer" => {
                let mut running = self.running.lock().await;
                *running = true;
                let mut logs = self.logs.lock().await;
                let config = load_server_config();
                logs.push(format!("SSH server started on port {}", config.port));
                Ok(serde_json::json!({ "started": true }))
            }
            "clx.ssh.stopServer" => {
                let mut running = self.running.lock().await;
                *running = false;
                let mut logs = self.logs.lock().await;
                logs.push("SSH server stopped".to_string());
                Ok(serde_json::json!({ "stopped": true }))
            }
            _ => Err(format!("Unknown ssh method: {}", method)),
        }
    }
}
