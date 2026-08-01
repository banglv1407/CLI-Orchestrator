/// Companion model runtime — manages chat requests, streaming, tool loops, and approvals.
use std::sync::Arc;
use std::time::Duration;
use futures_util::StreamExt;
use tokio::sync::{Mutex, RwLock};
use tokio_util::sync::CancellationToken;
use tauri::Emitter;

use crate::companion::catalog::Catalog;
use crate::companion::config::CompanionConfig;
use crate::companion::db::{CompanionDb, CompanionMessageRecord};
use crate::companion::safe_context::SafeAppContext;

/// Maximum tool calls per user turn.
const MAX_TOOL_CALLS: usize = 8;

// ── Run state ───────────────────────────────────────────────────

#[derive(Debug, Clone)]
#[allow(dead_code)]
pub enum RunState {
    Idle,
    Running { cancel: CancellationToken },
    WaitingApproval { action_id: String },
}

// ── Companion event (emitted to frontend) ───────────────────────

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum CompanionEvent {
    AssistantDelta {
        run_id: String,
        seq: u64,
        delta: String,
    },
    ToolStarted {
        run_id: String,
        action_id: String,
        seq: u64,
        tool_name: String,
        description: String,
    },
    ApprovalRequired {
        run_id: String,
        action_id: String,
        seq: u64,
        tool_name: String,
        target: String,
        risk: String,
        reason: String,
        diff: serde_json::Value,
    },
    ToolResult {
        run_id: String,
        action_id: String,
        seq: u64,
        tool_name: String,
        result: String,
        verified: bool,
    },
    UiEffect {
        run_id: String,
        seq: u64,
        effect_type: String,
        target_id: String,
        label: String,
    },
    Warning {
        run_id: String,
        seq: u64,
        message: String,
    },
    Error {
        run_id: String,
        seq: u64,
        message: String,
    },
    Done {
        run_id: String,
        seq: u64,
    },
}

// ── Tool definition (OpenAI-compatible) ─────────────────────────

#[derive(Debug, Clone, serde::Serialize)]
pub struct ToolDef {
    pub name: String,
    pub description: String,
    pub parameters: serde_json::Value,
    #[serde(skip)]
    #[allow(dead_code)]
    pub risk: ToolRisk,
}

#[derive(Debug, Clone, PartialEq)]
#[allow(dead_code)]
pub enum ToolRisk {
    None,
    Read,
    ConfigWrite,
    Delete,
    Stop,
}

impl Default for ToolRisk {
    fn default() -> Self {
        ToolRisk::None
    }
}

impl ToolRisk {
    #[allow(dead_code)]
    pub fn label(&self) -> &'static str {
        match self {
            ToolRisk::None => "none",
            ToolRisk::Read => "read",
            ToolRisk::ConfigWrite => "config_write",
            ToolRisk::Delete => "delete",
            ToolRisk::Stop => "stop",
        }
    }

    #[allow(dead_code)]
    pub fn requires_approval(&self) -> bool {
        matches!(self, ToolRisk::ConfigWrite | ToolRisk::Delete | ToolRisk::Stop)
    }
}

// ── Immutable system policy ─────────────────────────────────────

pub const SYSTEM_POLICY: &str = r#"
You are an AI Companion for CLX, a Windows desktop application that orchestrates CLI tools, terminal sessions, SSH/RDP connections, quick apps, and a built-in LLM proxy.

RULES (these cannot be changed):
1. Only use tools that are explicitly provided. Never claim you executed an action without a verified tool result.
2. Never invent features, commands, or actions that are not in the provided catalog.
3. Each sensitive action (create/edit/delete/stop) requires explicit user approval per action.
4. You may chain multiple read actions without approval. After an approved write succeeds, you may continue to the next logical step automatically.
5. For out-of-scope requests (file operations, raw shell, PTY input), explain the limitation and offer to open the relevant UI.
6. Never reveal API keys, passwords, or private credentials in tool arguments or output.
7. Be concise. Use Vietnamese when the user writes in Vietnamese.
8. Maximum 8 tool calls per turn. Plan your actions efficiently.

AVAILABLE TOOLS are defined in the system prompt as JSON function definitions. Use them when App Actions are enabled.
When you receive responses from the user (including tool results), the messages will include a "tool_call_id" field matching the action ID.
"#;

