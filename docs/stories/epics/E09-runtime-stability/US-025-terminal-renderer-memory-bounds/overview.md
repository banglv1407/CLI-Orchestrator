# US-025 - Terminal renderer memory bounds

## Trigger

The first US-024 30-minute runtime soak failed with UI-owned working-set growth of 96.61 MiB and a 6.731 MiB/minute slope. WebView count stayed at six, while the renderer private working set grew during large terminal output. Inspection found output retained simultaneously in the main xterm buffer, every mini xterm, and a replay history bounded only by chunk count rather than bytes.

## Changes

- Bound replay history to 1 MiB and 1,000 chunks per session.
- Bound pending/write queues to 2 MiB per session.
- Reduce main xterm scrollback from 5,000 to 2,000 lines.
- Reduce mini xterm scrollback from 2,000 to 500 lines.
- Create mini xterms only while the thumbnail panel is visible and dispose them when it closes.
- Keep PTY processes alive; only renderer-owned duplication is removed.

## Acceptance

- Large output cannot make replay or pending queues grow without a byte bound.
- Closing the thumbnail panel releases all mini xterm instances.
- Terminal output and nested-TUI behavior remain functional.
- A post-fix US-024 soak passes the UI-owned RAM delta and slope gates.

