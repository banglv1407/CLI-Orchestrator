# US-006 — Design

## Backend

### 1. Configuration

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyConfig {
    pub port: u16,
    pub backends: Vec<ProxyBackend>,
    pub enabled: bool,
    #[serde(default)]
    pub live_log_updates: bool,
}
```

`#[serde(default)]` makes existing `~/.ai-cli-manager/proxy.json` files load
with `live_log_updates: false`. `ProxyConfig::save()` already serializes the
whole struct, so the new field round-trips without code changes.

### 2. Log entry

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyLogEntry {
    // … existing fields unchanged …
    #[serde(default)]
    pub phase: LogPhase,
    #[serde(default)]
    pub normalized_response_json: String,
    #[serde(default)]
    pub response_truncated: bool,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum LogPhase { Streaming, Completed, Failed }
```

Existing log entries (no `phase` field) deserialize as `Completed` so the old
log list renders the same way it does today. `response_json` semantics are
unchanged: it is the captured raw upstream bytes, empty for an in-flight row.

### 3. Stream assembler

New module `src-tauri/src/core/stream_assembler.rs`. Two types:

```rust
pub struct StreamAssembler { /* buffers, accumulator, raw, capacity */ }
impl StreamAssembler {
    pub fn new(capacity: usize) -> Self;
    pub fn push(&mut self, chunk: &[u8]);
    pub fn normalized(&self) -> &serde_json::Value; // empty object when no data
    pub fn raw(&self) -> &str;
    pub fn truncated(&self) -> bool;
    pub fn token_usage(&self) -> (u32, u32, u32);
    pub fn error_msg(&self) -> Option<String>;
}
```

Internal rules (per execplan §Stream assembler):

1. Buffer bytes that don't end on a frame boundary.
2. Accept LF or CRLF separators.
3. Concatenate multiple `data:` lines within one event; ignore blank lines,
   `:` comments, and `[DONE]`.
4. Track `raw` until 256 KiB; once reached, set `truncated = true` and stop
   parsing while still forwarding bytes to the relay.
5. Merge JSON per the rules below. Malformed JSON is dropped silently from the
   normalized result but kept in `raw`.

#### Merge algorithm

Recursive `merge_json(dst: &mut Value, src: Value)`:

- **Both objects** → for each key in `src`, recurse into `dst[key]`. If the
  key is new, insert; if both sides are scalars, take `src` unless it is
  `null`; if both sides are arrays, recurse with the indexed-merge rule below.
- **Both arrays** → if every element is an object with a numeric `index`
  field, merge by `index`. Otherwise concatenate.
- **String + string** → concatenate. (Covers `delta.content`,
  `delta.reasoning`, `delta.reasoning_content`, `delta.reasoning_text`, and
  any provider `reasoning_*` / `thinking_*` field, plus
  `function.arguments`.)
- **Different shapes** → replace with `src` (e.g. metadata turning from
  missing to a string).

Top-level `usage` is replaced wholesale on every non-null update so the
cumulative counts from the last frame win. `finish_reason` is replaced with
the first non-null value seen. `id`, `object`, `created`, `model` are
preserved from the first non-null frame.

### 4. Streaming path

`streaming_response` (in `proxy_server.rs`) now takes a `live_log_updates: bool`
flag captured when the request begins. It spawns a worker task that owns:

- an mpsc **relay** channel → downstream SSE (unchanged, byte-identical)
- the `StreamAssembler` (for log observation only)
- an `AppHandle` for emitting `proxy-log-update`

```text
                    upstream bytes_stream()
                            │
                            ├──► assembler.push(chunk)  (parse side)
                            │
                            ├──► relay_tx.send(chunk)  (downstream, byte identical)
                            │
                            └──► dirty flag + last patch snapshot
                                          │
                          every 200ms (Tokio interval, skip-on-miss)
                                          │
                                          └──► emit("proxy-log-update", Progress{…})
```

`AppHandle` injection: `start()` already runs inside a `tokio::spawn`. The
cleanest place to plumb the `AppHandle` is via the existing `tauri::State<AppState>`
managed by `main.rs`, but `AppState` does not currently own the `AppHandle`.
We extend `ProxyServer` with `app_handle: Mutex<Option<AppHandle>>` that
`start()` fills from a new parameter. Tests use
`ProxyServer::with_handle_for_test(...)` and pass `None`.

### 5. Event payload

```rust
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "eventType")]
pub enum ProxyLogUpdate {
    Start { entry: ProxyLogEntry },
    Progress {
        id: u64,
        normalized_response_json: String,
        duration_ms: u64,
        prompt_tokens: u32,
        completion_tokens: u32,
        total_tokens: u32,
        response_truncated: bool,
    },
    Done { entry: ProxyLogEntry },
}
```

Event name: `proxy-log-update`. `Start` and `Done` carry the full entry;
`Progress` is a compact patch and never repeats `requestJson` or raw SSE.

### 6. Throttle

Worker uses `tokio::time::interval(Duration::from_millis(200))` with
`MissedTickBehavior::Skip`. After each tick, the worker reads the dirty flag
and emits one `Progress` event if dirty. The dirty flag is set whenever the
normalized JSON, token counts, or truncation flag changes.

`Start` and `Done` are emitted immediately, never throttled. `Done` always
carries the final, post-flush entry, including `phase = Completed` (or
`Failed` on upstream error) and the full captured `responseJson`.

### 7. OFF path

When `live_log_updates` is false at request start:

- The assembler is **not** used for log observation. The existing 256 KiB
  capture runs unchanged.
- No `Start`, no `Progress`, no `Done` event is emitted for the in-flight
  stream.
- On completion, one assembled entry is computed in-memory from the captured
  raw (so the final log is still readable), then added to the log list once.

This preserves the existing behavior (no event volume, no extra allocations)
and gives the same final entry as the ON path would have produced.

## Frontend

### 1. Types

`src/types.ts`:

```ts
export type LogPhase = 'streaming' | 'completed' | 'failed';

