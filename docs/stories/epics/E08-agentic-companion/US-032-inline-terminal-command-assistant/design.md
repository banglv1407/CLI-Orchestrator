# US-032 design

## Flow

`TerminalPanel` intercepts `Ctrl+Alt+Slash` through xterm's custom key handler,
computes the caret rectangle from the active buffer and cell geometry, and asks
Rust to detect the environment. The popup collects a one-line request and
captures only the current 20 visible xterm rows when Generate is pressed.

Rust owns the trust boundary:

1. Re-read session runtime metadata by session ID.
2. Reject non-shell sessions; probe WSL/SSH with bounded commands.
3. Apply only a supported typed environment override.
4. Redact known Companion, Proxy, and SSH secrets plus common credential/token
   patterns.
5. Call the Companion endpoint with the fixed command policy.
6. If that fails, call an already-running Proxy with at least one backend.
7. Parse strict JSON, normalize to one line, validate syntax, and repair once
   per provider when needed.
8. Return command, source, validator, environment, and locally classified risk.

## Validation matrix

| Target | Detection | Validator |
| --- | --- | --- |
| Windows Bash | user fallback or Bash executable | local `bash -n` |
| Windows cmd | requested session executable | strict one-line cmd subset |
| Windows PowerShell/pwsh | requested session executable | PowerShell parser AST errors |
| WSL Ubuntu/Debian | WSL distro probe | target `bash -n` |
| WSL RHEL-family | WSL distro probe | target `bash -n` |
| SSH Ubuntu/Debian | saved profile plus remote probe | remote `bash -n` |
| SSH RHEL-family | saved profile plus remote probe | remote `bash -n` |

Unknown shell or distro values remain unsupported until the user chooses a
typed override. Local uncertain detection defaults to Windows Bash and also
offers Windows PowerShell/cmd, Ubuntu/Debian Bash, and RHEL-family Bash. The
override cannot turn a known CLI/TUI session into a shell.

## Privacy and limits

- Context: 20 visible lines, 8 KiB maximum after filtering.
- User request: 4 KiB maximum and redacted by the same rules.
- Provider response: 512 KiB maximum.
- Command: 4 KiB maximum, no CR/LF, NUL, or escape characters.
- End-to-end request timeout: 45 seconds.
- Environment probe and validator timeout: 12 seconds each.
- Proxy logs use a fixed placeholder for marked internal requests.
