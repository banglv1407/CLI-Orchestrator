use std::sync::Arc;

use crate::{
    commands::api_proxy::{ApiProxyState, SharedApiProxyState},
    core::{
        account_manager::AccountManager, cass_index::CassIndex, cli_registry::CliRegistry,
        project_store::ProjectStore, quickapp_registry::QuickAppRegistry,
    },
    terminal::session_manager::SessionManager,
};

pub struct AppState {
    pub api_proxy: SharedApiProxyState,
    pub registry: Arc<CliRegistry>,
    pub project_store: Arc<ProjectStore>,
    pub session_manager: Arc<SessionManager>,
    pub account_manager: Arc<AccountManager>,
    pub cass_index: Arc<CassIndex>,
    pub quickapps: Arc<QuickAppRegistry>,
    pub ssh_server_manager: Arc<std::sync::Mutex<crate::core::ssh_server::SshServerManager>>,
}

impl AppState {
    pub fn new() -> Result<Self, String> {
        let registry = Arc::new(CliRegistry::new().map_err(|error| error.to_string())?);
        let project_store =
            Arc::new(ProjectStore::new(&registry).map_err(|error| error.to_string())?);
        let account_manager = Arc::new(AccountManager::new().map_err(|error| error.to_string())?);
        let cass_index = Arc::new(CassIndex::new().map_err(|error| error.to_string())?);
        let quickapps = Arc::new(QuickAppRegistry::new().map_err(|error| error.to_string())?);

        Ok(Self {
            registry,
            project_store,
            session_manager: Arc::new(SessionManager::new()),
            account_manager,
            cass_index,
            quickapps,
            api_proxy: Arc::new(ApiProxyState::new()),
            ssh_server_manager: Arc::new(std::sync::Mutex::new(crate::core::ssh_server::SshServerManager::new())),
        })
    }
}
