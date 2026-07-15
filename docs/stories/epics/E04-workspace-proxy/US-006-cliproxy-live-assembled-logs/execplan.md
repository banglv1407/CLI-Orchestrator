# US-006 — CliProxyAI Live Assembled Logs

## Status

Planned. Implementation has not started.

## Goal

Make streamed CliProxyAI responses readable in Detailed Logs by assembling
OpenAI-compatible SSE deltas into stable response fields, with an optional
realtime UI path that can be disabled to minimize parsing, IPC, and rendering
overhead.

The downstream `POST /v1/chat/completions` response must remain byte-compatible
with the upstream SSE stream. Log parsing is an observational side channel and
must never buffer, rewrite, delay, or fail the client response.

## Confirmed Product Decisions

- Final streamed logs are always assembled into a readable response.
- `Live log updates` controls only incremental UI updates:
  - ON: the current request appears and grows in Detailed Logs.
  - OFF: no incremental log is shown; the assembled log appears after the
    stream completes.
- The toggle defaults to OFF for existing and new configurations.
- The toggle is persisted globally in `~/.ai-cli-manager/proxy.json` and applies
  to requests that start after the setting changes. Restarting the proxy is not
  required.
- The inspector separates Content, Reasoning, Tool calls, Usage, and Other
  fields.
- Raw SSE remains available in a collapsed section for debugging.
- Realtime rows appear only in Detailed Logs. The compact Request Logs sidebar
  continues to show completed requests only.

## Scope

### In scope

- Incremental SSE parsing that tolerates arbitrary HTTP chunk boundaries.
- Reconstructing streamed `choices[].delta` data into an OpenAI-like completed
  response for display.
- Live log lifecycle, throttled Tauri events, and frontend state reconciliation.
- A persisted performance toggle and phase-aware Detailed Logs UI.
- Deterministic parser, relay, lifecycle, compatibility, and performance proof.
- Product contract, Harness story/evidence, and trace updates when implementation
  begins.

### Out of scope

- Changing the public proxy route, request body, downstream SSE headers, retry
  behavior, backend rotation, or `[DONE]` handling.
- Persisting proxy logs across application restarts.
- Server-side log pagination or increasing the existing 100-entry log limit.
- Showing live response content in the compact sidebar.
- Redacting request or response content beyond the existing rule that provider
  credentials must never enter logs or events.
- Modifying the staged terminal-copy behavior from US-005.

## Risk Classification

Lane: `high-risk`.

Risk flags:

- `external_systems`
- `public_contracts`
- `existing_behavior`
- `weak_proof`
- `multi_domain`

Hard gate: external provider behavior. The implementation touches the code path
that relays provider responses, even though the intended HTTP contract remains
unchanged.

Before implementation, create the remaining high-risk story documents
(`overview.md`, `design.md`, and `validation.md`), record the Harness intake,
and add US-006 as `in_progress`. Do not overwrite the staged US-005 source
changes. Reconcile US-005's Markdown status/evidence with the already
implemented Harness matrix entry as a documentation-only correction.

## Data and Interface Changes

### Proxy configuration

Add `live_log_updates: bool` to Rust `ProxyConfig`, serialized as
`liveLogUpdates` and mirrored in the TypeScript `ProxyConfig` interface.

- Use `#[serde(default)]` so configurations without the field load as `false`.
- Saving the toggle updates `proxy.json` through the existing config command.
- Snapshot the setting when a request begins; changing it does not alter a
  stream already in progress.

### Proxy log entry

Extend the internal Rust/TypeScript `ProxyLogEntry` IPC DTO with:

- `phase: "streaming" | "completed" | "failed"`
- `normalizedResponseJson: string`
- `responseTruncated: boolean`

Keep existing fields and meanings:

- `responseJson` remains the captured raw upstream response. For a live row it
  may be empty until the stream finishes.
- `success` describes only a completed or failed request. UI counts must exclude
  `streaming` rows from both OK and Fail totals.
- Logs remain in memory and capped at 100 entries.

For non-stream responses, populate `normalizedResponseJson` with the normalized
JSON response already used by the inspector so the UI can use one rendering
path.

### Tauri event

Add the internal event `proxy-log-update` with a tagged payload:

```ts
type ProxyLogUpdateEvent =
  | { eventType: 'start'; entry: ProxyLogEntry }
  | {
      eventType: 'progress';
      id: number;
      normalizedResponseJson: string;
      durationMs: number;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      responseTruncated: boolean;
    }
  | { eventType: 'done'; entry: ProxyLogEntry };
```

