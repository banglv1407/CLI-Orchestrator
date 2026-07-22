/// Companion database schema and operations.
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompanionMessageRecord {
    pub id: i64,
    pub conversation_id: String,
    pub run_id: String,
    pub role: String,
    pub content: String,
    pub status: String,
    pub timestamp: String,
}

/// Tool run record for DB (not exposed to frontend directly).
#[allow(dead_code)]
pub(crate) struct CompanionToolRun {
    action_id: String,
    run_id: String,
    tool_id: String,
    arguments: String,
    risk: String,
    approval_state: String,
    result: String,
    created_at: String,
    updated_at: String,
}

pub struct CompanionDb {
    conn: Mutex<Connection>,
}

impl CompanionDb {
    pub fn open(path: &Path) -> Result<Self, String> {
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| format!("mkdir: {}", e))?;
        }
        let conn = Connection::open(path).map_err(|e| format!("open db: {}", e))?;
        let db = Self {
            conn: Mutex::new(conn),
        };
        db.migrate()?;
        Ok(db)
    }

    fn migrate(&self) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS conversation (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL DEFAULT 'Default',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS message (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id TEXT NOT NULL,
                run_id TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('user','assistant','tool','system')),
                content TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'complete',
                timestamp TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (conversation_id) REFERENCES conversation(id)
            );

            CREATE TABLE IF NOT EXISTS tool_run (
                action_id TEXT PRIMARY KEY,
                run_id TEXT NOT NULL,
                tool_id TEXT NOT NULL,
                arguments TEXT NOT NULL DEFAULT '{}',
                risk TEXT NOT NULL DEFAULT 'none',
                approval_state TEXT NOT NULL DEFAULT 'pending',
                result TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            ",
        )
        .map_err(|e| format!("migrate: {}", e))?;

        // Ensure default conversation exists
        conn.execute(
            "INSERT OR IGNORE INTO conversation (id, title) VALUES ('default', 'Default')",
            [],
        )
        .map_err(|e| format!("insert default conv: {}", e))?;

        Ok(())
    }

    pub fn get_history(
        &self,
        conversation_id: &str,
        limit: i64,
    ) -> Result<Vec<CompanionMessageRecord>, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        let mut stmt = conn
            .prepare(
                "SELECT id, conversation_id, run_id, role, content, status, timestamp
                 FROM message WHERE conversation_id = ?1
                 ORDER BY id ASC LIMIT ?2",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt
            .query_map(params![conversation_id, limit], |row| {
                Ok(CompanionMessageRecord {
                    id: row.get(0)?,
                    conversation_id: row.get(1)?,
                    run_id: row.get(2)?,
                    role: row.get(3)?,
                    content: row.get(4)?,
                    status: row.get(5)?,
                    timestamp: row.get(6)?,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut messages = Vec::new();
        for row in rows {
            messages.push(row.map_err(|e| e.to_string())?);
        }
        Ok(messages)
    }

    pub fn add_message(&self, msg: &CompanionMessageRecord) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "INSERT INTO message (conversation_id, run_id, role, content, status, timestamp)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                msg.conversation_id,
                msg.run_id,
                msg.role,
                msg.content,
                msg.status,
                msg.timestamp
            ],
        )
        .map_err(|e| format!("insert msg: {}", e))?;

        conn.execute(
            "UPDATE conversation SET updated_at = datetime('now') WHERE id = ?1",
            params![msg.conversation_id],
        )
        .map_err(|e| format!("update conv: {}", e))?;

        Ok(())
    }

    #[allow(dead_code)]
    pub fn update_message(&self, id: i64, content: &str, status: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE message SET content = ?1, status = ?2 WHERE id = ?3",
            params![content, status, id],
        )
        .map_err(|e| e.to_string())?;
        Ok(())
    }

    #[allow(dead_code)]
    pub fn add_tool_run(&self, tr: &CompanionToolRun) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "INSERT OR REPLACE INTO tool_run (action_id, run_id, tool_id, arguments, risk, approval_state, result, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                tr.action_id,
                tr.run_id,
                tr.tool_id,
                tr.arguments,
                tr.risk,
                tr.approval_state,
                tr.result,
                tr.created_at,
                tr.updated_at
            ],
        )
        .map_err(|e| format!("insert tool_run: {}", e))?;
        Ok(())
    }

    #[allow(dead_code)]
    pub fn update_tool_run(
        &self,
        action_id: &str,
        approval_state: &str,
        result: &str,
    ) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE tool_run SET approval_state = ?1, result = ?2, updated_at = datetime('now') WHERE action_id = ?3",
            params![approval_state, result, action_id],
        )
        .map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn clear_conversation(&self, conversation_id: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "DELETE FROM tool_run WHERE run_id IN (SELECT run_id FROM message WHERE conversation_id = ?1)",
            params![conversation_id],
        )
        .map_err(|e| e.to_string())?;
        conn.execute(
            "DELETE FROM message WHERE conversation_id = ?1",
            params![conversation_id],
        )
        .map_err(|e| e.to_string())?;
        Ok(())
    }
}
