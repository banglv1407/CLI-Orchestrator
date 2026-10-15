# US-058 Mini Terminal Agent Session Titles and Hover

## Status

implemented

## Lane

normal

## Product Contract

Each mini terminal identifies its own agent session using the current terminal
title, with the same full title available on hover.

## Relevant Product Docs

- `docs/product/terminal.md`

## Acceptance Criteria

- Agent-provided terminal titles update the matching mini header and tooltip.
- Concurrent sessions of the same CLI do not share or overwrite titles.
- Resumed Hermes, Claude, Codex, Antigravity, and OpenCode sessions carry their
  saved title through terminal creation and subsequent session-list refreshes.
- Live titles take precedence over saved titles; when neither is available,
  display the CLI name and working folder.
- Right and bottom mini layouts use the same title and hover behavior, including
  long and Unicode titles. User content is not localized.
- Removing a terminal releases its title listener and title state.

## Design Notes

- `TerminalPanel.tsx` listens to the main xterm's `onTitleChange` event before
  pending output is parsed. xterm owns OSC parsing, including split sequences.
- Live titles are indexed by the CLX PTY session ID, independently of CLI name,
  folder, selected session, and mini-terminal recreation.
- `AgentSessionPanel.tsx` passes the selected history entry's title when
  resuming. Optional title metadata is retained by Rust `SessionManager` and
  returned by both terminal creation and session-list queries.
- No heuristic matches against latest agent history or rendered TUI text.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | TypeScript compilation and Rust command/session compatibility |
| Integration | Real xterm OSC parsing and per-session React header updates |
| E2E | Browser fixture: concurrent titles, hover, updates, both layouts |
| Platform | Manual Windows Tauri smoke with actual agent CLIs |
| Release | `npm.cmd run build`; targeted Rust compilation; diff check |

## Harness Delta

- Added US-058 and intake for mini-terminal titles; keep browser fixture proof
  distinct from native desktop/agent acceptance.

## Evidence

- `npm.cmd run build`: PASS (TypeScript and Vite production bundle).
- `cargo check --manifest-path src-tauri/Cargo.toml`: PASS for the default app
  after loading the existing Visual Studio developer environment and setting
  `AWS_LC_SYS_PREBUILT_NASM=1` for this check only. No Cargo/dependency changes.
- Real `@xterm/xterm` smoke: PASS for split OSC 0, OSC 2 with ST, Unicode and
  long titles, alternate-screen parsing, two independent terminals, title
  replacement, clearing, and title-listener disposal.
- `npm.cmd run check:i18n`: PASS; session titles are not translated.
- `rustfmt --check --edition 2021 src-tauri/src/terminal/session_manager.rs`:
  PASS. `git diff --check`: PASS.
- Browser fixture did not reach app rendering: `Page.enable` timed out twice
  in Edge and once in Chrome, although `Browser.getVersion` responded. No
  browser UI or hover acceptance is claimed from that attempted smoke.
- Manual Windows Tauri acceptance with real agent sessions remains pending,
  including both mini layouts, header/hover, live rename, and resume metadata.
- The code is included in the Windows portable `CLX (1011).exe` release;
  build and artifact evidence are recorded in US-060.
