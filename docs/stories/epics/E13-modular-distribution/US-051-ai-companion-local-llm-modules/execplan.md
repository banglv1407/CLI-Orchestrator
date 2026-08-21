# US-051 Exec Plan — AI Companion and Local LLM modules

## Goal

Extract both AI feature surfaces through the signed E13 module boundary.
AI Companion becomes `clx.ai-companion` with its own sidecar hosting the
HTTP model client, tool loop, SQLite history, and terminal command assistant.
Local LLM becomes `clx.local-llm` with the Candle inference engine and
tokenizer runtime. Local LLM depends on AI Companion at the installer level.

## Checkpoints

### Checkpoint A — AI Companion (`clx.ai-companion`)

1. Create `crates/clx-ai-companion-sidecar/` with JSON-RPC 2.0 stdio framing.
   Move companion manager, config, DB, catalog, tools, safe context, and
   terminal command assistant into the sidecar crate.

2. Create `modules/clx.ai-companion/` module pack:
   - `manifest.template.json` with capabilities: `networkRequest`, `processLaunch`
   - Move `AIChatPanel.tsx` to module UI, adapt to `host.moduleCall()`
   - Build separate ESM bundle

3. Remove from Core:
   - `src-tauri/src/companion/` directory (all 9 .rs files)
   - `companion_*` and `send_companion_chat` Tauri invoke handlers from `main.rs`
   - `CompanionManager` from `AppState`
   - `companion_*` typed wrappers from `src/lib/tauri.ts`
   - `AIChatPanel.tsx` from `src/components/`

4. Rewire Core consumers:
   - `CliSidebar.tsx` AI chat tab: load module UI contribution or show install stub
   - `companion-run-event` Tauri event: route through module host event bridge
   - Terminal command assistant: the sidecar reads `proxy.json` directly (already
     established in US-050), so no circular dependency on `clx.cli-proxy`

5. Special consideration — terminal command assistant:
   The terminal command assistant (`terminal_command.rs`, ~1,700 LOC) is invoked
   from Core's terminal sessions. After extraction, Core calls it via module RPC
   (`module_call("clx.ai-companion", "clx.ai-companion.terminalCommand", ...)`).
   When AI Companion is not installed, the terminal command feature is simply
   unavailable — Core does not need a fallback.

### Checkpoint B — Local LLM (`clx.local-llm`)

1. Create `crates/clx-local-llm-sidecar/` with JSON-RPC 2.0 stdio framing.
   Move `builtin_llm/` module (engine, config, prompts) into the sidecar.

2. Create `modules/clx.local-llm/` module pack:
   - `manifest.template.json` with dependency: `clx.ai-companion`
   - Move LLM config UI from `CliSidebar.tsx` and `LlmConfigModal.tsx` to module UI
   - Build separate ESM bundle

3. Remove from Core:
   - `src-tauri/src/builtin_llm/` directory (4 .rs files)
   - `builtin_llm_*` Tauri invoke handlers from `main.rs`
   - `BuiltinLlmEngine` from `AppState`
   - `builtin-llm` Cargo feature and `candle-core`, `candle-transformers`,
     `tokenizers` optional dependencies from `src-tauri/Cargo.toml`
   - `send_llm_chat` from `cli_commands.rs`

4. Rewire:
   - LLM config section in CliSidebar: show module UI or install stub
   - `send_llm_chat` callers: route through module RPC

5. Installer dependency:
   - Selecting `clx.local-llm` in NSIS auto-selects `clx.ai-companion`
   - `scripts/generate-modules-nsh.mjs` must encode this dependency

### Checkpoint C — Verification

1. `cargo check -p clx` passes (no companion or llm references)
2. `npm run build` passes (no companion or llm imports)
3. `npm run verify:core-boundaries` passes with new forbidden tokens
4. All module crate tests pass
5. Module staging and NSIS generation succeed for 5 module packs

## Stop Conditions

- Terminal command assistant latency would exceed 500ms per RPC round-trip.
- Companion streaming events would lose ordering guarantees through RPC bridge.
- Companion history DB would need destructive migration.
- Core would retain any `builtin_llm` or `companion` feature-specific registration.
- `candle-core` or `tokenizers` would remain in Core's dependency tree.
