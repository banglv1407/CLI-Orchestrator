use std::sync::Arc;
use serde_json::{json, Value};
use crate::server::{ProxyBackend, ProxyConfig, ProxyServer};
use crate::usage_db;

pub struct ProxyService {
    server: Arc<ProxyServer>,
}

impl ProxyService {
    pub fn new() -> Result<Self, String> {
        let _ = usage_db::init_db();
        let config = ProxyConfig::load().unwrap_or_default();
        let server = Arc::new(ProxyServer::new(config));
        Ok(Self { server })
    }

    pub async fn dispatch(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.cli-proxy.status" => {
                let status = self.server.status().await;
                serde_json::to_value(status).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.start" => {
                let status = self.server.start().await?;
                let mut config = self.server.state.config.write().await;
                config.enabled = true;
                config.save()?;
                serde_json::to_value(status).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.stop" => {
                let status = self.server.stop().await?;
                let mut config = self.server.state.config.write().await;
                config.enabled = false;
                config.save()?;
                serde_json::to_value(status).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.getConfig" => {
                let config = self.server.state.config.read().await;
                serde_json::to_value(&*config).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.saveConfig" => {
                #[derive(serde::Deserialize)]
                struct ConfigParams {
                    config: ProxyConfig,
                }
                let parsed: ConfigParams = serde_json::from_value(params).map_err(|e| e.to_string())?;
                parsed.config.save()?;
                let mut current = self.server.state.config.write().await;
                *current = parsed.config.clone();
                serde_json::to_value(&parsed.config).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.addBackend" => {
                #[derive(serde::Deserialize)]
                struct AddParams {
                    backend: ProxyBackend,
                }
                let mut parsed: AddParams = serde_json::from_value(params).map_err(|e| e.to_string())?;
                if parsed.backend.id.as_ref().map_or(true, String::is_empty) {
                    parsed.backend.id = Some(uuid::Uuid::new_v4().to_string());
                }
                let id_str = parsed.backend.id.clone().unwrap();
                let mut config = self.server.state.config.write().await;
                config.backends.retain(|b| {
                    let b_id_matches = b.id.as_ref() == Some(&id_str);
                    let b_name_matches = b.name == parsed.backend.name;
                    !b_id_matches && !b_name_matches
                });
                config.backends.push(parsed.backend);
                config.save()?;
                serde_json::to_value(&*config).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.removeBackend" => {
                #[derive(serde::Deserialize)]
                struct RemoveParams {
                    name: String,
                }
                let parsed: RemoveParams = serde_json::from_value(params).map_err(|e| e.to_string())?;
                let mut config = self.server.state.config.write().await;
                config.backends.retain(|b| b.name != parsed.name && b.id.as_ref() != Some(&parsed.name));
                config.save()?;
                serde_json::to_value(&*config).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.getLogs" => {
                let logs = self.server.state.get_logs().await;
                serde_json::to_value(logs).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.getRecentLogs" => {
                #[derive(serde::Deserialize)]
                struct RecentParams {
                    #[serde(default = "default_recent_limit")]
                    limit: Option<usize>,
                }
                fn default_recent_limit() -> Option<usize> { Some(10) }
                let parsed: RecentParams = serde_json::from_value(params).unwrap_or(RecentParams { limit: Some(10) });
                let logs = self.server.state.get_recent_logs(parsed.limit.unwrap_or(10)).await;
                serde_json::to_value(logs).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.getUsage" => {
                #[derive(serde::Deserialize)]
                struct UsageParams {
                    id: String,
                }
                let parsed: UsageParams = serde_json::from_value(params).map_err(|e| e.to_string())?;
                let usage = usage_db::get_usage(&parsed.id)?;
                serde_json::to_value(usage).map_err(|e| e.to_string())
            }
            "clx.cli-proxy.resetUsage" => {
                #[derive(serde::Deserialize)]
                struct ResetParams {
                    id: String,
                }
                let parsed: ResetParams = serde_json::from_value(params).map_err(|e| e.to_string())?;
                usage_db::reset_usage(&parsed.id)?;
                Ok(json!({}))
            }
            unknown => Err(format!("unknown proxy method: {unknown}")),
        }
    }
}
