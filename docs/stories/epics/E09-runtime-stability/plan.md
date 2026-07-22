# E09 - Runtime stability and memory budget

## Outcome

CLX remains responsive during long-running Dashboard, monitoring-log, AI Companion, and Web AI sessions. Background services keep running when the main window is hidden, while UI-only polling, rendering, and embedded WebViews are suspended or evicted.

## Delivery

- `US-024`: targeted stabilization of the recently added surfaces, with measurable Windows x64 gates.
- `US-025`: terminal renderer memory bounds, activated after the first `US-024` soak failed while WebView count stayed constant and terminal output was duplicated across three buffers.

## Guardrails

- Do not change persisted configuration formats or OpenAI-compatible proxy contracts.
- Do not stop PTY, proxy, SSH, or agent services merely because the main window is hidden.
- Prefer bounded buffers, completion-driven timers, cancellation, and lazy UI ownership.
- Keep Web AI cookies and login state on disk even when its live WebView is closed.
