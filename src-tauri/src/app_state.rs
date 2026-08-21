use std::sync::Arc;

use crate::{
    core::{
        cli_registry::CliRegistry,
        module_host::ModuleHost,
        monitoring::MonitorManager,
        project_store::ProjectStore,
        system_log::SystemLogger,
    },
    terminal::session_manager::SessionManager,
};

pub struct AppState {
    pub registry: Arc<CliRegistry>,
    pub project_store: Arc<ProjectStore>,
    pub session_manager: Arc<SessionManager>,
    pub logger: Arc<SystemLogger>,
    pub monitoring: Arc<MonitorManager>,
    pub modules: Arc<ModuleHost>,
}

impl AppState {
    pub fn new() -> Result<Self, String> {
        let registry = Arc::new(CliRegistry::new().map_err(|error| error.to_string())?);
        let project_store =
            Arc::new(ProjectStore::new(&registry).map_err(|error| error.to_string())?);
        let logger = Arc::new(SystemLogger::new(registry.data_dirs().logs_dir));
        let monitoring = Arc::new(MonitorManager::new(registry.data_dirs().root_dir.clone())?);
        let session_manager = Arc::new(SessionManager::new());

        let bridge = Arc::new(crate::core::module_callbacks::CoreModuleBridge::new(
            registry.clone(),
            session_manager.clone(),
        ));
        let modules = Arc::new(ModuleHost::for_current_install_with_callbacks(
            &registry.data_dirs().root_dir,
            env!("CARGO_PKG_VERSION"),
            bridge,
        )?);

        Ok(Self {
            registry: registry.clone(),
            project_store,
            session_manager: session_manager.clone(),
            logger,
            monitoring,
            modules,
        })
    }
}
