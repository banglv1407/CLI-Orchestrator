# US-067 Global Ctrl+Backquote New Terminal and Windows Release

## Status

Implemented.

## Lane

Normal: bounded global keyboard behavior, existing interaction contract and
stronger browser/native validation.

## Product Contract

Ctrl+` creates and focuses a new local shell from every CLX application area.
The old Ctrl+Shift+N binding is removed. Deliver a runnable Windows executable
containing this change and the preceding mini-terminal group input feature.

## Relevant Product Docs

- `docs/product/terminal.md`
- `README.md`

## Acceptance Criteria

- One capture owner installed before React catches Ctrl+Backquote from empty
  workspaces, xterm, sidebar, settings, editors, modals, palette and games.
- Recognize the physical Backquote key across layouts; allow literal backquote
  when code is unavailable. Ignore unrelated modifier chords, composition and
  key repeat. No shortcut bytes reach PTYs or other focused controls.
- Each new press creates one session, switches to terminal view and focuses its
  xterm once mounted. Old Ctrl+Shift+N no longer creates a session. Other global
  shortcuts keep their current behavior.
- Preserve file/notepad/form drafts while temporarily showing the new terminal;
  offer Return to previous view. Hidden game key mapping must not capture input.
- Inherit the active local folder; use the shell default from a remote session.
- Build the standard production Windows x64 executable with embedded frontend,
  validate metadata and perform an isolated native launch/shortcut smoke when
  available. Preserve the user's existing application process.

## Design Notes

- Capture keydown/keyup before React mounts; dispatch one app event to Dashboard.
- Dashboard owns creation and navigation; TerminalPanel owns delayed xterm focus.
- Temporary view suspension preserves draft state; no file write/discard occurs.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Shortcut chords, repeat, cancellation, cleanup |
| Integration | Build/typecheck and localization audit |
| E2E | Trusted browser keys across all main views, editable controls, modals, key mapping, no PTY leakage, draft restoration |
| Platform | Windows x64 artifact and isolated native startup/shortcut smoke |
| Release | Standard production build, executable metadata/hash |

## Harness Delta

Intake #72 and story US-067 track the shortcut and release.

## Evidence

- `npm.cmd run test:terminal-shortcuts`: all 3 chord/capture/repeat/disposal
  tests passed. The existing broadcast (6), title (7) and search (3) unit
  regressions also passed.
- `npm.cmd run check:i18n`: 1,507 complete en/vi/ko messages passed.
- `npm.cmd run build:production -- --no-bundle --ci`: passed with the VS x64
  environment, `AWS_LC_SYS_PREBUILT_NASM=1` and the standard compatibility guard.
  The embedded frontend compiled successfully; optimized Rust finished in
  3m 30s. Existing Rust unused-code and frontend bundle/import notices remain.
- All 20 production-browser shortcut cases passed empty workspaces, xterm, all
  main views, editable controls, priority over later capture handlers,
  hidden game key mapping, new-terminal broadcast-group reset, notepad/palette,
  and restoration of unsaved file/CLI form drafts. No shortcut
  bytes reached the simulated PTYs. Report:
  `.temp/terminal-shortcuts/report.json`.
- `npm.cmd run test:terminal-broadcast:ui`: all 11 existing real-xterm browser
  regressions passed with simulated Tauri IPC and zero runtime exceptions.
- Native release smoke passed 5 cases against the actual Windows Tauri binary,
  WebView2, real IPC and local PTYs: embedded frontend startup; held shortcut
  creates one focused shell; typed echo produces an independent output line;
  shortcut opens a second focused shell from Settings; old chord creates none.
  Zero runtime exceptions. Both test shells were stopped and the test process
  exited; the pre-existing CLX process was preserved. Report:
  `.temp/native-terminal-shortcut/report.json`; screenshot:
  `.temp/native-terminal-shortcut/native-verified.png`.
- Native automation uses a separate WebView2 profile and DevTools input. The
  managed runner needed test-only `--no-sandbox --disable-gpu` and did not need
  Page.enable subscriptions. These arguments are not configured in the app.
  Physical keyboard/OS interception and real agent providers were not tested.
- Artifact: `src-tauri/target/release/CLX (1015).exe`, 41,498,624 bytes;
  SHA256 `2FF55608674D028ABCCBA9A44660CF63806D125C215341E7FD02421A5F3642AC`.
  Windows x64 PE32+ GUI, product name `CLX (1015)`, version `0.2.3`, only
  Windows/UCRT runtime imports. Input hashes match the final checkout.
  Metadata: `.temp/portable-20261015-artifact.json`; build log:
  `.temp/portable-20261015-build.log`; exit status: 0.
- `node --check` on the new browser/native smoke scripts and
  `git diff --check`: passed. No installer or ZIP was requested.
