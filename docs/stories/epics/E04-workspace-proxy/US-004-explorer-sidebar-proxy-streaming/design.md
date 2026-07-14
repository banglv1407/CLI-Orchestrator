# Design

## Domain Model

A deletion target carries its absolute/remote path, display name, file type,
workspace root, source surface, and connection context. A proxy request carries
the parsed OpenAI fields plus compatible extension fields.

## Application Flow

Explorer or Git context menu opens confirmation. Confirmation dispatches to the
local workspace-bound command or the SSH command, closes an open deleted file,
invalidates cached descendants, reloads the parent/root directory, and refreshes
Git status.

For streaming, the proxy selects the configured backend, sends a streaming
request, validates the upstream HTTP status, then returns an Axum streaming body
backed directly by the Reqwest byte stream. Logging completes when the upstream
stream ends or errors.

## Interface Contract

- Tauri `delete_file_or_dir(path, root_path)` rejects root/outside paths.
- Tauri `delete_ssh_file_or_dir(connection, path, root_path)` performs the same
  lexical remote-root check before issuing a quoted remote command.
- `POST /v1/chat/completions` returns JSON for non-streaming calls and SSE for
  streaming calls.

## Data Model

No database or config migration is required. Existing `proxy.json` fields are
unchanged.

## UI / Platform Impact

Windows path canonicalization is performed in Rust for local deletion. Remote
paths use POSIX normalization. Context menus stay within the desktop UI and the
four pinned activity items use a separate bottom flex group.

## Observability

Proxy logs record the selected backend, status, elapsed time, collected stream
preview/usage, and stream errors without credentials. Deletion failures remain
in the confirmation modal and are also written to the developer console.

## Alternatives Considered

1. Buffer the upstream stream and replay it. Rejected because it is not real
   streaming and increases latency and memory use.
2. Allow arbitrary path deletion from the frontend. Rejected because Tauri
   commands are a trust boundary and must enforce the workspace root.

