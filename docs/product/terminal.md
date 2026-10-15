# Terminal

The terminal surface is a PTY-backed xterm.js renderer for interactive CLI
sessions.

## Rendering Contract

- PTY output owns the terminal buffer. App status, session metadata, and helper
  controls must be rendered outside the xterm buffer.
- Full-screen TUI CLIs such as Codex and OpenCode must not receive app-level
  text injection, raw ANSI history replay into the active terminal, or visible
  CLX overlays that cover their primary screen area.
- Inline helper triggers such as file mention and ripgrep search may be disabled
  for known nested TUI agent CLIs when they conflict with the child CLI input
  model.
- Mini terminal previews mirror a throttled plain-text snapshot of the parsed
  main xterm buffer. They do not replay raw ANSI history, because a bounded or
  partial TUI stream cannot reliably restore alternate-screen state.
- Main terminals start at the native PTY's 140-column, 34-row grid so early
  output is parsed at the correct size before the first fit.
- Windows main terminals preserve the boundary between ConPTY's viewport and
  scrollback during reflow. Native resize redraws must retain each logical
  output line once and must not overwrite unrelated history. The adapter uses
  xterm internals confined to `src/lib/terminalResize.ts`; xterm is pinned to
  6.0.0 and upgrades require the native-capture regression checks.
- Window/layout, session selection, and font/appearance changes share one
  debounced fit for the visible main terminal. Hidden terminals retain their
  grid until selected. Fits wait for old-grid output to finish parsing and for
  the preceding native resize to complete; per-session native resize requests
  execute serially and pending intermediate sizes coalesce.
- Returning to a terminal or resizing it preserves a user's scrollback
  position rather than forcing the view to the bottom.

## Clipboard Paste

- Keyboard paste has a single owner: the browser's native paste event handled
  by xterm. `Ctrl+V` (including Caps Lock and `Ctrl+Shift+V`) must not also read
  the clipboard asynchronously or send the Ctrl+V control character to the PTY.
- One paste gesture sends the clipboard payload once, whether clipboard API
  permission is allowed, denied, or has not been requested. Repeating a paste
  intentionally must still insert the same content again.
- xterm preserves terminal paste semantics, including newline normalization
  and bracketed-paste markers when enabled by the child CLI.

## Terminal Search

- `Ctrl+F` / `Cmd+F` opens CLX search for the visible main terminal. A single
  capture listener cancels the browser default and stops propagation before
  xterm handles the key. Repeating the shortcut focuses and selects the query.
- Search uses the parsed terminal buffer, including retained scrollback, rather
  than the DOM or WebView find. Matching is literal and case insensitive;
  punctuation, Unicode, and wrapped lines are supported. Output beyond xterm's
  scrollback retention is not searchable.
- Typing updates the query incrementally. Enter/Shift+Enter in the search input,
  the next/previous buttons, and F3/Shift+F3 or Ctrl/Cmd+G with search open move
  through results once per gesture, wrapping at either end. These gestures must
  not send input to the child CLI. F3 and Ctrl+G retain CLI handling when search
  is closed.
- Show the active index and result count, or the localized No match status.
  Highlighting is bounded to 1000 matches; `1000+` indicates that bound, and an
  untracked active index is shown as a dash.
- Main terminals enable xterm's decoration API required by SearchAddon. A
  temporary logical-line marker preserves a selected search match through
  width/height reflow, including wide-character padding, before the addon's
  delayed refresh. The adapter uses public xterm APIs and releases the marker.
- Switching sessions applies the same open query to the newly visible buffer
  and removes the old session's highlights, cached query, and search selection.
  Background sessions must not update the visible counter. Active results
  refresh when output or dimensions change.
- Clearing the query or closing search removes its highlights and selection.
  Escape/Close returns focus to the terminal. Opening a file or another main
  view closes terminal search. Other editable controls keep their shortcuts.
  Search listeners are disposed when a session or the terminal panel closes.

## Mini Terminal Titles

- Both the bottom tray and right panel offer a display selector: Mini terminal
  (the default live preview) or Title only. The choice is shared by both panels
  and persists under `clx-mini-terminal-display-mode`.
- Title only shows compact session title rows with full-title tooltips, active
  selection, and a stop/close button. Clicking or pressing Enter/Space selects
  the main terminal; session dragging and docking remain available.
- Title only removes the preview and CLI/folder information bar, reduces the
  bottom tray height, and hides preview scaling controls. Mini xterms and their
  pending synchronization work are disposed; main terminals keep running and
  keep their parsed buffers, output, input, and title updates. Returning to
  Mini terminal recreates previews from the current main buffers.
