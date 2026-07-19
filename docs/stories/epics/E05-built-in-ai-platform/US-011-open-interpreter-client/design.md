# Design

## Workspace Thread Layout

- Thread objects are stored in `localStorage` keyed under `ai-cli-interpreter-threads`.
- Schema:
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  toolCall?: { command: string; status: 'running' | 'completed' | 'failed' };
  permissionRequest?: { id: string; command: string };
}

interface Thread {
  id: string;
  name: string;
  workspace: string;
  messages: Message[];
}
```

## ACP Bridge Integration

- **Output Events Listener**:
  - Hooks into Tauri `listen("open-interpreter-frame")`. Parses JSON-RPC notifications and maps `session/update` delta outputs to the active thread assistant message text or reasoning.
  - Hooks into `listen("open-interpreter-status-changed")` and `listen("open-interpreter-crashed-warning")` to update process status states.
- **Input Dispatcher**:
  - Sends JSON-RPC prompt frames containing active prompt text, target permission settings, and selected proxy backend synthetic model identifier (`clx:<uuid>`) via `openInterpreterSend(message)`.
- **Approval Dispatcher**:
  - Captures `session/request_permission` RPC frames from the agent. Renders confirmation overlays, and forwards user selection (true/false) back to the agent stdin stream.
