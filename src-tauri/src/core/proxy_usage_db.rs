use chrono::Utc;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyBackendUsage {
    pub backend_id: String,
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
    pub reported_requests: u32,
    pub unreported_requests: u32,
    pub reset_at: String,
    pub updated_at: String,
}

pub fn get_db_path() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    Ok(home.join(".ai-cli-manager").join("proxy-usage.db"))
}

pub fn init_db() -> Result<(), String> {
    let path = get_db_path()?;
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    let conn = Connection::open(&path).map_err(|e| format!("Failed to open DB: {}", e))?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS backend_usage (
            backend_id TEXT PRIMARY KEY,
            prompt_tokens INTEGER NOT NULL DEFAULT 0,
            completion_tokens INTEGER NOT NULL DEFAULT 0,
            total_tokens INTEGER NOT NULL DEFAULT 0,
            reported_requests INTEGER NOT NULL DEFAULT 0,
            unreported_requests INTEGER NOT NULL DEFAULT 0,
            reset_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )",
        [],
    )
    .map_err(|e| format!("Failed to create table: {}", e))?;

    Ok(())
}

pub fn get_usage(backend_id: &str) -> Result<ProxyBackendUsage, String> {
    let path = get_db_path()?;
    let conn = Connection::open(&path).map_err(|e| format!("Failed to open DB: {}", e))?;

    let mut stmt = conn
        .prepare("SELECT backend_id, prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests, reset_at, updated_at FROM backend_usage WHERE backend_id = ?1")
        .map_err(|e| format!("Prepare query failed: {}", e))?;

    let row_opt = stmt.query_row(params![backend_id], |row| {
        let prompt: i64 = row.get(1)?;
        let completion: i64 = row.get(2)?;
        let total: i64 = row.get(3)?;
        let reported: i64 = row.get(4)?;
        let unreported: i64 = row.get(5)?;
        Ok(ProxyBackendUsage {
            backend_id: row.get(0)?,
            prompt_tokens: prompt as u32,
            completion_tokens: completion as u32,
            total_tokens: total as u32,
            reported_requests: reported as u32,
            unreported_requests: unreported as u32,
            reset_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    });

    match row_opt {
        Ok(usage) => Ok(usage),
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            // Create a default 0-initialized record
            let now = Utc::now().to_rfc3339();
            conn.execute(
                "INSERT INTO backend_usage (backend_id, prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests, reset_at, updated_at) VALUES (?1, 0, 0, 0, 0, 0, ?2, ?2)",
                params![backend_id, now],
            ).map_err(|e| format!("Insert default usage failed: {}", e))?;

            Ok(ProxyBackendUsage {
                backend_id: backend_id.to_string(),
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
                reported_requests: 0,
                unreported_requests: 0,
                reset_at: now.clone(),
                updated_at: now,
            })
        }
        Err(e) => Err(format!("Query failed: {}", e)),
    }
}

pub fn record_usage(
    backend_id: &str,
    prompt: u32,
    completion: u32,
    total: u32,
    reported: bool,
) -> Result<(), String> {
    let path = get_db_path()?;
    let conn = Connection::open(&path).map_err(|e| format!("Failed to open DB: {}", e))?;

    let now = Utc::now().to_rfc3339();
    let rep_inc = if reported { 1 } else { 0 };
    let unrep_inc = if reported { 0 } else { 1 };

    conn.execute(
        "INSERT INTO backend_usage (backend_id, prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests, reset_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)
         ON CONFLICT(backend_id) DO UPDATE SET
           prompt_tokens = prompt_tokens + ?2,
           completion_tokens = completion_tokens + ?3,
           total_tokens = total_tokens + ?4,
           reported_requests = reported_requests + ?5,
           unreported_requests = unreported_requests + ?6,
           updated_at = ?7",
        params![
            backend_id,
            prompt as i64,
            completion as i64,
            total as i64,
            rep_inc,
            unrep_inc,
            now
        ],
    ).map_err(|e| format!("Failed to record usage: {}", e))?;

    Ok(())
}

pub fn reset_usage(backend_id: &str) -> Result<(), String> {
    let path = get_db_path()?;
    let conn = Connection::open(&path).map_err(|e| format!("Failed to open DB: {}", e))?;

    let now = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO backend_usage (backend_id, prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests, reset_at, updated_at)
         VALUES (?1, 0, 0, 0, 0, 0, ?2, ?2)
         ON CONFLICT(backend_id) DO UPDATE SET
           prompt_tokens = 0,
           completion_tokens = 0,
           total_tokens = 0,
           reported_requests = 0,
           unreported_requests = 0,
           reset_at = ?2,
           updated_at = ?2",
        params![backend_id, now],
    ).map_err(|e| format!("Failed to reset usage: {}", e))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_sql_operations_in_memory() {
        let conn = rusqlite::Connection::open_in_memory().unwrap();
        conn.execute(
            "CREATE TABLE backend_usage (
                backend_id TEXT PRIMARY KEY,
                prompt_tokens INTEGER NOT NULL DEFAULT 0,
                completion_tokens INTEGER NOT NULL DEFAULT 0,
                total_tokens INTEGER NOT NULL DEFAULT 0,
                reported_requests INTEGER NOT NULL DEFAULT 0,
                unreported_requests INTEGER NOT NULL DEFAULT 0,
                reset_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",
            [],
        )
        .unwrap();

        let backend_id = "test-backend-uuid";
        let now = chrono::Utc::now().to_rfc3339();

        // 1. Test initial insert
        conn.execute(
            "INSERT INTO backend_usage (backend_id, prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests, reset_at, updated_at) VALUES (?1, 0, 0, 0, 0, 0, ?2, ?2)",
            rusqlite::params![backend_id, now],
        ).unwrap();

        // 2. Test Record reported usage (upsert conflict)
        conn.execute(
            "INSERT INTO backend_usage (backend_id, prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests, reset_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)
             ON CONFLICT(backend_id) DO UPDATE SET
               prompt_tokens = prompt_tokens + ?2,
               completion_tokens = completion_tokens + ?3,
               total_tokens = total_tokens + ?4,
               reported_requests = reported_requests + ?5,
               unreported_requests = unreported_requests + ?6,
               updated_at = ?7",
            rusqlite::params![backend_id, 10i64, 20i64, 30i64, 1i64, 0i64, now],
        ).unwrap();

        // 3. Verify values
        let mut stmt = conn.prepare("SELECT prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests FROM backend_usage WHERE backend_id = ?1").unwrap();
        let (prompt, completion, total, reported, unreported): (i64, i64, i64, i64, i64) = stmt
            .query_row(rusqlite::params![backend_id], |row| {
                Ok((
                    row.get(0)?,
                    row.get(1)?,
                    row.get(2)?,
                    row.get(3)?,
                    row.get(4)?,
                ))
            })
            .unwrap();

        assert_eq!(prompt, 10);
        assert_eq!(completion, 20);
        assert_eq!(total, 30);
        assert_eq!(reported, 1);
        assert_eq!(unreported, 0);

        // 4. Test Reset
        conn.execute(
            "INSERT INTO backend_usage (backend_id, prompt_tokens, completion_tokens, total_tokens, reported_requests, unreported_requests, reset_at, updated_at)
             VALUES (?1, 0, 0, 0, 0, 0, ?2, ?2)
             ON CONFLICT(backend_id) DO UPDATE SET
               prompt_tokens = 0,
               completion_tokens = 0,
               total_tokens = 0,
               reported_requests = 0,
               unreported_requests = 0,
               reset_at = ?2,
               updated_at = ?2",
            rusqlite::params![backend_id, now],
        ).unwrap();

        let (prompt2, completion2, total2, reported2, unreported2): (i64, i64, i64, i64, i64) =
            stmt.query_row(rusqlite::params![backend_id], |row| {
                Ok((
                    row.get(0)?,
                    row.get(1)?,
                    row.get(2)?,
                    row.get(3)?,
                    row.get(4)?,
                ))
            })
            .unwrap();

        assert_eq!(prompt2, 0);
        assert_eq!(completion2, 0);
        assert_eq!(total2, 0);
        assert_eq!(reported2, 0);
        assert_eq!(unreported2, 0);
    }
}
