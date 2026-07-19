# Execution Plan

## Implementation Phases

### Phase 1: Manifest and Installer (`open_interpreter_installer.rs`)
- Define the `install_runtime` mechanism:
  - Check if binary exists. If yes, skip.
  - Parse resource manifest: `open-interpreter-manifest.json`.
  - Download tar.zst artifact.
  - Verify SHA-256 hash.
  - Extract `.tar.zst` to target directory using `zstd` and `tar` crates.
  - Run `--version` check to verify execution.

### Phase 2: Subprocess Manager (`open_interpreter_manager.rs`)
- Design `OpenInterpreterManager` inside `AppState`:
  - Starts child process `interpreter acp`.
  - Configures environment: `OPENAI_API_BASE` pointing to local `CliProxyAI` port.
  - Loops on reading lines from stdout and emits Tauri event `open-interpreter-frame` for each line.
  - Loops on reading lines from stderr and logs them.
  - Implements crash recovery: auto-relaunch once and emit notification.

### Phase 3: Tauri Command Bridge
- Create `src-tauri/src/commands/open_interpreter_commands.rs` exposing:
  - `open_interpreter_status()`
  - `open_interpreter_install()`
  - `open_interpreter_start()`
  - `open_interpreter_stop()`
  - `open_interpreter_send(message: String)`
- Register commands in `main.rs`.
