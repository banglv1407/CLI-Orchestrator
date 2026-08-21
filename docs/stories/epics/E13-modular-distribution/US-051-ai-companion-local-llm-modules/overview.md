# US-051 Overview — AI Companion and Local LLM modules

Status: Not started

US-051 continues E13 Phase 4 by extracting the two AI-related features from
Core into signed module packs.

Checkpoint A moves AI Companion — streaming chat, tool dispatch, catalog,
config, SQLite history, safe context, and terminal command assistant — into
`clx.ai-companion`. The companion's tool handlers already route through module
RPC for proxy and quickapps capabilities (established in US-050); extraction
completes the boundary by moving the companion's own code out of Core.

Checkpoint B moves the built-in LLM runtime — Candle inference engine,
tokenizer, config, and model management — into `clx.local-llm`. Per the E13
plan, Local LLM requires AI Companion: the installer selects and locks
AI Companion when Local LLM is chosen.

## Scope

### AI Companion (clx.ai-companion)

Rust backend (~4,100 LOC across 9 files):
- `companion/catalog.rs` + `catalog.json` — feature catalog
- `companion/commands.rs` — 14 Tauri invoke handlers
- `companion/config.rs` — companion config load/save
- `companion/db.rs` — SQLite conversation/message/tool_run
- `companion/manager.rs` — HTTP model client, tool loop, streaming, cancellation
- `companion/safe_context.rs` — filtered app state snapshot
- `companion/terminal_command.rs` — terminal command assistant (~1,700 LOC)
- `companion/tools.rs` — 22 tool definitions and executor

Frontend (~400 LOC):
- `src/components/AIChatPanel.tsx` — streaming chat UI
- Typed wrappers in `src/lib/tauri.ts` (companion_* section)

AppState fields:
- `companion: Arc<CompanionManager>` — initialized in `AppState::new()`

### Local LLM (clx.local-llm)

Rust backend (~700 LOC across 4 files):
- `builtin_llm/engine.rs` — Candle model load/inference
- `builtin_llm/config.rs` — model path, tokenizer config
- `builtin_llm/prompts.rs` — prompt templates
- `commands/builtin_llm_commands.rs` — 6 Tauri invoke handlers

Cargo feature gate:
- `builtin-llm` feature enables `candle-core`, `candle-transformers`, `tokenizers`

Frontend:
- LLM config UI embedded in `CliSidebar.tsx` (~150 LOC)
- `LlmConfigModal.tsx` (~220 LOC)
- `send_llm_chat` calls in `CliSidebar.tsx` and `cli_commands.rs`

AppState fields:
- `builtin_llm: Arc<Mutex<BuiltinLlmEngine>>` — auto-loads on startup if configured

## Dependency graph

```
clx.local-llm ──requires──> clx.ai-companion
clx.ai-companion ──optional capability──> clx.cli-proxy (proxy tool)
clx.ai-companion ──optional capability──> clx.quickapps (quickapps tool)
clx.ai-companion ──optional capability──> clx.ssh (ssh/rdp tools)
```

AI Companion tools that call other modules (proxy.*, quickapps.*, ssh.*) already
route through `module_host.call()` — they degrade gracefully when the target
module is absent or disabled.

## Affected Users

- Windows x64 users who use AI Companion chat.
- Users with local GGUF models loaded through the built-in LLM.
- The terminal command assistant (embedded in companion, used by all terminal
  sessions regardless of AI Companion visibility).

## Non-Goals

- Changing the Companion's streaming protocol or tool schema.
- Extracting SSH, Buzz, NES, or Pet (later stories).
- Adding new tools or model providers.
