# US-042 NES protocol contracts and session service

## Status

in_progress

The Rust service provides NIP-98 room APIs, atomic public-room join, single-use
role tickets, and validated two-role WSS fan-out. Connection bundles contain a
WSS URL and ticket only—no TURN servers or media configuration.

Allowed room messages are bounded to 1 KiB and exact fields. ROM bytes,
snapshots, WebRTC descriptions, and unknown message types are rejected.

Unit and HTTP integration tests cover room state, quotas, authentication,
replay rejection, public listing, atomic join, bundle shape, and WSS fan-out.
Real two-machine gameplay remains a release gate.