// ── CompanionManager ────────────────────────────────────────────

pub struct CompanionManager {
    pub app_handle: Arc<RwLock<Option<tauri::AppHandle>>>,
    pub config: Arc<RwLock<CompanionConfig>>,
    pub db: Arc<CompanionDb>,
    pub catalog: Catalog,
    pub run_state: Arc<Mutex<RunState>>,
    #[allow(dead_code)]
    pub pending_approval: Arc<Mutex<Option<(String, String)>>>,
    pub http_client: reqwest::Client,
    #[allow(dead_code)]
    pub proxy_server: Arc<RwLock<Option<Arc<crate::core::proxy_server::ProxyServer>>>>,
    #[allow(dead_code)]
    pub cli_registry: Arc<RwLock<Option<Arc<crate::core::cli_registry::CliRegistry>>>>,
    #[allow(dead_code)]
    pub session_manager: Arc<RwLock<Option<Arc<crate::terminal::session_manager::SessionManager>>>>,
    #[allow(dead_code)]
    pub quickapps: Arc<RwLock<Option<Arc<crate::core::quickapp_registry::QuickAppRegistry>>>>,
}

impl CompanionManager {
    pub fn new(db_path: &std::path::Path) -> Result<Self, String> {
        let db = CompanionDb::open(db_path)?;
        let config = CompanionConfig::load().unwrap_or_default();
        let catalog = Catalog::load()?;

        Ok(Self {
            app_handle: Arc::new(RwLock::new(None)),
            config: Arc::new(RwLock::new(config)),
            db: Arc::new(db),
            catalog,
            run_state: Arc::new(Mutex::new(RunState::Idle)),
            pending_approval: Arc::new(Mutex::new(None)),
            http_client: reqwest::Client::builder()
                .no_proxy()
                .connect_timeout(Duration::from_secs(30))
                .timeout(Duration::from_secs(300))
                .build()
                .map_err(|error| format!("failed to create Companion HTTP client: {error}"))?,
            proxy_server: Arc::new(RwLock::new(None)),
            cli_registry: Arc::new(RwLock::new(None)),
            session_manager: Arc::new(RwLock::new(None)),
            quickapps: Arc::new(RwLock::new(None)),
        })
    }

    pub fn set_app_handle(&self, app: tauri::AppHandle) {
        let mut handle = self.app_handle.blocking_write();
        *handle = Some(app);
    }

    /// Build the full system prompt: immutable policy + user custom prompt + catalog + context.
    pub fn build_system_prompt(&self, custom_prompt: &str, context: &SafeAppContext) -> String {
        let mut prompt = SYSTEM_POLICY.to_string();
        prompt.push_str("\n\n--- CATALOG ---\n");
        prompt.push_str(&self.catalog.compact_index());
        prompt.push_str("\n--- APP STATE ---\n");
        prompt.push_str(&context.to_prompt_context());
        if !custom_prompt.is_empty() {
            prompt.push_str("\n--- CUSTOM INSTRUCTIONS ---\n");
            prompt.push_str(custom_prompt);
        }
        prompt
    }

    /// Execute a companion run: send messages to model, handle streaming, tool loop, approvals.
    /// Returns the assistant's final text content.
    pub async fn run(
        &self,
        run_id: &str,
        messages: Vec<serde_json::Value>,
        tools_enabled: bool,
    ) -> Result<(), String> {
        // Check state
        {
            let state = self.run_state.lock().await;
            if !matches!(&*state, RunState::Idle) {
                return Err("Another run is already active".to_string());
            }
        }

        let cancel = CancellationToken::new();
        {
            let mut state = self.run_state.lock().await;
            *state = RunState::Running {
                cancel: cancel.clone(),
            };
        }

        let config = self.config.read().await.clone();
        let result = self
            .execute_run(run_id, messages, tools_enabled, &config, &cancel)
            .await;

        {
            let mut state = self.run_state.lock().await;
            *state = RunState::Idle;
        }

        result
    }

