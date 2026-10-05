// Agent Session Browser — read session logs from Hermes, Antigravity, Claude, and Codex.

use std::{
    fs::{self, File},
    io::{BufRead, BufReader},
    path::{Path, PathBuf},
};

use chrono::DateTime;
use serde::{Deserialize, Serialize};
use tauri::State;

use crate::app_state::AppState;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentSessionEntry {
    pub id: String,
    pub agent: String, // "hermes" | "antigravity" | "claude" | "codex"
    pub model: Option<String>,
    pub title: Option<String>,
    pub cwd: Option<String>,
    pub message_count: i64,
    pub started_at: f64,
    pub ended_at: Option<f64>,
    pub real_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentSessionMessage {
    pub role: String,
    pub content: Option<String>,
    pub timestamp: f64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentSessionPreviewRequest {
    pub session_id: String,
    pub agent: Option<String>,
    pub real_path: Option<String>,
    pub limit: Option<u32>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentExportContextRequest {
    pub session_id: String,
    pub agent: String,
    pub real_path: Option<String>,
    pub cwd: Option<String>,
    pub target_agent: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentExportContextResponse {
    pub file_path: String,
    pub context_markdown: String,
}

fn home_dir() -> Option<PathBuf> {
    dirs::home_dir()
}

fn parse_iso_or_rfc3339(s: &str) -> Option<f64> {
    let clean = s.trim().replace(' ', "T");
    if let Ok(dt) = DateTime::parse_from_rfc3339(&clean) {
        return Some(dt.timestamp() as f64);
    }
    if let Ok(ndt) = chrono::NaiveDateTime::parse_from_str(&clean, "%Y-%m-%dT%H:%M:%S%.f") {
        return Some(ndt.and_utc().timestamp() as f64);
    }
    if let Ok(ndt) = chrono::NaiveDateTime::parse_from_str(&clean, "%Y-%m-%dT%H:%M:%S") {
        return Some(ndt.and_utc().timestamp() as f64);
    }
    None
}

// ── 1. Hermes Sessions ──────────────────────────────────────────────────────────

fn hermes_db_path() -> Option<PathBuf> {
    let home = home_dir()?;
    let db = home
        .join("AppData")
        .join("Local")
        .join("hermes")
        .join("state.db");
    if db.exists() {
        Some(db)
    } else {
        None
    }
}

fn load_hermes_sessions() -> Vec<AgentSessionEntry> {
    let mut entries = Vec::new();
    let Some(db_path) = hermes_db_path() else {
        return entries;
    };

    let Ok(conn) = rusqlite::Connection::open_with_flags(
        &db_path,
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    ) else {
        return entries;
    };

    let Ok(mut stmt) = conn.prepare(
        "SELECT id, source, model, title, cwd, message_count, started_at, ended_at, \
         COALESCE(last_activity_at, ended_at, started_at) as effective_time \
         FROM sessions \
         WHERE source IN ('cli', 'subagent', 'oneshot', 'acp') \
         ORDER BY effective_time DESC \
         LIMIT 200",
    ) else {
        return entries;
    };

    let real_path_str = db_path.to_string_lossy().to_string();
    if let Ok(rows) = stmt.query_map([], |row| {
        let effective_ts: f64 = row.get(8).unwrap_or_else(|_| row.get(6).unwrap_or(0.0));
        Ok(AgentSessionEntry {
            id: row.get(0)?,
            agent: "hermes".to_string(),
            model: row.get(2)?,
            title: row.get(3)?,
            cwd: row.get(4)?,
            message_count: row.get::<_, i64>(5).unwrap_or(0),
            started_at: effective_ts,
            ended_at: row.get(7)?,
            real_path: Some(real_path_str.clone()),
        })
    }) {
        for row in rows.flatten() {
            entries.push(row);
        }
    }

    entries
}

fn preview_hermes_messages(session_id: &str, limit: u32) -> Vec<AgentSessionMessage> {
    let mut messages = Vec::new();
    let Some(db_path) = hermes_db_path() else {
        return messages;
    };

    let Ok(conn) = rusqlite::Connection::open_with_flags(
        &db_path,
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    ) else {
        return messages;
    };

    let Ok(mut stmt) = conn.prepare(
        "SELECT role, content, timestamp \
         FROM messages \
         WHERE session_id = ?1 AND role IN ('user', 'assistant') AND content IS NOT NULL AND content != '' \
         ORDER BY rowid \
         LIMIT ?2",
    ) else {
        return messages;
    };

    if let Ok(rows) = stmt.query_map(rusqlite::params![session_id, limit], |row| {
        Ok(AgentSessionMessage {
            role: row.get(0)?,
            content: row.get(1)?,
            timestamp: row.get(2)?,
        })
    }) {
        for msg in rows.flatten() {
            messages.push(msg);
        }
    }

    messages
}

// ── 2. Claude Code Sessions ───────────────────────────────────────────────────

fn claude_projects_dir() -> Option<PathBuf> {
    let home = home_dir()?;
    let dir = home.join(".claude").join("projects");
    if dir.exists() {
        Some(dir)
    } else {
        None
    }
}

fn load_claude_sessions() -> Vec<AgentSessionEntry> {
    let mut entries = Vec::new();
    let Some(projects_dir) = claude_projects_dir() else {
        return entries;
    };

    let Ok(read_dir) = fs::read_dir(&projects_dir) else {
        return entries;
    };

    for project_entry in read_dir.flatten() {
        let path = project_entry.path();
        if !path.is_dir() {
            continue;
        }

        let Ok(files) = fs::read_dir(&path) else {
            continue;
        };

        for file in files.flatten() {
            let fpath = file.path();
            if fpath.extension().and_then(|e| e.to_str()) != Some("jsonl") {
                continue;
            }

            let file_stem = fpath
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("unknown")
                .to_string();

            let Ok(f) = File::open(&fpath) else {
                continue;
            };

            let reader = BufReader::new(f);
            let mut first_user_prompt: Option<String> = None;
            let mut detected_cwd: Option<String> = None;
            let mut first_ts: Option<f64> = None;
            let mut last_ts: Option<f64> = None;
            let mut message_count: i64 = 0;

            for line in reader.lines().flatten() {
                if let Ok(v) = serde_json::from_str::<serde_json::Value>(&line) {
                    if detected_cwd.is_none() {
                        if let Some(cwd) = v.get("cwd").and_then(|c| c.as_str()) {
                            detected_cwd = Some(cwd.to_string());
                        }
                    }
                    if let Some(ts_str) = v.get("timestamp").and_then(|t| t.as_str()) {
                        if let Some(ts) = parse_iso_or_rfc3339(ts_str) {
                            if first_ts.is_none() {
                                first_ts = Some(ts);
                            }
                            last_ts = Some(ts);
                        }
                    }

                    let is_msg = if let Some(msg) = v.get("message") {
                        let role = msg.get("role").and_then(|r| r.as_str()).unwrap_or("");
                        if role == "user" && first_user_prompt.is_none() {
                            if let Some(content) = msg.get("content").and_then(|c| c.as_str()) {
                                first_user_prompt = Some(content.trim().to_string());
                            }
                        }
                        role == "user" || role == "assistant"
                    } else if let Some(t) = v.get("type").and_then(|t| t.as_str()) {
                        if t == "user" && first_user_prompt.is_none() {
                            if let Some(content) = v.get("content").and_then(|c| c.as_str()) {
                                first_user_prompt = Some(content.trim().to_string());
                            }
                        }
                        t == "user" || t == "assistant"
                    } else {
                        false
                    };

                    if is_msg {
                        message_count += 1;
                    }
                }
            }

            let started_at = last_ts.or(first_ts).unwrap_or_else(|| {
                file.metadata()
                    .ok()
                    .and_then(|m| m.modified().ok())
                    .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                    .map(|d| d.as_secs_f64())
                    .unwrap_or(0.0)
            });

            let title = first_user_prompt
                .map(|p| {
                    if p.len() > 80 {
                        format!("{}…", &p[..80])
                    } else {
                        p
                    }
                })
                .unwrap_or_else(|| file_stem.clone());

            entries.push(AgentSessionEntry {
                id: file_stem,
                agent: "claude".to_string(),
                model: Some("Claude".to_string()),
                title: Some(title),
                cwd: detected_cwd,
                message_count,
                started_at,
                ended_at: Some(started_at),
                real_path: Some(fpath.to_string_lossy().to_string()),
            });
        }
    }

    entries
}

fn preview_claude_messages(real_path: &str, limit: u32) -> Vec<AgentSessionMessage> {
    let mut messages = Vec::new();
    let Ok(f) = File::open(real_path) else {
        return messages;
    };

    let reader = BufReader::new(f);
    let mut count = 0;

    for line in reader.lines().flatten() {
        if count >= limit {
            break;
        }

        let Ok(v) = serde_json::from_str::<serde_json::Value>(&line) else {
            continue;
        };

        let ts = v
            .get("timestamp")
            .and_then(|t| t.as_str())
            .and_then(parse_iso_or_rfc3339)
            .unwrap_or(0.0);

        if let Some(msg) = v.get("message") {
            let role = msg.get("role").and_then(|r| r.as_str()).unwrap_or("");
            if role == "user" || role == "assistant" {
                let content = if let Some(text) = msg.get("content").and_then(|c| c.as_str()) {
                    Some(text.to_string())
                } else if let Some(arr) = msg.get("content").and_then(|c| c.as_array()) {
                    let combined = arr
                        .iter()
                        .filter_map(|item| {
                            if let Some(t) = item.get("text").and_then(|s| s.as_str()) {
                                Some(t.to_string())
                            } else {
                                None
                            }
                        })
                        .collect::<Vec<_>>()
                        .join("\n");
                    if combined.is_empty() {
                        None
                    } else {
                        Some(combined)
                    }
                } else {
                    None
                };

                if let Some(c) = content {
                    messages.push(AgentSessionMessage {
                        role: role.to_string(),
                        content: Some(c),
                        timestamp: ts,
                    });
                    count += 1;
                }
            }
        }
    }

    messages
}

// ── 3. Codex Sessions ─────────────────────────────────────────────────────────

fn codex_index_path() -> Option<PathBuf> {
    let home = home_dir()?;
    let path = home.join(".codex").join("session_index.jsonl");
    if path.exists() {
        Some(path)
    } else {
        None
    }
}

fn codex_history_db_path() -> Option<PathBuf> {
    let home = home_dir()?;
    let path = home.join(".codex").join("thread_history_1.sqlite");
    if path.exists() {
        Some(path)
    } else {
        None
    }
}

fn load_codex_sessions() -> Vec<AgentSessionEntry> {
    let mut entries = Vec::new();
    let Some(index_path) = codex_index_path() else {
        return entries;
    };

    let Ok(f) = File::open(&index_path) else {
        return entries;
    };

    let reader = BufReader::new(f);
    let real_path_str = index_path.to_string_lossy().to_string();

    let mut by_id: std::collections::HashMap<String, AgentSessionEntry> =
        std::collections::HashMap::new();

    for line in reader.lines().flatten() {
        let Ok(v) = serde_json::from_str::<serde_json::Value>(&line) else {
            continue;
        };

        let Some(id) = v.get("id").and_then(|s| s.as_str()) else {
            continue;
        };

        let title = v.get("thread_name").and_then(|s| s.as_str()).map(|s| s.to_string());
        let updated_at = v.get("updated_at").and_then(|s| s.as_str()).unwrap_or("");
        let started_at = parse_iso_or_rfc3339(updated_at).unwrap_or(0.0);

        let entry = AgentSessionEntry {
            id: id.to_string(),
            agent: "codex".to_string(),
            model: Some("Codex".to_string()),
            title,
            cwd: None,
            message_count: 0,
            started_at,
            ended_at: Some(started_at),
            real_path: Some(real_path_str.clone()),
        };

        match by_id.get_mut(id) {
            Some(existing) => {
                if started_at >= existing.started_at {
                    *existing = entry;
                }
            }
            None => {
                by_id.insert(id.to_string(), entry);
            }
        }
    }

    entries.extend(by_id.into_values());
    entries
}

fn preview_codex_messages(session_id: &str, limit: u32) -> Vec<AgentSessionMessage> {
    let mut messages = Vec::new();
    let Some(db_path) = codex_history_db_path() else {
        return messages;
    };

    let Ok(conn) = rusqlite::Connection::open_with_flags(
        &db_path,
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    ) else {
        return messages;
    };

    let Ok(mut stmt) = conn.prepare(
        "SELECT item_type, item_json, created_at_ms \
         FROM thread_items \
         WHERE thread_id = ?1 AND item_type IN ('userMessage', 'agentMessage') \
         ORDER BY rollout_ordinal, item_id \
         LIMIT ?2",
    ) else {
        return messages;
    };

    if let Ok(rows) = stmt.query_map(rusqlite::params![session_id, limit], |row| {
        let item_type: String = row.get(0)?;
        let item_json: String = row.get(1)?;
        let created_at_ms: i64 = row.get(2).unwrap_or(0);
        let ts = (created_at_ms as f64) / 1000.0;

        let role = if item_type == "userMessage" {
            "user"
        } else {
            "assistant"
        };

        let mut content = None;
        if let Ok(v) = serde_json::from_str::<serde_json::Value>(&item_json) {
            if role == "user" {
                if let Some(arr) = v.get("content").and_then(|c| c.as_array()) {
                    let texts = arr
                        .iter()
                        .filter_map(|it| it.get("text").and_then(|t| t.as_str()))
                        .collect::<Vec<_>>()
                        .join("\n");
                    if !texts.is_empty() {
                        content = Some(texts);
                    }
                }
            } else if let Some(txt) = v.get("text").and_then(|t| t.as_str()) {
                content = Some(txt.to_string());
            }
        }

        Ok(AgentSessionMessage {
            role: role.to_string(),
            content,
            timestamp: ts,
        })
    }) {
        for msg in rows.flatten() {
            if msg.content.is_some() {
                messages.push(msg);
            }
        }
    }

    messages
}

// ── 4. Antigravity Sessions ───────────────────────────────────────────────────

fn antigravity_db_path() -> Option<PathBuf> {
    let home = home_dir()?;
    let path = home
        .join(".gemini")
        .join("antigravity-cli")
        .join("conversation_summaries.db");
    if path.exists() {
        Some(path)
    } else {
        None
    }
}

fn parse_workspace_uri(uris: &str) -> Option<String> {
    let clean = uris.trim();
    if clean.is_empty() || clean == "[]" {
        return None;
    }

    if let Ok(arr) = serde_json::from_str::<Vec<String>>(clean) {
        if let Some(first) = arr.first() {
            let s = first
                .trim_start_matches("file:///")
                .trim_start_matches("file://");
            return Some(s.replace('/', "\\"));
        }
    }

    None
}

fn load_antigravity_sessions() -> Vec<AgentSessionEntry> {
    let mut entries = Vec::new();
    let Some(db_path) = antigravity_db_path() else {
        return entries;
    };

    let Ok(conn) = rusqlite::Connection::open_with_flags(
        &db_path,
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    ) else {
        return entries;
    };

    let Ok(mut stmt) = conn.prepare(
        "SELECT conversation_id, title, preview, step_count, last_modified_time, workspace_uris \
         FROM conversation_summaries \
         ORDER BY last_modified_time DESC \
         LIMIT 200",
    ) else {
        return entries;
    };

    let conversations_dir = db_path.parent().map(|p| p.join("conversations"));

    if let Ok(rows) = stmt.query_map([], |row| {
        let id: String = row.get(0)?;
        let title_col: String = row.get(1).unwrap_or_default();
        let preview_col: String = row.get(2).unwrap_or_default();
        let step_count: i64 = row.get(3).unwrap_or(0);
        let last_mod: String = row.get(4).unwrap_or_default();
        let workspace_uris: String = row.get(5).unwrap_or_default();

        let title = if !title_col.trim().is_empty() {
            title_col
        } else if !preview_col.trim().is_empty() {
            preview_col
        } else {
            id.clone()
        };

        let started_at = parse_iso_or_rfc3339(&last_mod).unwrap_or(0.0);
        let cwd = parse_workspace_uri(&workspace_uris);

        let real_path = conversations_dir
            .as_ref()
            .map(|d| d.join(format!("{}.db", id)))
            .filter(|p| p.exists())
            .map(|p| p.to_string_lossy().to_string())
            .or_else(|| Some(db_path.to_string_lossy().to_string()));

        Ok(AgentSessionEntry {
            id,
            agent: "antigravity".to_string(),
            model: Some("Antigravity".to_string()),
            title: Some(title),
            cwd,
            message_count: step_count,
            started_at,
            ended_at: Some(started_at),
            real_path,
        })
    }) {
        for row in rows.flatten() {
            entries.push(row);
        }
    }

    entries
}

fn preview_antigravity_messages(session_id: &str) -> Vec<AgentSessionMessage> {
    let mut messages = Vec::new();
    let Some(db_path) = antigravity_db_path() else {
        return messages;
    };

    let Ok(conn) = rusqlite::Connection::open_with_flags(
        &db_path,
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    ) else {
        return messages;
    };

    let Ok(mut stmt) = conn.prepare(
        "SELECT title, preview, last_modified_time \
         FROM conversation_summaries \
         WHERE conversation_id = ?1 \
         LIMIT 1",
    ) else {
        return messages;
    };

    if let Ok(mut rows) = stmt.query(rusqlite::params![session_id]) {
        if let Ok(Some(row)) = rows.next() {
            let title: String = row.get(0).unwrap_or_default();
            let preview: String = row.get(1).unwrap_or_default();
            let last_mod: String = row.get(2).unwrap_or_default();
            let ts = parse_iso_or_rfc3339(&last_mod).unwrap_or(0.0);

            if !title.is_empty() {
                messages.push(AgentSessionMessage {
                    role: "user".to_string(),
                    content: Some(title),
                    timestamp: ts,
                });
            }
            if !preview.is_empty() {
                messages.push(AgentSessionMessage {
                    role: "assistant".to_string(),
                    content: Some(preview),
                    timestamp: ts,
                });
            }
        }
    }

    messages
}

// ── 5. OpenCode Sessions ────────────────────────────────────────────────────────

fn opencode_db_path() -> Option<PathBuf> {
    let home = home_dir()?;
    let p1 = home
        .join(".local")
        .join("share")
        .join("opencode")
        .join("opencode.db");
    if p1.exists() {
        return Some(p1);
    }
    let p2 = home
        .join("AppData")
        .join("Roaming")
        .join("OpenCode")
        .join("opencode.db");
    if p2.exists() {
        return Some(p2);
    }
    None
}

fn parse_opencode_model(raw_model: &str) -> Option<String> {
    if raw_model.trim().is_empty() {
        return None;
    }
    if let Ok(val) = serde_json::from_str::<serde_json::Value>(raw_model) {
        if let Some(id) = val.get("id").and_then(|v| v.as_str()) {
            return Some(id.to_string());
        }
        if let Some(model_id) = val.get("modelID").and_then(|v| v.as_str()) {
            return Some(model_id.to_string());
        }
    }
    Some(raw_model.to_string())
}

fn load_opencode_sessions() -> Vec<AgentSessionEntry> {
    let mut entries = Vec::new();
    let Some(db_path) = opencode_db_path() else {
        return entries;
    };

    let Ok(conn) = rusqlite::Connection::open_with_flags(
        &db_path,
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    ) else {
        return entries;
    };

    let Ok(mut stmt) = conn.prepare(
        "SELECT s.id, s.title, s.directory, s.model, s.time_created, s.time_updated, \
         (SELECT COUNT(*) FROM message m WHERE m.session_id = s.id) AS msg_count \
         FROM session s \
         ORDER BY s.time_updated DESC \
         LIMIT 300",
    ) else {
        return entries;
    };

    let real_path_str = db_path.to_string_lossy().to_string();

    if let Ok(rows) = stmt.query_map([], |row| {
        let id: String = row.get(0)?;
        let title_opt: Option<String> = row.get(1)?;
        let dir_opt: Option<String> = row.get(2)?;
        let model_raw: Option<String> = row.get(3)?;
        let time_created: i64 = row.get(4).unwrap_or(0);
        let time_updated: i64 = row.get(5).unwrap_or(0);
        let msg_count: i64 = row.get(6).unwrap_or(0);

        let title = title_opt
            .filter(|t| !t.trim().is_empty())
            .unwrap_or_else(|| id.clone());

        let model = model_raw.as_deref().and_then(parse_opencode_model);

        let updated_sec = if time_updated > 0 {
            (time_updated as f64) / 1000.0
        } else {
            0.0
        };
        let created_sec = if time_created > 0 {
            (time_created as f64) / 1000.0
        } else {
            updated_sec
        };

        let started_at = if updated_sec > 0.0 { updated_sec } else { created_sec };

        Ok(AgentSessionEntry {
            id,
            agent: "opencode".to_string(),
            model,
            title: Some(title),
            cwd: dir_opt,
            message_count: msg_count,
            started_at,
            ended_at: Some(updated_sec),
            real_path: Some(real_path_str.clone()),
        })
    }) {
        for row in rows.flatten() {
            entries.push(row);
        }
    }

    entries
}

fn preview_opencode_messages(session_id: &str, limit: u32) -> Vec<AgentSessionMessage> {
    let mut messages = Vec::new();
    let Some(db_path) = opencode_db_path() else {
        return messages;
    };

    let Ok(conn) = rusqlite::Connection::open_with_flags(
        &db_path,
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    ) else {
        return messages;
    };

    let Ok(mut stmt) = conn.prepare(
        "SELECT m.id, m.time_created, m.data, p.data \
         FROM message m \
         LEFT JOIN part p ON p.message_id = m.id \
         WHERE m.session_id = ? \
         ORDER BY m.time_created ASC, p.time_created ASC",
    ) else {
        return messages;
    };

    struct AccMessage {
        role: String,
        timestamp: f64,
        texts: Vec<String>,
        reasoning: Vec<String>,
    }

    let mut map: std::collections::HashMap<String, AccMessage> = std::collections::HashMap::new();
    let mut order: Vec<String> = Vec::new();

    if let Ok(rows) = stmt.query_map([session_id], |row| {
        let mid: String = row.get(0)?;
        let mtime: i64 = row.get(1).unwrap_or(0);
        let mdata_str: Option<String> = row.get(2)?;
        let pdata_str: Option<String> = row.get(3)?;
        Ok((mid, mtime, mdata_str, pdata_str))
    }) {
        for (mid, mtime, mdata_str, pdata_str) in rows.flatten() {
            if !map.contains_key(&mid) {
                let mut role = "assistant".to_string();
                if let Some(raw) = &mdata_str {
                    if let Ok(val) = serde_json::from_str::<serde_json::Value>(raw) {
                        if let Some(r) = val.get("role").and_then(|v| v.as_str()) {
                            role = r.to_string();
                        }
                    }
                }
                let timestamp = if mtime > 0 {
                    (mtime as f64) / 1000.0
                } else {
                    0.0
                };
                map.insert(
                    mid.clone(),
                    AccMessage {
                        role,
                        timestamp,
                        texts: Vec::new(),
                        reasoning: Vec::new(),
                    },
                );
                order.push(mid.clone());
            }

            if let Some(raw) = pdata_str {
                if let Ok(val) = serde_json::from_str::<serde_json::Value>(&raw) {
                    let ptype = val.get("type").and_then(|v| v.as_str()).unwrap_or("");
                    if ptype == "text" {
                        if let Some(txt) = val.get("text").and_then(|v| v.as_str()) {
                            if !txt.is_empty() {
                                if let Some(acc) = map.get_mut(&mid) {
                                    acc.texts.push(txt.to_string());
                                }
                            }
                        }
                    } else if ptype == "reasoning" {
                        if let Some(txt) = val.get("text").and_then(|v| v.as_str()) {
                            if !txt.is_empty() {
                                if let Some(acc) = map.get_mut(&mid) {
                                    acc.reasoning.push(txt.to_string());
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    for mid in order {
        if let Some(acc) = map.remove(&mid) {
            let content = if !acc.texts.is_empty() {
                Some(acc.texts.join("\n"))
            } else if !acc.reasoning.is_empty() {
                Some(acc.reasoning.join("\n"))
            } else {
                None
            };
            messages.push(AgentSessionMessage {
                role: acc.role,
                content,
                timestamp: acc.timestamp,
            });
        }
    }

    if messages.len() > limit as usize {
        let skip = messages.len() - (limit as usize);
        messages = messages.into_iter().skip(skip).collect();
    }

    messages
}

// ── Tauri Commands ─────────────────────────────────────────────────────────────

#[tauri::command]
pub fn agent_list_sessions(
    _state: State<'_, AppState>,
) -> Result<Vec<AgentSessionEntry>, String> {
    let mut all_sessions = Vec::new();

    // 1. Hermes
    all_sessions.extend(load_hermes_sessions());

    // 2. Claude Code
    all_sessions.extend(load_claude_sessions());

    // 3. Codex
    all_sessions.extend(load_codex_sessions());

    // 4. Antigravity
    all_sessions.extend(load_antigravity_sessions());

    // 5. OpenCode
    all_sessions.extend(load_opencode_sessions());

    // Sort newest first
    all_sessions.sort_by(|a, b| {
        b.started_at
            .partial_cmp(&a.started_at)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    Ok(all_sessions)
}

#[tauri::command]
pub fn agent_session_preview(
    _state: State<'_, AppState>,
    request: AgentSessionPreviewRequest,
) -> Result<Vec<AgentSessionMessage>, String> {
    let limit = request.limit.unwrap_or(30).min(100);
    let agent = request.agent.as_deref().unwrap_or("hermes");

    match agent {
        "claude" => {
            if let Some(ref path) = request.real_path {
                Ok(preview_claude_messages(path, limit))
            } else {
                Ok(Vec::new())
            }
        }
        "codex" => Ok(preview_codex_messages(&request.session_id, limit)),
        "antigravity" => Ok(preview_antigravity_messages(&request.session_id)),
        "opencode" => Ok(preview_opencode_messages(&request.session_id, limit)),
        _ => Ok(preview_hermes_messages(&request.session_id, limit)),
    }
}

#[tauri::command]
pub fn agent_export_session_context(
    _state: State<'_, AppState>,
    request: AgentExportContextRequest,
) -> Result<AgentExportContextResponse, String> {
    let messages = match request.agent.as_str() {
        "claude" => {
            if let Some(ref path) = request.real_path {
                preview_claude_messages(path, 100)
            } else {
                Vec::new()
            }
        }
        "codex" => preview_codex_messages(&request.session_id, 100),
        "antigravity" => preview_antigravity_messages(&request.session_id),
        "opencode" => preview_opencode_messages(&request.session_id, 100),
        _ => preview_hermes_messages(&request.session_id, 100),
    };

    let mut md = String::new();
    md.push_str(&format!(
        "# CONTEXT TỪ SESSION TRƯỚC (Nguồn: {} - Session ID: {})\n\n",
        request.agent.to_uppercase(),
        request.session_id
    ));
    if let Some(ref cwd) = request.cwd {
        md.push_str(&format!("- **Thư mục làm việc:** `{}`\n", cwd));
    }
    if let Some(ref path) = request.real_path {
        md.push_str(&format!("- **Tệp nguồn:** `{}`\n", path));
    }
    if let Some(ref target) = request.target_agent {
        md.push_str(&format!("- **Chuyển sang Agent:** `{}`\n", target));
    }
    md.push_str("\n---\n\n## Lịch sử hội thoại:\n\n");

    for msg in &messages {
        let role_label = if msg.role == "user" {
            "🧑 **Người dùng (User):**"
        } else {
            "🤖 **Trợ lý (AI Assistant):**"
        };
        md.push_str(role_label);
        md.push_str("\n\n");
        if let Some(ref content) = msg.content {
            md.push_str(content);
            md.push_str("\n\n");
        }
    }

    let out_dir = if let Some(ref dir) = request.cwd {
        let p = Path::new(dir);
        if p.is_dir() {
            p.to_path_buf()
        } else {
            home_dir()
                .unwrap_or_else(|| PathBuf::from("."))
                .join(".ai-cli-manager")
                .join("context_handoff")
        }
    } else {
        home_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join(".ai-cli-manager")
            .join("context_handoff")
    };

    let _ = fs::create_dir_all(&out_dir);
    let file_path = out_dir.join(format!("SESSION_CONTEXT_{}.md", request.session_id));
    fs::write(&file_path, &md)
        .map_err(|e| format!("Không thể ghi tệp context tại {}: {}", file_path.display(), e))?;

    Ok(AgentExportContextResponse {
        file_path: file_path.to_string_lossy().to_string(),
        context_markdown: md,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_date_parsing() {
        let t1 = parse_iso_or_rfc3339("2026-09-10 15:41:07.9576924+00:00");
        let t2 = parse_iso_or_rfc3339("2026-09-13T10:58:36.8933687Z");
        let t3 = parse_iso_or_rfc3339("2026-09-22T13:08:57.140Z");
        println!("t1: {:?}, t2: {:?}, t3: {:?}", t1, t2, t3);
        assert!(t1.is_some(), "t1 failed");
        assert!(t2.is_some(), "t2 failed");
        assert!(t3.is_some(), "t3 failed");
    }

    #[test]
    fn test_counts() {
        let h = load_hermes_sessions();
        let c = load_claude_sessions();
        let x = load_codex_sessions();
        let a = load_antigravity_sessions();
        let o = load_opencode_sessions();
        println!("H: {}, C: {}, X: {}, A: {}, O: {}", h.len(), c.len(), x.len(), a.len(), o.len());
        assert!(!h.is_empty(), "H empty");
        assert!(!c.is_empty(), "C empty");
        assert!(!x.is_empty(), "X empty");
        assert!(!a.is_empty(), "A empty");
        assert!(!o.is_empty(), "O empty");
        let first = &o[0];
        let prev = preview_opencode_messages(&first.id, 10);
        assert!(!prev.is_empty(), "OpenCode preview messages empty");
    }
}
