//! Companion model runtime — manages chat requests, streaming, tool loops, and approvals.
use futures_util::StreamExt;
use serde_json::Value;
use std::collections::VecDeque;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{Mutex, RwLock};
use tokio_util::sync::CancellationToken;

use crate::catalog::Catalog;
use crate::config::CompanionConfig;
use crate::db::{CompanionDb, CompanionMessageRecord};
use crate::safe_context::SafeAppContext;

const MAX_TOOL_CALLS: usize = 8;
const MAX_POLL_EVENTS: usize = 64;

#[derive(Debug, Clone)]
pub enum RunState {
    Idle,
    Running { cancel: CancellationToken },
}

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

#[derive(Debug, Clone, serde::Serialize)]
pub struct ToolDef {
    pub name: String,
    pub description: String,
    pub parameters: serde_json::Value,
    #[serde(skip)]
    pub risk: ToolRisk,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub enum ToolRisk {
    #[default]
    None,
    Read,
    ConfigWrite,
    Delete,
    Stop,
}

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
"#;

pub struct CompanionManager {
    pub config: Arc<RwLock<CompanionConfig>>,
    pub db: Arc<CompanionDb>,
    pub catalog: Catalog,
    pub run_state: Arc<Mutex<RunState>>,
    pub http_client: reqwest::Client,
    pub event_queue: Arc<Mutex<VecDeque<CompanionEvent>>>,
}

impl CompanionManager {
    pub fn new(db_path: &std::path::Path) -> Result<Self, String> {
        let db = CompanionDb::open(db_path)?;
        let config = CompanionConfig::load().unwrap_or_default();
        let catalog = Catalog::load()?;

        Ok(Self {
            config: Arc::new(RwLock::new(config)),
            db: Arc::new(db),
            catalog,
            run_state: Arc::new(Mutex::new(RunState::Idle)),
            http_client: reqwest::Client::builder()
                .no_proxy()
                .connect_timeout(Duration::from_secs(30))
                .timeout(Duration::from_secs(300))
                .build()
                .map_err(|error| format!("failed to create Companion HTTP client: {error}"))?,
            event_queue: Arc::new(Mutex::new(VecDeque::new())),
        })
    }

    pub async fn emit(&self, event: CompanionEvent) {
        let mut q = self.event_queue.lock().await;
        if q.len() < 1000 {
            q.push_back(event);
        }
    }

    pub async fn poll_events(&self) -> Vec<CompanionEvent> {
        let mut q = self.event_queue.lock().await;
        let count = q.len().min(MAX_POLL_EVENTS);
        q.drain(..count).collect()
    }

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

    pub async fn run(
        &self,
        run_id: &str,
        messages: Vec<Value>,
        tools_enabled: bool,
    ) -> Result<(), String> {
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
        mut messages: Vec<Value>,
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

            let trimmed = config.base_url.trim_end_matches('/');
            let url = if trimmed.ends_with("/chat/completions") {
                trimmed.to_string()
            } else {
                format!("{}/chat/completions", trimmed)
            };

            let request = self
                .http_client
                .post(&url)
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
                resp = request.send() => resp,
            };

            match response {
                Ok(resp) => {
                    if !resp.status().is_success() {
                        let status = resp.status();
                        let body = resp.text().await.unwrap_or_default();
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

                    let body_text = resp.text().await.map_err(|e| e.to_string())?;
                    let parsed: Value =
                        serde_json::from_str(&body_text).unwrap_or(Value::Null);

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

                    if !content.is_empty() {
                        seq += 1;
                        self.emit(CompanionEvent::AssistantDelta {
                            run_id: run_id.to_string(),
                            seq,
                            delta: content.clone(),
                        })
                        .await;

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

                    if let Some(tools) = tool_calls {
                        if !tools.is_empty() {
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
                                if cancel.is_cancelled() || tool_call_count >= MAX_TOOL_CALLS {
                                    break;
                                }
                            }
                            continue;
                        }
                    }

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
        messages: &[Value],
        tools_enabled: bool,
        config: &CompanionConfig,
    ) -> Value {
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
            let tool_defs: Vec<Value> = self
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
        let parsed: Value = serde_json::from_str(args).unwrap_or_default();

        match name {
            "app.search_help" => {
                let query = parsed["query"].as_str().unwrap_or("");
                let results = self.catalog.search(query);
                let mut out = String::new();
                for f in &results {
                    out.push_str(&format!(
                        "- {}: {}\n  Open: {}\n",
                        f.feature_id,
                        f.summary,
                        f.open_instruction()
                    ));
                }
                Ok(if out.is_empty() {
                    "No features found.".into()
                } else {
                    out
                })
            }
            "app.get_context" => {
                let ctx = self.catalog.compact_index();
                Ok(ctx)
            }
            "app.open_view" => {
                let view_id = parsed["view_id"].as_str().unwrap_or("");
                self.emit(CompanionEvent::UiEffect {
                    run_id: run_id.into(),
                    seq: 0,
                    effect_type: "open_view".into(),
                    target_id: view_id.into(),
                    label: format!("Open {}", view_id),
                })
                .await;
                Ok(format!("Opened view: {}", view_id))
            }
            "app.open_settings" => {
                let section = parsed["section"].as_str().unwrap_or("");
                self.emit(CompanionEvent::UiEffect {
                    run_id: run_id.into(),
                    seq: 0,
                    effect_type: "open_settings".into(),
                    target_id: section.into(),
                    label: format!("Settings → {}", section),
                })
                .await;
                Ok(format!("Opened Settings → {}", section))
            }
            _ => Err(format!("Tool '{name}' is executed via Core delegation")),
        }
    }
}
