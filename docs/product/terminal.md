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
- Mini terminal previews may skip raw history replay when alternate-screen ANSI
  output is detected, because replaying a TUI stream is not equivalent to a live
  terminal state restore.

## Validation Notes

Automated frontend build validates TypeScript and bundling. Visual correctness
for nested TUI CLIs still requires manual testing with at least Codex or
OpenCode inside an interactive CLX session.