export interface ProxyConfig {
  port: number;
  backends: ProxyBackend[];
  enabled: boolean;
  liveLogUpdates: boolean;
}

export interface ProxyLogEntry {
  // … existing fields …
  phase: LogPhase;
  normalizedResponseJson: string;
  responseTruncated: boolean;
}

export type ProxyLogUpdateEvent =
  | { eventType: 'start'; entry: ProxyLogEntry }
  | { eventType: 'progress'; id: number; normalizedResponseJson: string;
      durationMs: number; promptTokens: number; completionTokens: number;
      totalTokens: number; responseTruncated: boolean }
  | { eventType: 'done'; entry: ProxyLogEntry };
```

### 2. Event subscription

`src/lib/proxyLogStream.ts` exposes `subscribeProxyLog(handler)` and
`unsubscribeProxyLog()`. The handler is invoked with the tagged event. The
listener is mounted only while the main Detailed Logs surface is visible and
the toggle is ON; both conditions gate it inside `LogsTab`.

Polling remains the recovery channel: a stale `Progress` id triggers one
`proxyGetLogs()` refresh; events and polls are merged by id so duplicates
cannot appear.

### 3. Toggle UI

A small switch + label in the LogsTab header:

```
[ ◯ Live log updates ]   Applies to new requests
```

State comes from `ProxyConfig.liveLogUpdates`; saving goes through
`proxySaveConfig` so persistence is automatic.

### 4. Inspector sections

Given a `normalizedResponseJson`, the inspector derives sections per choice:

- **Content** → `choices[].message.content`
- **Reasoning** → `choices[].message.reasoning`,
  `choices[].message.reasoning_content`, `…reasoning_text`,
  `…reasoning_details`, plus any key starting with `reasoning_` or `thinking`
- **Tool calls** → `choices[].message.tool_calls`, `…function_call`
- **Usage** → top-level `usage`
- **Other** → everything else under `choices[].message`, plus choice-level
  metadata (`finish_reason`, `index`, `logprobs`) and any remaining top-level
  field

Sections are rendered as monospace, selectable blocks. While streaming, a
pulsing `LIVE` badge replaces the row's "completed" icon. Duration is taken
from the progress event so it visibly grows.

### 5. Raw section

A collapsed `<details>` element below the structured sections with its own
Copy button. While streaming, the section header reads "Raw (finalized when
request completes)". When `responseTruncated` is true, a 256 KiB warning chip
is shown next to the Copy button.

The existing Response Copy button now copies the complete `normalizedResponseJson`,
not the raw buffer.

### 6. Counts and sorting

- Sidebar `Request Logs` filters out `phase === "streaming"` rows.
- Header counts (OK / Fail) likewise exclude streaming rows.
- Sort by `id` descending so newest live row is at the top regardless of when
  the page is opened.
- Pagination in `LogsTab` does not snap back to page 1 on progress events.

### 7. Compatibility with US-005

`LogsTab`'s inline detail, 10-per-page pagination, `select-text` panels, and
per-row Copy buttons are reused unchanged. The structured sections and Raw
are added inside the expanded detail row only.
