# US-066 Mini Terminal Multi-Selection and Shared Text

## Status

Implemented.

## Lane

Normal: bounded frontend behavior; existing behavior, public UI contract, and
weak proof. Validate actual modifier gestures and exact recipient payloads.

## Product Contract

Users can Ctrl-click mini terminals to select multiple sessions across the
bottom and right panels. Typing or pasting into the selected main terminal
then sends the same input to that group.

## Relevant Product Docs

- `docs/product/terminal.md`
- `docs/product/localization.md`
- `README.md`

## Acceptance Criteria

- Plain click or Enter/Space activates one terminal and replaces the selection.
- Ctrl-click (Cmd-click on macOS) adds/removes a session; Ctrl+Enter/Space also
  toggles a focused card. Modifier selection does not drag, reorder, or dock.
- Both preview and title-only modes show selected recipients separately from
  the active terminal. Selection spans both panels and survives display changes.
- Selecting two or more running terminals reveals a recipient count and clear
  selection control. Input remains in the main terminal; no separate composer.
- Typing, Unicode/IME, Enter, Shift+Enter, editing/control keys, and clipboard
  paste reach all selected running sessions once. Paste respects each
  recipient's bracketed-paste mode and terminal newline normalization.
- xterm protocol replies, focus reports, and input from unselected/background
  terminals stay local. Search and copy shortcuts do not send input to the group.
- Pending keystrokes keep the recipients selected when they were typed.
- Single-terminal input/paste and per-session close remain independent.
  Closing/exiting sessions removes them from the group. Selection is not persisted.
- Closing the active recipient focuses a surviving member without discarding
  the group. Late session-stop/status callbacks cannot reset a newer selection.
- New interface text has complete English, Vietnamese, and Korean translations.

## Design Notes

- Keep selection in TerminalPanel. Reuse the existing per-session
  input callback; no backend API or PTY lifecycle changes.
- Keep group status outside terminal buffers. Snapshot live recipients before
  input batching; preserve whitespace and each recipient's paste protocol.
- A small xterm 6 adapter confines the internal user-input signal to
  `src/lib/terminalBroadcast.ts`; xterm upgrades must verify user input versus
  protocol replies, including delayed IME completion. Addon disposal owns listeners.
- Session lifecycle callbacks update the active ID functionally so an async
  stop completion cannot overwrite a newer group selection.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Selection toggles, recipient filtering, terminal paste and input classification |
| Integration | TypeScript/production build and localization audit |
| E2E | Browser fixture with real React/xterm, trusted Ctrl-click/keys, exact simulated IPC recipients, mixed paste modes, protocol isolation, close/exit and both modes/panels |
| Platform | Native Windows/real agent acceptance remains separate |
| Release | Packaged executable not requested |

## Harness Delta

Intake #71 and story US-066 track the selection and shared text contract.
The feature smoke inspects actual xterm handles through a test-only Vite
observer and checks the exact simulated IPC recipients. It retries once only
when cold dependency discovery leaves an empty page before React initializes.

## Evidence

- `npm.cmd run build`: TypeScript and production Vite build passed. Existing
  Browserslist, shared plugin import, and bundle-size notices remain.
- `npm.cmd run test:terminal-broadcast`: 6 unit tests passed for modifier
  selection, exact running-recipient filtering, paste payloads, user/protocol
  input classification, mouse isolation, and listener disposal.
- `npm.cmd run test:terminal-broadcast:ui` with installed Chromium and
  `CLX_BROADCAST_BROWSER_NO_SANDBOX=1`: all 11 browser cases passed, using
  current React and xterm with simulated Tauri IPC. Trusted Ctrl-click spans
  both panels without docking/reordering; Unicode and actual IME composition,
  Enter/Shift+Enter/Backspace/Ctrl+C, repeated clipboard-event fixtures with
  mixed bracketed-paste modes, app shortcut isolation, DSR/focus/mouse protocol
  isolation, original-recipient buffering, keyboard selection, both display
  modes, active-recipient close/exit, en/vi/ko, clear, and reload all passed.
  Zero runtime exceptions and console errors. Report:
  `.temp/terminal-broadcast/report.json`; screenshot:
  `.temp/terminal-broadcast/multi-terminal-vi.png`.
- `npm.cmd run test:terminal-titles`: 7 existing tests passed.
- `npm.cmd run test:terminal-search`: 3 existing tests passed.
- `npm.cmd run test:terminal-search:ui`: all 12 browser search regressions
  passed with zero runtime exceptions. An initial run timed out before React
  initialized; the subsequent run passed. Report:
  `.temp/terminal-search/report.json`.
- `npm.cmd run check:i18n`: 1,506 complete en/vi/ko messages passed.
- `npm.cmd run test:i18n:ui`: production-browser regression passed all locales,
  mini-terminal modes/buffers/selection/close, navigation, and persistence with
  zero runtime exceptions. Report: `.temp/i18n-browser/report.json`.
- `node --check scripts/terminal-broadcast-smoke.mjs` and `git diff --check`
  passed.
- Native Windows Tauri, real agent/PTY acceptance, and a packaged executable
  were not run. Browser clipboard payloads were supplied by clipboard-event
  fixtures; native desktop paste remains part of platform acceptance.
- Subsequent release US-067 includes this feature in `CLX (1015).exe`.
  Its real native shell/shortcut startup smoke passed; group input itself still
  has browser-fixture proof and awaits native multi-session/provider acceptance.
