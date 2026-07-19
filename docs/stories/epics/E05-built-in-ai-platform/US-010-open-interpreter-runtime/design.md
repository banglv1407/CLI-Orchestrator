# Design

## Directory Layout

All runtime files are stored under `~/.ai-cli-manager/openinterpreter/`:
- `runtime/<version>/` — Location of the extracted binary (e.g. `interpreter.exe`).
- `downloads/` — Pinned tar.zst packages cached here.
- `home/` — Configured as `INTERPRETER_HOME`.

## Manifest Schema

`open-interpreter-manifest.json` is embedded as a resource:
```json
{
  "version": "0.0.25",
  "artifact": "open-interpreter-package-x86_64-pc-windows-msvc.tar.zst",
  "sha256": "e0e264dd95d4a025c7bc4c567bcab15bb940042c320fccac3f46a25ffad5884e",
  "url": "https://github.com/openinterpreter/openinterpreter/releases/download/rust-v0.0.25/open-interpreter-package-x86_64-pc-windows-msvc.tar.zst",
  "license": "Apache-2.0"
}
```

## ACP subprocess management

The ACP process is managed by `OpenInterpreterManager` using `tokio::process::Command`:
- Command: `~/.ai-cli-manager/openinterpreter/runtime/0.0.25/interpreter.exe`
- Argument: `acp`
- Env variables:
  - `INTERPRETER_HOME` = `~/.ai-cli-manager/openinterpreter/home`
  - `OPENAI_API_BASE` = `http://127.0.0.1:<proxy-port>/v1`
  - `OPENAI_API_KEY` = `local-placeholder`
  - `INTERPRETER_CHECK_UPDATES` = `false`
- Stdout / Stderr configuration:
  - Stdin: Piped (used to feed prompt frames to the interpreter).
  - Stdout: Piped (used to parse output protocol frames to emit back to frontend).
  - Stderr: Piped (redirected to debug logger).
