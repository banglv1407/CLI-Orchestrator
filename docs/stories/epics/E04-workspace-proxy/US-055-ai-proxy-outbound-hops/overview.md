# US-055: AI Proxy hops and Companion entrypoint

## Current Behavior

Before this change AI backends always connected directly and AIChatPanel was
imported but never rendered in the sidebar.

## Target Behavior

Per-backend Direct, HTTP, HTTPS, SOCKS4, SOCKS5 and SSH configuration, retained
through add/edit/duplicate/reload. Normal and streamed requests honor the hop.
Ctrl+P offers Settings: CliProxyAI and View: AI Companion.

## Affected Users

- CliProxyAI and AI Companion desktop users.

## Affected Product Docs

- README.md
- docs/decisions/0015-per-backend-ai-proxy-hops.md

## Non-Goals

- Multi-hop chains, global profiles, inbound proxying, OS proxy settings.
- Credential-store migration or replacing a running user executable.

## Tracking

Intake #48 / US-055. The untracked US-052 draft was renamed because the live
Harness database already assigns US-052 to Expedition.
