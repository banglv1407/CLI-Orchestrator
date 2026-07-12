use chrono::Local;
use serde::{Deserialize, Serialize};
use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use tokio::sync::Mutex;

// ── Types ────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemLogEntry {
    pub timestamp: String,
    pub level: String,
    pub source: String,
    pub message: String,
}

// ── Ring buffer + file logger ─────────────────────────────────

#[allow(dead_code)]
pub struct SystemLogger {
    buffer: Mutex<Vec<SystemLogEntry>>,
    file_path: PathBuf,
    max_entries: usize,
    max_file_bytes: u64,
}

impl SystemLogger {
    pub fn new(logs_dir: PathBuf) -> Self {
        std::fs::create_dir_all(&logs_dir).ok();
        Self {
            buffer: Mutex::new(Vec::with_capacity(500)),
            file_path: logs_dir.join("system.log"),
            max_entries: 500,
            max_file_bytes: 5 * 1024 * 1024, // 5MB rotate
        }
    }

    #[allow(dead_code)]
    pub async fn log(&self, level: &str, source: &str, message: &str) {
        let entry = SystemLogEntry {
            timestamp: Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
            level: level.to_string(),
            source: source.to_string(),
            message: message.to_string(),
        };

        // Ring buffer (in-memory)
        {
            let mut buf = self.buffer.lock().await;
            while buf.len() >= self.max_entries {
                buf.remove(0);
            }
            buf.push(entry.clone());
        }

        // File persistence (append)
        let line = serde_json::to_string(&entry).unwrap_or_default();
        if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(&self.file_path) {
            let _ = writeln!(f, "{}", line);
            // Rotate if too large
            if let Ok(m) = f.metadata() {
                if m.len() > self.max_file_bytes {
                    let backup = self.file_path.with_extension("log.old");
                    let _ = std::fs::rename(&self.file_path, &backup);
                }
            }
        }
    }

    pub async fn get_logs(&self, limit: usize) -> Vec<SystemLogEntry> {
        let buf = self.buffer.lock().await;
        let len = buf.len();
        let start = if len > limit { len - limit } else { 0 };
        buf[start..].to_vec()
    }

    #[allow(dead_code)]
    pub async fn get_all_logs(&self) -> Vec<SystemLogEntry> {
        self.buffer.lock().await.clone()
    }
}

// ── Macro ─────────────────────────────────────────────────────

#[macro_export]
macro_rules! system_log {
    ($logger:expr, $level:expr, $source:expr, $($arg:tt)*) => {{
        let msg = format!($($arg)*);
        eprintln!("[{}][{}] {}", $level, $source, msg);
        let logger: &Arc<$crate::core::system_log::SystemLogger> = &$logger;
        let lvl: &str = $level;
        let src: &str = $source;
        tokio::spawn({
            let logger = logger.clone();
            let lvl = lvl.to_string();
            let src = src.to_string();
            async move {
                logger.log(&lvl, &src, &msg).await;
            }
        });
    }};
}
