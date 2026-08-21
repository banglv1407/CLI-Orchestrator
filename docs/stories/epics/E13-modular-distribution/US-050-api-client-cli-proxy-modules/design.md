# US-050 Design — API Client and CliProxyAI modules

API Client registers signed `api-client.main` and
`api-client.history` UI contributions. Its sidecar owns HTTP clients and
accepts namespaced JSON-RPC methods. Non-streaming requests are request/response.
Streaming uses `streamStart`, bounded `streamPoll`, and `streamAbort` so the
sidecar can process cancellation while a network task is active. Poll results
carry ordered start/data/done/error events; queues and per-event bytes are
bounded.

The Core module host grants `networkRequest` only when declared in the signed
manifest. Core continues to own pack verification, entitlement, lifecycle,
asset serving, and exact-path sidecar launch.

CliProxyAI remains a separate independent pack. AI Companion discovers its
optional capability at runtime and keeps direct OpenAI-compatible endpoint
support when the proxy pack is absent.
