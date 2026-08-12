# ADR 0014: Inline terminal command assistant boundary

- Status: Accepted
- Date: 2026-07-29
- Story: US-032

## Context

Users need a fast way to turn a natural-language request into a command that
matches the active terminal. A generic AI answer is unsafe here because cmd,
PowerShell, Bash, WSL distributions, and remote Linux hosts have incompatible
syntax and available package managers. Terminal output may also contain
credentials or prompt-injection text.

E08 intentionally prohibits arbitrary Companion-generated PTY control. This
feature therefore needs a smaller boundary that cannot become an autonomous
shell agent.

## Decision

The main terminal owns a caret-anchored popup opened by `Ctrl+Alt+?`. It is
eligible only for a normal shell buffer and is disabled for nested TUI/agent
sessions. Rust derives the target from immutable session launch metadata and,
for WSL/SSH, a bounded `/etc/os-release`, shell, and package-manager probe.
Uncertain targets require an explicit user override.

The request contains a fixed system policy, the user request, detected
environment, and at most 20 visible terminal lines. Known credentials and
token-shaped values are redacted before provider access. No Companion history,
custom prompt, tools, or app-action consent is inherited.

Provider order is exactly the saved LLM Proxy backend array. Command Assistant
calls each upstream directly using the Proxy backend's model, headers,
transforms, reasoning setting, and retry count, then falls back to the next
backend. Routing is independent of the Proxy service lifecycle and never
starts it. AI Companion and the built-in local LLM are excluded. Attempt logs
replace request and response bodies with a fixed redaction placeholder.

The model must return one JSON object containing one physical-line command and
the shell dialect. CLX retries one repair per provider and accepts output only
after strict cmd validation, PowerShell AST parsing, or `bash -n` in the target
WSL/SSH environment.

The UI always permits Copy. Insert is shown as available only at a recognized
empty prompt, rechecks that condition at click time, writes command text only,
and never sends Enter.

## Consequences

- The feature verifies syntax, not command availability or runtime success.
- SSH and WSL probes add bounded latency and may require user selection.
- Closing the popup cancels provider work and local parser processes; a
  blocking SSH library call may finish in its worker after the UI has cancelled.
- This exception does not expose a generic PTY tool to AI Companion.
