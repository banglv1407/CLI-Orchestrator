#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod service;

use std::io::{self, BufRead, BufReader, Write};

use serde::Deserialize;
use serde_json::{json, Value};

use service::ApiClientService;

const MODULE_ID: &str = "clx.api-client";
const MAX_RPC_BYTES: usize = 1024 * 1024;
const MAX_HEADER_BYTES: usize = 8 * 1024;

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

fn main() {
    if let Err(error) = run() {
        eprintln!("[clx.api-client] sidecar stopped: {error}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let module_id = std::env::var("CLX_MODULE_ID")
        .map_err(|_| "missing CLX_MODULE_ID launch boundary".to_string())?;
    let launch_token = std::env::var("CLX_MODULE_TOKEN")
        .map_err(|_| "missing CLX_MODULE_TOKEN launch boundary".to_string())?;
    if module_id != MODULE_ID || launch_token.len() < 16 {
        return Err("invalid module launch boundary".into());
    }

    let service = ApiClientService::new()?;
    let stdin = io::stdin();
    let stdout = io::stdout();
    let mut reader = BufReader::new(stdin.lock());
    let mut writer = stdout.lock();

    loop {
        let payload = match read_frame(&mut reader)? {
            Some(payload) => payload,
            None => return Ok(()),
        };
        let request: JsonRpcRequest = serde_json::from_slice(&payload)
            .map_err(|_| "malformed JSON-RPC request".to_string())?;
        if request.jsonrpc != "2.0"
            || !request.id.is_number()
            || !constant_time_equal(&request.token, &launch_token)
        {
            return Err("invalid JSON-RPC protocol or launch token".into());
        }
        let response = match service.dispatch(&request.method, request.params) {
            Ok(result) => json!({"jsonrpc":"2.0","id":request.id,"result":result}),
            Err(message) => json!({
                "jsonrpc":"2.0",
                "id":request.id,
                "error":{"code":-32000,"message":message}
            }),
        };
        write_frame(&mut writer, &response)?;
    }
}

fn read_frame(reader: &mut impl BufRead) -> Result<Option<Vec<u8>>, String> {
    let mut header = Vec::new();
    loop {
        let available = reader.fill_buf().map_err(|error| error.to_string())?;
        if available.is_empty() {
            return if header.is_empty() {
                Ok(None)
            } else {
                Err("unexpected EOF in JSON-RPC header".into())
            };
        }
        header.push(available[0]);
        reader.consume(1);
        if header.ends_with(b"\r\n\r\n") {
            break;
        }
        if header.len() >= MAX_HEADER_BYTES {
            return Err("JSON-RPC header exceeds 8 KiB".into());
        }
    }
    let header =
        std::str::from_utf8(&header).map_err(|_| "JSON-RPC header is not UTF-8".to_string())?;
    let mut length = None;
    for line in header.split("\r\n").filter(|line| !line.is_empty()) {
        let (name, value) = line
            .split_once(':')
            .ok_or_else(|| "malformed JSON-RPC header".to_string())?;
        if !name.eq_ignore_ascii_case("Content-Length") || length.is_some() {
            return Err("unsupported or duplicate JSON-RPC header".into());
        }
        length = Some(
            value
                .trim()
                .parse::<usize>()
                .map_err(|_| "invalid Content-Length".to_string())?,
        );
    }
    let length = length.ok_or_else(|| "missing Content-Length".to_string())?;
    if length == 0 || length > MAX_RPC_BYTES {
        return Err("JSON-RPC payload exceeds bounds".into());
    }
    let mut payload = vec![0_u8; length];
    reader
        .read_exact(&mut payload)
        .map_err(|error| error.to_string())?;
    Ok(Some(payload))
}

fn write_frame(writer: &mut impl Write, value: &Value) -> Result<(), String> {
    let payload = serde_json::to_vec(value).map_err(|error| error.to_string())?;
    if payload.len() > MAX_RPC_BYTES {
        return Err("module response exceeds 1 MiB".into());
    }
    write!(writer, "Content-Length: {}\r\n\r\n", payload.len())
        .map_err(|error| error.to_string())?;
    writer
        .write_all(&payload)
        .and_then(|_| writer.flush())
        .map_err(|error| error.to_string())
}

fn constant_time_equal(left: &str, right: &str) -> bool {
    let left = left.as_bytes();
    let right = right.as_bytes();
    let mut difference = left.len() ^ right.len();
    for index in 0..left.len().max(right.len()) {
        difference |= (left.get(index).copied().unwrap_or(0)
            ^ right.get(index).copied().unwrap_or(0)) as usize;
    }
    difference == 0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn framing_and_token_checks_are_bounded() {
        let value = json!({"jsonrpc":"2.0","id":1,"result":{"ok":true}});
        let mut wire = Vec::new();
        write_frame(&mut wire, &value).unwrap();
        let payload = read_frame(&mut BufReader::new(wire.as_slice()))
            .unwrap()
            .unwrap();
        assert_eq!(serde_json::from_slice::<Value>(&payload).unwrap(), value);
        assert!(constant_time_equal("0123456789abcdef", "0123456789abcdef"));
        assert!(!constant_time_equal("0123456789abcdef", "0123456789abcdee"));
    }
}