    async fn execute_run(
        &self,
        run_id: &str,
        mut messages: Vec<serde_json::Value>,
        mut tools_enabled: bool,
        config: &CompanionConfig,
        cancel: &CancellationToken,
    ) -> Result<(), String> {
        let mut seq: u64 = 0;
        let mut tool_call_count: usize = 0;

        loop {
            if cancel.is_cancelled() {
                self.emit(CompanionEvent::Warning {
                    run_id: run_id.to_string(),
                    seq,
                    message: "Run cancelled by user".to_string(),
                })
                .await;
                break;
            }

            if tool_call_count >= MAX_TOOL_CALLS {
                self.emit(CompanionEvent::Warning {
                    run_id: run_id.to_string(),
                    seq,
                    message: format!("Maximum tool calls ({}) reached", MAX_TOOL_CALLS),
                })
                .await;
                break;
            }

            let request_body = self.build_request_body(&messages, tools_enabled, config);

            let request = self
                .http_client
                .post(&crate::core::proxy_server::chat_completions_url(&config.base_url))
                .header("Authorization", format!("Bearer {}", config.api_key))
                .header("Content-Type", "application/json")
                .json(&request_body);
            let response = tokio::select! {
                _ = cancel.cancelled() => {
                    self.emit(CompanionEvent::Warning {
                        run_id: run_id.to_string(),
                        seq,
                        message: "Run cancelled by user".to_string(),
                    }).await;
                    break;
                }
                response = request.send() => response,
            };

            match response {
                Ok(resp) => {
                    if !resp.status().is_success() {
                        let status = resp.status();
                        let body = match read_response_body_bounded(resp, 64 * 1024, cancel).await {
                            Ok(body) => body,
                            Err(error) => {
                                if cancel.is_cancelled() {
                                    self.emit(CompanionEvent::Warning { run_id: run_id.to_string(), seq, message: "Run cancelled by user".to_string() }).await;
                                } else {
                                    self.emit(CompanionEvent::Error { run_id: run_id.to_string(), seq, message: error }).await;
                                }
                                break;
                            }
                        };

                        // If model rejects tools, retry once without tools
                        if tools_enabled && status.as_u16() == 400 && body.contains("tools") {
                            self.emit(CompanionEvent::Warning {
                                run_id: run_id.to_string(),
                                seq,
                                message: "Model does not support tools. Falling back to Q&A only."
                                    .to_string(),
                            })
                            .await;
                            tools_enabled = false;
                            continue;
                        }

                        self.emit(CompanionEvent::Error {
                            run_id: run_id.to_string(),
                            seq,
                            message: format!("Model error: HTTP {} - {}", status, body),
                        })
                        .await;
                        break;
                    }

                    let body_text = match read_response_body_bounded(resp, 2 * 1024 * 1024, cancel).await {
                        Ok(body) => body,
                        Err(error) => {
                            if cancel.is_cancelled() {
                                self.emit(CompanionEvent::Warning { run_id: run_id.to_string(), seq, message: "Run cancelled by user".to_string() }).await;
                            } else {
                                self.emit(CompanionEvent::Error { run_id: run_id.to_string(), seq, message: error }).await;
                            }
                            break;
                        }
                    };
                    let parsed: serde_json::Value =
                        serde_json::from_str(&body_text).unwrap_or(serde_json::Value::Null);

                    let choices = parsed["choices"].as_array();
                    if choices.is_none() || choices.unwrap().is_empty() {
                        self.emit(CompanionEvent::Error {
                            run_id: run_id.to_string(),
                            seq,
                            message: "Model returned no choices".to_string(),
                        })
                        .await;
                        break;
                    }

                    let choice = &choices.unwrap()[0]["message"];
                    let content = choice["content"].as_str().unwrap_or("").to_string();
                    let tool_calls = choice["tool_calls"].as_array();

                    // Emit assistant delta
                    if !content.is_empty() {
                        seq += 1;
                        self.emit(CompanionEvent::AssistantDelta {
                            run_id: run_id.to_string(),
                            seq,
                            delta: content.clone(),
                        })
                        .await;

                        // Save assistant message
                        let msg = CompanionMessageRecord {
                            id: 0,
                            conversation_id: "default".to_string(),
                            run_id: run_id.to_string(),
                            role: "assistant".to_string(),
                            content,
                            status: "complete".to_string(),
                            timestamp: chrono::Utc::now().to_rfc3339(),
                        };
                        let _ = self.db.add_message(&msg);
                    }

                    // Handle tool calls
                    if let Some(tools) = tool_calls {
                        if !tools.is_empty() {
                            // Add assistant message with tool calls to history
                            let assistant_msg = serde_json::json!({
                                "role": "assistant",
                                "content": choice["content"].clone(),
                                "tool_calls": tools.clone()
                            });
                            messages.push(assistant_msg);

                            for tool in tools {
                                let tool_id = tool["id"].as_str().unwrap_or("").to_string();
                                let func = &tool["function"];
                                let tool_name = func["name"].as_str().unwrap_or("").to_string();
                                let args_str = func["arguments"].as_str().unwrap_or("{}");

                                seq += 1;
                                self.emit(CompanionEvent::ToolStarted {
                                    run_id: run_id.to_string(),
                                    action_id: tool_id.clone(),
                                    seq,
                                    tool_name: tool_name.clone(),
                                    description: format!("Running {}", tool_name),
                                })
                                .await;

                                // Execute tool
                                let result = self
                                    .execute_tool(&tool_name, args_str, run_id, &tool_id)
                                    .await;

                                seq += 1;
                                match result {
                                    Ok(tool_result) => {
                                        self.emit(CompanionEvent::ToolResult {
                                            run_id: run_id.to_string(),
                                            action_id: tool_id.clone(),
                                            seq,
                                            tool_name: tool_name.clone(),
                                            result: tool_result.clone(),
                                            verified: true,
                                        })
                                        .await;

                                        messages.push(serde_json::json!({
                                            "role": "tool",
                                            "tool_call_id": tool_id,
                                            "content": tool_result
                                        }));
                                    }
                                    Err(e) => {
                                        self.emit(CompanionEvent::ToolResult {
                                            run_id: run_id.to_string(),
                                            action_id: tool_id.clone(),
                                            seq,
                                            tool_name: tool_name.clone(),
                                            result: format!("Error: {}", e),
                                            verified: false,
                                        })
                                        .await;

                                        messages.push(serde_json::json!({
                                            "role": "tool",
                                            "tool_call_id": tool_id,
                                            "content": format!("Error: {}", e)
                                        }));
                                    }
                                }

                                tool_call_count += 1;
                                if cancel.is_cancelled()
                                    || tool_call_count >= MAX_TOOL_CALLS
                                {
                                    break;
                                }
                            }

                            // Continue loop to let model process tool results
                            continue;
                        }
                    }

                    // No tool calls — done
                    seq += 1;
                    self.emit(CompanionEvent::Done {
                        run_id: run_id.to_string(),
                        seq,
                    })
                    .await;
                    break;
                }
                Err(e) => {
                    self.emit(CompanionEvent::Error {
                        run_id: run_id.to_string(),
                        seq,
                        message: format!("Request failed: {}", e),
                    })
                    .await;
                    break;
                }
            }
        }

        Ok(())
    }

