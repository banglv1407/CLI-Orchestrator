use serde::{Deserialize, Serialize};
use tauri::State;

use crate::app_state::AppState;
use crate::companion::catalog::{Catalog, FeatureEntry};
use crate::companion::config::{CompanionConfigUpdate, CompanionConfigView};
use crate::companion::db::CompanionMessageRecord;
use crate::companion::safe_context::SafeAppContext;

// ── Catalog commands ────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CatalogResponse {
    pub features: Vec<FeatureEntry>,
    pub compact_index: String,
}

#[tauri::command]
pub async fn companion_get_catalog() -> Result<CatalogResponse, String> {
    let catalog = Catalog::load()?;
    let compact_index = catalog.compact_index();
    Ok(CatalogResponse {
        features: catalog.features,
        compact_index,
    })
}

#[tauri::command]
pub async fn companion_help_search(query: String) -> Result<Vec<FeatureEntry>, String> {
    let catalog = Catalog::load()?;
    let results = catalog.search(&query);
    Ok(results.into_iter().cloned().collect())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HelpDetail {
    pub feature_id: String,
    pub title: String,
    pub help: String,
    pub summary: String,
    pub how_to_open: String,
    pub availability: String,
    pub limitations: Vec<String>,
    pub tool_exposure: String,
    pub backend_commands: Vec<String>,
}

#[tauri::command]
pub async fn companion_get_help(feature_id: String) -> Result<HelpDetail, String> {
    let catalog = Catalog::load()?;
    let feature = catalog
        .find_by_id(&feature_id)
        .ok_or_else(|| format!("Feature not found: {}", feature_id))?;
    Ok(HelpDetail {
        feature_id: feature.feature_id.clone(),
        title: feature.title.clone(),
        help: feature.help.clone(),
        summary: feature.summary.clone(),
        how_to_open: feature.open_instruction(),
        availability: feature.availability.clone(),
        limitations: feature.limitations.clone(),
        tool_exposure: feature.tool_exposure_label().to_string(),
        backend_commands: feature.backend_commands.clone(),
    })
}

#[tauri::command]
pub async fn companion_get_safe_context(
    state: State<'_, AppState>,
) -> Result<SafeAppContext, String> {
    let cli_profiles: Vec<String> = state
        .registry
        .list()
        .map_err(|e| e.to_string())?
        .into_iter()
        .map(|c| c.name)
        .collect();
    let proxy_status = state.proxy_server.status().await;
    let proxy_backend_names: Vec<String> = {
        let config = state.proxy_server.state.config.read().await;
        config.backends.iter().map(|b| b.name.clone()).collect()
    };
    let ssh_profiles: Vec<String> = {
        let file_path = state.registry.data_dirs().root_dir.join("ssh_connections.json");
        if let Ok(content) = std::fs::read_to_string(&file_path) {
            #[derive(serde::Deserialize)]
            struct SshConn {
                name: String,
            }
            serde_json::from_str::<Vec<SshConn>>(&content)
                .map(|conns| conns.into_iter().map(|c| c.name).collect())
                .unwrap_or_default()
        } else {
            Vec::new()
        }
    };
    let quick_apps: Vec<String> = state
        .quickapps
        .list()
        .map_err(|e| e.to_string())?
        .into_iter()
        .map(|a| a.name)
        .collect();
    let session_count = state.session_manager.list_sessions().await.len();
    let builtin_llm_loaded = state
        .builtin_llm
        .try_lock()
        .map(|l| l.is_loaded())
        .unwrap_or(false);
    let config = state.companion.config.read().await;
    let actions_enabled = config.actions_enabled;
    drop(config);

    Ok(SafeAppContext {
        active_view: None,
        selected_cli: None,
        workspace_path: None,
        project_tag: None,
        active_sessions: session_count,
        cli_profiles,
        proxy_backend_names,
        proxy_running: proxy_status.running,
        proxy_port: if proxy_status.running {
            Some(proxy_status.port)
        } else {
            None
        },
        ssh_profiles,
        quick_apps,
        builtin_llm_loaded,
        actions_enabled,
    })
}

// ── Chat commands ───────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompanionSendResponse {
    pub run_id: String,
}

#[tauri::command]
pub async fn companion_send(
    message: String,
    state: State<'_, AppState>,
) -> Result<CompanionSendResponse, String> {
    let run_id = uuid::Uuid::new_v4().to_string();

    // Save user message
    let user_msg = CompanionMessageRecord {
        id: 0,
        conversation_id: "default".to_string(),
        run_id: run_id.clone(),
        role: "user".to_string(),
        content: message.clone(),
        status: "complete".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    };
    let _ = state.companion.db.add_message(&user_msg);

    // Build messages array for model
    let history = state.companion.db.get_history("default", 50)?;
    let mut messages: Vec<serde_json::Value> = Vec::new();

    // System prompt
    let config = state.companion.config.read().await;
    let safe_ctx = crate::companion::safe_context::SafeAppContext::empty(); // TODO: build real context
    let system_prompt = state
        .companion
        .build_system_prompt(&config.custom_prompt, &safe_ctx);
    messages.push(serde_json::json!({
        "role": "system",
        "content": system_prompt
    }));

    // History (last 20 messages)
    for msg in history.iter().rev().take(20).rev() {
        if msg.role == "user" || msg.role == "assistant" {
            messages.push(serde_json::json!({
                "role": msg.role,
                "content": msg.content
            }));
        }
    }

    let actions_enabled = config.actions_enabled;
    drop(config);

    // Spawn the run in background — emit events
    let companion = state.companion.clone();
    let run_id_clone = run_id.clone();
    tauri::async_runtime::spawn(async move {
        let _ = companion
            .run(&run_id_clone, messages, actions_enabled)
            .await;
    });

    Ok(CompanionSendResponse { run_id })
}

