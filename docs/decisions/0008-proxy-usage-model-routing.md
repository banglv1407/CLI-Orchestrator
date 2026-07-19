# 0008 Durable Proxy Usage Accounting and Model Routing

Date: 2026-07-16

## Status

Accepted

## Context

Prior to this change, token usage for API requests passing through the CLI Orchestrator proxy server was only recorded in-memory within a capped circular buffer of 100 entries. This led to data loss on application restart or log rotation. In addition, there was no way to target specific backends dynamically other than re-ordering the list, nor was token usage automatically requested on streaming calls.

## Decision

We implemented three key improvements to the proxy server (`CliProxyAI`):
1. **Durable SQLite usage store (`~/.ai-cli-manager/proxy-usage.db`)**:
   - Tracks atomic updates to prompt, completion, and total tokens, reported requests, and unreported requests (successful requests that did not provide usage statistics).
   - Generates stable UUIDs for each backend on load.
   - Adds Tauri commands to fetch and reset usage per backend.
2. **Exact-First Accounting with Fallback Retry**:
   - Injects `stream_options: { include_usage: true }` to streaming completions.
   - Caches backend incompatibilities (e.g. if provider returns `400 Bad Request` in response to the injected parameter) and retries exactly once inline without it, caching that compatibility result for the run to avoid future failures.
   - Uses a sliding window buffer (16KB) on incoming streaming chunks to parse the final usage block, bypassing the 256KB raw-log Cap.
3. **Synthetic Model Routing**:
   - Implements `GET /v1/models` in local proxy server, publishing each backend as `clx:<backend-uuid>`.
   - Intercepts requests using synthetic model IDs, prioritizes routing to that backend first (falling back to others on failure), and rewrites the model parameter in the body to the backend's real upstream model string.
4. **Proxy UI Card Grid**:
   - Shows detailed stats (prompt, completion, total, reported, unreported counts) on each backend card.
   - Disclaims whenever `unreportedRequests > 0`.
   - Adds Reset buttons with a confirmation overlay.

## Alternatives Considered

1. **Calculating token estimation locally (e.g. using tiktoken/bpe)**: Rejected. Estimating is inaccurate and would significantly increase Tauri binary size with tokenizers dependencies. Counted only actual provider-reported usage.
2. **Global reset button**: Rejected. Out of scope for v1.

## Consequences

Positive:
- Precise cost/token metrics persisted across app restarts.
- Auto-injection works with most standard OpenAI providers, with immediate retry fallback for older or custom endpoints.
- Frontends can target a specific backend model directly using synthetic model naming.

Tradeoffs:
- Minor additional SQLite writes on proxy requests.
