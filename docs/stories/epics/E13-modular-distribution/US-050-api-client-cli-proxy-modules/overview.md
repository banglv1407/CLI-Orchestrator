# US-050 Overview — API Client and CliProxyAI modules

Status: In progress

US-050 begins E13 Phase 4 by extracting the independent HTTP tools from Core.
Checkpoint A moves API Client UI, history, request, streaming, cancellation,
and runner traffic into `clx.api-client`. Checkpoint B moves CliProxyAI UI,
server, routing, usage, and logs into `clx.cli-proxy`.

The extraction must preserve current user data and OpenAI-compatible streaming.
An absent or disabled pack must not leave its UI bundle, Tauri commands,
sidecar, polling loop, listener, server, or network activity in Core.
