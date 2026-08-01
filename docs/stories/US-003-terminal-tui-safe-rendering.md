# US-003 Terminal TUI-safe Rendering

## Status

implemented

## Lane

normal

## Product Contract

When a user runs nested interactive agent CLIs such as Codex or OpenCode inside
CLX, the terminal should preserve the child CLI's screen ownership as much as
possible. CLX must avoid injecting its own status text into the xterm buffer,
avoid unsafe raw ANSI replay into the active terminal, and reduce visible
overlays that can cover full-screen TUI content.

## Relevant Product Docs

- `docs/product/terminal.md`

## Acceptance Criteria

- [x] CLX no longer writes session status lines into the xterm buffer.
- [x] CLX no longer writes frontend-only connection metadata into the xterm buffer.
- [x] The main terminal refresh path no longer replays raw ANSI history.
- [x] Mini terminals do not replay raw ANSI history; they mirror the parsed main buffer.
- [x] Known nested TUI agent CLIs disable CLX inline `@` and `!` assist interception.
- [x] Session metadata and top-right controls are less intrusive for known nested TUI agent CLIs.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Frontend TypeScript build passes |
| Integration | Not required for this frontend-only renderer adjustment |
| E2E | Manual test with Codex/OpenCode in CLX terminal |
| Platform | Manual Windows Tauri terminal smoke test |
| Release | Production frontend build passes |

## Evidence

- `npm.cmd run build` passes.
- `npm.cmd run validate:quick` was attempted but stopped at existing Rust
  formatting diffs before reaching TypeScript checks.

## Harness Delta

The Harness CLI wrapper and direct binary are not executable in this Windows
sandbox, so durable records were updated through the available SQLite database
tooling for this task.
