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

Automated frontend build validates TypeScript and bundling. Visual correctness
for nested TUI CLIs still requires manual testing with at least Codex or
OpenCode inside an interactive CLX session.

The inline assistant additionally requires desktop checks for caret anchoring,
prompt recognition, insert-without-execute behavior, WSL distro probing, and
real SSH fixtures for both Ubuntu/Debian and RHEL-family hosts.