- Every mini terminal uses its corresponding main terminal's current title,
  including agent-provided OSC 0/2 title changes. Titles belong to the PTY
  session ID, so multiple sessions of the same agent remain independent.
- Resuming a session from Agent Sessions carries that agent's saved session
  title into the terminal metadata. For agents that emit conversation titles,
  a live OSC title takes precedence; until one arrives, use the saved title,
  then the CLI name and working folder.
- Hermes keeps its conversation name in `sessions.title` rather than OSC.
  Match its active session registry owner to the PTY's process tree and read
  the exact session row. This supports new/resumed Hermes sessions and Hermes
  started in a local shell; concurrent PTYs stay independent. Windows ConPTYs
  have unique terminal identities, so Hermes's per-terminal current-session
  breadcrumb also tracks `/new` and `/resume` when its lease keeps an old ID.
  A live rename or session switch updates the name on the next two-second refresh while
  the window is visible. Database reads run on a blocking worker.
- For Hermes, its current name overrides technical shell/window titles. Before
  its active owner is registered, a known resume ID can resolve the saved name.
  An untitled current conversation falls back to CLI/folder, not an ID or the
  previously resumed conversation's name. Custom CLI `HERMES_HOME` is honored.
- Both the right and bottom layouts show this title above the mini terminal.
  Title-only rows use the same resolved title.
  Hovering the card, header, or information bar reveals the full current title,
  including long titles. The information bar retains the CLI/folder metadata.
- Session titles are agent/user content and keep their original language.
  Removing a session disposes its title listener and removes its live title.
- Do not infer a title from the latest agent history entry or folder alone:
  another running session can share both the agent and working directory.

## Inline Command Assistant

Press `Ctrl+Alt+?` (the physical Slash key) in the active main terminal to open
a small command assistant beside the xterm caret. It is available only for
normal shell buffers, not known nested TUI/agent CLIs or alternate-screen
programs.

The assistant:

- Detects local Windows cmd/PowerShell and Bash running through WSL or SSH.
- Supports Windows Bash, Ubuntu/Debian, and RHEL-family targets. If detection
  is inconclusive, the user chooses the OS/shell target; local Windows Bash is
  selected by default.
- Sends the user's request plus at most 20 visible, filtered terminal lines to
  the LLM Proxy backends in their saved UI order.
- Calls those configured upstreams directly, using each backend's model,
  headers, transforms, reasoning setting, and retry count before falling back
  to the next backend. This works while the Proxy service is stopped and does
  not start it. AI Companion and the built-in local LLM are not used for
  command generation.
- Accepts only one-line structured output that passes the matching syntax
  validator: strict cmd grammar, PowerShell AST parsing, or `bash -n` in the
  target WSL/SSH environment.
- Always offers Copy. Insert is available only at a recognized empty shell
  prompt and pastes text without sending Enter.

Syntax verification does not guarantee that referenced files, packages,
permissions, network services, or commands exist at runtime.

## Output Bursts

PTY output chunks that are already queued are coalesced before they enter
xterm. This prevents a Codex/OpenCode redraw after reload or resize from
visibly replaying thousands of small chunks from the beginning while preserving
the original byte order and terminal control sequences.

## Validation Notes

Search ownership and navigation are tracked in
`docs/stories/US-065-single-terminal-search.md`. Run
`npm.cmd run test:terminal-search` for shortcut routing, and
`npm.cmd run test:terminal-search:ui` for the current React surface with actual
xterm/SearchAddon and simulated Tauri IPC. The browser check supports
`CLX_SEARCH_BROWSER` and `CLX_SEARCH_BROWSER_NO_SANDBOX=1` on restricted runners.
Native WebView find UI still requires a Windows desktop check.

Resize integrity is tracked in `docs/stories/US-064-main-terminal-resize-integrity.md`.
Run `npm.cmd run test:terminal-resize` for native ConPTY capture regressions,
alternate-screen/reset behavior, colored Unicode history, bounded scrollback,
and serialized resize delivery. Current React browser checks preserve all 60
fixture lines across 15 native redraw stages, keep hidden sessions at their
existing sizes, and wait for outstanding native resizes and writes. These
checks use simulated Tauri IPC; live Windows agent acceptance remains open.

Automated frontend build validates TypeScript and bundling. Visual correctness
for nested TUI CLIs still requires manual testing with at least Codex or
OpenCode inside an interactive CLX session.

The inline assistant additionally requires desktop checks for caret anchoring,
prompt recognition, insert-without-execute behavior, WSL distro probing, and
real SSH fixtures for both Ubuntu/Debian and RHEL-family hosts.
