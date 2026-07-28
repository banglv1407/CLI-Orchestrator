# Validation

## Proof Strategy

Use deterministic storage tests for migration and backup behavior, then verify
the tab lifecycle in the desktop modal.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Legacy parse, v2 validation, duplicate IDs, missing active ID |
| Integration | Staged save, backup, reload, malformed-file refusal |
| E2E | Add, rename, switch, confirm/cancel close, close last tab, reopen |
| Platform | Windows modal close flush and app restart |
| Performance | Repeated edits across 20 tabs without save reordering |
| Logs/Audit | Actionable load/save error remains visible |

## Fixtures

- Legacy one-note JSON.
- Valid two-tab v2 JSON.
- Malformed JSON and duplicate-ID state.

## Commands

```text
cargo test --manifest-path src-tauri/Cargo.toml notepad_commands
npm.cmd run build
```

## Acceptance Evidence

- `cargo test --manifest-path src-tauri/Cargo.toml notepad_commands`: 4/4
  Notepad tests passed.
- Full `cargo test --manifest-path src-tauri/Cargo.toml`: 70 passed total
  (5 library + 65 application), one live-provider test ignored.
- `npm.cmd run build`: TypeScript and Vite production build passed.
- Manual desktop tab lifecycle and application-restart proof remain pending.
- `cargo check` is separately blocked on this Windows host by
  `STATUS_DLL_INIT_FAILED` while starting the `aws-lc-sys` build script; the
  same source compiles and passes under `cargo test`.
