use chrono::{DateTime, Utc};
use rusqlite::{params, Connection, OptionalExtension};
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::collections::{HashMap, HashSet};
use std::fs;
use std::io::Read;
use std::path::{Path, PathBuf};
use thiserror::Error;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CassIndexSummary {
    pub indexed: usize,
    pub skipped: usize,
    pub removed: usize,
    pub tokens: usize,
    pub sessions_total: usize,
    pub tokens_total: usize,
    pub sources: Vec<CassSourceInfo>,
    pub last_indexed_at: String,
    pub errors: usize,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CassIndexStats {
    pub sessions_total: usize,
    pub tokens_total: usize,
    pub sources: Vec<CassSourceInfo>,
    pub last_indexed_at: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CassSourceInfo {
    pub name: String,
    pub path: String,
    pub exists: bool,
    pub files: usize,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CassSearchResult {
    pub session_id: String,
    pub cli_name: String,
    pub path: String,
    pub updated_at: String,
    pub score: i64,
    pub snippet: String,
    pub cwd: Option<String>,
}

#[derive(Error, Debug)]
pub enum CassIndexError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),
    #[error("Missing home directory")]
    MissingHomeDirectory,
}

struct CassSourceDefinition {
    name: &'static str,
    cli_name: &'static str,
    root: PathBuf,
    recursive: bool,
    extensions: &'static [&'static str],
}

struct CassSourceFile {
    cli_name: String,
    path: PathBuf,
    source: String,
}

pub struct CassIndex {
    db: Connection,
    sources: Vec<CassSourceDefinition>,
}

const MAX_SOURCE_BYTES: usize = 2_000_000;

impl CassIndex {
    pub fn new() -> Result<Self, CassIndexError> {
        let home = dirs::home_dir().ok_or(CassIndexError::MissingHomeDirectory)?;
        let root_dir = home.join(".ai-cli-manager");
        let db_path = root_dir.join("cass_index.db");

        fs::create_dir_all(&root_dir)?;

        let db = Connection::open(&db_path)?;
        let sources = default_sources(&home);
        let index = Self { db, sources };
        index.init_schema()?;
        Ok(index)
    }

    fn init_schema(&self) -> Result<(), CassIndexError> {
        self.db.execute("PRAGMA foreign_keys = ON", [])?;

        self.db.execute(
            "CREATE TABLE IF NOT EXISTS cass_sessions (
                session_id TEXT PRIMARY KEY,
                cli_name TEXT NOT NULL,
                path TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                content_hash TEXT NOT NULL,
                size_bytes INTEGER NOT NULL,
                cwd TEXT,
                title TEXT
            )",
            [],
        )?;

