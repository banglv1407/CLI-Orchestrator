use std::sync::Arc;

use crate::{
    core::{cli_registry::CliRegistry, project_store::ProjectStore},
    terminal::session_manager::SessionManager,
};

pub struct AppState {
    pub registry: Arc<CliRegistry>,
    pub project_store: Arc<ProjectStore>,
    pub session_manager: Arc<SessionManager>,
}

impl AppState {
    pub fn new() -> Result<Self, String> {
        let registry = Arc::new(CliRegistry::new().map_err(|error| error.to_string())?);
        let project_store =
            Arc::new(ProjectStore::new(&registry).map_err(|error| error.to_string())?);

        Ok(Self {
            registry,
            project_store,
            session_manager: Arc::new(SessionManager::new()),
        })
    }
}
