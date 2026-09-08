# Design

## Domain Model

ProxyBackend gains optional hop: kind, host, port, username, secret, authMode,
keyPath and hostKey (camelCase). Missing/null means Direct. Kinds: http, https,
socks4, socks5, ssh. SOCKS4 is unauthenticated; SOCKS5 supports auth and remote
DNS. HTTPS means TLS to the proxy. HTTP proxies also tunnel HTTPS targets.

## Application Flow

core/proxy_hop.rs builds a transport for each selected backend attempt.
SSH authenticates with russh password or key/passphrase and verifies the expected
SHA256 server fingerprint. An ephemeral loopback HTTP/CONNECT listener forwards
only the configured target host/port via SSH direct-tcpip channels, preserving
original URLs, Host and TLS validation, including IP targets.

The transport owns listener and channel tasks. Drop/cancel closes them. SSE
retains the transport through completion/downstream disconnect. Requests have
a 300-second timeout; SSH setup/auth/channel opens have 30-second limits.
Stopping the proxy stops accepting new requests; existing responses may finish
under the existing graceful shutdown behavior.

OAuth token exchange/refresh and terminal-command backend calls also honor hop.
Browser OAuth login keeps browser networking. Redirects are disabled. A failed
hop cannot fall back directly within that backend. Existing fallback to another
backend uses that backend's own hop.

## Interface Contract and Persistence

Existing Tauri commands carry hop. Validate before add/save. The UI displays
relevant fields, masks secrets and states that credentials remain in local
proxy JSON alongside existing API keys. Key files are referenced, not copied.
Debug output and setup errors exclude secrets.

## UI / Platform Impact

ProxyHopEditor appears in Add/Edit backend. Cards show hop kind. Command Palette
opens chat explicitly, including collapsed sidebar, and adds proxy settings.
Settings selection is persisted before mounting.

## Alternatives Considered

- Global proxy cannot represent separate provider routes.
- Unmanaged shared SOCKS listener has broader forwarding and lifecycle costs.
- Buzz AcceptAnyServerKey is not reused for the new credential-bearing path.
