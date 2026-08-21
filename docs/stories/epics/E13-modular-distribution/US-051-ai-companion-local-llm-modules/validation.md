# US-051: AI Companion and Local LLM Module Extraction Validation

## Status: COMPLETE

### Deliverables
1. **Module Packs**:
   - `dist-packs/clx.ai-companion/0.1.0/`: Signed manifest, UI bundle (`dist-modules/clx.ai-companion/index.js`), Sidecar (`clx-ai-companion-sidecar.exe`).
   - `dist-packs/clx.local-llm/0.1.0/`: Signed manifest, UI bundle (`dist-modules/clx.local-llm/index.js`), Sidecar (`clx-local-llm-sidecar.exe`).
2. **Bidirectional JSON-RPC Host**:
   - `clx-module-host` supports sidecar notifications (event streaming) and sidecar-to-Core reverse RPC calls (`core.*`).
   - `CoreModuleBridge` provides secure host callbacks.
3. **Core Cleaned**:
   - Removed companion DB, config, tools, catalog, and manager from Core.
   - Removed `candle-core`, `candle-transformers`, `tokenizers` dependencies from `src-tauri/Cargo.toml`.
   - Removed `builtin_llm` and `companion` fields from `AppState`.
   - Core boundary verifier asserts no companion or local-llm traces in Core source or bundle.
4. **Verification**:
   - `cargo check -p clx`: PASS (zero candle/tokenizers/companion code)
   - `npm run build`: PASS
   - `npm run verify:core-boundaries`: PASS
   - `cargo test`: All 6 module crates passed (50/50 tests)
   - NSIS sections generated for 5 module packs