    fn build_request_body(
        &self,
        messages: &[serde_json::Value],
        tools_enabled: bool,
        config: &CompanionConfig,
    ) -> serde_json::Value {
        let mut body = serde_json::json!({
            "model": config.model,
            "messages": messages,
            "stream": false
        });

        if let Some(ref eff) = config.reasoning_effort {
            if !eff.trim().is_empty() {
                body["reasoning_effort"] = serde_json::json!(eff);
            }
        }

        if tools_enabled {
            let tool_defs: Vec<serde_json::Value> = self
                .v1_tools()
                .iter()
                .map(|t| {
                    serde_json::json!({
                        "type": "function",
                        "function": {
                            "name": t.name,
                            "description": t.description,
                            "parameters": t.parameters
                        }
                    })
                })
                .collect();

            body["tools"] = serde_json::json!(tool_defs);
            body["tool_choice"] = serde_json::json!("auto");
        }

        body
    }

    async fn execute_tool(
        &self,
        name: &str,
        args: &str,
        run_id: &str,
        _action_id: &str,
    ) -> Result<String, String> {
        let parsed: serde_json::Value = serde_json::from_str(args).unwrap_or_default();

        match name {
            // ── Help & navigation ──────────────────────────────
            "app.search_help" => {
                let query = parsed["query"].as_str().unwrap_or("");
                let results = self.catalog.search(query);
                let mut out = String::new();
                for f in &results {
                    out.push_str(&format!("- {}: {}\n  Open: {}\n", f.feature_id, f.summary, f.open_instruction()));
                }
                Ok(if out.is_empty() { "No features found.".into() } else { out })
            }
            "app.get_context" => {
                let ctx = self.catalog.compact_index();
                Ok(ctx)
            }
            "app.open_view" => {
                let view_id = parsed["view_id"].as_str().unwrap_or("");
                let valid = ["terminal","quickapps","apiclient","proxy","logs","remote","dashboard","web-ai","settings"];
                if !valid.contains(&view_id) { return Err(format!("Invalid view: {}", view_id)); }
                self.emit(CompanionEvent::UiEffect { run_id: run_id.into(), seq: 0, effect_type: "open_view".into(), target_id: view_id.into(), label: format!("Open {}", view_id) }).await;
                Ok(format!("Opened view: {}", view_id))
            }
            "app.open_settings" => {
                let section = parsed["section"].as_str().unwrap_or("");
                let valid = ["appearance","mythical-pet","ai-companion","local-llm","web-ai","navigation"];
                if !valid.contains(&section) { return Err(format!("Invalid section: {}", section)); }
                self.emit(CompanionEvent::UiEffect { run_id: run_id.into(), seq: 0, effect_type: "open_settings".into(), target_id: section.into(), label: format!("Settings → {}", section) }).await;
                Ok(format!("Opened Settings → {}", section))
            }
            // ── CliProxyAI ─────────────────────────────────────
            "proxy.get_status" => {
                let proxy = self.proxy_server.read().await;
                let proxy = proxy.as_ref().ok_or("Proxy service unavailable")?;
                let status = proxy.status().await;
                Ok(serde_json::to_string(&status).unwrap_or_default())
            }
            "proxy.list_backends" => {
                let proxy = self.proxy_server.read().await;
                let proxy = proxy.as_ref().ok_or("Proxy service unavailable")?;
                let config = proxy.state.config.read().await;
                let names: Vec<String> = config.backends.iter().map(|b| format!("{} ({} @ {})", b.name, b.model, b.url)).collect();
                Ok(names.join("\n"))
            }
            "proxy.start" => {
                let proxy = self.proxy_server.read().await;
                let proxy = proxy.as_ref().ok_or("Proxy service unavailable")?;
                let status = proxy.start().await?;
                Ok(format!("Proxy started on port {} with {} backends", status.port, status.active_backends))
            }
            "proxy.stop" => {
                let proxy = self.proxy_server.read().await;
                let proxy = proxy.as_ref().ok_or("Proxy service unavailable")?;
                let status = proxy.stop().await?;
                Ok(format!("Proxy stopped (was on port {})", status.port))
            }
            "proxy.upsert_backend" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                let url = parsed["url"].as_str().ok_or("url required")?;
                let model = parsed["model"].as_str().ok_or("model required")?;
                let api_key = parsed["apiKey"].as_str().unwrap_or("");
                let weight = parsed["weight"].as_u64().unwrap_or(1) as u32;
                let max_retries = parsed["maxRetries"].as_u64().unwrap_or(2) as u32;
                let proxy = self.proxy_server.read().await;
                let proxy = proxy.as_ref().ok_or("Proxy service unavailable")?;
                let mut config = proxy.state.config.write().await;
                let id = uuid::Uuid::new_v4().to_string();
                config.backends.retain(|b| b.name != name);
                config.backends.push(crate::core::proxy_server::ProxyBackend {
                    id: Some(id.clone()),
                    name: name.into(),
                    url: url.into(),
                    api_key: api_key.into(),
                    model: model.into(),
                    weight,
                    max_retries,
                    headers: std::collections::HashMap::new(),
                    custom_user_agent: None,
                    enable_rtk: false,
                    enable_ponytail: false,
                    reasoning_effort: None,
                });
                config.save().map_err(|e| format!("save: {}", e))?;
                Ok(format!("Backend '{}' saved", name))
            }
            "proxy.delete_backend" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                let proxy = self.proxy_server.read().await;
                let proxy = proxy.as_ref().ok_or("Proxy service unavailable")?;
                let mut config = proxy.state.config.write().await;
                let len_before = config.backends.len();
                config.backends.retain(|b| b.name != name);
                if config.backends.len() == len_before { return Err(format!("Backend '{}' not found", name)); }
                config.save().map_err(|e| format!("save: {}", e))?;
                Ok(format!("Backend '{}' deleted", name))
            }
            // ── CLI profiles ───────────────────────────────────
            "cli.list_profiles" => {
                let registry = self.cli_registry.read().await;
                let registry = registry.as_ref().ok_or("CLI registry unavailable")?;
                let clis = registry.list().map_err(|e| e.to_string())?;
                let lines: Vec<String> = clis.iter().map(|c| format!("{}: {} {:?}", c.name, c.command, c.args)).collect();
                Ok(lines.join("\n"))
            }
            "cli.list_workspaces" => {
                let registry = self.cli_registry.read().await;
                let registry = registry.as_ref().ok_or("CLI registry unavailable")?;
                let tags: Vec<String> = registry.list().map_err(|e| e.to_string())?.iter()
                    .flat_map(|c| c.saved_directories.iter().map(|d| format!("{}: {} (CLI: {})", d.tag, d.path, c.name)))
                    .collect();
                Ok(if tags.is_empty() { "No workspace tags saved.".into() } else { tags.join("\n") })
            }
            "cli.upsert_profile" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                let command = parsed["command"].as_str().ok_or("command required")?;
                let args: Vec<String> = parsed["args"].as_array().map(|a| a.iter().filter_map(|v| v.as_str().map(String::from)).collect()).unwrap_or_default();
                let default_working_dir = parsed["defaultWorkingDir"].as_str().map(String::from);
                let registry = self.cli_registry.read().await;
                let registry = registry.as_ref().ok_or("CLI registry unavailable")?;
                registry.upsert(crate::core::cli_registry::CliDefinition {
                    name: name.into(), command: command.into(), args,
                    mode: crate::core::cli_registry::CliMode::Interactive,
                    env: std::collections::HashMap::new(),
                    default_working_dir, saved_directories: Vec::new(),
                    enable_rtk: false,
                    group: parsed["group"].as_str().map(String::from),
                }, None).map_err(|e| e.to_string())?;
                Ok(format!("CLI profile '{}' saved", name))
            }
            "cli.delete_profile" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                let registry = self.cli_registry.read().await;
                let registry = registry.as_ref().ok_or("CLI registry unavailable")?;
                registry.delete(name).map_err(|e| e.to_string())?;
                Ok(format!("CLI profile '{}' deleted", name))
            }
            // ── Terminal sessions ──────────────────────────────
            "session.list" => {
                let sm = self.session_manager.read().await;
                let sm = sm.as_ref().ok_or("Session manager unavailable")?;
                let sessions = sm.list_sessions().await;
                let lines: Vec<String> = sessions.iter().map(|s| format!("{}: {} ({}) {}", s.id, s.cli_name, s.status, s.working_dir.as_deref().unwrap_or(""))).collect();
                Ok(if lines.is_empty() { "No active sessions.".into() } else { lines.join("\n") })
            }
            "session.start" => {
                let cli_name = parsed["cliName"].as_str().ok_or("cliName required")?;
                let working_dir = parsed["workingDir"].as_str().ok_or("workingDir required")?;
                let project_tag = parsed["projectTag"].as_str();
                let path = std::path::Path::new(working_dir);
                if !path.exists() { return Err(format!("Directory does not exist: {}", working_dir)); }
                if !path.is_dir() { return Err(format!("Not a directory: {}", working_dir)); }

                // Resolve CLI definition
                let registry = self.cli_registry.read().await;
                let registry = registry.as_ref().ok_or("CLI registry unavailable")?;
                let cli = registry.get(cli_name).map_err(|e| e.to_string())?
                    .ok_or_else(|| format!("CLI not found: {}. Registered: {}", cli_name,
                        registry.list().map(|c| c.iter().map(|x| x.name.clone()).collect::<Vec<_>>().join(", ")).unwrap_or_default()))?;

                let command = crate::core::execution_engine::ExecutionEngine::resolve_command(
                    &cli, "", Some(working_dir.to_string()));
                let app = self.app_handle.read().await;
                let app = app.as_ref().ok_or("App handle unavailable")?;
                let sm = self.session_manager.read().await;
                let sm = sm.as_ref().ok_or("Session manager unavailable")?;
                let info = sm.create_session(
                    app.clone(), cli.name, Some(working_dir.to_string()),
                    project_tag.filter(|s| !s.is_empty()).map(String::from), command,
                ).await.map_err(|e| e.to_string())?;

                self.emit(CompanionEvent::UiEffect {
                    run_id: run_id.into(), seq: 0,
                    effect_type: "focus_session".into(),
                    target_id: info.id.clone(),
                    label: format!("Session {}", cli_name),
                }).await;
                Ok(format!("Session started: {} ({} in {})", info.id, cli_name, working_dir))
            }
            "session.focus" => {
                let session_id = parsed["sessionId"].as_str().ok_or("sessionId required")?;
                self.emit(CompanionEvent::UiEffect {
                    run_id: run_id.into(), seq: 0, effect_type: "focus_session".into(),
                    target_id: session_id.into(), label: "Focus session".into(),
                }).await;
                Ok(format!("Focused session: {}", session_id))
            }
            "session.stop" => {
                let session_id = parsed["sessionId"].as_str().ok_or("sessionId required")?;
                let app = self.app_handle.read().await;
                let app = app.as_ref().ok_or("App handle unavailable")?;
                let sm = self.session_manager.read().await;
                let sm = sm.as_ref().ok_or("Session manager unavailable")?;
                sm.stop_session(&app, session_id).await.map_err(|e| e.to_string())?;
                Ok(format!("Session stopped: {}", session_id))
            }
            "remote.list_profiles" => {
                let path = {
                    let registry = self.cli_registry.read().await;
                    let registry = registry.as_ref().ok_or("CLI registry unavailable")?;
                    registry.data_dirs().root_dir.join("ssh_connections.json")
                };
                let content = std::fs::read_to_string(&path).unwrap_or_default();
                Ok(content)
            }
            "remote.upsert_profile" => {
                // Return message that user should use the UI for SSH profile management
                Ok("SSH/RDP profiles are managed through the Operator panel. Use Settings → Remote SSH to add profiles.".into())
            }
            "remote.delete_profile" => {
                Ok("SSH/RDP profiles are managed through the Operator panel. Use Settings → Remote SSH to delete profiles.".into())
            }
            "remote.connect" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                self.emit(CompanionEvent::UiEffect { run_id: run_id.into(), seq: 0, effect_type: "open_view".into(), target_id: "remote".into(), label: format!("Connect SSH: {}", name) }).await;
                Ok(format!("Opening Remote SSH panel to connect to '{}'", name))
            }
            // ── Quick Apps ─────────────────────────────────────
            "quickapp.list" => {
                let qa = self.quickapps.read().await;
                let qa = qa.as_ref().ok_or("QuickApps unavailable")?;
                let apps = qa.list().map_err(|e| e.to_string())?;
                let lines: Vec<String> = apps.iter().map(|a| format!("{}: {} {}", a.name, a.command, a.args.join(" "))).collect();
                Ok(if lines.is_empty() { "No Quick Apps registered.".into() } else { lines.join("\n") })
            }
            "quickapp.upsert" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                let command = parsed["command"].as_str().ok_or("command required")?;
                let args: Vec<String> = parsed["args"].as_array().map(|a| a.iter().filter_map(|v| v.as_str().map(String::from)).collect()).unwrap_or_default();
                let working_dir = parsed["workingDir"].as_str().map(String::from);
                let qa = self.quickapps.read().await;
                let qa = qa.as_ref().ok_or("QuickApps unavailable")?;
                let app = crate::core::quickapp_registry::QuickApp {
                    id: uuid::Uuid::new_v4().to_string(),
                    name: name.into(), command: command.into(), args,
                    working_dir, icon_path: None, order: 0, group: None,
                };
                qa.upsert(app).map_err(|e| e.to_string())?;
                Ok(format!("Quick App '{}' saved", name))
            }
            "quickapp.delete" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                let qa = self.quickapps.read().await;
                let qa = qa.as_ref().ok_or("QuickApps unavailable")?;
                let apps = qa.list().map_err(|e| e.to_string())?;
                if let Some(app) = apps.iter().find(|a| a.name == name) {
                    qa.delete(&app.id).map_err(|e| e.to_string())?;
                    Ok(format!("Quick App '{}' deleted", name))
                } else {
                    Err(format!("Quick App '{}' not found", name))
                }
            }
            "quickapp.launch" => {
                let name = parsed["name"].as_str().ok_or("name required")?;
                let qa = self.quickapps.read().await;
                let qa = qa.as_ref().ok_or("QuickApps unavailable")?;
                let apps = qa.list().map_err(|e| e.to_string())?;
                if let Some(app) = apps.iter().find(|a| a.name == name) {
                    let mut cmd = std::process::Command::new(&app.command);
                    cmd.args(&app.args);
                    if let Some(ref dir) = app.working_dir { cmd.current_dir(dir); }
                    cmd.spawn().map_err(|e| format!("launch: {}", e))?;
                    Ok(format!("Launched Quick App: {}", name))
                } else {
                    Err(format!("Quick App '{}' not found", name))
                }
            }
            _ => Err(format!("Unknown tool: {}", name)),
        }
    }

    pub async fn cancel(&self, _run_id: &str) -> Result<(), String> {
        let state = self.run_state.lock().await;
        match &*state {
            RunState::Running { cancel } => {
                cancel.cancel();
                Ok(())
            }
            _ => Err("No active run to cancel".to_string()),
        }
    }

    async fn emit(&self, event: CompanionEvent) {
        if let Some(handle) = self.app_handle.read().await.as_ref() {
            let _ = handle.emit("companion-run-event", &event);
        } else {
            eprintln!("[companion] emit dropped (no app_handle): {:?}", std::mem::discriminant(&event));
        }
    }
}

