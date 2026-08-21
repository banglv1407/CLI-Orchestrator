# US-051 Design — AI Companion and Local LLM modules

## Current Architecture

### AI Companion

`CompanionManager` (in `AppState.companion`) is a large runtime that owns:

- `app_handle: Arc<RwLock<Option<tauri::AppHandle>>>` — for emitting streaming
  events (`companion-run-event`) to the frontend
- `config: Arc<RwLock<CompanionConfig>>` — API key, model, endpoint, headers
- `db: Arc<CompanionDb>` — rusqlite: conversation, message, tool_run tables
- `catalog: Catalog` — embedded feature catalog (catalog.json)
- `run_state: Arc<Mutex<RunState>>` — Idle/Running/Cancelling
- `http_client: reqwest::Client` — for calling external LLM APIs
- `cli_registry: Arc<RwLock<Option<...>>>` — injected post-setup for session tools
- `session_manager: Arc<RwLock<Option<...>>>` — injected post-setup for session tools
- `module_host: Arc<StdRwLock<Option<...>>>` — injected post-setup for module RPC

The manager's tool executor dispatches 22 tools. Several already route through
`module_host.call()` to reach extracted modules (proxy.*, quickapps.*). Others
interact directly with Core services (cli_registry for CLI profiles,
session_manager for terminal sessions, app_handle for UI effects).

The terminal command assistant (`terminal_command.rs`, ~1,700 LOC) is a
semi-independent subsystem within the companion module. It has its own
reqwest client, reads `proxy.json` directly (as of US-050), and is called from
the main terminal panel's "explain" feature. It uses `AppState` for:
- `registry` (CLI definitions for context)
- `session_manager` (session state for environment)
- `logger` (system log)
- `modules` (module host for status checks)

### Local LLM

`BuiltinLlmEngine` (in `AppState.builtin_llm`) owns:
- Candle model loading/inference (CPU)
- Tokenizer management
- Config persistence (`~/.ai-cli-manager/builtin-llm.json`)
- Auto-load on startup if model is configured

The engine is behind a Cargo feature gate (`builtin-llm`) so the candle/
tokenizers deps are optional. 6 Tauri commands expose status/load/unload/
generate/config operations.

`send_llm_chat` in `cli_commands.rs` is a standalone chat function that calls
the builtin LLM engine directly — used by the AI chat sidebar as a fallback
when no external API is configured.

## Extraction Design

### clx.ai-companion sidecar

The companion sidecar will be the most complex sidecar yet because it needs to:

1. **Host the HTTP model client** — make outbound API calls to OpenAI-compatible
   endpoints (reqwest + SSE streaming)
2. **Run the tool loop** — execute up to 8 tool calls per turn, with the tool
   executor routing back to Core for session/CLI operations and to other modules
   for their capabilities
3. **Manage SQLite history** — conversation persistence
4. **Stream events** — emit incremental tokens/tool status back to the frontend

**Sidecar → Core callback pattern**: Some companion tools need Core services
(start/stop sessions, list CLIs, get SSH state). After extraction, these become
**reverse RPC calls** from the sidecar back to Core through the module host's
bidirectional JSON-RPC channel. The module host already supports this pattern
(sidecar sends a JSON-RPC request on stdout, Core dispatches and responds).

Core will expose a small set of callback methods that the companion sidecar can
invoke:
- `core.listClis` — CLI definitions
- `core.createSession` / `core.stopSession` — terminal session management
- `core.getEnvironment` — terminal environment context
- `core.emitUiEffect` — navigation, focus, view switching
- `core.getModuleSnapshot` — check if another module is available

**Streaming bridge**: The sidecar emits streaming tokens as JSON-RPC
notifications (`companion.streamEvent`). The module host forwards these as Tauri
events (`companion-run-event`) to the frontend — same shape as today, so
`AIChatPanel.tsx` needs minimal changes beyond switching from direct Tauri
invoke to module-hosted calls.

### clx.local-llm sidecar

Simpler extraction: the sidecar loads the Candle model and exposes:
- `clx.local-llm.status` — loaded/model info
- `clx.local-llm.load` — load model from path
- `clx.local-llm.unload` — unload model
- `clx.local-llm.generate` — inference
- `clx.local-llm.getConfig` / `clx.local-llm.saveConfig` — config CRUD

The `send_llm_chat` function moves into the local-llm sidecar. When the AI
Companion needs local inference, it calls through module RPC:
`module_call("clx.local-llm", "clx.local-llm.generate", ...)`.

### Installer dependency

`clx.local-llm` manifest declares `dependencies: ["clx.ai-companion"]`.
The NSIS generator enforces this: selecting Local LLM auto-selects and locks
AI Companion. The module host also checks dependencies at activation time.

## Risk Assessment

**High risk**: The companion manager's deep integration with Core services
(session management, CLI registry, app handle for events) makes this the
hardest extraction in E13. The reverse RPC pattern (sidecar calling Core) is
new and must be reliable.

**Medium risk**: Terminal command assistant latency — adding JSON-RPC framing
overhead to what is currently a direct function call. Mitigation: the terminal
command assistant already has 300s timeout; RPC framing adds <10ms.

**Low risk**: Local LLM extraction — self-contained, feature-gated, minimal
Core coupling.

## File Impact Summary

### Files to create
- `crates/clx-ai-companion-sidecar/` — sidecar crate
- `crates/clx-local-llm-sidecar/` — sidecar crate
- `modules/clx.ai-companion/` — module pack (manifest, UI)
- `modules/clx.local-llm/` — module pack (manifest, UI)
- `scripts/stage-ai-companion.mjs` — staging script
- `scripts/stage-local-llm.mjs` — staging script

### Files to delete from Core
- `src-tauri/src/companion/` — entire directory (9 files, ~4,100 LOC)
- `src-tauri/src/builtin_llm/` — entire directory (4 files, ~570 LOC)
- `src-tauri/src/commands/builtin_llm_commands.rs` (~130 LOC)
- `src/components/AIChatPanel.tsx` (~400 LOC)
- `src/components/LlmConfigModal.tsx` (~220 LOC)

### Files to modify in Core
- `src-tauri/src/main.rs` — remove companion_* and builtin_llm_* handlers
- `src-tauri/src/app_state.rs` — remove companion and builtin_llm fields
- `src-tauri/src/commands/mod.rs` — remove builtin_llm_commands module
- `src-tauri/src/commands/cli_commands.rs` — remove send_llm_chat
- `src/lib/tauri.ts` — remove companion_* and llm wrappers
- `src/components/CliSidebar.tsx` — remove builtin LLM state/handlers (~120 LOC)
- `src/components/SettingsPanel.tsx` — companion config section → module stub
- `scripts/verify-core-boundaries.mjs` — add companion/llm forbidden tokens
- `scripts/generate-modules-nsh.mjs` — add clx.ai-companion, clx.local-llm
- `package.json` — add build/stage scripts
- `src-tauri/Cargo.toml` — remove builtin-llm feature, candle/tokenizers deps