        self.db.execute(
            "CREATE TABLE IF NOT EXISTS cass_tokens (
                token TEXT NOT NULL,
                session_id TEXT NOT NULL,
                weight INTEGER NOT NULL,
                PRIMARY KEY (token, session_id),
                FOREIGN KEY (session_id) REFERENCES cass_sessions(session_id) ON DELETE CASCADE
            )",
            [],
        )?;

        self.db.execute(
            "CREATE INDEX IF NOT EXISTS cass_tokens_token_idx ON cass_tokens(token)",
            [],
        )?;

        self.db.execute(
            "CREATE TABLE IF NOT EXISTS cass_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )",
            [],
        )?;

        Ok(())
    }

    pub fn stats(&self) -> Result<CassIndexStats, CassIndexError> {
        let sessions_total: usize = self
            .db
            .query_row("SELECT COUNT(*) FROM cass_sessions", [], |row| row.get(0))?;
        let tokens_total: usize = self
            .db
            .query_row("SELECT COUNT(*) FROM cass_tokens", [], |row| row.get(0))?;
        let last_indexed_at: Option<String> = self
            .db
            .query_row(
                "SELECT value FROM cass_meta WHERE key = 'last_indexed_at'",
                [],
                |row| row.get(0),
            )
            .optional()?;
        let (_files, sources, _errors) = self.collect_sources()?;

        Ok(CassIndexStats {
            sessions_total,
            tokens_total,
            sources,
            last_indexed_at,
        })
    }

    fn collect_sources(
        &self,
    ) -> Result<(Vec<CassSourceFile>, Vec<CassSourceInfo>, usize), CassIndexError> {
        let mut files = Vec::new();
        let mut infos = Vec::new();
        let mut errors = 0;

        for definition in &self.sources {
            let root = &definition.root;
            let exists = root.exists();
            let mut collected = Vec::new();

            if exists {
                match collect_files(root, definition.recursive, definition.extensions) {
                    Ok(mut list) => {
                        collected.append(&mut list);
                    }
                    Err(_) => {
                        errors += 1;
                    }
                }
            }

            infos.push(CassSourceInfo {
                name: definition.name.to_string(),
                path: root.to_string_lossy().to_string(),
                exists,
                files: collected.len(),
            });

            for path in collected {
                files.push(CassSourceFile {
                    cli_name: definition.cli_name.to_string(),
                    path,
                    source: definition.name.to_string(),
                });
            }
        }

        Ok((files, infos, errors))
    }

    pub fn index_logs(&self) -> Result<CassIndexSummary, CassIndexError> {
        let mut indexed = 0;
        let mut skipped = 0;
        let mut removed = 0;
        let mut tokens_indexed = 0;
        let (source_files, sources, mut errors) = self.collect_sources()?;
        if source_files.is_empty() {
            let now = Utc::now().to_rfc3339();
            let stats = self.stats()?;
            return Ok(CassIndexSummary {
                indexed,
                skipped,
                removed,
                tokens: tokens_indexed,
                sessions_total: stats.sessions_total,
                tokens_total: stats.tokens_total,
                sources,
                last_indexed_at: now,
                errors,
            });
        }

        let mut seen_paths = HashSet::new();

        for source in source_files {
            let path = source.path;
            seen_paths.insert(path.clone());
            let content = match read_file_with_limit(&path, MAX_SOURCE_BYTES) {
                Ok(value) => value,
                Err(_) => {
                    errors += 1;
                    continue;
                }
            };
            let session_id = build_session_id(&source.cli_name, &path);
            let cli_name = source.cli_name;

            let hash = sha256_hex(&content);
            let existing_hash: Option<String> = self
                .db
                .query_row(
                    "SELECT content_hash FROM cass_sessions WHERE session_id = ?1",
                    params![session_id],
                    |row| row.get(0),
                )
                .optional()?;

            if existing_hash.as_deref() == Some(&hash) {
                skipped += 1;
                continue;
            }

            let metadata = match fs::metadata(&path) {
                Ok(value) => value,
                Err(_) => {
                    errors += 1;
                    continue;
                }
            };
            let updated_at = metadata
                .modified()
                .ok()
                .map(|value| DateTime::<Utc>::from(value).to_rfc3339())
                .unwrap_or_else(|| Utc::now().to_rfc3339());
            let size_bytes = metadata.len() as i64;
            let cwd = extract_cwd(&content);
            let title = extract_title(&content);

            self.db.execute(
                "INSERT OR REPLACE INTO cass_sessions (session_id, cli_name, path, updated_at, content_hash, size_bytes, cwd, title)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                params![
                    session_id,
                    cli_name,
                    path.to_string_lossy().to_string(),
                    updated_at,
                    hash,
                    size_bytes,
                    cwd,
                    title,
                ],
            )?;

            self.db.execute(
                "DELETE FROM cass_tokens WHERE session_id = ?1",
                params![session_id],
            )?;

            let token_map = tokenize_for_index(&content);
            let tx = self.db.transaction()?;
            {
                let mut stmt = tx.prepare(
                    "INSERT OR REPLACE INTO cass_tokens (token, session_id, weight) VALUES (?1, ?2, ?3)",
                )?;
                for (token, weight) in token_map {
                    stmt.execute(params![token, session_id, weight])?;
                    tokens_indexed += 1;
                }
            }
            tx.commit()?;

            indexed += 1;
        }

        let mut to_remove = Vec::new();
        {
            let mut stmt = self
                .db
                .prepare("SELECT session_id, path FROM cass_sessions")?;
            let rows = stmt.query_map([], |row| {
                Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
            })?;
            for row in rows {
                let (session_id, path) = row?;
                if !seen_paths.contains(&PathBuf::from(path)) {
                    to_remove.push(session_id);
                }
            }
        }

        for session_id in to_remove {
            self.db.execute(
                "DELETE FROM cass_sessions WHERE session_id = ?1",
                params![session_id],
            )?;
            removed += 1;
        }

        let last_indexed_at = Utc::now().to_rfc3339();
        self.db.execute(
            "INSERT OR REPLACE INTO cass_meta (key, value) VALUES ('last_indexed_at', ?1)",
            params![last_indexed_at],
        )?;

        let stats = self.stats()?;

        Ok(CassIndexSummary {
            indexed,
            skipped,
            removed,
            tokens: tokens_indexed,
            sessions_total: stats.sessions_total,
            tokens_total: stats.tokens_total,
            sources,
            last_indexed_at: last_indexed_at,
            errors,
        })
    }

    pub fn search(&self, query: &str, limit: usize) -> Result<Vec<CassSearchResult>, CassIndexError> {
        let query = query.trim();
        if query.is_empty() {
            return Ok(Vec::new());
        }

        let query_tokens = parse_query_tokens(query);
        if query_tokens.is_empty() {
            return Ok(Vec::new());
        }

        let mut scores: HashMap<String, i64> = HashMap::new();
        let mut stmt_exact = self
            .db
            .prepare("SELECT session_id, weight FROM cass_tokens WHERE token = ?1")?;
        let mut stmt_like = self
            .db
            .prepare("SELECT session_id, weight FROM cass_tokens WHERE token LIKE ?1")?;

        for token in &query_tokens {
            let (pattern, boost) = match token.mode {
                QueryMode::Exact => (token.value.clone(), 3_i64),
                QueryMode::Prefix => (format!("{}%", token.value), 2_i64),
                QueryMode::Contains => (format!("%{}%", token.value), 1_i64),
            };

            let mut rows = if matches!(token.mode, QueryMode::Exact) {
                stmt_exact.query(params![pattern])?
            } else {
                stmt_like.query(params![pattern])?
            };

            while let Some(row) = rows.next()? {
                let session_id: String = row.get(0)?;
                let weight: i64 = row.get(1)?;
                let entry = scores.entry(session_id).or_insert(0);
                *entry += weight * boost;
            }
        }

        if scores.is_empty() {
            return Ok(Vec::new());
        }

        let mut scored: Vec<(String, i64)> = scores.into_iter().collect();
        scored.sort_by(|a, b| b.1.cmp(&a.1));
        scored.truncate(limit.max(1));

        let mut results = Vec::new();
        let mut stmt = self.db.prepare(
            "SELECT session_id, cli_name, path, updated_at, cwd FROM cass_sessions WHERE session_id = ?1",
        )?;

        let terms: Vec<String> = query_tokens.iter().map(|token| token.value.clone()).collect();

        for (session_id, score) in scored {
            let row = stmt
                .query_row(params![session_id], |row| {
                    Ok((
                        row.get::<_, String>(0)?,
                        row.get::<_, String>(1)?,
                        row.get::<_, String>(2)?,
                        row.get::<_, String>(3)?,
                        row.get::<_, Option<String>>(4)?,
                    ))
                })
                .optional()?;

            if let Some((session_id, cli_name, path, updated_at, cwd)) = row {
                let snippet = build_snippet(Path::new(&path), &terms);
                results.push(CassSearchResult {
                    session_id,
                    cli_name,
                    path,
                    updated_at,
                    score,
                    snippet,
                    cwd,
                });
            }
        }

        Ok(results)
    }
}

