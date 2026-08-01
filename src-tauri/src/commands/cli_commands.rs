use std::collections::HashMap;
use std::path::PathBuf;
use std::process::Command;

use serde::Deserialize;
use tauri::{AppHandle, State};

use crate::{
    app_state::AppState,
    core::{
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
    let name = cli.name.clone();
    let res = state
        .registry
        .upsert(cli, request.original_name)
        .map_err(|error| error.to_string());

    match &res {
        Ok(_) => crate::system_log!(
            state.logger,
            "INFO",
            "CLIRegistry",
            "Successfully upserted CLI configuration: {}",
            name
        ),
        Err(e) => crate::system_log!(
            state.logger,
            "ERROR",
            "CLIRegistry",
            "Failed to upsert CLI configuration {}: {}",
            name,
            e
        ),
    }
    res
}

#[tauri::command]
pub async fn delete_cli(
    state: State<'_, AppState>,
    request: DeleteCliRequest,
) -> Result<(), String> {
    let res = state
        .registry
        .delete(&request.name)
        .map_err(|error| error.to_string());

    match &res {
        Ok(_) => crate::system_log!(
            state.logger,
            "INFO",
            "CLIRegistry",
            "Successfully deleted CLI configuration: {}",
            request.name
        ),
        Err(e) => crate::system_log!(
            state.logger,
            "ERROR",
            "CLIRegistry",
            "Failed to delete CLI configuration {}: {}",
            request.name,
            e
        ),
    }
    res
}

#[tauri::command]
pub async fn detect_installed_clis(state: State<'_, AppState>) -> Result<Vec<DetectedCli>, String> {
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
    state
        .project_store
        .list()
        .map_err(|error| error.to_string())
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

    let cli = if request.cli_name == "shell" || request.cli_name == "Quick - shell" {
        let mut def = shell_cli_definition();
        def.name = request.cli_name.clone();
        def
    } else {
        state
            .registry
            .get(&request.cli_name)
            .map_err(|error| error.to_string())?
            .ok_or_else(|| format!("CLI not found: {}", request.cli_name))?
    };

    let working_dir = normalize_working_dir(request.working_dir)?;
    let command = ExecutionEngine::resolve_command(&cli, "", working_dir.clone());

    crate::system_log!(
        state.logger,
        "INFO",
        "SessionManager",
        "Creating terminal session for CLI: {}, working_dir: {:?}",
        cli.name,
        working_dir
    );

    let res = state
        .session_manager
        .create_session(app, cli.name, working_dir, request.project_tag, command)
        .await
        .map_err(|error| error.to_string());

    match &res {
        Ok(info) => crate::system_log!(
            state.logger,
            "INFO",
            "SessionManager",
            "Terminal session created successfully: {}",
            info.id
        ),
        Err(e) => crate::system_log!(
            state.logger,
            "ERROR",
            "SessionManager",
            "Failed to create terminal session: {}",
            e
        ),
    }
    res
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
    crate::system_log!(
        state.logger,
        "INFO",
        "SessionManager",
        "Stopping session: {}",
        request.session_id
    );
    let res = state
        .session_manager
        .stop_session(&app, &request.session_id)
        .await
        .map_err(|error| error.to_string());

    match &res {
        Ok(_) => crate::system_log!(
            state.logger,
            "INFO",
            "SessionManager",
            "Session stopped successfully: {}",
            request.session_id
        ),
        Err(e) => crate::system_log!(
            state.logger,
            "ERROR",
            "SessionManager",
            "Failed to stop session {}: {}",
            request.session_id,
            e
        ),
    }
    res
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
            enable_rtk: false,
            group: None,
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
            enable_rtk: false,
            group: None,
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

#[derive(serde::Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

#[tauri::command]
pub async fn list_directory_files(path: String) -> Result<Vec<FileEntry>, String> {
    use std::fs;
    let mut entries = Vec::new();
    let dir_entries =
        fs::read_dir(&path).map_err(|e| format!("Failed to read directory '{}': {}", path, e))?;

    for entry in dir_entries {
        if let Ok(entry) = entry {
            let path_buf = entry.path();
            let name = path_buf
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string();

            let is_dir = path_buf.is_dir();
            entries.push(FileEntry {
                name,
                path: path_buf.to_string_lossy().to_string(),
                is_dir,
            });
        }
    }

    // Sort: directories first, then files alphabetically
    entries.sort_by(|a, b| {
        if a.is_dir != b.is_dir {
            b.is_dir.cmp(&a.is_dir)
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });

    Ok(entries)
}

#[tauri::command]
pub async fn read_file_content(path: String) -> Result<String, String> {
    use std::fs;
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file '{}': {}", path, e))
}

#[tauri::command]
pub async fn write_file_content(path: String, content: String) -> Result<(), String> {
    use std::fs;
    fs::write(&path, content).map_err(|e| format!("Failed to write file '{}': {}", path, e))
}

#[tauri::command]
pub async fn create_directory(path: String) -> Result<(), String> {
    use std::fs;
    fs::create_dir_all(&path).map_err(|e| format!("Failed to create directory '{}': {}", path, e))
}

#[tauri::command]
pub async fn create_file_content(path: String, content: String) -> Result<(), String> {
    use std::fs;
    if let Some(parent) = std::path::Path::new(&path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create parent directory for '{}': {}", path, e))?;
    }
    fs::write(&path, content).map_err(|e| format!("Failed to create file '{}': {}", path, e))
}

fn validate_local_delete_target(
    path: &std::path::Path,
    root_path: &std::path::Path,
) -> Result<std::path::PathBuf, String> {
    use std::fs;

    let root = fs::canonicalize(root_path).map_err(|e| {
        format!(
            "Cannot access workspace root '{}': {}",
            root_path.display(),
            e
        )
    })?;
    let parent = path
        .parent()
        .ok_or_else(|| format!("Cannot determine parent for '{}'", path.display()))?;
    let file_name = path
        .file_name()
        .ok_or_else(|| format!("Cannot delete workspace root '{}'", path.display()))?;
    let resolved = fs::canonicalize(parent)
        .map_err(|e| format!("Cannot access parent of '{}': {}", path.display(), e))?
        .join(file_name);

    if resolved == root {
        return Err("Cannot delete the active workspace root".to_string());
    }
    if !resolved.starts_with(&root) {
        return Err(format!(
            "Refusing to delete '{}' because it is outside the active workspace",
            path.display()
        ));
    }

    Ok(resolved)
}

#[tauri::command]
pub async fn delete_file_or_dir(path: String, root_path: String) -> Result<(), String> {
    use std::fs;

    let target = validate_local_delete_target(
        std::path::Path::new(&path),
        std::path::Path::new(&root_path),
    )?;
    let meta =
        fs::symlink_metadata(&target).map_err(|e| format!("Cannot access '{}': {}", path, e))?;

    if meta.file_type().is_symlink() {
        #[cfg(windows)]
        {
            let points_to_directory = fs::metadata(&target)
                .map(|target_meta| target_meta.is_dir())
                .unwrap_or(false);
            if points_to_directory {
                fs::remove_dir(&target)
                    .map_err(|e| format!("Failed to delete directory link '{}': {}", path, e))
            } else {
                fs::remove_file(&target)
                    .map_err(|e| format!("Failed to delete file link '{}': {}", path, e))
            }
        }
        #[cfg(not(windows))]
        {
            fs::remove_file(&target)
                .map_err(|e| format!("Failed to delete file link '{}': {}", path, e))
        }
    } else if meta.is_dir() {
        fs::remove_dir_all(&target)
            .map_err(|e| format!("Failed to delete directory '{}': {}", path, e))
    } else {
        fs::remove_file(&target).map_err(|e| format!("Failed to delete file '{}': {}", path, e))
    }
}

fn create_silent_command(program: &str) -> std::process::Command {
    let mut cmd = std::process::Command::new(program);
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
    }
    cmd
}

#[derive(serde::Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct GitStatusEntry {
    pub path: String,
    pub status: String,
    pub staged: bool,
}

#[tauri::command]
pub async fn get_git_status(repo_path: String) -> Result<Vec<GitStatusEntry>, String> {
    let output = create_silent_command("git")
        .arg("rev-parse")
        .arg("--is-inside-work-tree")
        .current_dir(&repo_path)
        .output();

    match output {
        Ok(out) if out.status.success() => {
            let status_out = create_silent_command("git")
                .arg("status")
                .arg("--porcelain")
                .current_dir(&repo_path)
                .output()
                .map_err(|e| format!("Failed to run git status: {}", e))?;

            let stdout_str = String::from_utf8_lossy(&status_out.stdout);
            let mut entries = Vec::new();

            for line in stdout_str.lines() {
                if line.len() > 3 {
                    let index_status = &line[..1]; // staging area
                    let worktree_status = &line[1..2]; // working tree
                    let file_path = line[3..].trim().to_string();

                    // Determine file status from the more "interesting" column
                    let status_str = if worktree_status != " " {
                        match worktree_status {
                            "M" => "modified",
                            "A" => "added",
                            "D" => "deleted",
                            "?" => "untracked",
                            _ => "modified",
                        }
                    } else {
                        match index_status {
                            "M" => "modified",
                            "A" => "added",
                            "D" => "deleted",
                            _ => "modified",
                        }
                    };

                    // Staged if index_status is not ' ' or '?'
                    let is_staged = index_status != " " && index_status != "?";

                    entries.push(GitStatusEntry {
                        path: file_path,
                        status: status_str.to_string(),
                        staged: is_staged,
                    });
                }
            }
            Ok(entries)
        }
        _ => Ok(Vec::new()),
    }
}

#[tauri::command]
pub async fn get_git_diff(
    repo_path: String,
    file_path: String,
    is_untracked: bool,
) -> Result<String, String> {
    use std::fs;
    use std::path::Path;

    if is_untracked {
        let full_path = Path::new(&repo_path).join(&file_path);
        let content = fs::read_to_string(&full_path)
            .map_err(|e| format!("Failed to read untracked file: {}", e))?;

        let mut diff = format!(
            "--- /dev/null\n+++ b/{}\n@@ -0,0 +1,{} @@\n",
            file_path,
            content.lines().count()
        );
        for line in content.lines() {
            diff.push_str(&format!("+{}\n", line));
        }
        return Ok(diff);
    }

    let output = create_silent_command("git")
        .arg("diff")
        .arg("HEAD")
        .arg("--")
        .arg(&file_path)
        .current_dir(&repo_path)
        .output()
        .map_err(|e| format!("Failed to run git diff: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    let diff_str = String::from_utf8_lossy(&output.stdout).to_string();
    Ok(diff_str)
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LlmChatRequest {
    pub base_url: String,
    pub model: String,
    pub api_key: String,
    pub headers: HashMap<String, String>,
    pub system_prompt: String,
    pub messages: Vec<LlmMessage>,
    pub stream: bool,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct LlmMessage {
    pub role: String,
    pub content: String,
}

#[tauri::command]
pub async fn send_llm_chat(request: LlmChatRequest) -> Result<String, String> {
    use reqwest::header::{HeaderMap, HeaderName, HeaderValue};

    let client = reqwest::Client::new();
    let url = format!(
        "{}/chat/completions",
        request.base_url.trim_end_matches('/')
    );

    let mut headers = HeaderMap::new();
    let mut has_user_agent = false;

    for (k, v) in &request.headers {
        let name = HeaderName::from_bytes(k.as_bytes())
            .map_err(|e| format!("Invalid header name '{}': {}", k, e))?;
        let value =
            HeaderValue::from_str(v).map_err(|e| format!("Invalid header value '{}': {}", v, e))?;

        if k.to_ascii_lowercase() == "user-agent" {
            has_user_agent = true;
        }
        headers.insert(name, value);
    }

    if !has_user_agent {
        headers.insert(
            reqwest::header::USER_AGENT,
            HeaderValue::from_static("AI-CLI-Orchestrator"),
        );
    }

    if !request.api_key.is_empty() {
        headers.insert(
            reqwest::header::AUTHORIZATION,
            HeaderValue::from_str(&format!("Bearer {}", request.api_key))
                .map_err(|e| format!("Invalid API Key: {}", e))?,
        );
    }

    let mut chat_messages = Vec::new();
    if !request.system_prompt.is_empty() {
        chat_messages.push(LlmMessage {
            role: "system".to_string(),
            content: request.system_prompt.clone(),
        });
    }
    chat_messages.extend(request.messages);

    let body = serde_json::json!({
        "model": request.model,
        "messages": chat_messages,
        "stream": request.stream,
    });

    let response = client
        .post(&url)
        .headers(headers)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let status = response.status();
    let text = response
        .text()
        .await
        .map_err(|e| format!("Failed to read body: {}", e))?;

    if !status.is_success() {
        return Err(format!("LLM Error {}: {}", status, text));
    }

    // Nếu là stream hoặc body có định dạng stream SSE
    if request.stream || text.contains("data:") {
        let mut full_content = String::new();
        for line in text.lines() {
            let line = line.trim();
            if line.is_empty() || line == "data: [DONE]" {
                continue;
            }
            if let Some(json_str) = line.strip_prefix("data:") {
                let json_str = json_str.trim();
                if json_str.is_empty() || json_str == "[DONE]" {
                    continue;
                }
                if let Ok(val) = serde_json::from_str::<serde_json::Value>(json_str) {
                    if let Some(content) = val["choices"][0]["delta"]["content"].as_str() {
                        full_content.push_str(content);
                    } else if let Some(content) = val["choices"][0]["message"]["content"].as_str() {
                        full_content.push_str(content);
                    }
                }
            } else {
                if let Ok(val) = serde_json::from_str::<serde_json::Value>(line) {
                    if let Some(content) = val["choices"][0]["message"]["content"].as_str() {
                        full_content.push_str(content);
                    } else if let Some(content) = val["choices"][0]["delta"]["content"].as_str() {
                        full_content.push_str(content);
                    }
                }
            }
        }

        if !full_content.is_empty() {
            return Ok(full_content);
        }
    }

    // Non-stream fallback: Làm sạch các ký tự rác (như "data: [DONE]") ở cuối JSON để tránh lỗi parse
    let mut clean_text = text.trim().to_string();
    if clean_text.contains("data: [DONE]") {
        clean_text = clean_text.replace("data: [DONE]", "");
        clean_text = clean_text.trim().to_string();
    }

    let json_resp: serde_json::Value = serde_json::from_str(&clean_text)
        .map_err(|e| format!("Invalid JSON response: {}\nRaw: {}", e, text))?;

    let content = json_resp["choices"][0]["message"]["content"]
        .as_str()
        .or_else(|| json_resp["choices"][0]["delta"]["content"].as_str())
        .ok_or_else(|| format!("Invalid response format: content not found.\nRaw: {}", text))?;

    Ok(content.to_string())
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshConnection {
    pub id: String,
    pub name: String,
    #[serde(default = "default_protocol")]
    pub protocol: String, // "ssh" or "rdp"
    pub host: String,
    pub port: u16,
    pub user: String,
    pub auth_mode: Option<String>,
    pub key_path: Option<String>,
    pub password: Option<String>,
    pub group: String,
    pub rdp_resolution: Option<String>,
    pub rdp_share_clipboard: Option<bool>,
    pub rdp_share_drives: Option<bool>,
    pub working_dir: Option<String>,
}

fn default_protocol() -> String {
    "ssh".to_string()
}

#[tauri::command]
pub fn pick_file() -> Result<Option<String>, String> {
    Ok(rfd::FileDialog::new()
        .pick_file()
        .map(|path| path.to_string_lossy().to_string()))
}

#[tauri::command]
pub async fn load_ssh_connections(
    state: State<'_, AppState>,
) -> Result<Vec<SshConnection>, String> {
    let root_dir = state.registry.data_dirs().root_dir;
    let path = root_dir.join("ssh_connections.json");
    if !path.exists() {
        return Ok(Vec::new());
    }
    let data = std::fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))?;
    let connections: Vec<SshConnection> =
        serde_json::from_str(&data).map_err(|e| format!("Failed to parse JSON: {}", e))?;
    Ok(connections)
}

#[tauri::command]
pub async fn save_ssh_connections(
    state: State<'_, AppState>,
    connections: Vec<SshConnection>,
) -> Result<(), String> {
    let root_dir = state.registry.data_dirs().root_dir;
    std::fs::create_dir_all(&root_dir).map_err(|e| format!("Failed to create directory: {}", e))?;
    let path = root_dir.join("ssh_connections.json");
    let data = serde_json::to_string_pretty(&connections)
        .map_err(|e| format!("Failed to serialize JSON: {}", e))?;
    std::fs::write(&path, data).map_err(|e| format!("Failed to write file: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn create_ssh_session(
    app: AppHandle,
    state: State<'_, AppState>,
    connection: SshConnection,
) -> Result<SessionInfo, String> {
    let mut args = vec!["-p".to_string(), connection.port.to_string()];
    if connection.auth_mode.as_deref() == Some("key") {
        if let Some(ref path) = connection.key_path {
            args.push("-i".to_string());
            args.push(path.clone());
        }
    }
    args.push(format!("{}@{}", connection.user, connection.host));

    let command = crate::core::execution_engine::ResolvedCommand {
        command: "ssh".to_string(),
        args,
        env: std::collections::HashMap::new(),
        cwd: None,
    };

    let display_name = format!("SSH: {}", connection.name);
    state
        .session_manager
        .create_session(
            app,
            display_name,
            connection.working_dir.clone(),
            None,
            command,
        )
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn create_rdp_session(
    state: State<'_, AppState>,
    connection: SshConnection,
) -> Result<(), String> {
    let root_dir = state.registry.data_dirs().root_dir;
    let rdp_dir = root_dir.join("rdp_profiles");
    std::fs::create_dir_all(&rdp_dir)
        .map_err(|e| format!("Failed to create RDP directory: {}", e))?;

    let file_path = rdp_dir.join(format!("{}.rdp", connection.id));

    // Resolution parameters
    let (screen_mode, width, height) = match connection.rdp_resolution.as_deref() {
        Some("fullscreen") => (2, 1920, 1080),
        Some("1080p") => (1, 1920, 1080),
        Some("720p") => (1, 1280, 720),
        _ => (1, 1440, 900),
    };

    let share_clipboard = if connection.rdp_share_clipboard.unwrap_or(true) {
        1
    } else {
        0
    };
    let share_drives = if connection.rdp_share_drives.unwrap_or(false) {
        1
    } else {
        0
    };

    let rdp_content = format!(
        "screen mode id:i:{}\r\n\
         desktopwidth:i:{}\r\n\
         desktopheight:i:{}\r\n\
         session bpp:i:32\r\n\
         full address:s:{}:{}\r\n\
         username:s:{}\r\n\
         redirectclip:i:{}\r\n\
         redirectdrives:i:{}\r\n\
         prompt for credentials:i:1\r\n",
        screen_mode,
        width,
        height,
        connection.host,
        connection.port,
        connection.user,
        share_clipboard,
        share_drives
    );

    std::fs::write(&file_path, rdp_content)
        .map_err(|e| format!("Failed to write RDP file: {}", e))?;

    #[cfg(target_os = "windows")]
    {
        let path_str = file_path.to_string_lossy().to_string();
        std::process::Command::new("mstsc.exe")
            .arg(path_str)
            .spawn()
            .map_err(|e| format!("Failed to launch mstsc.exe: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
pub fn reveal_in_file_manager(path: String) -> Result<(), String> {
    let p = PathBuf::from(path.clone());
    if !p.exists() {
        return Err(format!("Path does not exist: {}", path));
    }
    #[cfg(target_os = "windows")]
    {
        if p.is_file() {
            Command::new("explorer")
                .args(["/select,", &p.to_string_lossy()])
                .spawn()
                .map_err(|e| e.to_string())?;
        } else {
            Command::new("explorer")
                .arg(&p)
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        return Ok(());
    }
    #[cfg(target_os = "macos")]
    {
        let parent = p
            .parent()
            .map(|x| x.to_path_buf())
            .unwrap_or_else(|| p.clone());
        Command::new("open")
            .args(["-R", &p.to_string_lossy()])
            .spawn()
            .map_err(|e| e.to_string())?;
        return Ok(());
    }
    #[cfg(all(unix, not(target_os = "macos")))]
    {
        Command::new("xdg-open")
            .arg(p.parent().map(|x| x.as_os_str()).unwrap_or(p.as_os_str()))
            .spawn()
            .map_err(|e| e.to_string())?;
        return Ok(());
    }
}

#[tauri::command]
pub fn open_workspace_folder(path: String) -> Result<(), String> {
    let p = PathBuf::from(path);
    if !p.exists() {
        return Err("Directory does not exist".to_string());
    }
    open_folder(&p)
}

pub(crate) fn run_ssh_command(
    connection: &SshConnection,
    remote_command: &str,
    stdin_data: Option<&str>,
) -> Result<String, String> {
    use std::fs;
    use std::io::Write;
    use std::process::{Command, Stdio};

    let mut cmd = Command::new("ssh");
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
    }

    let temp_askpass = if connection.auth_mode.as_deref() == Some("password") {
        if let Some(ref pwd) = connection.password {
            let temp_path =
                std::env::temp_dir().join(format!("askpass_{}.bat", uuid::Uuid::new_v4().simple()));
            let batch_content = format!("@echo off\necho {}", pwd);
            if let Err(e) = fs::write(&temp_path, batch_content) {
                return Err(format!("Failed to create temporary askpass script: {}", e));
            }
            Some(temp_path)
        } else {
            None
        }
    } else {
        None
    };

    if let Some(ref askpass_path) = temp_askpass {
        cmd.env("SSH_ASKPASS", askpass_path.to_string_lossy().to_string());
        cmd.env("SSH_ASKPASS_REQUIRE", "force");
        cmd.env("DISPLAY", "d");
    }

    cmd.arg("-o").arg("StrictHostKeyChecking=no");
    cmd.arg("-o").arg("ConnectTimeout=10");
    cmd.arg("-p").arg(connection.port.to_string());

    if connection.auth_mode.as_deref() == Some("key") {
        if let Some(ref path) = connection.key_path {
            cmd.arg("-i").arg(path);
        }
    }

    cmd.arg(format!("{}@{}", connection.user, connection.host));
    cmd.arg(remote_command);

    if stdin_data.is_some() {
        cmd.stdin(Stdio::piped());
    }
    cmd.stdout(Stdio::piped());
    cmd.stderr(Stdio::piped());

    let mut child = cmd
        .spawn()
        .map_err(|e| format!("Failed to execute ssh command: {}", e))?;

    if let Some(stdin_str) = stdin_data {
        if let Some(mut child_stdin) = child.stdin.take() {
            let _ = child_stdin.write_all(stdin_str.as_bytes());
        }
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Failed to wait for ssh command: {}", e))?;

    // Cleanup temp askpass file
    if let Some(ref askpass_path) = temp_askpass {
        let _ = fs::remove_file(askpass_path);
    }

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        let err_str = String::from_utf8_lossy(&output.stderr).to_string();
        Err(err_str)
    }
}

#[tauri::command]
pub async fn list_ssh_directory_files(
    connection: SshConnection,
    path: String,
) -> Result<Vec<FileEntry>, String> {
    let target_path = if path.is_empty() {
        ".".to_string()
    } else {
        path.clone()
    };

    let cmd_str = format!("ls -p -1 -A \"{}\"", target_path.replace('"', "\\\""));

    let output = run_ssh_command(&connection, &cmd_str, None)?;
    let mut entries = Vec::new();

    for line in output.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }

        let is_dir = trimmed.ends_with('/');
        let name = if is_dir {
            trimmed[..trimmed.len() - 1].to_string()
        } else {
            trimmed.to_string()
        };

        let file_path = if target_path.ends_with('/') {
            format!("{}{}", target_path, name)
        } else {
            format!("{}/{}", target_path, name)
        };

        entries.push(FileEntry {
            name,
            path: file_path,
            is_dir,
        });
    }

    // Sort directories first, then files alphabetically
    entries.sort_by(|a, b| {
        if a.is_dir != b.is_dir {
            b.is_dir.cmp(&a.is_dir)
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });

    Ok(entries)
}

#[tauri::command]
pub async fn read_ssh_file_content(
    connection: SshConnection,
    path: String,
) -> Result<String, String> {
    let cmd_str = format!("cat \"{}\"", path.replace('"', "\\\""));
    run_ssh_command(&connection, &cmd_str, None)
}

#[tauri::command]
pub async fn write_ssh_file_content(
    connection: SshConnection,
    path: String,
    content: String,
) -> Result<(), String> {
    let escaped_path = path.replace('"', "\\\"");
    let cmd_str = format!(
        "mkdir -p \"$(dirname \"{}\")\" && cat > \"{}\"",
        escaped_path, escaped_path
    );
    let _ = run_ssh_command(&connection, &cmd_str, Some(&content))?;
    Ok(())
}

fn normalize_remote_path(path: &str) -> Result<(bool, Vec<&str>), String> {
    let absolute = path.starts_with('/');
    let mut components = Vec::new();

    for component in path.split('/') {
        match component {
            "" | "." => {}
            ".." => {
                if components.pop().is_none() {
                    return Err(format!("Remote path escapes its root: {}", path));
                }
            }
            value => components.push(value),
        }
    }

    Ok((absolute, components))
}

fn validate_remote_delete_target(path: &str, root_path: &str) -> Result<(), String> {
    let (root_absolute, root_components) = normalize_remote_path(root_path)?;
    let (target_absolute, target_components) = normalize_remote_path(path)?;

    if root_absolute != target_absolute
        || target_components == root_components
        || !target_components.starts_with(&root_components)
    {
        return Err(format!(
            "Refusing to delete '{}' because it is outside the active remote workspace",
            path
        ));
    }

    Ok(())
}

fn quote_posix_shell(value: &str) -> String {
    format!("'{}'", value.replace('\'', "'\"'\"'"))
}

fn remote_delete_command(path: &str, root_path: &str) -> String {
    let quoted_path = quote_posix_shell(path);
    let quoted_root = quote_posix_shell(root_path);
    format!(
        "root=$(realpath -m -- {quoted_root}) || exit 1; \
parent=$(dirname -- {quoted_path}) || exit 1; \
parent=$(realpath -m -- \"$parent\") || exit 1; \
case \"$parent/\" in \"$root/\"*) rm -rf -- {quoted_path} ;; \
*) printf '%s\\n' 'Refusing to delete outside remote workspace' >&2; exit 64 ;; esac"
    )
}

#[tauri::command]
pub async fn delete_ssh_file_or_dir(
    connection: SshConnection,
    path: String,
    root_path: String,
) -> Result<(), String> {
    validate_remote_delete_target(&path, &root_path)?;
    let command = remote_delete_command(&path, &root_path);
    run_ssh_command(&connection, &command, None)?;
    Ok(())
}

fn walk_dir_recursive(dir: &std::path::Path, entries: &mut Vec<FileEntry>) {
    if let Ok(read_dir) = std::fs::read_dir(dir) {
        for entry in read_dir {
            if let Ok(entry) = entry {
                let path = entry.path();
                let name = path
                    .file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string();
                if name == "node_modules" || name == "target" || name == "dist" || name == ".git" {
                    continue;
                }
                if path.is_dir() {
                    entries.push(FileEntry {
                        name,
                        path: path.to_string_lossy().to_string(),
                        is_dir: true,
                    });
                    walk_dir_recursive(&path, entries);
                } else {
                    entries.push(FileEntry {
                        name,
                        path: path.to_string_lossy().to_string(),
                        is_dir: false,
                    });
                }
            }
        }
    }
}

#[tauri::command]
pub async fn list_all_files_recursive(path: String) -> Result<Vec<FileEntry>, String> {
    let mut entries = Vec::new();
    let root_path = std::path::PathBuf::from(&path);
    if !root_path.exists() {
        return Err("Directory does not exist".to_string());
    }
    walk_dir_recursive(&root_path, &mut entries);
    Ok(entries)
}

#[tauri::command]
pub async fn list_ssh_files_recursive(
    connection: SshConnection,
    path: String,
) -> Result<Vec<FileEntry>, String> {
    let target_path = if path.is_empty() {
        ".".to_string()
    } else {
        path.clone()
    };

    let cmd_str = format!(
        "find \"{}\" -maxdepth 4 -type f -not -path '*/node_modules/*' -not -path '*/target/*' -not -path '*/dist/*' -not -path '*/.git/*'",
        target_path.replace('"', "\\\"")
    );

    let output = run_ssh_command(&connection, &cmd_str, None)?;
    let mut entries = Vec::new();

    for line in output.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }

        let path_buf = std::path::Path::new(trimmed);
        let name = path_buf
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

        entries.push(FileEntry {
            name,
            path: trimmed.to_string(),
            is_dir: false,
        });
    }

    Ok(entries)
}

#[derive(serde::Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RipgrepMatch {
    pub file_path: String,
    pub line_number: usize,
    pub content: String,
}

#[tauri::command]
pub async fn ripgrep_search(path: String, query: String) -> Result<Vec<RipgrepMatch>, String> {
    if query.trim().is_empty() {
        return Ok(Vec::new());
    }

    let root_path = std::path::PathBuf::from(&path);
    if !root_path.exists() {
        return Err("Directory does not exist".to_string());
    }

    let mut cmd = std::process::Command::new("rg");
    cmd.current_dir(&root_path).args(&[
        "--line-number",
        "--color=never",
        "--smart-case",
        "--max-count=2",
        "--",
        &query,
        ".",
    ]);

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
    }

    let output = cmd
        .output()
        .map_err(|e| format!("Failed to execute ripgrep (is rg installed?): {}", e))?;

    let stdout_str = String::from_utf8_lossy(&output.stdout);
    let mut matches = Vec::new();

    for line in stdout_str.lines() {
        let parts: Vec<&str> = line.splitn(3, ':').collect();
        if parts.len() == 3 {
            let file_path = parts[0].to_string();
            let line_number = parts[1].parse::<usize>().unwrap_or(0);
            let content = parts[2].trim().to_string();

            matches.push(RipgrepMatch {
                file_path,
                line_number,
                content,
            });
        }
        if matches.len() >= 50 {
            break;
        }
    }

    Ok(matches)
}

#[derive(serde::Serialize)]
pub struct SshStatusResponse {
    pub running: bool,
    pub port: u16,
    pub local_ip: String,
    pub logs: Vec<String>,
}

#[tauri::command]
pub async fn start_ssh_server(
    app: tauri::AppHandle,
    state: tauri::State<'_, crate::app_state::AppState>,
    port: u16,
) -> Result<(), String> {
    let root_dir = state.registry.data_dirs().root_dir;
    let config = load_ssh_server_config_internal(&root_dir)?;
    let mut manager = state.ssh_server_manager.lock().map_err(|e| e.to_string())?;
    manager.start(
        app,
        state.session_manager.clone(),
        port,
        config,
        root_dir.clone(),
    )
}

#[tauri::command]
pub async fn stop_ssh_server(
    state: tauri::State<'_, crate::app_state::AppState>,
) -> Result<(), String> {
    let mut manager = state.ssh_server_manager.lock().map_err(|e| e.to_string())?;
    manager.stop();
    Ok(())
}

#[tauri::command]
pub async fn get_ssh_server_status(
    state: tauri::State<'_, crate::app_state::AppState>,
) -> Result<SshStatusResponse, String> {
    let manager = state.ssh_server_manager.lock().map_err(|e| e.to_string())?;
    let (running, port, logs) = manager.status();

    let local_ip = std::net::UdpSocket::bind("0.0.0.0:0")
        .and_then(|socket| {
            socket.connect("8.8.8.8:80")?;
            socket.local_addr()
        })
        .map(|addr| addr.ip().to_string())
        .unwrap_or_else(|_| "127.0.0.1".to_string());

    Ok(SshStatusResponse {
        running,
        port,
        local_ip,
        logs,
    })
}

fn load_ssh_server_config_internal(
    root_dir: &std::path::Path,
) -> Result<crate::core::ssh_server::SshServerConfig, String> {
    let path = root_dir.join("ssh_server_config.json");
    if !path.exists() {
        let default_config = crate::core::ssh_server::SshServerConfig::default();
        let _ = std::fs::create_dir_all(root_dir);
        if let Ok(data) = serde_json::to_string_pretty(&default_config) {
            let _ = std::fs::write(&path, data);
        }
        return Ok(default_config);
    }
    let data =
        std::fs::read_to_string(&path).map_err(|e| format!("Failed to read SSH config: {}", e))?;
    let config: crate::core::ssh_server::SshServerConfig = serde_json::from_str(&data)
        .map_err(|e| format!("Failed to parse SSH config JSON: {}", e))?;
    Ok(config)
}

#[tauri::command]
pub async fn get_ssh_server_config(
    state: tauri::State<'_, crate::app_state::AppState>,
) -> Result<crate::core::ssh_server::SshServerConfig, String> {
    let root_dir = state.registry.data_dirs().root_dir;
    load_ssh_server_config_internal(&root_dir)
}

#[tauri::command]
pub async fn save_ssh_server_config(
    state: tauri::State<'_, crate::app_state::AppState>,
    config: crate::core::ssh_server::SshServerConfig,
) -> Result<(), String> {
    let root_dir = state.registry.data_dirs().root_dir;
    let path = root_dir.join("ssh_server_config.json");
    std::fs::create_dir_all(&root_dir).map_err(|e| format!("Failed to create directory: {}", e))?;
    let data = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize SSH config: {}", e))?;
    std::fs::write(&path, data).map_err(|e| format!("Failed to write SSH config file: {}", e))?;
    Ok(())
}

#[derive(Debug, Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoteSystemStats {
    pub cpu_usage: f64,
    pub memory_used: u64,
    pub memory_total: u64,
    pub disk_used: u64,
    pub disk_total: u64,
    pub load_average: f64,
    pub uptime_seconds: f64,
}

#[tauri::command]
pub async fn get_remote_system_stats(
    connection: SshConnection,
) -> Result<RemoteSystemStats, String> {
    let stats_cmd = r#"printf "CPU:%s\n" "$(top -bn1 2>/dev/null | grep -i 'cpu(s)' | awk '{print $2+$4}' || echo '-1')"; printf "MEM_TOTAL:%s\n" "$(free -b 2>/dev/null | awk '/^Mem:/{print $2}' || echo '0')"; printf "MEM_USED:%s\n" "$(free -b 2>/dev/null | awk '/^Mem:/{print $3}' || echo '0')"; printf "DISK_TOTAL:%s\n" "$(df -B1 / 2>/dev/null | awk 'NR==2{print $2}' || echo '0')"; printf "DISK_USED:%s\n" "$(df -B1 / 2>/dev/null | awk 'NR==2{print $3}' || echo '0')"; printf "LOAD:%s\n" "$(cat /proc/loadavg 2>/dev/null | awk '{print $1}' || echo '0')"; printf "UPTIME:%s\n" "$(cat /proc/uptime 2>/dev/null | awk '{print $1}' || echo '0')""#;

    let output = tokio::task::spawn_blocking({
        let conn = connection.clone();
        move || run_ssh_command(&conn, stats_cmd, None)
    })
    .await
    .map_err(|e| format!("Task join error: {}", e))?
    .map_err(|e| format!("SSH stats failed: {}", e))?;

    let mut stats = RemoteSystemStats {
        cpu_usage: 0.0,
        memory_used: 0,
        memory_total: 0,
        disk_used: 0,
        disk_total: 0,
        load_average: 0.0,
        uptime_seconds: 0.0,
    };

    for line in output.lines() {
        let line = line.trim();
        if let Some(val) = line.strip_prefix("CPU:") {
            stats.cpu_usage = val.trim().parse().unwrap_or(0.0);
        } else if let Some(val) = line.strip_prefix("MEM_TOTAL:") {
            stats.memory_total = val.trim().parse().unwrap_or(0);
        } else if let Some(val) = line.strip_prefix("MEM_USED:") {
            stats.memory_used = val.trim().parse().unwrap_or(0);
        } else if let Some(val) = line.strip_prefix("DISK_TOTAL:") {
            stats.disk_total = val.trim().parse().unwrap_or(0);
        } else if let Some(val) = line.strip_prefix("DISK_USED:") {
            stats.disk_used = val.trim().parse().unwrap_or(0);
        } else if let Some(val) = line.strip_prefix("LOAD:") {
            stats.load_average = val.trim().parse().unwrap_or(0.0);
        } else if let Some(val) = line.strip_prefix("UPTIME:") {
            stats.uptime_seconds = val.trim().parse().unwrap_or(0.0);
        }
    }

    Ok(stats)
}

fn run_scp_command(
    connection: &SshConnection,
    source: &str,
    destination: &str,
    upload: bool,
) -> Result<(), String> {
    use std::fs;
    use std::process::{Command, Stdio};

    let mut cmd = Command::new("scp");
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }

    let temp_askpass = if connection.auth_mode.as_deref() == Some("password") {
        if let Some(ref pwd) = connection.password {
            let temp_path =
                std::env::temp_dir().join(format!("askpass_{}.bat", uuid::Uuid::new_v4().simple()));
            let batch_content = format!("@echo off\necho {}", pwd);
            if let Err(e) = fs::write(&temp_path, &batch_content) {
                return Err(format!("Failed to create temporary askpass script: {}", e));
            }
            Some(temp_path)
        } else {
            None
        }
    } else {
        None
    };

    if let Some(ref askpass_path) = temp_askpass {
        cmd.env("SSH_ASKPASS", askpass_path.to_string_lossy().to_string());
        cmd.env("SSH_ASKPASS_REQUIRE", "force");
        cmd.env("DISPLAY", "d");
    }

    cmd.arg("-o").arg("StrictHostKeyChecking=no");
    cmd.arg("-o").arg("ConnectTimeout=30");
    cmd.arg("-P").arg(connection.port.to_string());

    if connection.auth_mode.as_deref() == Some("key") {
        if let Some(ref path) = connection.key_path {
            cmd.arg("-i").arg(path);
        }
    }

    let remote_spec = format!(
        "{}@{}:{}",
        connection.user,
        connection.host,
        if upload { destination } else { source }
    );

    if upload {
        cmd.arg(source);
        cmd.arg(&remote_spec);
    } else {
        cmd.arg(&remote_spec);
        cmd.arg(destination);
    }

    cmd.stdout(Stdio::piped());
    cmd.stderr(Stdio::piped());

    let output = cmd
        .spawn()
        .map_err(|e| format!("Failed to execute scp: {}", e))?
        .wait_with_output()
        .map_err(|e| format!("SCP process error: {}", e))?;

    if let Some(ref askpass_path) = temp_askpass {
        let _ = fs::remove_file(askpass_path);
    }

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
pub async fn download_ssh_file(
    connection: SshConnection,
    remote_path: String,
    local_path: String,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        run_scp_command(&connection, &remote_path, &local_path, false)
    })
    .await
    .map_err(|e| format!("Task join error: {}", e))?
}

#[tauri::command]
pub async fn upload_ssh_file(
    connection: SshConnection,
    local_path: String,
    remote_path: String,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        run_scp_command(&connection, &local_path, &remote_path, true)
    })
    .await
    .map_err(|e| format!("Task join error: {}", e))?
}

#[cfg(test)]
mod delete_tests {
    use super::{
        quote_posix_shell, remote_delete_command, validate_local_delete_target,
        validate_remote_delete_target,
    };
    use std::path::PathBuf;

    fn temporary_directory(label: &str) -> PathBuf {
        let path = std::env::temp_dir().join(format!("clx-{label}-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&path).expect("temporary directory should be created");
        path
    }

    #[test]
    fn local_delete_target_must_stay_below_workspace_root() {
        let parent = temporary_directory("delete-boundary");
        let root = parent.join("workspace");
        let nested = root.join("nested");
        let outside = parent.join("outside.txt");
        std::fs::create_dir_all(&nested).unwrap();
        std::fs::write(&outside, "outside").unwrap();

        let accepted = validate_local_delete_target(&nested.join("file.txt"), &root).unwrap();
        assert!(accepted.starts_with(std::fs::canonicalize(&root).unwrap()));
        assert!(validate_local_delete_target(&root, &root).is_err());
        assert!(validate_local_delete_target(&outside, &root).is_err());
        assert!(validate_local_delete_target(&root.join("..").join("outside.txt"), &root).is_err());

        std::fs::remove_dir_all(parent).unwrap();
    }

    #[tokio::test]
    async fn local_delete_removes_files_and_non_empty_directories() {
        let root = temporary_directory("delete-operation");
        let file = root.join("file.txt");
        let directory = root.join("nested");
        std::fs::write(&file, "content").unwrap();
        std::fs::create_dir_all(&directory).unwrap();
        std::fs::write(directory.join("child.txt"), "content").unwrap();

        super::delete_file_or_dir(
            file.to_string_lossy().into_owned(),
            root.to_string_lossy().into_owned(),
        )
        .await
        .unwrap();
        super::delete_file_or_dir(
            directory.to_string_lossy().into_owned(),
            root.to_string_lossy().into_owned(),
        )
        .await
        .unwrap();

        assert!(!file.exists());
        assert!(!directory.exists());
        assert!(root.exists());
        std::fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn remote_delete_target_must_stay_below_remote_root() {
        assert!(validate_remote_delete_target("/srv/app/src/main.rs", "/srv/app").is_ok());
        assert!(validate_remote_delete_target("/srv/app", "/srv/app").is_err());
        assert!(validate_remote_delete_target("/srv/app/../../etc/passwd", "/srv/app").is_err());
        assert!(validate_remote_delete_target("/etc/passwd", "/srv/app").is_err());
    }

    #[test]
    fn remote_delete_path_is_shell_quoted() {
        assert_eq!(quote_posix_shell("/srv/app/a'b"), "'/srv/app/a'\"'\"'b'");
        let command = remote_delete_command("/srv/app/a'b", "/srv/app");
        assert!(command.contains("rm -rf -- '/srv/app/a'\"'\"'b'"));
        assert!(command.contains("realpath -m -- '/srv/app'"));
    }
}
