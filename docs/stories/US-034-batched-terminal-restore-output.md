# US-034 Batched Terminal Restore Output

## Status

implemented

## Lane

normal

## Product Contract

When a running Codex or OpenCode session redraws after the CLX window reloads
or the PTY is resized, the terminal should render the latest redraw promptly
instead of visibly processing each small output chunk from the beginning.

## Relevant Product Docs

- `docs/product/terminal.md`

## Acceptance Criteria

- Queued PTY chunks retain their original byte order.
- All chunks already waiting in the frontend queue enter xterm as one batch.
- Pending output received before a terminal is initialized is also written as
  one batch.
- Main-terminal scroll preservation and right mini-terminal synchronization
  continue to work.
- Per-session pending and write queues retain their existing byte bounds.

## Design Notes

- UI surface: `src/components/TerminalPanel.tsx`.
- The change coalesces queued strings only; it does not alter PTY reads,
  terminal control sequences, or child-process behavior.
- Output arriving during an in-flight xterm write becomes the next batch.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | TypeScript compilation through the production frontend build |
| Integration | Existing queued and pre-initialization output paths batch in order |
| E2E | Reload a long Codex conversation and observe no slow top-to-bottom replay |
| Platform | Manual Windows Tauri smoke test |
| Release | `npm.cmd run build` and `git diff --check` |

## Harness Delta

- Added US-034 so the manual long-conversation reload proof remains visible.

## Evidence

- `npm.cmd run build` passes.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features`
  passes 74 tests; 1 saved-live-provider test is intentionally ignored.
- `git diff --check` passes.
- Manual Windows Codex reload proof pending.
