# US-056 Terminal Recent CLI and folders

## Status

Implemented.

## Lane

Normal: bounded additive local history and existing terminal launch integration.

## Product Contract

Terminal Orchestrator has a Recent tab showing CLI and working folder, newest
first. Click launches a new terminal through the existing launch flow with
that CLI's current configuration and the saved folder.

## Relevant Product Docs

- README.md

## Acceptance Criteria

- Save only successfully created local CLI and Quick shell sessions.
- Retain 50 unique exact CLI-folder pairs, newest first; reuse moves to top.
- Persist across restart; ignore malformed history without preventing launch.
- Missing CLI is disabled; launch errors leave history unchanged.
- No saved command, arguments or environment secrets; current registry is used.

## Design Notes

- src/lib/terminal-recents.ts owns validation and localStorage persistence.
- RecentTerminals renders the list and suppresses concurrent clicks.
- Dashboard records successful CLI and Quick shell launches.
- Existing folder-picker history is retained separately.
- Historical launch times cannot be reconstructed from the old folder-only
  history. The new list begins recording when this version is used.
- Remote SSH/RDP and directory changes typed inside a running shell are excluded.

## Validation

- node --test scripts/terminal-recents.test.mjs
- npm.cmd run build
- git diff --check
- Manual desktop: launch two CLI-folder pairs, reopen older pair, restart,
  verify newest order and persisted entries; remove CLI and verify disabled row.

## Harness Delta

Intake #49, story US-056.

## Evidence

Two Node tests PASS (parsing/order/deduplication and persistence/reuse/cap/storage
failure). Frontend tsc/Vite build PASS, 133 modules. git diff --check PASS.
Desktop interaction/restart checks not yet exercised.

Production build PASS: src-tauri/target/release/CLX (0908).exe (40,166,400 bytes).
