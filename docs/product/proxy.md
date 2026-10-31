# CliProxyAI

CliProxyAI is a localhost OpenAI-compatible gateway backed by the servers in
`~/.ai-cli-manager/proxy.json`.

## Chat Completions Contract

- `POST /v1/chat/completions` accepts OpenAI-compatible chat completion JSON.
- The configured backend URL, API key, model, headers, retry count, and custom
  user agent remain the source of truth for upstream calls.
- A request with `stream: false` returns one JSON response.
- A request with `stream: true` sends `stream: true` upstream and relays the
  upstream response incrementally as `text/event-stream` without buffering the
  full completion.
- SSE data frames, including `[DONE]`, remain byte-compatible with the upstream
  response. The proxy must not synthesize a complete response before sending
  the first downstream chunk.
- Upstream HTTP failures may retry or rotate before response streaming begins.
  A failure after streaming begins terminates the stream and is recorded in
  proxy logs; it cannot be retried into the same downstream response.
- Provider credentials must never be included in response bodies or logs.


## SSH Fingerprints

- Backend Add/Edit > Outbound hop > SSH tunnel provides Get fingerprint and Copy fingerprint.
- Discovery reads the actual negotiated host key from the current host/port, within a 10-second connection timeout, without authentication, forwarding or saving configuration.
- Fingerprints use canonical OpenSSH SHA256 encoding. The UI allows administrator comparison and manual entry; actual traffic still requires the saved exact key.
- Changing host/port clears the old fingerprint and invalidates outstanding UI lookups. Authentication edits during a lookup are preserved.
- Remote Access > SSH Server exposes its own fingerprint with the same controls. It uses the persisted ssh_host_key.pem, creates a key once if absent, and never replaces an existing key. An invalid/unreadable existing key is reported.
- Loading, network, key and clipboard feedback is available in en/vi/ko.
