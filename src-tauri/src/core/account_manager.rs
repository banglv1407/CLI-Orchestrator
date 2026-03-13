use chrono::{DateTime, Utc};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use thiserror::Error;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountProfile {
    pub id: String,
    pub cli_name: String,
    pub profile_name: String,
    pub created_at: String,
    pub last_used: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountAuthFile {
    pub id: String,
    pub account_id: String,
    pub original_path: String,
    pub vault_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountStatus {
    pub cli_name: String,
    pub active_profile: Option<String>,
    pub available_profiles: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CooldownEntry {
    pub cli_name: String,
    pub profile_name: String,
    pub until: String,
}

#[derive(Error, Debug)]
pub enum AccountError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),
    #[error("Database lock poisoned")]
    DbLockPoisoned,
    #[error("Missing home directory")]
    MissingHomeDirectory,
    #[error("Profile not found: {0}")]
    ProfileNotFound(String),
    #[error("CLI not supported: {0}")]
    UnsupportedCli(String),
    #[error("No auth files found for CLI: {0}")]
    NoAuthFiles(String),
}

pub struct AccountManager {
    vault_dir: PathBuf,
    db: Mutex<Connection>,
}

impl AccountManager {
    pub fn new() -> Result<Self, AccountError> {
        let home = dirs::home_dir().ok_or(AccountError::MissingHomeDirectory)?;
        let root_dir = home.join(".ai-cli-manager");
        let vault_dir = root_dir.join("vault");
        let db_path = root_dir.join("accounts.db");

        fs::create_dir_all(&vault_dir)?;

        let db = Connection::open(&db_path)?;
        let manager = Self {
            vault_dir,
            db: Mutex::new(db),
        };
        manager.init_schema()?;

        Ok(manager)
    }

    fn init_schema(&self) -> Result<(), AccountError> {
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        db.execute(
            "CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY,
                cli_name TEXT NOT NULL,
                profile_name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                last_used TEXT,
                UNIQUE(cli_name, profile_name)
            )",
            [],
        )?;

        db.execute(
            "CREATE TABLE IF NOT EXISTS account_auth_files (
                id TEXT PRIMARY KEY,
                account_id TEXT NOT NULL,
                original_path TEXT NOT NULL,
                vault_path TEXT NOT NULL,
                FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
            )",
            [],
        )?;

        db.execute(
            "CREATE TABLE IF NOT EXISTS cooldown (
                cli_name TEXT NOT NULL,
                profile_name TEXT NOT NULL,
                until TEXT NOT NULL,
                PRIMARY KEY (cli_name, profile_name)
            )",
            [],
        )?;

        Ok(())
    }

    pub fn get_auth_file_paths(cli_name: &str) -> Vec<(PathBuf, &'static str)> {
        let home = dirs::home_dir().unwrap_or_default();
        match cli_name {
            "claude-code" | "claude" => vec![
                (home.join(".claude.json"), "claude_json"),
                (home.join(".config/claude-code/auth.json"), "auth_json"),
            ],
            "codex" => vec![
                (home.join(".codex/auth.json"), "auth_json"),
            ],
            "gemini" => vec![
                (home.join(".gemini/settings.json"), "settings_json"),
                (home.join(".gemini/oauth_creds.json"), "oauth_creds_json"),
            ],
            _ => vec![],
        }
    }

    pub fn backup_account(&self, cli_name: &str, profile_name: &str) -> Result<AccountProfile, AccountError> {
        let auth_paths = Self::get_auth_file_paths(cli_name);
        
        if auth_paths.iter().filter(|(p, _)| p.exists()).count() == 0 {
            return Err(AccountError::NoAuthFiles(cli_name.to_string()));
        }

        let vault_dir = self.vault_dir.join(cli_name).join(profile_name);
        fs::create_dir_all(&vault_dir)?;

        let profile_id = Uuid::new_v4().to_string();
        let now = Utc::now().to_rfc3339();

        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        db.execute(
            "INSERT OR REPLACE INTO accounts (id, cli_name, profile_name, created_at, last_used) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![profile_id, cli_name, profile_name, now, now],
        )?;

        for (source_path, filename) in &auth_paths {
            if source_path.exists() {
                let dest = vault_dir.join(filename);
                fs::copy(source_path, &dest)?;

                let file_id = Uuid::new_v4().to_string();
                db.execute(
                    "INSERT INTO account_auth_files (id, account_id, original_path, vault_path) VALUES (?1, ?2, ?3, ?4)",
                    params![file_id, profile_id, source_path.to_string_lossy().to_string(), dest.to_string_lossy().to_string()],
                )?;
            }
        }

        Ok(AccountProfile {
            id: profile_id,
            cli_name: cli_name.to_string(),
            profile_name: profile_name.to_string(),
            created_at: now.clone(),
            last_used: Some(now),
        })
    }

    pub fn activate_account(&self, cli_name: &str, profile_name: &str) -> Result<(), AccountError> {
        let vault_dir = self.vault_dir.join(cli_name).join(profile_name);
        
        if !vault_dir.exists() {
            return Err(AccountError::ProfileNotFound(format!("{}/{}", cli_name, profile_name)));
        }

        let auth_paths = Self::get_auth_file_paths(cli_name);

        for (source_path, filename) in &auth_paths {
            let vault_file = vault_dir.join(filename);
            if vault_file.exists() {
                if let Some(parent) = source_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                fs::copy(&vault_file, source_path)?;
            }
        }

        let now = Utc::now().to_rfc3339();
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        db.execute(
            "UPDATE accounts SET last_used = ?1 WHERE cli_name = ?2 AND profile_name = ?3",
            params![now, cli_name, profile_name],
        )?;

        Ok(())
    }

    pub fn delete_account(&self, cli_name: &str, profile_name: &str) -> Result<(), AccountError> {
        let vault_dir = self.vault_dir.join(cli_name).join(profile_name);
        
        if vault_dir.exists() {
            fs::remove_dir_all(&vault_dir)?;
        }

        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        db.execute(
            "DELETE FROM accounts WHERE cli_name = ?1 AND profile_name = ?2",
            params![cli_name, profile_name],
        )?;

        Ok(())
    }

    pub fn list_accounts(&self, cli_name: &str) -> Result<Vec<AccountProfile>, AccountError> {
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        let mut stmt = db.prepare(
            "SELECT id, cli_name, profile_name, created_at, last_used FROM accounts WHERE cli_name = ?1 ORDER BY last_used DESC"
        )?;

        let profiles = stmt.query_map(params![cli_name], |row| {
            Ok(AccountProfile {
                id: row.get(0)?,
                cli_name: row.get(1)?,
                profile_name: row.get(2)?,
                created_at: row.get(3)?,
                last_used: row.get(4)?,
            })
        })?.filter_map(Result::ok).collect();

        Ok(profiles)
    }

    pub fn get_account_status(&self, cli_name: &str) -> Result<AccountStatus, AccountError> {
        let active = self.get_active_profile(cli_name)?;
        let profiles = self.list_accounts(cli_name)?;

        Ok(AccountStatus {
            cli_name: cli_name.to_string(),
            active_profile: active,
            available_profiles: profiles.into_iter().map(|p| p.profile_name).collect(),
        })
    }

    pub fn get_active_profile(&self, cli_name: &str) -> Result<Option<String>, AccountError> {
        let auth_paths = Self::get_auth_file_paths(cli_name);
        
        let mut current_hash: Option<String> = None;
        for (path, _) in &auth_paths {
            if path.exists() {
                let content = fs::read(path)?;
                let mut hasher = Sha256::new();
                hasher.update(&content);
                let hash = hex::encode(hasher.finalize());
                current_hash = Some(hash);
                break;
            }
        }

        let vault_dir = self.vault_dir.join(cli_name);
        if !vault_dir.exists() {
            return Ok(None);
        }

        for entry in fs::read_dir(&vault_dir)? {
            let entry = entry?;
            let profile_name = entry.file_name().to_string_lossy().to_string();
            let profile_dir = vault_dir.join(&profile_name);

            if !profile_dir.is_dir() {
                continue;
            }

            for (source_path, filename) in &auth_paths {
                let vault_file = profile_dir.join(filename);
                if vault_file.exists() && source_path.exists() {
                    let vault_content = fs::read(&vault_file)?;
                    let current_content = fs::read(source_path)?;
                    
                    let mut vault_hasher = Sha256::new();
                    vault_hasher.update(&vault_content);
                    let vault_hash = hex::encode(vault_hasher.finalize());
                    
                    let mut current_hasher = Sha256::new();
                    current_hasher.update(&current_content);
                    let current_hash_val = hex::encode(current_hasher.finalize());

                    if vault_hash == current_hash_val {
                        return Ok(Some(profile_name));
                    }
                }
            }
        }

        Ok(None)
    }

    pub fn set_cooldown(&self, cli_name: &str, profile_name: &str, minutes: i64) -> Result<(), AccountError> {
        let until = Utc::now() + chrono::Duration::minutes(minutes);
        
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        db.execute(
            "INSERT OR REPLACE INTO cooldown (cli_name, profile_name, until) VALUES (?1, ?2, ?3)",
            params![cli_name, profile_name, until.to_rfc3339()],
        )?;

        Ok(())
    }

    pub fn get_cooldown(&self, cli_name: &str, profile_name: &str) -> Result<Option<CooldownEntry>, AccountError> {
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        let mut stmt = db.prepare(
            "SELECT cli_name, profile_name, until FROM cooldown WHERE cli_name = ?1 AND profile_name = ?2"
        )?;

        let result = stmt.query_row(params![cli_name, profile_name], |row| {
            Ok(CooldownEntry {
                cli_name: row.get(0)?,
                profile_name: row.get(1)?,
                until: row.get(2)?,
            })
        });

        match result {
            Ok(entry) => {
                let until: DateTime<Utc> = entry.until.parse().unwrap_or_else(|_| Utc::now());
                if until > Utc::now() {
                    Ok(Some(entry))
                } else {
                    self.clear_cooldown(cli_name, profile_name)?;
                    Ok(None)
                }
            }
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(AccountError::Database(e)),
        }
    }

    pub fn clear_cooldown(&self, cli_name: &str, profile_name: &str) -> Result<(), AccountError> {
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        db.execute(
            "DELETE FROM cooldown WHERE cli_name = ?1 AND profile_name = ?2",
            params![cli_name, profile_name],
        )?;
        Ok(())
    }

    pub fn list_cooldowns(&self) -> Result<Vec<CooldownEntry>, AccountError> {
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        let mut stmt = db.prepare(
            "SELECT cli_name, profile_name, until FROM cooldown"
        )?;

        let entries: Vec<CooldownEntry> = stmt.query_map([], |row| {
            Ok(CooldownEntry {
                cli_name: row.get(0)?,
                profile_name: row.get(1)?,
                until: row.get(2)?,
            })
        })?.filter_map(Result::ok).filter(|e| {
            if let Ok(until) = DateTime::parse_from_rfc3339(&e.until) {
                until.with_timezone(&Utc) > Utc::now()
            } else {
                false
            }
        }).collect();

        Ok(entries)
    }

    pub fn select_next_profile(&self, cli_name: &str) -> Result<Option<String>, AccountError> {
        let profiles = self.list_accounts(cli_name)?;
        
        if profiles.is_empty() {
            return Ok(None);
        }

        for profile in &profiles {
            let cooldown = self.get_cooldown(cli_name, &profile.profile_name)?;
            if cooldown.is_none() {
                return Ok(Some(profile.profile_name.clone()));
            }
        }

        Ok(profiles.first().map(|p| p.profile_name.clone()))
    }

    pub fn get_all_cli_names(&self) -> Result<Vec<String>, AccountError> {
        let db = self.db.lock().map_err(|_| AccountError::DbLockPoisoned)?;
        let mut stmt = db.prepare("SELECT DISTINCT cli_name FROM accounts")?;
        let names: Vec<String> = stmt.query_map([], |row| row.get(0))?
            .filter_map(Result::ok)
            .collect();
        Ok(names)
    }
}