- `start` and `done` carry a full entry once.
- `progress` is a compact patch and must not repeat request JSON or raw SSE.
- An unknown progress ID triggers one log refresh rather than creating an
  incomplete entry.
- Inject `AppHandle` into the existing proxy start path and keep event emission
  a no-op in unit tests without an application handle.
- No public HTTP or external API interface changes.

## Backend Design

### Stream assembler

Create a stateful assembler beside the existing byte relay. It receives a copy
of bytes only for logging; the original bytes are sent downstream unchanged and
immediately.

The parser must:

1. Buffer incomplete SSE frames across arbitrary `reqwest` chunks.
2. Recognize both LF and CRLF frame separators.
3. Join multiple `data:` lines within one SSE event.
4. Ignore comments, empty frames, and `[DONE]` for JSON assembly while retaining
   them in raw output.
5. Treat malformed or provider-specific non-JSON frames as a log parse issue,
   not a downstream stream failure.
6. Stop capturing/parsing after 256 KiB, set `responseTruncated`, and continue
   relaying all remaining upstream bytes.

Merge parsed JSON using these rules:

- Match `choices` and indexed arrays by their `index` field.
- Merge `choices[].delta` into `choices[].message`.
- Recursively concatenate repeated string fragments inside a delta. This covers
  `content`, `reasoning`, `reasoning_content`, `reasoning_text`, provider
  `reasoning_*` fields, and nested `function.arguments`.
- Recursively merge objects.
- Merge indexed arrays such as `tool_calls` by index; append arrays without an
  index.
- Replace scalar metadata with the latest non-null value.
- Preserve top-level metadata, `usage`, `finish_reason`, provider-specific
  fields, and multiple choices.

Serialize the reconstructed object into `normalizedResponseJson`. If no valid
JSON data frame is found, leave the normalized response empty and let the UI
show a parse warning plus Raw rather than inventing a completion shape.

### Log lifecycle

When live updates are ON:

1. After a successful upstream response header, insert one `streaming` entry
   with the request-start timestamp and emit `start` immediately.
2. Relay each upstream chunk before doing optional log work.
3. Accumulate parsed changes locally without taking the shared log mutex.
4. Use a 200 ms Tokio interval with missed ticks skipped. On a dirty tick,
   update the in-memory entry once and emit one `progress` patch.
5. On stream completion or error, flush immediately, replace the entry with its
   final `completed` or `failed` form, attach captured Raw, and emit `done`.

When live updates are OFF:

1. Preserve the existing capped raw capture while relaying.
2. Do not insert a streaming row, acquire the log mutex for progress, or emit
   progress events.
3. Assemble once from the captured response after completion and add one final
   entry.

Downstream disconnects and upstream read errors finalize the log as `failed`.
They must not be retried after response streaming has begun.

## Frontend Design

### Toggle and event subscription

- Place `Live log updates` in the Detailed Logs header with an ON/OFF control
  and the note `Applies to new requests`.
- Persist through the existing `proxySaveConfig` flow.
- Subscribe to `proxy-log-update` only while the main Detailed Logs surface is
  mounted and the toggle is enabled; clean up the listener on unmount or OFF.
- Retain the existing polling path as recovery and for completed logs. Merge
  event entries/patches by ID so polling cannot duplicate a row.
- Sort newest requests by descending ID rather than completion order. Do not
  force users on older pagination pages back to page 1.
- Filter `phase === "streaming"` from compact sidebar logs.

### Inspector rendering

- Render a pulsing `LIVE` badge for streaming entries and update duration from
  progress events.
- Derive sections from `normalizedResponseJson` for every choice:
  - Content: `message.content`.
  - Reasoning: `reasoning`, `reasoning_content`, `reasoning_text`,
    `reasoning_details`, and message keys beginning with `reasoning_` or
    `thinking`.
  - Tool calls: `tool_calls` and `function_call`.
  - Usage: the top-level `usage` object.
  - Other: remaining message, choice, and top-level metadata.
- Keep all sections selectable and monospace. Do not auto-scroll or collapse an
  expanded row during updates.
- The existing Response Copy button copies the complete normalized JSON.
- Add a collapsed Raw section with its own Copy button. While streaming, state
  that Raw is finalized when the request completes.
