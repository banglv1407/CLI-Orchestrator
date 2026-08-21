use std::env;
use std::io::{self, BufRead, Write};
use std::sync::Arc;
use serde::{Deserialize, Serialize};
use serde_json::Value;

mod server;
mod usage_db;
mod service;
mod stream_assembler;
mod rtk_sanitizer;

use service::ProxyService;

const MAX_HEADER_BYTES: usize = 8 * 1024;
const MAX_PAYLOAD_BYTES: usize = 1024 * 1024;

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
struct JsonRpcRequest {
    jsonrpc: String,
    id: Value,
    method: String,
    #[serde(default)]
    params: Value,
    token: String,
}

#[derive(Debug, Serialize)]
struct JsonRpcResponse<'a> {
    jsonrpc: &'static str,
    id: &'a Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    result: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<JsonRpcError>,
}

#[derive(Debug, Serialize)]
struct JsonRpcError {
    code: i64,
    message: String,
}

#[tokio::main]
async fn main() {
    let expected_module_id = "clx.cli-proxy";
    let module_id = env::var("CLX_MODULE_ID").unwrap_or_default();
    let expected_token = env::var("CLX_MODULE_TOKEN").unwrap_or_default();

    if module_id != expected_module_id || expected_token.is_empty() {
        eprintln!("Invalid environment for module sidecar");
        std::process::exit(1);
    }

    let service = match ProxyService::new() {
        Ok(s) => Arc::new(s),
        Err(err) => {
            eprintln!("Failed to initialize proxy service: {err}");
            std::process::exit(1);
        }
    };

    let stdin = io::stdin();
    let mut reader = stdin.lock();
    let mut stdout = io::stdout();

    loop {
        let payload = match read_frame(&mut reader) {
            Ok(Some(p)) => p,
            Ok(None) => break,
            Err(err) => {
                let _ = write_response(&mut stdout, &Value::Null, Err(format!("protocol error: {err}")));
                break;
            }
        };

        let request: JsonRpcRequest = match serde_json::from_slice(&payload) {
            Ok(req) => req,
            Err(err) => {
                let _ = write_response(&mut stdout, &Value::Null, Err(format!("malformed JSON-RPC: {err}")));
                continue;
            }
        };

        if request.jsonrpc != "2.0" {
            let _ = write_response(&mut stdout, &request.id, Err("only JSON-RPC 2.0 supported".into()));
            continue;
        }

        if !token_matches(&request.token, &expected_token) {
            let _ = write_response(&mut stdout, &request.id, Err("unauthorized module token".into()));
            continue;
        }

        let result = service.dispatch(&request.method, request.params).await;
        if let Err(err) = write_response(&mut stdout, &request.id, result) {
            eprintln!("Failed to write response: {err}");
            break;
        }
    }
}

fn read_frame<R: BufRead>(reader: &mut R) -> Result<Option<Vec<u8>>, String> {
    let mut content_length: Option<usize> = None;
    let mut header_bytes = 0_usize;

    loop {
        let mut line = String::new();
        let bytes = reader.read_line(&mut line).map_err(|e| e.to_string())?;
        if bytes == 0 {
            if header_bytes == 0 {
                return Ok(None);
            }
            return Err("unexpected EOF in headers".into());
        }
        header_bytes += bytes;
        if header_bytes > MAX_HEADER_BYTES {
            return Err("header exceeds bounds".into());
        }
        let trimmed = line.trim_end_matches(|c| c == '\r' || c == '\n');
        if trimmed.is_empty() {
            break;
        }
        if let Some((name, val)) = trimmed.split_once(':') {
            if name.trim().eq_ignore_ascii_case("content-length") {
                let len = val.trim().parse::<usize>().map_err(|_| "invalid Content-Length")?;
                if len > MAX_PAYLOAD_BYTES {
                    return Err("payload exceeds 1 MiB bounds".into());
                }
                content_length = Some(len);
            }
        }
    }

    let len = content_length.ok_or("missing Content-Length header")?;
    let mut buffer = vec![0u8; len];
    reader.read_exact(&mut buffer).map_err(|e| e.to_string())?;
    Ok(Some(buffer))
}

fn write_response<W: Write>(writer: &mut W, id: &Value, outcome: Result<Value, String>) -> io::Result<()> {
    let response = match outcome {
        Ok(result) => JsonRpcResponse {
            jsonrpc: "2.0",
            id,
            result: Some(result),
            error: None,
        },
        Err(msg) => JsonRpcResponse {
            jsonrpc: "2.0",
            id,
            result: None,
            error: Some(JsonRpcError {
                code: -32000,
                message: msg,
            }),
        },
    };
    let payload = serde_json::to_vec(&response)?;
    let header = format!("Content-Length: {}\r\n\r\n", payload.len());
    writer.write_all(header.as_bytes())?;
    writer.write_all(&payload)?;
    writer.flush()
}

fn token_matches(a: &str, b: &str) -> bool {
    a.as_bytes().len() == b.as_bytes().len()
        && a.bytes().zip(b.bytes()).fold(0, |acc, (x, y)| acc | (x ^ y)) == 0
}
