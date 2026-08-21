# US-049 Overview — Module host, Quick Apps pilot, and installer slice

## Baseline Before This Story

CLX is one Tauri executable. Optional feature React components are statically
included in the main Vite graph, feature-specific commands are registered in
the Core `generate_handler!`, and all feature state is initialized at startup.
Bundling is disabled and the production script changes the product and binary
names by appending an `MMDD` suffix.

Quick Apps is currently imported by `TerminalPanel`, owns five direct Tauri
commands, and initializes `QuickAppRegistry` in `AppState` even when the user
never opens it.

## Target Behavior

Core discovers installed signed packs, exposes typed snapshots, enforces
compatibility/integrity/entitlement before activation, and serves only generic
module operations. Quick Apps is the pilot module and is absent from a Core-only
frontend/backend build. Fresh setup selects Core only; selecting Quick Apps
installs its verified pack files without changing entitlement or user data.

## Implemented Result

The Rust module contracts and host are separate workspace crates. Quick Apps
UI, registry, icon extraction, and process launch now build as a signed module
pack with an on-demand sidecar; Core retains only generic module commands and
contribution slots. Settings exposes installed/runtime module state and can
enable, disable, or restart installed packs without changing files.

The production build now keeps the `CLX`/`clx.exe` identity and synchronized
`0.1.0` version, requires an external Ed25519 signing seed, stages immutable
packs, generates NSIS component sections, and targets current-user NSIS only.
Fresh install selection is Core-only, existing Quick Apps files preselect that
component on rerun, removal preserves user data, and WebView2 is preflight-only.

## Affected Users

- Windows x64 users installing CLX for the current user.
- Existing portable users whose Quick Apps data must remain compatible.
- Release operators building and signing Core and pack artifacts.
- Future module authors consuming the first-party host SDK.

## Affected Product Docs

- `docs/stories/epics/E13-modular-distribution/plan.md`
- `docs/ARCHITECTURE.md`
- `docs/HARNESS.md`
- `docs/FEATURE_INTAKE.md`

## Non-Goals

- Extracting the remaining eight E13 packs in this story.
- Implementing production licensing or accepting third-party publishers.
- Shipping signing secrets, model weights, ROMs, or online services.