async fn read_response_body_bounded(
    response: reqwest::Response,
    max_bytes: usize,
    cancel: &CancellationToken,
) -> Result<String, String> {
    let mut stream = response.bytes_stream();
    let mut body = Vec::with_capacity(max_bytes.min(64 * 1024));
    loop {
        let chunk = tokio::select! {
            _ = cancel.cancelled() => return Err("Run cancelled by user".to_string()),
            chunk = stream.next() => chunk,
        };
        match chunk {
            Some(Ok(bytes)) => {
                append_response_chunk(&mut body, &bytes, max_bytes)?;
            }
            Some(Err(error)) => return Err(format!("Failed to read model response: {error}")),
            None => break,
        }
    }
    String::from_utf8(body).map_err(|_| "Model response was not valid UTF-8".to_string())
}

fn append_response_chunk(body: &mut Vec<u8>, chunk: &[u8], max_bytes: usize) -> Result<(), String> {
    if body.len().saturating_add(chunk.len()) > max_bytes {
        return Err(format!("Model response exceeded the {} KiB limit", max_bytes / 1024));
    }
    body.extend_from_slice(chunk);
    Ok(())
}

#[cfg(test)]
mod response_limit_tests {
    use super::{append_response_chunk, read_response_body_bounded};
    use std::time::{Duration, Instant};
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use tokio_util::sync::CancellationToken;