#[derive(Debug, Clone)]
struct QueryToken {
    value: String,
    mode: QueryMode,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum QueryMode {
    Exact,
    Prefix,
    Contains,
}

fn parse_query_tokens(query: &str) -> Vec<QueryToken> {
    let mut tokens = Vec::new();

    for raw in query.split_whitespace() {
        let trimmed = raw.trim();
        if trimmed.is_empty() {
            continue;
        }

        let (mode, inner) = if trimmed.starts_with('*') && trimmed.ends_with('*') && trimmed.len() > 2 {
            (QueryMode::Contains, trimmed.trim_matches('*'))
        } else if trimmed.ends_with('*') && trimmed.len() > 1 {
            (QueryMode::Prefix, trimmed.trim_end_matches('*'))
        } else if trimmed.starts_with('*') && trimmed.len() > 1 {
            (QueryMode::Contains, trimmed.trim_start_matches('*'))
        } else {
            (QueryMode::Exact, trimmed)
        };

        let normalized = normalize_query_term(inner);
        if normalized.len() < 2 {
            continue;
        }

        tokens.push(QueryToken {
            value: normalized,
            mode,
        });
    }

    tokens
}

fn normalize_query_term(raw: &str) -> String {
    raw.chars()
        .filter(|ch| is_token_char(*ch))
        .collect::<String>()
        .to_ascii_lowercase()
}

fn default_sources(home: &Path) -> Vec<CassSourceDefinition> {
    vec![
        CassSourceDefinition {
            name: "claude",
            cli_name: "claude-code",
            root: home.join(".claude").join("projects"),
            recursive: true,
            extensions: &["jsonl", "json", "md", "txt", "log"],
        },
        CassSourceDefinition {
            name: "claude",
            cli_name: "claude-code",
            root: home.join(".claude").join("sessions"),
            recursive: true,
            extensions: &["jsonl", "json", "md", "txt", "log"],
        },
        CassSourceDefinition {
            name: "claude",
            cli_name: "claude-code",
            root: home.join(".claude"),
            recursive: false,
            extensions: &["jsonl", "json", "md", "txt", "log"],
        },
        CassSourceDefinition {
            name: "codex",
            cli_name: "codex",
            root: home.join(".codex").join("sessions"),
            recursive: true,
            extensions: &["jsonl", "json", "md", "txt", "log"],
        },
        CassSourceDefinition {
            name: "gemini",
            cli_name: "gemini",
            root: home.join(".gemini"),
            recursive: true,
            extensions: &["jsonl", "json", "md", "txt", "log"],
        },
    ]
}

fn collect_files(
    root: &Path,
    recursive: bool,
    extensions: &[&str],
) -> Result<Vec<PathBuf>, std::io::Error> {
    let mut files = Vec::new();
    if root.is_file() {
        if has_allowed_extension(root, extensions) {
            files.push(root.to_path_buf());
        }
        return Ok(files);
    }

    let mut stack = vec![root.to_path_buf()];
    while let Some(dir) = stack.pop() {
        for entry in fs::read_dir(&dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                if recursive {
                    stack.push(path);
                }
                continue;
            }

            if path.is_file() && has_allowed_extension(&path, extensions) {
                files.push(path);
            }
        }
    }