- Show a 256 KiB truncation warning when `responseTruncated` is true.
- Summary preview uses Content first, then Reasoning, then tool-call name, then
  the current error fallback.

## Failure and Compatibility Rules

- SSE parsing, JSON merging, UI events, and clipboard errors never alter the
  downstream response.
- Event emission failures are ignored after recording an operational diagnostic;
  the in-memory final log must still be written.
- No event or log payload may include backend API keys or authorization headers.
- A live setting change affects only future requests to avoid half-assembled
  streams.
- The raw capture limit affects logging only; it never truncates the client
  response.
- Existing URL normalization, retry rotation, and short config-lock behavior
  remain unchanged.

## Validation Plan

### Unit tests

- Config without `liveLogUpdates` defaults to OFF and round-trips correctly.
- SSE frames split inside prefixes, UTF-8 text, JSON, CRLF separators, and
  `[DONE]` are reconstructed correctly.
- Multi-line `data:` events parse correctly.
- Content and reasoning fragments concatenate in order.
- Multiple choices, indexed tool calls, fragmented function arguments,
  `finish_reason`, `usage`, and unknown fields merge correctly.
- Malformed frames remain in Raw and do not fail assembly or relay.
- Capture stops at 256 KiB and marks truncation.

### Mock integration tests

- Downstream headers and concatenated bytes exactly match the mock upstream SSE.
- The first downstream chunk arrives before the delayed second chunk.
- ON creates a visible streaming entry, advances normalized content, and
  finalizes it with Raw and token usage.
- OFF emits no progress updates and produces the same final normalized log.
- A burst of small chunks emits no more than five progress updates per second
  plus immediate start/done events.
- Downstream disconnect and upstream stream error finalize a failed log without
  retrying into the same response.

### UI and platform scenarios

- Toggle persists as OFF/ON across reload and applies only to new requests.
- Live Content and Reasoning visibly grow in the expanded Detailed Logs row.
- Sidebar does not show an in-progress row.
- Pagination, selection, Request/Response copy, and US-005 terminal copy behavior
  remain intact.
- Raw is available after completion and its copy output matches the captured
  upstream response.
- Windows Tauri smoke verifies listener cleanup and no duplicate rows after tab
  changes.

### Commands and evidence

Run during implementation:

```powershell
npm.cmd run build
cargo test --manifest-path src-tauri/Cargo.toml
npm.cmd run validate:quick
git --git-dir=.git --work-tree=. diff --check
```

Also extend and run the ignored `streams_with_saved_proxy_config` test with
`CLX_PROXY_CONFIG` pointing to the current saved config. It must prove multiple
SSE chunks, `[DONE]`, a non-empty normalized response, no credential leakage,
and unchanged downstream streaming.

Known repository-wide formatting or clippy debt must be reported honestly and
must not be claimed as caused or fixed by this story without evidence.

## Acceptance Criteria

- With live OFF, no in-progress row is shown and the final log is assembled into
  readable sections.
- With live ON, a new row appears immediately and meaningful updates reach the
  inspector at most once every 200 ms.
- Content, reasoning variants, tool calls, usage, finish reason, multiple choices,
  and unknown fields survive reconstruction.
- Raw SSE is available after completion and clearly marked if truncated.
- Compact sidebar shows completed requests only.
- Downstream SSE remains byte-compatible, incremental, and ends with the
  upstream `[DONE]` frame.
- No API key or authorization value is exposed in Raw, normalized logs, events,
  tests, or final evidence.
- Frontend build, deterministic Rust tests, mock streaming proof, Windows Tauri
  smoke, and saved-config live smoke have recorded results.

## Implementation Order

1. Complete the US-006 high-risk story packet and Harness intake.
2. Add backward-compatible config and log DTO fields.
3. Implement and unit-test the bounded SSE assembler.
4. Add phase-aware log upsert/finalization and throttled Tauri events.
5. Add the persisted toggle, event merge logic, and structured inspector UI.
6. Extend mock and saved-config streaming tests.
7. Run deterministic, platform, and live validation.
8. Update product docs, story evidence, Harness matrix, trace, and any friction
   backlog item.

## Stop Conditions

Pause for confirmation if implementation would require any of the following:

- Rewriting or buffering the downstream SSE stream.
- Removing Raw logs or changing the 256 KiB logging cap.
- Persisting response content to disk.
- Logging live content in the compact sidebar.
- Weakening the mock byte-compatibility test or saved-config smoke requirement.
- Expanding the change into provider-specific request/response translation.
