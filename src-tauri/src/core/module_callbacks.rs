use async_trait::async_trait;
use clx_module_host::CoreHostCallbacks;
use serde_json::Value;
use std::sync::Arc;
use tauri::Emitter;
use tokio::sync::RwLock;

use crate::core::cli_registry::CliRegistry;
use crate::terminal::session_manager::SessionManager;

/// Bridge connecting module host reverse RPC and events to Core services and Tauri.
pub struct CoreModuleBridge {
    app_handle: Arc<RwLock<Option<tauri::AppHandle>>>,
    registry: Arc<CliRegistry>,
    session_manager: Arc<SessionManager>,
}

impl CoreModuleBridge {
    pub fn new(
        registry: Arc<CliRegistry>,
        session_manager: Arc<SessionManager>,
    ) -> Self {
        Self {
            app_handle: Arc::new(RwLock::new(None)),
            registry,
            session_manager,
        }
    }

    pub fn set_app_handle(&self, handle: tauri::AppHandle) {
        let app_handle = self.app_handle.clone();
        tokio::spawn(async move {
            *app_handle.write().await = Some(handle);
        });
    }
}

#[async_trait]
impl CoreHostCallbacks for CoreModuleBridge {
    async fn dispatch_core_call(
        &self,
        module_id: &str,
        method: &str,
        params: Value,
    ) -> Result<Value, String> {
        match method {
            "core.listClis" => {
                let clis = self.registry.list().map_err(|e| e.to_string())?;
                serde_json::to_value(clis).map_err(|e| e.to_string())
            }
            "core.listSessions" => {
                let sessions = self.session_manager.list_sessions().await;
                serde_json::to_value(sessions).map_err(|e| e.to_string())
            }
            "core.stopSession" => {
                let session_id = params
                    .get("sessionId")
                    .and_then(Value::as_str)
                    .ok_or("sessionId required")?;
                let app = self.app_handle.read().await;
                let app = app.as_ref().ok_or("App handle unavailable")?;
                self.session_manager
                    .stop_session(app, session_id)
                    .await
                    .map_err(|e| e.to_string())?;
                Ok(serde_json::json!({ "stopped": session_id }))
            }
            "core.emitUiEffect" => {
                let effect_type = params
                    .get("effectType")
                    .and_then(Value::as_str)
                    .unwrap_or("");
                let target_id = params
                    .get("targetId")
                    .and_then(Value::as_str)
                    .unwrap_or("");
                let app = self.app_handle.read().await;
                if let Some(handle) = app.as_ref() {
                    let _ = handle.emit(
                        "ui-effect",
                        serde_json::json!({
                            "effectType": effect_type,
                            "targetId": target_id,
                            "moduleId": module_id,
                        }),
                    );
                }
                Ok(Value::Null)
            }
            _ => Err(format!("unknown core method: {method}")),
        }
    }

    async fn emit_event(&self, _module_id: &str, event_name: &str, payload: Value) {
        let app = self.app_handle.read().await;
        if let Some(handle) = app.as_ref() {
            let _ = handle.emit(event_name, payload);
        }
    }
}
