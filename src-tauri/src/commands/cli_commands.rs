use std::collections::HashMap;
use std::path::PathBuf;
use std::process::Command;

use serde::Deserialize;
use tauri::{AppHandle, State};

use crate::{
    app_state::AppState,
    core::{
        account_manager::{AccountProfile, AccountStatus, CooldownEntry},
        cli_registry::{CliDefinition, CliMode, DetectedCli},
        execution_engine::ExecutionEngine,
        project_store::ProjectTag,
    },
    terminal::session_manager::SessionInfo,
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendCliInputRequest {
    pub session_id: String,
    pub input: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StopCliRequest {
    pub session_id: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateTerminalSessionRequest {
    pub cli_name: String,
    pub working_dir: Option<String>,
    pub project_tag: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveProjectTagRequest {
    pub tag: String,
    pub path: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveCliTagRequest {
    pub cli_name: String,
    pub tag: String,
    pub path: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpsertCliRequest {
    pub cli: CliDefinition,
    pub original_name: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteCliRequest {
    pub name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResizeCliRequest {
    pub session_id: String,
    pub rows: u16,
    pub cols: u16,
}

#[tauri::command]
pub async fn list_clis(state: State<'_, AppState>) -> Result<Vec<CliDefinition>, String> {
    state.registry.reload().map_err(|error| error.to_string())?;
    state.registry.list().map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn upsert_cli(
    state: State<'_, AppState>,
    request: UpsertCliRequest,
) -> Result<CliDefinition, String> {
    let mut cli = request.cli;
    cli.mode = CliMode::Interactive;
    state
        .registry
        .upsert(cli, request.original_name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn delete_cli(
    state: State<'_, AppState>,
    request: DeleteCliRequest,
) -> Result<(), String> {
    state
        .registry
        .delete(&request.name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn detect_installed_clis(
    state: State<'_, AppState>,
) -> Result<Vec<DetectedCli>, String> {
    Ok(state.registry.detect_installed_clis())
}

#[tauri::command]
pub async fn list_sessions(state: State<'_, AppState>) -> Result<Vec<SessionInfo>, String> {
    Ok(state.session_manager.list_sessions().await)
}

#[tauri::command]
pub async fn list_project_tags(state: State<'_, AppState>) -> Result<Vec<ProjectTag>, String> {
    state
        .project_store
        .reload()
        .map_err(|error| error.to_string())?;
    state.project_store.list().map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn save_project_tag(
    state: State<'_, AppState>,
    request: SaveProjectTagRequest,
) -> Result<Vec<ProjectTag>, String> {
    state
        .project_store
        .upsert(request.tag, request.path)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn save_cli_tag(
    state: State<'_, AppState>,
    request: SaveCliTagRequest,
) -> Result<CliDefinition, String> {
    state.registry.reload().map_err(|error| error.to_string())?;
    state
        .registry
        .save_project_tag(&request.cli_name, request.tag, request.path)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn backend_logs_path(state: State<'_, AppState>) -> Result<String, String> {
    let logs_dir = state.registry.data_dirs().logs_dir;
    std::fs::create_dir_all(&logs_dir).map_err(|error| error.to_string())?;
    Ok(logs_dir.to_string_lossy().to_string())
}

#[tauri::command]
pub fn open_backend_logs_folder(state: State<'_, AppState>) -> Result<String, String> {
    let logs_dir = state.registry.data_dirs().logs_dir;
    std::fs::create_dir_all(&logs_dir).map_err(|error| error.to_string())?;
    open_folder(&logs_dir)?;
    Ok(logs_dir.to_string_lossy().to_string())
}

#[tauri::command]
pub fn pick_folder() -> Result<Option<String>, String> {
    Ok(rfd::FileDialog::new()
        .pick_folder()
        .map(|path| path.to_string_lossy().to_string()))
}

#[tauri::command]
pub async fn create_terminal_session(
    app: AppHandle,
    state: State<'_, AppState>,
    request: CreateTerminalSessionRequest,
) -> Result<SessionInfo, String> {
    state.registry.reload().map_err(|error| error.to_string())?;

    let cli = if request.cli_name == "shell" {
        shell_cli_definition()
    } else {
        state
            .registry
            .get(&request.cli_name)
            .map_err(|error| error.to_string())?
            .ok_or_else(|| format!("CLI not found: {}", request.cli_name))?
    };

    let working_dir = normalize_working_dir(request.working_dir)?;
    let command = ExecutionEngine::resolve_command(&cli, "", working_dir.clone());
    state
        .session_manager
        .create_session(app, cli.name, working_dir, request.project_tag, command)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn send_cli_input(
    state: State<'_, AppState>,
    request: SendCliInputRequest,
) -> Result<(), String> {
    state
        .session_manager
        .send_input(&request.session_id, &request.input)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn stop_cli(
    app: AppHandle,
    state: State<'_, AppState>,
    request: StopCliRequest,
) -> Result<(), String> {
    state
        .session_manager
        .stop_session(&app, &request.session_id)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn resize_cli(
    state: State<'_, AppState>,
    request: ResizeCliRequest,
) -> Result<(), String> {
    state
        .session_manager
        .resize_session(&request.session_id, request.rows, request.cols)
        .await
        .map_err(|error| error.to_string())
}

fn shell_cli_definition() -> CliDefinition {
    #[cfg(target_os = "windows")]
    {
        let command = std::env::var("ComSpec").unwrap_or_else(|_| "cmd.exe".to_string());
        return CliDefinition {
            name: "shell".to_string(),
            command,
            args: vec![],
            mode: CliMode::Interactive,
            env: HashMap::new(),
            default_working_dir: None,
            saved_directories: Vec::new(),
        };
    }

    #[cfg(not(target_os = "windows"))]
    {
        let command = std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".to_string());
        return CliDefinition {
            name: "shell".to_string(),
            command,
            args: vec![],
            mode: CliMode::Interactive,
            env: HashMap::new(),
            default_working_dir: None,
            saved_directories: Vec::new(),
        };
    }
}

fn normalize_working_dir(raw: Option<String>) -> Result<Option<String>, String> {
    let Some(raw_dir) = raw else {
        return Ok(None);
    };

    let trimmed = raw_dir.trim();
    if trimmed.is_empty() {
        return Ok(None);
    }

    let dir = PathBuf::from(trimmed);
    if !dir.is_dir() {
        return Ok(None);
    }

    Ok(Some(dir.to_string_lossy().to_string()))
}

fn open_folder(path: &PathBuf) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(path)
            .spawn()
            .map_err(|error| error.to_string())?;
        return Ok(());
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(path)
            .spawn()
            .map_err(|error| error.to_string())?;
        return Ok(());
    }

    #[cfg(all(unix, not(target_os = "macos")))]
    {
        Command::new("xdg-open")
            .arg(path)
            .spawn()
            .map_err(|error| error.to_string())?;
        return Ok(());
    }

    #[allow(unreachable_code)]
    Err("unsupported platform".to_string())
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveAccountRequest {
    pub cli_name: String,
    pub profile_name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActivateAccountRequest {
    pub cli_name: String,
    pub profile_name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteAccountRequest {
    pub cli_name: String,
    pub profile_name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetCooldownRequest {
    pub cli_name: String,
    pub profile_name: String,
    pub minutes: i64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAccountStatusRequest {
    pub cli_name: String,
}

#[tauri::command]
pub async fn list_accounts(
    state: State<'_, AppState>,
    cli_name: String,
) -> Result<Vec<AccountProfile>, String> {
    state
        .account_manager
        .list_accounts(&cli_name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn save_account(
    state: State<'_, AppState>,
    request: SaveAccountRequest,
) -> Result<AccountProfile, String> {
    state
        .account_manager
        .backup_account(&request.cli_name, &request.profile_name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn activate_account(
    state: State<'_, AppState>,
    request: ActivateAccountRequest,
) -> Result<(), String> {
    state
        .account_manager
        .activate_account(&request.cli_name, &request.profile_name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn delete_account(
    state: State<'_, AppState>,
    request: DeleteAccountRequest,
) -> Result<(), String> {
    state
        .account_manager
        .delete_account(&request.cli_name, &request.profile_name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn get_account_status(
    state: State<'_, AppState>,
    request: GetAccountStatusRequest,
) -> Result<AccountStatus, String> {
    state
        .account_manager
        .get_account_status(&request.cli_name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn switch_to_next_account(
    state: State<'_, AppState>,
    cli_name: String,
) -> Result<Option<String>, String> {
    let next = state
        .account_manager
        .select_next_profile(&cli_name)
        .map_err(|error| error.to_string())?;

    if let Some(profile_name) = &next {
        state
            .account_manager
            .activate_account(&cli_name, profile_name)
            .map_err(|error| error.to_string())?;
    }

    Ok(next)
}

#[tauri::command]
pub async fn set_account_cooldown(
    state: State<'_, AppState>,
    request: SetCooldownRequest,
) -> Result<(), String> {
    state
        .account_manager
        .set_cooldown(&request.cli_name, &request.profile_name, request.minutes)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn clear_account_cooldown(
    state: State<'_, AppState>,
    cli_name: String,
    profile_name: String,
) -> Result<(), String> {
    state
        .account_manager
        .clear_cooldown(&cli_name, &profile_name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn list_account_cooldowns(
    state: State<'_, AppState>,
) -> Result<Vec<CooldownEntry>, String> {
    state
        .account_manager
        .list_cooldowns()
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn get_all_account_statuses(
    state: State<'_, AppState>,
) -> Result<Vec<AccountStatus>, String> {
    let cli_names = vec!["claude-code", "claude", "codex", "gemini"];
    let mut statuses = Vec::new();
    
    for cli_name in cli_names {
        match state.account_manager.get_account_status(cli_name) {
            Ok(status) => {
                if !status.available_profiles.is_empty() {
                    statuses.push(status);
                }
            }
            Err(_) => {}
        }
    }
    
    Ok(statuses)
}
