use std::sync::Arc;
use std::sync::atomic::AtomicU64;

use crate::{
    commands::api_proxy::{ApiProxyState, SharedApiProxyState},
    companion::manager::CompanionManager,
    core::{
        cli_registry::CliRegistry,
        monitoring::MonitorManager,
        project_store::ProjectStore,
        proxy_server::{ProxyConfig, ProxyServer},
        quickapp_registry::QuickAppRegistry,
        system_log::SystemLogger,
    },
    terminal::session_manager::SessionManager,
};

pub struct AppState {
    pub api_proxy: SharedApiProxyState,
    pub registry: Arc<CliRegistry>,
    pub project_store: Arc<ProjectStore>,
    pub session_manager: Arc<SessionManager>,
    pub quickapps: Arc<QuickAppRegistry>,
    pub proxy_server: Arc<ProxyServer>,
    pub logger: Arc<SystemLogger>,
    pub monitoring: Arc<MonitorManager>,
    pub ssh_server_manager: Arc<std::sync::Mutex<crate::core::ssh_server::SshServerManager>>,
    pub builtin_llm: Arc<tokio::sync::Mutex<crate::builtin_llm::engine::BuiltinLlmEngine>>,
    pub companion: Arc<CompanionManager>,
    pub web_ai_generation: AtomicU64,
    pub web_ai_operation: tokio::sync::Mutex<()>,
}

impl AppState {
    pub fn new() -> Result<Self, String> {
        let registry = Arc::new(CliRegistry::new().map_err(|error| error.to_string())?);
        let project_store =
            Arc::new(ProjectStore::new(&registry).map_err(|error| error.to_string())?);
        let quickapps = Arc::new(QuickAppRegistry::new().map_err(|error| error.to_string())?);
        let _ = crate::core::proxy_usage_db::init_db();
        let mut proxy_config = ProxyConfig::load().unwrap_or_default();
        let mut migrated = false;
        for backend in &mut proxy_config.backends {
            if backend.id.is_none() || backend.id.as_ref().unwrap().is_empty() {
                backend.id = Some(uuid::Uuid::new_v4().to_string());
                migrated = true;
            }
        }
        if migrated {
            let _ = proxy_config.save();
        }
        let proxy_server = Arc::new(ProxyServer::new(proxy_config));
        let logger = Arc::new(SystemLogger::new(registry.data_dirs().logs_dir));
        let monitoring = Arc::new(MonitorManager::new(registry.data_dirs().root_dir.clone())?);

        let builtin_config = crate::builtin_llm::config::BuiltinLlmConfig::load();
        let mut builtin_llm_engine =
            crate::builtin_llm::engine::BuiltinLlmEngine::new(builtin_config.clone());
        if builtin_config.enabled {
            if let Err(e) = builtin_llm_engine.load_model() {
                eprintln!("Failed to auto-load built-in LLM: {}", e);
            }
        }
        let builtin_llm = Arc::new(tokio::sync::Mutex::new(builtin_llm_engine));

        let session_manager = Arc::new(SessionManager::new());

        let companion_db_path = registry.data_dirs().root_dir.join("companion.db");
        let companion = Arc::new(CompanionManager::new(&companion_db_path)?);

        Ok(Self {
            registry: registry.clone(),
            project_store,
            session_manager: session_manager.clone(),
            quickapps: quickapps.clone(),
            api_proxy: Arc::new(ApiProxyState::new()),
            proxy_server: proxy_server.clone(),
            logger,
            monitoring,
            ssh_server_manager: Arc::new(std::sync::Mutex::new(
                crate::core::ssh_server::SshServerManager::new(),
            )),
            builtin_llm,
            companion,
            web_ai_generation: AtomicU64::new(0),
            web_ai_operation: tokio::sync::Mutex::new(()),
        })
    }
}
