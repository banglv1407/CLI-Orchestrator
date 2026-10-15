# US-059 Terminal Ctrl+V Pastes Once

## Status

implemented

## Lane

normal

## Product Contract

Pasting clipboard text into a terminal inserts it once per paste gesture,
including after the user allows clipboard access.

## Relevant Product Docs

- `docs/product/terminal.md`

## Acceptance Criteria

- Ctrl+V sends clipboard text once when clipboard API access is allowed,
  denied, or not requested.
- Caps Lock and Ctrl+Shift+V use the same native paste path without emitting
  a Ctrl+V control character or requesting an asynchronous clipboard read.
- Repeated intentional pastes of identical text remain valid.
- Multiline and Unicode text follows xterm's newline normalization and
  bracketed-paste mode, including in nested agent TUIs.
- Copy shortcuts and the context-menu paste action continue to work.

## Design Notes

- The previous key handler called `navigator.clipboard.readText()` and sent
  the result directly to the PTY, while leaving the browser's default paste
  enabled. xterm also handled that paste event and emitted the same text.
- Keep returning false for the keyboard shortcut to suppress xterm's Ctrl+V
  control character. Do not cancel the browser event or read the clipboard
  in the keyboard handler; xterm's native paste listener owns delivery.
- Do not deduplicate payloads or add a timing window: those would suppress
  legitimate repeated pastes.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | TypeScript compilation |
| Integration | Production key handler and installed xterm native paste path |
| E2E | First clipboard permission grant followed by Ctrl+V in CLX |
| Platform | Windows Tauri clipboard and agent TUI smoke |
| Release | `npm.cmd run build`; `git diff --check` |

## Harness Delta

- Intake and story record a bounded terminal input fix, with clipboard
  permission and repeated-paste scenarios in validation expectations.

## Evidence

- `npm.cmd run build`: PASS (TypeScript and Vite production bundle).
- `node .temp/terminal-paste-smoke.mjs`: PASS. This temporary Node integration
  smoke executes the production key callback and the installed xterm native
  paste handler, simulating DOM event delivery and clipboard API permission
  states. Granted, prompt, and denied states each deliver exactly one payload
  without an asynchronous clipboard read.
- The same smoke against the pre-fix `HEAD` callback reproduces the bug:
  granted access sends two identical `Paste once` payloads for one shortcut.
- Repeated identical pastes, Caps Lock, Ctrl+Shift+V, Unicode, multiline
  normalization, agent-enabled bracketed paste, copy shortcuts, and separate
  session input targets all pass the integration smoke.
- `git diff --check`: PASS. Context-menu paste is outside the keyboard route
  and its implementation is unchanged.
- Actual browser/native clipboard events and the first Allow dialog have not
  been exercised by this Node fixture. Manual Windows Tauri acceptance remains
  pending for the permission dialog and paste into shell and agent sessions.
- The fix is included in the Windows portable `CLX (1011).exe` release;
  build and artifact evidence are recorded in US-060.
