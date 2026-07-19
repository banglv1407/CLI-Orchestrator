# Overview

## Current Behavior

- Proxy backends configured in `proxy.json` do not possess a stable unique identifier (UUID) other than their name.
- Token usage is tracked only in-memory in a capped log (`ProxyLogEntry`). When logs rotate, old usage counts are lost.
- There is no sqlite database for durable token storage, nor Tauri commands to fetch/reset usage.
- The proxy server does not implement `GET /v1/models` or synthetic model routing (`clx:<backend-uuid>`).
- Auto-injection of `stream_options.include_usage` for streaming requests is not implemented.

## Target Behavior

- **Stable UUIDs**: Add a stable UUID `id` to `ProxyBackend` in Rust and TypeScript. On loading a legacy `proxy.json`, UUIDs are dynamically generated and the config is saved.
- **Durable usage store**: SQLite database `~/.ai-cli-manager/proxy-usage.db` stores backend token usage. Aggregate rows update atomically. Added Tauri commands `proxy_get_usage` and `proxy_reset_usage` to get and clear usage per backend.
- **Exact-first accounting**: Tracks prompt, completion, total tokens, reported requests, and unreported requests (successful requests lacking usage reports). Inject `stream_options.include_usage=true` for streaming calls with a fallback single retry if rejected.
- **Model routing**: Expose `GET /v1/models` from the local proxy endpoint publishing backends as `clx:<backend-uuid>`. Rewrite upstream model name when routing requests.
- **UI Updates**: Display tokens and reset options on backend cards.

## Affected Users

- Users routing LLM API calls through `CliProxyAI` and tracking API costs.

## Affected Product Docs

- `docs/stories/epics/E05-built-in-ai-platform/plan.md`

## Non-Goals

- Global usage reset in v1 (only per-backend reset).
- Estimating token counts (only exact counting).