    Ok(files)
}

fn has_allowed_extension(path: &Path, extensions: &[&str]) -> bool {
    if extensions.is_empty() {
        return true;
    }

    let Some(ext) = path.extension().and_then(|value| value.to_str()) else {
        return false;
    };

    extensions
        .iter()
        .any(|allowed| allowed.eq_ignore_ascii_case(ext))
}

fn build_session_id(cli_name: &str, path: &Path) -> String {
    let identifier = format!("{}:{}", cli_name, path.to_string_lossy());
    let digest = sha256_hex(&identifier);
    format!("{}-{}", cli_name, &digest[..12])
}

fn read_file_with_limit(path: &Path, max_bytes: usize) -> Result<String, std::io::Error> {
    let mut file = fs::File::open(path)?;
    let mut buffer = Vec::new();
    file.take(max_bytes as u64).read_to_end(&mut buffer)?;
    Ok(String::from_utf8_lossy(&buffer).to_string())
}

fn extract_cwd(content: &str) -> Option<String> {
    for line in content.lines().take(3) {
        if let Some(pos) = line.find("`") {
            let remaining = &line[pos + 1..];
            if let Some(end) = remaining.find('`') {
                let value = &remaining[..end];
                if !value.trim().is_empty() {
                    return Some(value.trim().to_string());
                }
            }
        }
    }
    None
}

