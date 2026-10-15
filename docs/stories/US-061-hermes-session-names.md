# US-061 Hermes Mini Terminals Display Session Names

## Status

implemented

## Lane

normal

## Product Contract

Hermes mini terminals show the name of their current Hermes conversation,
including on hover. A session ID or shell command cannot override that name.

## Relevant Product Docs

- `docs/product/terminal.md`

## Acceptance Criteria

- Resolve the session name from Hermes `sessions.title`, keeping its ID separate.
- Match active Hermes sessions to the owning PTY process, including Windows
  command/Python wrappers. Concurrent sessions in one folder stay independent.
- Fresh sessions, resumed sessions, renames, and in-process session switches
  use the corresponding current name. Never guess from newest history or cwd.
- A known resumed ID can supply its name before Hermes publishes its active
  lease. An untitled session falls back to CLI/folder rather than its ID.
- Both mini layouts and their hover text use the same resolved name.
- Stop background title refresh when the window is hidden or panel unmounted;
  ignore stale requests and release native process-snapshot handles.
- Refresh the Windows portable executable and ZIP with this fix.

## Design Notes

- Installed Hermes source and read-only database inspection confirm that
  `sessions.title` is the conversation name. `display_name` identifies the
  user/chat, not the conversation.
- Hermes CLI reads that title for its status bar but does not emit it as OSC
  0/2. Raw terminal/window titles can contain the launch command and resume ID.
- Its `runtime/active_sessions.json` records each current session ID, owner
  PID, and surface. Resolve the closest CLI/TUI owner in the PTY process tree;
  ambiguous or unrelated owners do not qualify. Read only the exact matching
  database row. Saved resume IDs are an exact fallback for older Hermes builds.
- The classic CLI's active lease can retain the launch ID after `/new` or
  `/resume`. On Windows, CLX assigns each ConPTY a unique `TERM_SESSION_ID`.
  Hermes writes its current ID to the matching `terminal-sessions` breadcrumb
  at startup and each session switch. Prefer that exact breadcrumb for a live
  Hermes owner; exclude breadcrumbs belonging to other registered agents.
  Higher-priority inherited multiplexer identities do not qualify as unique
  CLX breadcrumbs. A plain shell does not retain an exited Hermes breadcrumb.
- Refresh labels through one bounded, non-overlapping two-second request while
  the CLX window is visible. Read filesystem/SQLite on a blocking worker.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | PASS: nine Rust cases and seven frontend cases for ownership, titles, switching, and lifecycle |
| Integration | PASS: native Windows snapshot, read-only SQLite/registry fixtures, xterm paste and OSC regression |
| E2E | Pending: manual current name/hover with concurrent Hermes sessions and rename |
| Platform | PASS: Windows x64 release, PE32+ GUI, system imports, matching ZIP entry |
| Release | PASS: updated portable executable and ZIP; artifact size and SHA256 |

## Harness Delta

- Refine US-058 title precedence for Hermes, whose name is database metadata
  rather than a terminal OSC title.

## Evidence

- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features
  core::hermes_session_titles::tests -- --nocapture`: PASS, nine tests;
  the optional installed-Hermes smoke is ignored by default. Covers two
  independent process trees, nested owners, ambiguity, dead PIDs, ancestry
  cycles, registry formats, exact SQLite names/Unicode/rename, resume flags,
  custom launch aliases/home paths, and native process snapshots.
- The registry/SQLite integration fixture uses the actual native resolver and
  verifies new/resumed/manual-shell targets, live switches and renames, and an
  untitled new conversation replacing an initially named resumed one.
- A second native fixture verifies stale launch leases alongside an updated
  per-terminal breadcrumb: the current conversation name wins, untitled new
  sessions clear the original name, unrelated live registered IDs are excluded,
  stale leases cannot prevent resuming their former conversation,
  and exited Hermes instances do not leave a name attached to a plain shell.
- `npm.cmd run test:terminal-titles`: PASS, seven cases. The panel's actual
  polling effect is driven with delayed IPC and a controlled clock to verify
  hidden-window suspension, cleanup, no overlapping requests during PTY
  changes, and rejection of removed-session results.
- `node .temp/terminal-paste-smoke.mjs`: PASS for single paste across permission
  states, intentional repeat paste, Unicode/multiline, bracketed paste, and
  isolated PTY input. `node .temp/mini-title-parser-smoke.cjs`: PASS for actual
  xterm OSC title updates, independence, clearing, and listener disposal.
- `npm.cmd run check:i18n` and `npm.cmd run test:i18n`: PASS, all 1,507 messages
  and ten language tests. `npx.cmd tsc --noEmit`: PASS.
- The optional `installed_hermes_owners` read-only smoke was attempted but
  could not run: both recorded Hermes CLI owner PIDs had already exited.
  This is not counted as live Hermes/desktop validation. The resolver excludes
  these stale entries, rather than selecting their names for an unrelated PTY.
- Source inspection confirms both mini layouts call the shared name resolver;
  card, title bar, and information-bar hover use that same full name. Native
  hover and a real currently running Hermes conversation still need manual
  acceptance. The existing CLX desktop instance was left running.
- Final production build: PASS in 2m 03s through the repo production entrypoint
  with the existing default features and normal Tauri dependency checks.
  The final command first reran the nine Rust tests successfully and then
  built/packaged the executable; log `.temp/portable-20261011-r2-final.log`.
- Windows portable metadata: PE32+ x64 GUI; product `CLX (1011-2)` version
  `0.2.3`. DLL imports are Windows system DLLs and Universal CRT API sets.
  The ZIP has only the executable; its extracted entry SHA256 matches.
- Updated artifacts:

  | File | Bytes | SHA256 |
  | --- | ---: | --- |
  | `src-tauri/target/release/CLX (1011-2).exe` | 41,494,528 | `FCE9C3EB50741745B66991A41BB073898C6E77D8F79B4705DEDC845475CAB9B0` |
  | `src-tauri/target/release/CLX (1011-2).zip` | 17,969,397 | `36CF27B9F1472296984BF819AF67B604AAEA833DECEB33AEC8BC6D8FAA74E1BE` |

- Machine-readable artifact report: `.temp/portable-20261011-r2-artifacts.json`.
  `git diff --check`: PASS. Native app launch, live Hermes UI name/hover, and
  first clipboard Allow-dialog acceptance remain manual checks; none are
  inferred from the automated fixtures or PE inspection.
