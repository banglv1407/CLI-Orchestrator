# US-006 — Overview

## What

CliProxyAI currently captures the raw upstream SSE bytes and stores the entire
buffer (capped at 256 KiB) as `responseJson`. The Detailed Logs view then tries
to render that buffer verbatim, which is unreadable for streamed completions:
the user sees `data: {...}\n\ndata: {...}` instead of a normal chat response.

This story adds a parallel **observation** layer: a bounded SSE assembler that
walks the same bytes the relay is forwarding, joins them into a single
OpenAI-like response object, and exposes the result through a new live UI path
that can be disabled to avoid the parse/IPC/render overhead.

## Why

- The 256 KiB capture is the only signal the inspector has today. For long
  completions the truncated SSE buffer is the source of truth, which is wrong
  for a chat-shaped UI.
- A toggle is required because live parsing doubles event volume and costs IPC
  bandwidth on every chunk. The default must stay OFF to keep existing users
  unaffected.
- The downstream SSE response stays byte-compatible. Log parsing is a side
  channel that must never affect what the client sees.

## Out of scope (matches execplan)

- Public HTTP route, request body, downstream SSE headers, retry, backend
  rotation, `[DONE]` handling.
- Server-side log pagination or 100-entry cap changes.
- Persisting logs to disk.
- Showing live content in the compact sidebar.
- Redacting content beyond the existing credential rule.
- US-005 terminal-copy behavior (already merged on this branch).

## Affected surfaces

| Surface | Change |
| --- | --- |
| `src-tauri/src/core/proxy_server.rs` | Extend `ProxyConfig` + `ProxyLogEntry`; insert assembler into `streaming_response`; emit throttled events |
| `src-tauri/src/core/stream_assembler.rs` (new) | Bounded SSE parser + recursive JSON merger |
| `src-tauri/src/commands/proxy_commands.rs` | Snapshot toggle on `proxy_start` so it takes effect on new requests |
| `src/components/ProxyPanel.tsx` | Toggle UI, structured inspector, live merge, raw collapsed section |
| `src/lib/tauri.ts`, `src/types.ts` | Type additions + event listener helper |
| `docs/product/proxy.md` | Document the toggle and event semantics |

## Hard gates touched

External provider behavior — the change runs in the same code path that
relays provider responses, even though the relayed bytes are untouched.

## Lane

High-risk. Requires `overview.md`, `design.md`, `validation.md`, intake,
in_progress status before any source edit.
