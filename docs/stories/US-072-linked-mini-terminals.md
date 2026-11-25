# US-072 VS Code quick launch and linked mini terminals

## Status

implemented

## Lane

normal: existing terminal behavior, native shell boundary, visible UI contract.

## Product Contract

Right-click a local terminal, its mini card, or an Explorer file/folder to open
its recorded path in VS Code. Right-click any running terminal to create a linked
local shell in the right or bottom mini tray. Ctrl+Backquote creates a linked
local shell from the active terminal, or a root shell in an empty workspace.

## Relevant Product Docs

- `docs/product/terminal.md`

## Acceptance Criteria

- New children inherit the recorded directory of a local parent, including when
  right-clicking an inactive mini card. SSH parents create local children without
  treating remote paths as local directories.
- A graph connects running parent/child sessions across trays, supports horizontal
  and vertical layouts, selecting nodes, reparenting and unlinking without cycles.
- Reloading sessions preserves links; closing a parent preserves its children.
- Graph direction and links persist locally for matching live session IDs.
- VS Code receives literal path arguments, handles spaces/Unicode, and reports
  missing targets or installations. Remote Explorer paths have no local VS Code action.
- en/vi/ko copy, terminal input/broadcast, search, mini previews and view-return
  shortcuts continue to work.

## Design Notes

- `terminalLinks.ts` stores a child-to-parent forest independently of PTY state.
- `TerminalGraph.tsx` renders navigation nodes and SVG connectors; existing xterm
  instances and mini previews remain mounted.
- Native `open_in_vscode` resolves a local installation and passes the canonical
  path directly to the editor process without constructing a shell command.
- The inherited path is the directory recorded in SessionInfo, not live shell
  `cd` tracking. Linking is navigation metadata and does not enable input fanout.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Graph cycles, branching, orphan cleanup, storage; literal native arguments |
| Integration | TypeScript production build, Rust compile, locale audit |
| E2E | Context targets, both trays/directions, focus, reparent/unlink, persistence, failure cleanup |
| Platform | Actual VS Code launch and desktop keyboard behavior recorded separately |

## Harness Delta

Story US-072 and intake #82. Windows uses the Git Bash entrypoint because the
default `bash` resolves to a WSL service denied in this environment.
Backlog #9 records the legacy dev-server broadcast smoke bootstrap failure.
The production graph smoke covers trusted group typing across both trays instead.

## Evidence

- `npm.cmd run build`: TypeScript and production bundle passed.
- `cargo check --manifest-path src-tauri/Cargo.toml --offline` with
  `AWS_LC_SYS_PREBUILT_NASM=1`: default features passed with existing dead-code warnings.
- 17 Node unit checks across links, shortcuts, broadcast and search passed.
- Standalone `rustc --test src-tauri/src/core/vscode.rs`: 2 native argument/path checks passed.
- `npm.cmd run check:i18n`: 1,733 complete en/vi/ko messages passed.
- `test:terminal-links:ui`: 11 production React/xterm scenarios with simulated
  IPC passed, including trusted shortcut/group typing, graph focus/layout,
  inactive context targets, Explorer paths, failure cleanup, buffer preservation,
  persistence, parent closure, and compact layout. Report:
  `.temp/terminal-links/report.json`; images `graph-horizontal.png`,
  `graph-vertical.png`, `menu-vi.png`, `menu-ko.png`, `compact-ko.png` in that folder.
- `test:terminal-shortcuts:ui`: all 25 production regression scenarios passed,
  including empty workspace, all main views, drafts, groups, cycle and menus.
  Report: `.temp/terminal-shortcuts/report.json`.
- Legacy `test:terminal-broadcast:ui` did not bootstrap its dev fixture (empty
  exception-free Vite page); Edge also timed out at `Page.enable`. Attempts with
  an isolated cache/TS transform did not resolve it and those fixture changes
  were reverted. The production fixture above verified selected-session typing.
- Portable delivery on 2026-11-25: `build-portable.bat` completed the standard
  default-feature production build in the Visual Studio x64 environment.
  `src-tauri/target/release/CLX (1125).exe`, v0.2.3, Windows x64 PE32+ GUI,
  43,724,800 bytes, SHA256
  `C93C78E0809DAD32F89FB48EF46C7B35A395BB086F726D249FD8ABB322CC9DA4`.
  All 225 recorded source inputs remained unchanged. DLL imports inspected.
  Artifact report: `.temp/exe-1125/artifact.json`.
- The final packaged EXE passed 5 existing native shortcut/startup/PTY checks
  and 6 additional native feature checks: Unicode/spaced-directory child
  creation, bottom/right placement, held shortcut, actual child command output,
  graph orientation/reparent/unlink/cycle prevention, opening the requested file
  in an actual VS Code window, and preserving descendants after closing a parent.
  The editor check required execution outside the agent sandbox because its
  default permissions blocked VS Code profile initialization. Final run passed;
  no browser exceptions and zero remaining test PTYs. The pre-existing desktop
  `CLX (1111)` process was preserved.
  Reports: `.temp/exe-1125/native-report.json` and
  `.temp/native-terminal-shortcut/report.json`; capture
  `.temp/exe-1125/native-window.png`.
- Native keyboard proof uses DevTools automation. Physical OS interception,
  external agent providers and other operating systems remain unverified.
