# US-056 Terminal Recent CLI and folders

## Status

Retired on 2026-10-13 at the user's request (intake 69). The Recent tab,
its reopen handler, and CLI/folder-pair recording are removed. The left menu
now contains CLIs, VM, Configs, and Explorer. The directory picker's separate
folder history remains available. The original implementation below is
historical; its two feature-specific tests are retired with the removed code.

Current product contract: `docs/product/workspace.md`.

Retirement validation:

- Frontend TypeScript/Vite build PASS.
- Localization audit PASS (1502 complete en/vi/ko messages after removing eight
  strings owned by this feature); existing 10 locale tests and 4 navigation
  tests PASS.
- Current production-bundle browser check PASS for all three languages. Each
  renders exactly CLIs, VM, Configs, and Explorer, and all four views activate.
  Seeded legacy recent-terminal data does not restore the removed menu; the
  separate folder-picker history is retained. Zero runtime exceptions.
- No remaining source imports or calls to the removed history module.
- Production portable build PASS (exit 0), including the final translation
  cleanup. Windows x64 PE32+ GUI format verified. Native desktop acceptance
  not run.

The browser check uses simulated Tauri IPC. Report and screenshots are in
`.temp/sidebar-no-recents/`; runner: `.temp/sidebar-no-recents-smoke.mjs`.

Updated portable: `src-tauri/target/release/CLX (1013-3).exe` (41,494,528 bytes).
SHA256: `ED652A7C15A9EE9185EBAA29617C8AC6C7164D4E4CC112033F469CD823E81E81`.
Build log, exit code and artifact proof:
`.temp/portable-no-recents-build.log`, `.temp/portable-no-recents-exit.txt`,
`.temp/portable-no-recents-artifact.json`.

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
