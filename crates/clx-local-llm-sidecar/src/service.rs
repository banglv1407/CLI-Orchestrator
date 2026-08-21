use serde_json::Value;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::config::BuiltinLlmConfig;
use crate::engine::BuiltinLlmEngine;
use crate::prompts::{format_chat_prompt, LlmChatMessage};

pub struct LocalLlmService {
    engine: Arc<Mutex<BuiltinLlmEngine>>,
}

impl LocalLlmService {
    pub fn new() -> Self {
        let config = BuiltinLlmConfig::load();
        Self {
            engine: Arc::new(Mutex::new(BuiltinLlmEngine::new(config))),
        }
    }

    pub async fn handle_call(&self, method: &str, params: Value) -> Result<Value, String> {
        match method {
            "clx.local-llm.status" => {
                let engine = self.engine.lock().await;
                Ok(serde_json::to_value(engine.status()).unwrap_or_default())
            }
            "clx.local-llm.getConfig" => {
                let engine = self.engine.lock().await;
                Ok(serde_json::to_value(&engine.config).unwrap_or_default())
            }
            "clx.local-llm.saveConfig" => {
                let config: BuiltinLlmConfig =
                    serde_json::from_value(params).map_err(|e| e.to_string())?;
                config.save().map_err(|e| e.to_string())?;
                let mut engine = self.engine.lock().await;
                engine.config = config.clone();
                Ok(serde_json::to_value(&config).unwrap_or_default())
            }
            "clx.local-llm.loadModel" => {
                let mut engine = self.engine.lock().await;
                engine.load_model()?;
                Ok(serde_json::to_value(engine.status()).unwrap_or_default())
            }
            "clx.local-llm.unloadModel" => {
                let mut engine = self.engine.lock().await;
                engine.unload_model();
                Ok(serde_json::to_value(engine.status()).unwrap_or_default())
            }
            "clx.local-llm.generate" => {
                let prompt = params
                    .get("prompt")
                    .and_then(Value::as_str)
                    .ok_or("prompt required")?;
                let mut engine = self.engine.lock().await;
                let text = engine.generate(prompt)?;
                Ok(serde_json::json!({ "text": text }))
            }
            "clx.local-llm.chat" => {
                let messages: Vec<LlmChatMessage> = params
                    .get("messages")
                    .and_then(|v| serde_json::from_value(v.clone()).ok())
                    .unwrap_or_default();
                let system_prompt = params.get("systemPrompt").and_then(Value::as_str);
                let prompt = format_chat_prompt(&messages, system_prompt);
                let mut engine = self.engine.lock().await;
                let text = engine.generate(&prompt)?;
                Ok(serde_json::json!({ "text": text }))
            }
            _ => Err(format!("Unknown local-llm method: {}", method)),
        }
    }
}
