# E12 - NES Multiplayer with Local ROM Input Sync

## Goal

Two authenticated CLX Windows clients play the same NES title while each runs
its own local JSNES emulator and local ROM. A small Linux service owns room
discovery, authentication, and WSS input relay. It never stores or transports
game content or rendered media.

## Fixed Decisions

- Exactly two players: host is P1, guest is P2.
- Both players explicitly select a local ROM.
- SHA-256 equality is mandatory before frame 1.
- No ROM transfer, emulator snapshot transfer, video, or audio.
- Input-only lockstep uses the authenticated room WebSocket.
- Three-frame input pipeline, fail-closed state hash every 300 frames.
- Pause/resume/reset are room-wide controls.
- Solo is fully local and does not require the server.
- One Linux `nes-session` binary/container; no coturn or UDP ports.

## Client Surfaces

- Home: server status, Host Game, live room list, explicit Join as P2.
- Host Setup: service URL, local ROM picker, Solo or Host Public Room.
- Guest Setup: room ID, independent local ROM picker, Verify ROM & Join.
- Host/Guest Game: local canvas/audio, role-specific controls, sync status,
  synchronized pause/reset, leave/end.

## Protocol

- HTTP room operations remain NIP-98 authenticated.
- WebSocket tickets are role-specific, short-lived, and single-use.
- Allowed messages: `rom_ready`, `input`, `state_hash`, `pause`, `resume`,
  `reset`, `peer_left`, `end`, `error`.
- Payload cap: 1 KiB with exact-field validation.
- Room ID and strictly increasing per-role message sequence are enforced.
- Directory responses never contain ROM hashes, tickets, or identities beyond
  the host public key already required for room ownership.

## Linux Deployment

- Compose builds one `nes-session` image.
- The container publishes only `127.0.0.1:18080`.
- Nginx/Caddy exposes `https://<host>` and `wss://<host>/v1/signal` on 443/TCP.
- `/health/live`, `/health/ready`, and `/metrics` remain internal/operator
  endpoints.
- Restarting the in-memory service ends all active rooms.

## Validation

- Unit: message validation, input masks, room state, quotas.
- Integration: NIP-98, public room/atomic join, two-role WSS fan-out, ROM bytes
  rejected, no TURN fields in connection bundles.
- Build: frontend production build, Rust tests, Compose config, Bash syntax,
  native Linux x86-64 release build and health smoke.
- Release: two Windows machines with same-ROM success, different-ROM refusal,
  synchronized controls/pause/reset, deliberate state mismatch refusal,
  reconnect/leave behavior, and 30-minute soak.

## Out of Scope

- ROM sharing/download, save-state transfer, rollback repair, spectators,
  browser clients, more than two players, cloud emulation, or media streaming.
