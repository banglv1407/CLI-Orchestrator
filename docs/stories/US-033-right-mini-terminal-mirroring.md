# US-033 Right Mini Terminal Mirroring

## Status

implemented

## Lane

normal

## Product Contract

The read-only mini terminal in the right area must show the latest parsed text
from its corresponding main terminal, including sessions that use
alternate-screen TUI rendering such as Codex and OpenCode.

## Relevant Product Docs

- `docs/product/terminal.md`

## Acceptance Criteria

- The right mini terminal shows text already visible in the main terminal.
- New main-terminal output reaches the mini terminal without requiring the
  right panel to be closed and reopened.
- Recreating or resizing a mini terminal does not depend on replaying a partial
  raw ANSI stream.
- Mirroring is throttled and does not add another retained output-history copy.

## Design Notes

- UI surface: `src/components/TerminalPanel.tsx`.
- The main xterm buffer is the authoritative parsed state.
- Mini terminals receive screen snapshots after main-terminal writes and
  resizes, rather than independently parsing the PTY stream.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | TypeScript compilation through the frontend production build |
| Integration | Main write queue schedules a mini-buffer snapshot |
| E2E | Manual right-area check with a shell and Codex or OpenCode |
| Platform | Manual Windows Tauri smoke test |
| Release | `npm.cmd run build` |

## Harness Delta

- Added a matrix row so manual desktop/TUI proof remains visible.

## Evidence

- `npm.cmd run build` passes.
- Manual Windows desktop/TUI proof remains pending.
