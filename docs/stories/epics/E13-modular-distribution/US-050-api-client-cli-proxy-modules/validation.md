# US-050 Validation Evidence

## Checkpoint A — API Client Module Extraction (Complete)

Evidence collected during earlier iteration. Checkpoint A verified:
- `clx.api-client` UI bundle in `dist-modules/clx.api-client/index.js`
- `clx-api-client-sidecar` crate (5 unit tests passed)
- Core Tauri invoke handlers cleaned (no `api_proxy_*` commands)
- `verify-core-boundaries.mjs` passed

## Checkpoint B — CliProxyAI Module Extraction (Complete)

### B1. New crate: `clx-cli-proxy-sidecar`
- Created at `crates/clx-cli-proxy-sidecar/`
- Owns Axum HTTP proxy server, SQLite usage DB, RTK sanitizer, stream assembler
- JSON-RPC 2.0 stdio framing (same protocol as `clx-api-client-sidecar`)
- **28 tests passed, 0 failed** (including streaming, ponytail, RTK, usage DB, URL joining)

### B2. Module UI: `modules/clx.cli-proxy/`
- `manifest.template.json` with capabilities `networkRequest`, `localServer`
- UI adapter (`api.ts`) routes through `host.moduleCall`
- `ProxyPanel.tsx` moved from Core to module UI
- `index.tsx` registers `cli-proxy.main` and `cli-proxy.settings` contributions
- Module UI bundle built: `dist-modules/clx.cli-proxy/index.js`

### B3. Core cleanup
- Deleted: `src/components/ProxyPanel.tsx`
- Deleted: `src-tauri/src/commands/proxy_commands.rs`
- Deleted: `src-tauri/src/core/proxy_server.rs`
- Deleted: `src-tauri/src/core/proxy_usage_db.rs`
- Removed `proxy_server` field from `AppState`
- Removed `proxy_commands` from `commands/mod.rs` and `core/mod.rs`
- Removed all proxy Tauri invoke commands from `main.rs`
- `SettingsPanel.tsx`: replaced `<ProxyPanel />` with module-install stub
- `DashboardPanel.tsx`: proxy widget now routes through `invoke('module_call', ...)`
- `tauri.ts`: removed all `proxy*` wrapper functions
- `companion/manager.rs`: proxy tool calls route through `module_host.call()`
- `companion/commands.rs`: proxy status reads from module host RPC
- `companion/terminal_command.rs`: self-contained `ProxyBackend`/`ProxyConfig`/`ChatMessage`
  types, reads config from `~/.ai-cli-manager/proxy.json` file directly, logs to
  `SystemLogger` instead of `ProxyState.add_log()`

### B4. Packaging & distribution
- `scripts/stage-cli-proxy.mjs` stages sidecar binary + UI + manifest
- `package.json`: `build:cli-proxy-ui` and `stage:modules:dev` include clx.cli-proxy
- `scripts/generate-modules-nsh.mjs`: generates NSIS config for 3 module packs
- `Cargo.toml` workspace: `clx-cli-proxy-sidecar` member added

### B5. Boundary verification
- `scripts/verify-core-boundaries.mjs` updated:
  - Blocks `ProxyPanel.tsx` in Core frontend
  - Blocks `proxy_commands` in Core Rust
  - Blocks proxy invoke wrappers in Core JS bundles
  - Requires `dist-modules/clx.cli-proxy/index.js` exists
- **Result: PASSED** — "Core/module Quick Apps, API Client, and CliProxyAI boundaries verified."

## Full verification matrix

| Check                                      | Result         |
|--------------------------------------------|----------------|
| `cargo check -p clx`                       | OK (1 warning) |
| `npm run build`                            | OK             |
| `npm run verify:core-boundaries`           | PASSED         |
| `cargo test -p clx-module-contracts`       | 5/5 passed     |
| `cargo test -p clx-module-host`            | 6/6 passed     |
| `cargo test -p clx-api-client-sidecar`     | 5/5 passed     |
| `cargo test -p clx-quickapps-sidecar`      | 2/2 passed     |
| `cargo test -p clx-cli-proxy-sidecar`      | 28/28 passed   |
| `npm run build:cli-proxy-ui`               | OK             |
| `npm run stage:modules:dev`                | OK (3 packs)   |
| `npm run generate:modules-nsh`             | OK (3 packs)   |

Runner concurrency parity: verified — `clx-module-host` serializes RPC via
`Mutex<HashMap<String, SidecarProcess>>` ensuring bounded stdin/stdout I/O.
Stream-abort and timeout fixtures in `clx-api-client-sidecar` confirm clean
cancellation semantics.
