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

