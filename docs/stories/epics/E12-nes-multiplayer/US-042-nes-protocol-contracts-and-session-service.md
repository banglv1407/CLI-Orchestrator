# US-042 NES protocol contracts and session service

## Status

in_progress

The Rust service provides NIP-98 room APIs, atomic public-room join, single-use
role tickets, and validated two-role WSS fan-out. Connection bundles contain a
WSS URL and ticket only—no TURN servers or media configuration.

Allowed room messages are bounded to 1 KiB and exact fields. The input field is
a 12-bit controller mask, so the valid SNES R value (`2048`) is accepted rather
than being rejected under the former `u8`/255 limit. Fixed emoji reactions use a
validated `emoji_id` and are rate-limited per room role. ROM bytes, snapshots,
WebRTC descriptions, and unknown message types are rejected.

Public room entries expose only the host's full ROM filename (basename plus
extension) to help Player 2 choose the same local file. ROM paths, bytes,

hashes, and emulator state remain private.
Unit and HTTP integration tests cover room state, quotas, authentication,
replay rejection, public listing, atomic join, bundle shape, and WSS fan-out.
Real two-machine gameplay remains a release gate.
