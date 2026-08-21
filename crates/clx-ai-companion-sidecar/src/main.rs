use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::io::{self, BufRead, Read, Write};

mod catalog;
mod config;
mod db;
mod manager;
mod safe_context;
mod service;
mod tools;

fn main() {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .expect("tokio runtime");

    rt.block_on(async {
        let data_root = std::env::var("CLX_DATA_ROOT")
            .unwrap_or_else(|_| {
                let home = dirs::home_dir().expect("home dir");
                home.join(".ai-cli-manager").to_string_lossy().into()
            });
        let db_path = std::path::PathBuf::from(&data_root).join("companion.db");
        let service = service::CompanionService::new(&db_path)
            .expect("Failed to initialize companion service");

        let stdin = io::stdin();
        let stdout = io::stdout();

        loop {
            let mut header = String::new();
            if stdin.lock().read_line(&mut header).unwrap_or(0) == 0 {
                break;
            }
            let header = header.trim();
            if !header.starts_with("Content-Length:") {
                continue;
            }
            let length: usize = header
                .trim_start_matches("Content-Length:")
                .trim()
                .parse()
                .unwrap_or(0);
            if length == 0 || length > 1_048_576 {
                continue;
            }
            // consume blank line
            let mut blank = String::new();
            let _ = stdin.lock().read_line(&mut blank);

            let mut body = vec![0u8; length];
            if stdin.lock().read_exact(&mut body).is_err() {
                break;
            }

            let request: Value = match serde_json::from_slice(&body) {
                Ok(v) => v,
                Err(_) => continue,
            };

            let id = request.get("id").cloned();
            let method = request
                .get("method")
                .and_then(Value::as_str)
                .unwrap_or("")
                .to_string();
            let params = request.get("params").cloned().unwrap_or(Value::Null);

            let result = service.dispatch(&method, params).await;

            let response = match result {
                Ok(value) => serde_json::json!({
                    "jsonrpc": "2.0",
                    "id": id,
                    "result": value,
                }),
                Err(msg) => serde_json::json!({
                    "jsonrpc": "2.0",
                    "id": id,
                    "error": { "code": -32000, "message": msg },
                }),
            };

            let payload = serde_json::to_vec(&response).unwrap();
            let mut out = stdout.lock();
            write!(out, "Content-Length: {}\r\n\r\n", payload.len()).ok();
            out.write_all(&payload).ok();
            out.flush().ok();
        }
    });
}
