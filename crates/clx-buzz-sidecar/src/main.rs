use serde_json::Value;
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};

mod service;
use service::BuzzService;

#[tokio::main]
async fn main() {
    let service = Arc::new(BuzzService::new());
    let stdin = tokio::io::stdin();
    let mut reader = BufReader::new(stdin);
    let mut line = String::new();

    loop {
        line.clear();
        match reader.read_line(&mut line).await {
            Ok(0) => break,
            Ok(_) => {
                let trimmed = line.trim();
                if trimmed.is_empty() { continue; }
                let request: Value = match serde_json::from_str(trimmed) {
                    Ok(v) => v,
                    Err(e) => {
                        let err_resp = serde_json::json!({
                            "jsonrpc": "2.0", "id": null,
                            "error": { "code": -32700, "message": format!("Parse error: {}", e) }
                        });
                        write_frame(&err_resp).await;
                        continue;
                    }
                };
                let id = request.get("id").cloned().unwrap_or(Value::Null);
                let method = request.get("method").and_then(Value::as_str).unwrap_or("").to_string();
                let params = request.get("params").cloned().unwrap_or(Value::Null);
                let svc = service.clone();
                tokio::spawn(async move {
                    let result = svc.handle_call(&method, params).await;
                    let response = match result {
                        Ok(data) => serde_json::json!({"jsonrpc":"2.0","id":id,"result":data}),
                        Err(err) => serde_json::json!({"jsonrpc":"2.0","id":id,"error":{"code":-32000,"message":err}}),
                    };
                    write_frame(&response).await;
                });
            }
            Err(_) => break,
        }
    }
}

async fn write_frame(value: &Value) {
    let json = serde_json::to_string(value).unwrap_or_default();
    let mut stdout = tokio::io::stdout();
    let _ = stdout.write_all(json.as_bytes()).await;
    let _ = stdout.write_all(b"\n").await;
    let _ = stdout.flush().await;
}