#[tauri::command]
pub async fn companion_cancel(
    run_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state.companion.cancel(&run_id).await
}

#[tauri::command]
pub async fn companion_get_config(
    state: State<'_, AppState>,
) -> Result<CompanionConfigView, String> {
    let config = state.companion.config.read().await;
    Ok(CompanionConfigView::from(&*config))
}

#[tauri::command]
pub async fn companion_save_config(
    update: CompanionConfigUpdate,
    state: State<'_, AppState>,
) -> Result<CompanionConfigView, String> {
    let mut config = state.companion.config.write().await;

    if let Some(v) = update.base_url {
        config.base_url = v;
    }
    if let Some(v) = update.model {
        config.model = v;
    }
    if let Some(v) = update.api_key {
        if !v.is_empty() {
            config.api_key = v;
        }
    }
    if update.clear_api_key == Some(true) {
        config.api_key = String::new();
    }
    if let Some(v) = update.stream_enabled {
        config.stream = v;
    }
    if let Some(v) = update.custom_prompt {
        config.custom_prompt = v;
    }
    if let Some(headers) = update.custom_headers {
        for (k, v) in headers {
            config.custom_headers.insert(k, v);
        }
    }
    if let Some(clear) = update.clear_custom_headers {
        for name in clear {
            config.custom_headers.remove(&name);
        }
    }
    if let Some(v) = update.actions_enabled {
        config.actions_enabled = v;
    }
    if let Some(v) = update.reasoning_effort {
        config.reasoning_effort = if v.trim().is_empty() { None } else { Some(v) };
    }

    config.save()?;
    Ok(CompanionConfigView::from(&*config))
}

#[tauri::command]
pub async fn companion_get_history(
    state: State<'_, AppState>,
) -> Result<Vec<CompanionMessageRecord>, String> {
    state.companion.db.get_history("default", 100)
}

#[tauri::command]
pub async fn companion_clear_history(state: State<'_, AppState>) -> Result<(), String> {
    state.companion.db.clear_conversation("default")
}

#[tauri::command]
pub async fn companion_set_actions_enabled(
    enabled: bool,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut config = state.companion.config.write().await;
    config.actions_enabled = enabled;
    config.save()
}

// ── Legacy migration ────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegacyImportPayload {
    pub endpoint: String,
    pub model: String,
    pub api_key: String,
    pub headers: std::collections::HashMap<String, String>,
    pub system_prompt: String,
    pub stream: bool,
    pub history: Vec<LegacyChatMessage>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegacyChatMessage {
    pub role: String,
    pub content: String,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MigrationResult {
    pub config_imported: bool,
    pub history_imported: usize,
    pub errors: Vec<String>,
}

#[tauri::command]
pub async fn companion_import_legacy(
    legacy: LegacyImportPayload,
    state: State<'_, AppState>,
) -> Result<MigrationResult, String> {
    let mut result = MigrationResult {
        config_imported: false,
        history_imported: 0,
        errors: Vec::new(),
    };

    // Import config if not already configured
    {
        let config = state.companion.config.read().await;
        if config.api_key.is_empty() && config.base_url == "https://api.openai.com/v1" {
            drop(config);
            let mut config = state.companion.config.write().await;
            config.base_url = legacy.endpoint;
            config.model = legacy.model;
            config.api_key = legacy.api_key;
            config.custom_headers = legacy.headers;
            config.custom_prompt = legacy.system_prompt;
            config.stream = legacy.stream;
            if let Err(e) = config.save() {
                result.errors.push(format!("config save: {}", e));
            } else {
                result.config_imported = true;
            }
        }
    }

    // Import history — redact known secrets
    let config = state.companion.config.read().await;
    let redaction_values: Vec<&str> = vec![
        config.api_key.as_str(),
    ];

    for msg in &legacy.history {
        let mut content = msg.content.clone();
        for secret in &redaction_values {
            if !secret.is_empty() {
                content = content.replace(secret, "[REDACTED]");
            }
        }

        let record = CompanionMessageRecord {
            id: 0,
            conversation_id: "default".to_string(),
            run_id: format!("legacy-{}", uuid::Uuid::new_v4().as_simple()),
            role: msg.role.clone(),
            content,
            status: "complete".to_string(),
            timestamp: msg.timestamp.clone(),
        };

        if let Err(e) = state.companion.db.add_message(&record) {
            result.errors.push(format!("history import: {}", e));
        } else {
            result.history_imported += 1;
        }
    }

    Ok(result)
}
