# US-001 Exit Choice and Sub-Console

## Status

implemented

## Lane

normal

## Product Contract

1. When the user closes the main window, they should see a message dialog asking if they want to hide the application to the system tray (minitray) or exit completely. If yes, it hides the application; if no, it exits completely.
2. In the terminal session console, the user can split the terminal in half. A new sub-console will open in the other half showing a shell starting in the current interacting directory of the active session. This can be triggered via right-click option "Split Terminal (Ctrl+N)" or by pressing the "Ctrl+N" keyboard shortcut when focused inside the terminal.

## Relevant Product Docs

- `docs/product/README.md`

## Acceptance Criteria

- [x] Application close event shows a confirmation dialog with "Yes" and "No" buttons.
- [x] Choosing "Yes" hides the window to minitray.
- [x] Choosing "No" exits the application completely.
- [x] Context menu (right-click) on terminal panel has a "Split Terminal (Ctrl+N)" option.
- [x] Pressing `Ctrl+N` when focused inside the terminal triggers terminal splitting.
- [x] Splitting opens a new shell console starting in the same working directory as the current session.
- [x] The split console displays side-by-side with the main terminal.
- [x] Closing/stopping the split console works individually.
- [x] Stopping a parent session stops its split sub-console.
- [x] Split consoles are excluded from the side/bottom sessions list.

## Design Notes

- UI: TerminalPanel uses custom flex-row rendering to split viewport when a parent session has a split child session.
- keyboard: Ctrl+N custom key handler added to xterm.js custom key event handler.
- state: `splitSessions` mapping maintained in `Dashboard.tsx` and updated correctly during creation/termination.
- dialog: Tauri `tauri-plugin-dialog` utilized on WindowEvent::CloseRequested on the backend.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Frontend typecheck and build pass |
| Integration | Rust compilation and formatting pass |
| E2E | Manual testing of split pane and close dialog |
| Platform | |
| Release | Production build compiles without error |

## Harness Delta

N/A

## Evidence

- Rust cargo check: compilation succeeds.
- Frontend build: `npm run build` compiles with typecheck and Vite minification successfully.
