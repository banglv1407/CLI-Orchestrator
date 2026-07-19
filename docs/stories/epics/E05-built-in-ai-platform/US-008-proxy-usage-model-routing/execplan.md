# Execution Plan

## Implementation Phases

### Phase 1: Database Setup
- Create Rust module `src-tauri/src/core/proxy_usage_db.rs` to manage SQLite database at `~/.ai-cli-manager/proxy-usage.db`.
- Setup table `backend_usage` and implement functions to:
  - Fetch usage for a backend ID (returns default 0-initialized row if not exists).
  - Atomically update token counts, reported, and unreported requests.
  - Reset a backend's usage (set tokens to 0, update `reset_at`).

### Phase 2: Configuration Migration
- Add `pub id: String` to `ProxyBackend` in `src-tauri/src/core/proxy_server.rs`.
- Update config loader `ProxyConfig::load()` to:
  - Scan all backends.
  - If a backend has an empty or missing `id`, generate a new UUIDv4 and mark config as modified.
  - Save the config back to `proxy.json` if modified.

### Phase 3: Exact-first Token Accounting
- In `handle_chat_completion`, check if request is streaming:
  - If streaming, inject `stream_options: { "include_usage": true }` to the upstream request body (only if the user did not supply it).
  - Cache provider compatibility using an in-memory thread-safe `Mutex<HashSet<String>>` (URL-based or name-based). If a provider fails with 400 when usage is injected, mark as incompatible, retry without it, and bypass injection for subsequent requests.
  - Extract token usage from final chunk (for streams) or JSON body (for non-streams).
  - Update usage database: increment tokens and reported requests. If success but no usage returned, increment unreported requests.

### Phase 4: Model Routing & Models API
- Implement `GET /v1/models` route in Axum server.
- Update `handle_chat_completion` request interceptor:
  - If target model is `"clx:<backend-uuid>"`, select that backend for routing.
  - Rewrite target model name in the upstream payload to the backend's real model name.

### Phase 5: Tauri Commands & Frontend Integration
- Implement tauri commands `proxy_get_usage` and `proxy_reset_usage`.
- Update frontend TypeScript types in `src/types.ts`.
- In `src/components/ProxyPanel.tsx`:
  - Fetch usage details for each backend and display them.
  - Highlight total tokens, prompt, completion, reported, and unreported counts.
  - Add a per-backend Reset button with a confirmation popup.
