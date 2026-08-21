use crate::catalog::Catalog;
use crate::config::{CompanionConfig, CompanionConfigUpdate, CompanionConfigView};
use crate::db::CompanionDb;
use crate::manager::CompanionManager;
use serde_json::Value;
use std::sync::Arc;

pub struct CompanionService {
    pub manager: Arc<CompanionManager>,
}

impl CompanionService {
    pub fn new(db_path: &std::path::Path) -> Result<Self, String> {
        let manager = Arc::new(CompanionManager::new(db_path)?);
        Ok(Self { manager })
    }

    pub async fn dispatch(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.ai-companion.getCatalog" => {
                let catalog = Catalog::load()?;
                let compact = catalog.compact_index();
                Ok(serde_json::json!({
                    "features": catalog.features,
                    "compactIndex": compact,
                }))
            }
            "clx.ai-companion.helpSearch" => {
                let query = params
                    .get("query")
                    .and_then(Value::as_str)
                    .unwrap_or("");
                let catalog = Catalog::load()?;
                let results = catalog.search(query);
                Ok(serde_json::to_value(results).unwrap_or_default())
            }
            "clx.ai-companion.getConfig" => {
                let config = self.manager.config.read().await;
                let view = CompanionConfigView::from(&*config);
                Ok(serde_json::to_value(&view).unwrap_or_default())
            }
            "clx.ai-companion.saveConfig" => {
                let update: CompanionConfigUpdate =
                    serde_json::from_value(params).map_err(|e| e.to_string())?;
                let mut config = self.manager.config.write().await;
                config.apply_update(&update);
                config.save().map_err(|e| e.to_string())?;
                let view = CompanionConfigView::from(&*config);
                Ok(serde_json::to_value(&view).unwrap_or_default())
            }
            "clx.ai-companion.getHistory" => {
                let messages = self
                    .manager
                    .db
                    .get_history("default", 200)
                    .map_err(|e| e.to_string())?;
                Ok(serde_json::to_value(&messages).unwrap_or_default())
            }
            "clx.ai-companion.clearHistory" => {
                self.manager
                    .db
                    .clear_conversation("default")
                    .map_err(|e| e.to_string())?;
                Ok(Value::Null)
            }
            "clx.ai-companion.send" => {
                let message = params
                    .get("message")
                    .and_then(Value::as_str)
                    .ok_or("message required")?
                    .to_string();
                let tools_enabled = params
                    .get("toolsEnabled")
                    .and_then(Value::as_bool)
                    .unwrap_or(true);
                let run_id = uuid::Uuid::new_v4().to_string();
                let mgr = self.manager.clone();
                let rid = run_id.clone();
                tokio::spawn(async move {
                    let messages = vec![serde_json::json!({
                        "role": "user",
                        "content": message,
                    })];
                    let _ = mgr.run(&rid, messages, tools_enabled).await;
                });
                Ok(serde_json::json!({ "runId": run_id }))
            }
            "clx.ai-companion.cancel" => {
                let _run_id = params
                    .get("runId")
                    .and_then(Value::as_str)
                    .unwrap_or("");
                self.manager.cancel(_run_id).await?;
                Ok(Value::Null)
            }
            "clx.ai-companion.pollEvents" => {
                let events = self.manager.poll_events().await;
                Ok(serde_json::to_value(&events).unwrap_or_default())
            }
            "clx.ai-companion.setActionsEnabled" => {
                let enabled = params
                    .get("enabled")
                    .and_then(Value::as_bool)
                    .unwrap_or(true);
                let mut config = self.manager.config.write().await;
                config.actions_enabled = enabled;
                config.save().map_err(|e| e.to_string())?;
                Ok(Value::Null)
            }
            _ => Err(format!("Unknown method: {method}")),
        }
    }
}
