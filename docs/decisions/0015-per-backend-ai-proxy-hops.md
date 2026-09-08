# 0015 Per-backend AI Proxy Hops

Date: 2026-09-07

## Status

Accepted

## Context

CliProxyAI can route to several OpenAI-compatible providers, but all requests
currently leave directly. Providers may need distinct outbound network paths.

## Decision

Attach one optional outbound hop to each backend: direct, HTTP/HTTPS CONNECT,
SOCKS4, SOCKS5, or SSH. Build the HTTP transport for the selected backend and
retry rather than sharing one global client. SSH uses a request-owned
loopback HTTP/CONNECT forwarder backed by russh, restricted to the selected
upstream host and port. It preserves original URLs and TLS validation.

## Alternatives Considered

1. Global proxy configuration: rejected because it cannot express
   provider-specific egress.
2. OS `ssh -D` process: rejected because russh is already shipped and allows a
   bounded in-process lifecycle.

## Consequences

Positive:

- Provider routing, retries, and SSE work through the same backend-specific
  transport.
- Existing configuration stays direct with no migration.

Tradeoffs:

- Hop credentials use the current local configuration persistence model.
- SSH requires the expected SHA256 server fingerprint; the existing Buzz
  accept-any-key behavior is not reused.
- SOCKS4 is unauthenticated; SOCKS5 supports username/password and remote DNS.
- OAuth token exchange/refresh and terminal requests honor the backend hop.
  Browser login retains browser networking.
- Redirects are disabled. A failed hop never falls back to Direct for that
  backend; existing fallback to other backends uses their own selected hops.

## Follow-Up

- Exercise HTTP/SOCKS and SSH fixtures on supported desktop platforms.
- Implementation and proof are tracked as US-055 (US-052 was already assigned).
