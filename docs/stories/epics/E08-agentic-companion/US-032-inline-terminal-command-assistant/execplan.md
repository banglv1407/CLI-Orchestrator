# US-032 execution plan

## Implementation

- [x] Preserve requested session executable and args for environment detection.
- [x] Add typed environment detection for cmd, PowerShell, WSL, and SSH.
- [x] Bound and redact user/terminal context.
- [x] Route directly through saved LLM Proxy backends in configured order,
      independent of Proxy Start/Stop state, with per-backend retry fallback.
- [x] Add cancellation, total timeout, bounded response, and one repair attempt.
- [x] Add strict cmd, PowerShell AST, and target Bash validators.
- [x] Reuse Proxy backend request options and redact direct-attempt log bodies.
- [x] Add caret popup, physical-key shortcut, environment selector, result
      badges, Copy, and guarded Insert-without-Enter.
- [x] Register Tauri commands and frontend typed wrappers.
- [ ] Complete real desktop WSL and SSH fixture acceptance.

## Rollback boundary

The feature is isolated behind three Tauri commands and one terminal-owned
popup. Rollback removes the popup/shortcut, command module registration, and
session runtime metadata fields. No persisted data migration is involved.
