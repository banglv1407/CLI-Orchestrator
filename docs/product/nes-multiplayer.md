# NES Multiplayer

## Product Contract

NES multiplayer supports exactly two authenticated CLX desktop players. Both
players select and run the same `.nes` ROM locally. The service never receives
ROM bytes, filenames, emulator snapshots, video, or audio.

Online traffic is input-only over the authenticated room WebSocket. There is
no WebRTC media path and no coturn dependency.

## Room Discovery and Join

- Home lists live public rooms and refreshes every five seconds.
- The host selects a local ROM before creating a room.
- Clicking Join opens a Player 2 setup view before claiming the room. Player 2
  must select a local ROM explicitly.
- The first authenticated join succeeds atomically; later joins fail.
- Room directory entries contain no ROM metadata or connection secrets.

## ROM Boundary

- Each machine reads its own ROM through the existing local Tauri command.
- After the private room WebSocket is authenticated, peers exchange only the
  lowercase SHA-256 of their local ROM.
- Gameplay fails closed when hashes differ.
- ROM bytes and emulator snapshots are rejected by the server message schema.

## Input Lockstep

- Host local input is Player 1; guest local input is Player 2.
- Each side pipelines three future frames of `{epoch, frame, mask}` messages.
- A frame advances locally only after both Player 1 and Player 2 masks exist.
- Pause, resume, and reset are synchronized through the same room WebSocket.
- Every 300 completed frames, peers compare an eight-character state hash. A
  mismatch pauses the session and reports failure; v1 does not transfer a
  snapshot to repair divergence.
- The controller state itself is one byte per player per frame. The current
  JSON room envelope plus WebSocket/TLS framing makes real traffic typically
  single-digit to low-tens of KiB/s per client, depending on transport behavior.

## Solo

Solo play never contacts the session service. It loads the local ROM and uses
the normal local requestAnimationFrame emulator loop.

## Linux Server

- Production runs one `nes-session` container from `deploy/nes-relay/` behind
  an external Nginx/Caddy HTTPS/WSS reverse proxy.
- Only `443/TCP` is public. The service binds to `127.0.0.1:18080`.
- No UDP, TURN, coturn, or relay allocation ports are required.
- Room state is in memory; restarting the service ends every room.

## Current Acceptance Boundary

Frontend build, Rust protocol/service tests, Compose rendering, Linux native
build, and health smoke are mechanical gates. Release acceptance still needs
two physical Windows machines with the same ROM on separate networks, plus a
30-minute lockstep/state-hash soak and a deliberate ROM-mismatch test.
