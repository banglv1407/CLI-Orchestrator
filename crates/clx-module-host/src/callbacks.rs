//! Module host callbacks for reverse-RPC and events from sidecars.

use async_trait::async_trait;
use serde_json::Value;

/// Callback interface for sidecar-to-Core reverse RPC calls and notifications.
/// Implemented by Core (AppState/Tauri) and injected into ModuleHost.
#[async_trait]
pub trait CoreHostCallbacks: Send + Sync + 'static {
    /// Handle a reverse-RPC call from a sidecar (e.g. `core.listClis`, `core.createSession`).
    async fn dispatch_core_call(
        &self,
        module_id: &str,
        method: &str,
        params: Value,
    ) -> Result<Value, String>;

    /// Handle a notification/event emitted by a sidecar (e.g. `companion.streamEvent`).
    async fn emit_event(&self, module_id: &str, event_name: &str, payload: Value);
}

/// No-op implementation for standalone/test environments.
pub struct NoopHostCallbacks;

#[async_trait]
impl CoreHostCallbacks for NoopHostCallbacks {
    async fn dispatch_core_call(
        &self,
        _module_id: &str,
        method: &str,
        _params: Value,
    ) -> Result<Value, String> {
        Err(format!("no Core callback dispatcher registered for {method}"))
    }

    async fn emit_event(&self, _module_id: &str, _event_name: &str, _payload: Value) {}
}