fn extract_title(content: &str) -> Option<String> {
    for line in content.lines().take(3) {
        let trimmed = line.trim();
        if trimmed.starts_with('#') {
            return Some(trimmed.trim_start_matches('#').trim().to_string());
        }
    }
    None
}

fn sha256_hex(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    hex::encode(hasher.finalize())
}

fn build_snippet(path: &Path, terms: &[String]) -> String {
    let content = match read_file_with_limit(path, MAX_SOURCE_BYTES) {
        Ok(value) => value,
        Err(_) => return String::new(),
    };

    if content.is_empty() {
        return String::new();
    }

    let lower = content.to_ascii_lowercase();
    let mut match_pos = None;
    let mut match_len = 0;

    for term in terms {
        if term.is_empty() {
            continue;
        }
        if let Some(pos) = lower.find(term) {
            match_pos = Some(pos);
            match_len = term.len();
            break;
        }
    }

    let bytes = content.as_bytes();
    let snippet = if let Some(pos) = match_pos {
        let start = pos.saturating_sub(80);
        let end = (pos + match_len + 120).min(bytes.len());
        String::from_utf8_lossy(&bytes[start..end]).to_string()
    } else {
        let end = bytes.len().min(200);
        String::from_utf8_lossy(&bytes[..end]).to_string()
    };

    snippet
        .replace('\n', " ")
        .replace('\r', " ")
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
}

fn tokenize_for_index(text: &str) -> HashMap<String, i64> {
    let raw_tokens = extract_tokens(text);
    let mut map: HashMap<String, i64> = HashMap::new();

    for token in raw_tokens {
        if token.len() < 2 {
            continue;
        }
        let max_len = token.len().min(24);
        for end in 2..=max_len {
            let prefix = &token[..end];
            let weight = if end == token.len() { 2 } else { 1 };
            let entry = map.entry(prefix.to_string()).or_insert(weight);
            if *entry < weight {
                *entry = weight;
            }
        }
    }

    map
}

fn extract_tokens(input: &str) -> Vec<String> {
    let mut tokens = Vec::new();
    let mut current = String::new();

    for ch in input.chars() {
        if is_token_char(ch) {
            current.push(ch);
        } else if !current.is_empty() {
            push_token_variants(&mut tokens, &current);
            current.clear();
        }
    }

    if !current.is_empty() {
        push_token_variants(&mut tokens, &current);
    }

    tokens
}

fn push_token_variants(target: &mut Vec<String>, token: &str) {
    let normalized = token.to_ascii_lowercase();
    if normalized.len() >= 2 {
        target.push(normalized.clone());
    }

    let mut part = String::new();
    for ch in normalized.chars() {
        if is_token_separator(ch) {
            if part.len() >= 2 {
                target.push(part.clone());
            }
            part.clear();
        } else {
            part.push(ch);
        }
    }

    if part.len() >= 2 {
        target.push(part);
    }
}

fn is_token_char(ch: char) -> bool {
    ch.is_ascii_alphanumeric() || matches!(ch, '_' | '-' | '.' | '+' | '#' | ':' | '/')
}

fn is_token_separator(ch: char) -> bool {
    matches!(ch, '_' | '-' | '.' | ':' | '/')
}
