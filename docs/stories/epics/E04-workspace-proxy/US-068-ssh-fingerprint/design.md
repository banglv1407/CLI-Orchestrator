# Design

## Application Flow

`probe_ssh_fingerprint(host, port)` validates the address and performs a bounded
russh handshake using the same default key negotiation as the AI tunnel. It
records SHA256 of the negotiated public key and disconnects without sending
credentials, opening channels or persisting trust. Exact pinning remains in the
normal transport. The UI explains that the fetched value can be compared with
the administrator's fingerprint before saving.

`get_ssh_server_fingerprint()` loads the same host key as server startup. It
creates an Ed25519 key only when absent; existing invalid keys produce an error
instead of replacement. Shared serialized loading prevents concurrent UI/start
requests from changing server identity. Files are created exclusively.

## Interface Contract

Both Tauri commands return a canonical `SHA256:` string or a bounded error.
Remote discovery accepts only host and port, never credentials. A shared React
field provides Fetch, loading, inline error, manual remote entry and Copy.
Changing endpoint or closing the editor invalidates outstanding UI requests.
The success callback uses the latest draft to preserve concurrent auth edits.

## Data Model

Existing `ProxyHop.hostKey`, `proxy.json` and `ssh_host_key.pem` are reused.
There is no migration or additional trust store.

## Alternatives Considered

- OS ssh-keyscan: adds a platform dependency and may choose a different key from
  the actual russh tunnel.
- Accept any key in the real tunnel: violates the existing pinning contract.