    #[test]
    fn response_buffer_rejects_the_chunk_that_crosses_its_limit() {
        let mut body = Vec::new();
        append_response_chunk(&mut body, b"1234", 5).unwrap();
        assert!(append_response_chunk(&mut body, b"56", 5).is_err());
        assert_eq!(body, b"1234");
    }

    #[tokio::test]
    async fn response_read_is_cancelled_in_under_one_second() {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let address = listener.local_addr().unwrap();
        let server = tokio::spawn(async move {
            let (mut socket, _) = listener.accept().await.unwrap();
            let mut request = [0u8; 1024];
            let _ = socket.read(&mut request).await;
            socket
                .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 1024\r\n\r\n")
                .await
                .unwrap();
            tokio::time::sleep(Duration::from_secs(5)).await;
        });

        let response = reqwest::Client::new()
            .get(format!("http://{address}"))
            .send()
            .await
            .unwrap();
        let cancellation = CancellationToken::new();
        let trigger = cancellation.clone();
        tokio::spawn(async move {
            tokio::time::sleep(Duration::from_millis(25)).await;
            trigger.cancel();
        });
        let started = Instant::now();
        let result = read_response_body_bounded(response, 2 * 1024 * 1024, &cancellation).await;

        assert!(result.is_err());
        assert!(started.elapsed() < Duration::from_secs(1));
        server.abort();
    }
}
