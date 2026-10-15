# US-065 Single Terminal Search Ownership and Navigation

## Status

implemented

Source fix, automated validation and Windows portable packaging complete on
2026-10-13. Native desktop acceptance is separate.

## Lane

normal

Risk flags: existing behavior and weak proof.

## Product Contract

Ctrl+F in the main terminal must open one CLX search over its parsed output and
retained scrollback. Search gestures must cancel the browser default, navigate
one match at a time, and keep results scoped to the visible session.

The user explicitly chose CLX buffer search over default WebView find.

## Relevant Product Docs

- `docs/product/terminal.md`
- `docs/stories/US-064-main-terminal-resize-integrity.md`
- `docs/stories/US-059-terminal-single-paste.md`

## Acceptance Criteria

- [x] One Ctrl/Cmd+F owner prevents the browser default from xterm and the
  search input, including repeat and Caps Lock.
- [x] Actual SearchAddon highlights work; incremental typing, literal Unicode
  queries, scrollback, counters, forward/backward navigation and wrapping work.
- [x] Blank/closed search clears decorations and search selection; switching
  terminals clears the old cache and ignores its subsequent output.
- [x] The selected result survives width/height reflow and wide-character
  padding. Active output and resize refresh the count.
- [x] Search gestures send no child input; other views and editable controls
  keep their shortcuts. F3/Ctrl+G belong to the CLI when search is closed.
- [ ] Native Windows WebView2 find UI remains absent during these gestures in
  a live CLX desktop session.

## Design Notes

The previous xterm custom handler returned false for Ctrl+F without calling
preventDefault. xterm returns early in that case, so the browser default was
not canceled. A second global bubble handler also opened search, excluded
textarea focus, and did not restrict handling to the terminal view. Repeated
Ctrl+F from the search textbox therefore fell through to native find.

The main Terminal constructor also omitted `allowProposedApi`. Installed
xterm 6.0.0 rejects SearchAddon's `registerDecoration` calls without that
option, so a successful match could throw before rendering its highlight.
The old UI displayed a boolean Found label and treated every edit as Next;
empty input did not clear old decorations.

`src/lib/terminalSearch.ts` routes search gestures from one window capture
listener and supplies literal, case-insensitive addon options with RGB
highlight colors. TerminalPanel enables the required API and subscribes to
`onDidChangeResults` for index/count. The displayed count is bounded by the
addon's 1000-highlight limit; queries continue to navigate beyond that bound.

Search state follows the visible main session. Effects clear old highlights
and cached queries, rerun the open query for the selected session, and close
search when another main view or file opens. Closing only clears a normal
selection when that handle was actually searched. Event listeners and focus
frames are cleaned up with the session/panel.

xterm clears selections on height changes. SearchAddon's subsequent delayed
refresh would then start at the bottom and change the current result. A
public-API resize adapter saves a search selection as offsets within its
logical line, uses a temporary marker to follow reflow, and restores the
selection after resize. Offsets account for padding around wide characters.
The marker is disposed immediately; ordinary mouse-selection behavior remains
with xterm. The prior ConPTY resize adapter stays in the resize chain.

## Validation

| Layer | Proof |
| --- | --- |
| Unit | 3 shortcut-routing tests pass, including cancellation, one callback, composition, unrelated controls and CLI keys |
| Integration / E2E | 12 current-React browser cases pass with installed xterm 6.0.0 and SearchAddon 0.16.0; simulated Tauri IPC; zero runtime exceptions |
| Regression | 10 native-capture resize tests, 7 title tests and 9 paste smoke scenarios pass |
| Localization | Audit passes all 1510 complete en/vi/ko entries; counters use language-independent numeric notation |
| Platform | Live native WebView2 find UI and agent keyboard acceptance pending |
| Release | Frontend and production portable build exit 0; Windows x64 GUI PE verified |

Browser cases cover trusted Ctrl+F event cancellation from xterm, a single
search bar, off-screen scrollback, actual DOM decorations, incremental typing,
Enter/Shift+Enter/F3/Ctrl+G navigation, repeat/Caps Lock/Cmd+F, toolbar actions,
literal punctuation/Unicode, wide-character reflow across three window sizes,
no match/empty input, two independent sessions, active/background output,
Escape while a refresh is pending, view/editable scoping and 1000+ cleanup.
Handled search gestures produce zero `send_cli_input` calls in the fixture.

Commands passed:

```powershell
npm.cmd run test:terminal-search
$env:CLX_SEARCH_BROWSER='C:\Users\july1\AppData\Local\ms-playwright\chromium-1223\chrome-win64\chrome.exe'
$env:CLX_SEARCH_BROWSER_NO_SANDBOX='1'
npm.cmd run test:terminal-search:ui
npm.cmd run test:terminal-resize
npm.cmd run test:terminal-titles
node .temp\terminal-paste-smoke.mjs
npm.cmd run check:i18n
node node_modules\typescript\bin\tsc --noEmit
```

The production build also ran `npm.cmd run build` (TypeScript plus Vite)
successfully before compiling and packaging the native executable.

## Evidence

Branch `dev`, HEAD `d6805f209867a6d943aea2c2a683cc862d424a0d`, current working
tree including previous uncommitted work. The isolated browser uses a generated
Vite observer to inspect the actual TerminalPanel handles; that observer and
all diagnostic state stay outside production source.

`scripts/terminal-search.test.mjs` and `scripts/terminal-search-smoke.mjs` are
executable regressions. `.temp/terminal-search/report.json` retains the 12
passing browser cases. One earlier fresh-browser setup timed out before
session initialization; the final fresh run completed all cases. This check
proves DOM event cancellation and frontend behavior, not physical native
WebView find UI acceptance. The running user desktop was not restarted.

Portable release: `src-tauri/target/release/CLX (1013-2).exe` (41,494,528 bytes),
including the preceding main-terminal resize fix. Production build exited 0;
PE inspection confirms Windows x64 PE32+ GUI.
SHA256: `AB7BD8B81EB91CD6B25539868D8C012EC12B536C570A8F668D04DC2D7B2E6A33`.
Build log, exit code and artifact metadata are retained in
`.temp/portable-search-build.log`, `.temp/portable-search-exit.txt` and
`.temp/portable-search-artifact.json`.

## Harness Delta

Intake 68 links this change to US-065 and the terminal product contract. Keep
browser keyboard proof separate from live native desktop acceptance. The
search browser regression now checks the required decoration API and retained
selection across resizing, which a TypeScript-only build cannot establish.
