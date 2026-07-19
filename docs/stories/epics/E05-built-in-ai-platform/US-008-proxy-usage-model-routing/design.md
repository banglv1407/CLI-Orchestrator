# Design

## Data Models

### Database Schema (`proxy-usage.db`)

Table `backend_usage`:
- `backend_id` TEXT PRIMARY KEY (UUID)
- `prompt_tokens` INTEGER NOT NULL DEFAULT 0
- `completion_tokens` INTEGER NOT NULL DEFAULT 0
- `total_tokens` INTEGER NOT NULL DEFAULT 0
- `reported_requests` INTEGER NOT NULL DEFAULT 0
- `unreported_requests` INTEGER NOT NULL DEFAULT 0
- `reset_at` TEXT NOT NULL (ISO-8601 UTC)
- `updated_at` TEXT NOT NULL (ISO-8601 UTC)

### Public DTOs (Rust & TypeScript)

```typescript
export interface ProxyBackendUsage {
  backendId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  reportedRequests: number;
  unreportedRequests: number;
  resetAt: string;
  updatedAt: string;
}
```

## API Contracts

### Proxy HTTP Server

#### `GET /v1/models`
Returns list of configured backends as synthetic OpenAI model objects:
```json
{
  "object": "list",
  "data": [
    {
      "id": "clx:<backend-uuid>",
      "object": "model",
      "created": 1677610222,
      "owned_by": "clx"
    }
  ]
}
```

#### `POST /v1/chat/completions` (Routing behavior)
If `model` parameter is `"clx:<backend-uuid>"`, route request directly to the backend matching `<backend-uuid>` first, fall back to others if needed, and rewrite the `"model"` field in the upstream body to that backend's real `model` string.

### Tauri Commands

- `proxy_get_usage(id: String) -> Result<ProxyBackendUsage, String>`
- `proxy_reset_usage(id: String) -> Result<(), String>`

## Event Routing

- **Broadcast Event**: Tauri event `proxy-usage-updated` emitted on backend usage update.
- **Window Listener**: Listen to `proxy-usage-updated` in `ProxyPanel.tsx` to refresh usage.
