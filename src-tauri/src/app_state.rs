use std::sync::Arc;

use crate::{
    commands::api_proxy::{ApiProxyState, SharedApiProxyState},
    core::{
        cli_registry::CliRegistry,
        project_store::ProjectStore, quickapp_registry::QuickAppRegistry,
    },
    terminal::session_manager::SessionManager,
};

pub struct AppState {
    pub api_proxy: SharedApiProxyState,
    pub registry: Arc<CliRegistry>,
    pub project_store: Arc<ProjectStore>,
    pub session_manager: Arc<SessionManager>,
    pub quickapps: Arc<QuickAppRegistry>,
    pub ssh_server_manager: Arc<std::sync::Mutex<crate::core::ssh_server::SshServerManager>>,
}

impl AppState {
    pub fn new() -> Result<Self, String> {
        let registry = Arc::new(CliRegistry::new().map_err(|error| error.to_string())?);
        let project_store =
            Arc::new(ProjectStore::new(&registry).map_err(|error| error.to_string())?);
        let quickapps = Arc::new(QuickAppRegistry::new().map_err(|error| error.to_string())?);

        Ok(Self {
            registry,
            project_store,
            session_manager: Arc::new(SessionManager::new()),
            quickapps,
            api_proxy: Arc::new(ApiProxyState::new()),
            ssh_server_manager: Arc::new(std::sync::Mutex::new(crate::core::ssh_server::SshServerManager::new())),
        })
    }
}
