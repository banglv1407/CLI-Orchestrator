# US-032 — Inline terminal command assistant

## User story

As a terminal user, I want to press `Ctrl+Alt+?`, describe an operation, and
receive a command for the active shell so that I can review, copy, or insert it
without leaving the terminal.

## Acceptance criteria

1. The physical Slash shortcut opens a small popup beside the active main
   xterm caret and stays within the terminal viewport.
2. Known nested TUI/agent CLIs and alternate-screen buffers do not open it.
3. Local cmd/PowerShell and Bash through local Windows, WSL, or SSH are
   detected. Ubuntu/Debian and RHEL-family hosts map to the matching package
   manager; uncertain probes require an OS/shell choice and default to local
   Windows Bash.
4. Only the request, environment, and last 20 visible redacted lines are sent.
5. Saved LLM Proxy backends are called directly in their configured UI order,
   including each backend's actual model/request options and retry count. The
   next backend is the fallback. Routing works while the Proxy service is
   stopped; it is not auto-started, and neither AI Companion nor the built-in
   LLM is used.
6. The result is one physical-line command that passes the target syntax
   validator. One repair attempt per provider is allowed.
7. Copy is always available. Insert is enabled only at a recognized empty
   prompt, inserts without Enter, and revalidates the prompt on click.
8. Closing, changing view, or changing session cancels the active request.
9. Proxy request/response logs do not retain terminal context, requests, or
   generated commands from this feature.

## Non-goals

- Executing commands automatically.
- Guaranteeing command availability, permissions, or runtime success.
- Supporting arbitrary shells or Linux distro families in v1.
- Running inside Codex, OpenCode, or another nested full-screen TUI.
