use crate::app_state::AppState;
use crate::builtin_llm::config::BuiltinLlmConfig;
use crate::builtin_llm::engine::BuiltinLlmStatus;

#[tauri::command]
pub async fn builtin_llm_status(
    state: tauri::State<'_, AppState>,
) -> Result<BuiltinLlmStatus, String> {
    let engine = state.builtin_llm.lock().await;
    Ok(engine.status())
}

#[tauri::command]
pub async fn builtin_llm_get_config(
    state: tauri::State<'_, AppState>,
) -> Result<BuiltinLlmConfig, String> {
    let engine = state.builtin_llm.lock().await;
    Ok(engine.config().clone())
}

#[tauri::command]
pub async fn builtin_llm_save_config(
    state: tauri::State<'_, AppState>,
    config: BuiltinLlmConfig,
) -> Result<(), String> {
    config.save()?;
    let mut engine = state.builtin_llm.lock().await;
    engine.update_config(config);
    crate::system_log!(
        state.logger,
        "INFO",
        "BuiltinLLM",
        "Built-in local LLM configuration updated"
    );
    Ok(())
}

#[tauri::command]
pub async fn builtin_llm_load(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut engine = state.builtin_llm.lock().await;
    crate::system_log!(
        state.logger,
        "INFO",
        "BuiltinLLM",
        "Attempting to load built-in local LLM model"
    );
    match engine.load_model() {
        Ok(_) => {
            crate::system_log!(
                state.logger,
                "INFO",
                "BuiltinLLM",
                "Built-in local LLM model loaded successfully"
            );
            Ok(())
        }
        Err(e) => {
            crate::system_log!(
                state.logger,
                "ERROR",
                "BuiltinLLM",
                "Failed to load built-in local LLM model: {}",
                e
            );
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn builtin_llm_unload(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut engine = state.builtin_llm.lock().await;
    engine.unload_model();
    crate::system_log!(
        state.logger,
        "INFO",
        "BuiltinLLM",
        "Built-in local LLM model unloaded"
    );
    Ok(())
}

#[tauri::command]
pub async fn builtin_llm_generate(
    state: tauri::State<'_, AppState>,
    prompt: String,
    task: Option<String>,
    max_tokens: Option<u32>,
) -> Result<String, String> {
    let formatted_prompt = match task.as_deref() {
        Some("rewrite") => crate::builtin_llm::prompts::rewrite_query(&prompt),
        Some("suggest") => crate::builtin_llm::prompts::suggest_command(&prompt, None),
        Some("summarize") => crate::builtin_llm::prompts::summarize(&prompt),
        Some("title") => crate::builtin_llm::prompts::generate_title(&prompt),
        Some("chat") => crate::builtin_llm::prompts::general_chat("", &prompt),
        _ => prompt.clone(),
    };

    crate::system_log!(
        state.logger,
        "INFO",
        "BuiltinLLM",
        "Running local inference task: {:?}",
        task.as_deref().unwrap_or("raw")
    );

    let engine = state.builtin_llm.lock().await;
    match engine.generate(&formatted_prompt, max_tokens) {
        Ok(res) => {
            crate::system_log!(
                state.logger,
                "INFO",
                "BuiltinLLM",
                "Local inference completed successfully ({} chars output)",
                res.len()
            );
            Ok(res)
        }
        Err(e) => {
            crate::system_log!(
                state.logger,
                "ERROR",
                "BuiltinLLM",
                "Local inference failed: {}",
                e
            );
            Err(e)
        }
    }
}
