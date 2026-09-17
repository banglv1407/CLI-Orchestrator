# NES Multiplayer

## Product Contract

NES multiplayer supports exactly two authenticated CLX desktop players. Both
players select and run the same `.nes` ROM locally. The service receives only
the host's display-only ROM filename (basename plus extension); it never
receives ROM bytes, paths, hashes, emulator snapshots, video, or audio.

Online traffic uses input lockstep plus fixed, ephemeral emoji reactions over the
authenticated room WebSocket. Reactions are not chat, are rate-limited, and are
never persisted. There is no WebRTC media path and no coturn dependency.

## Room Discovery and Join

- Home lists live public rooms and refreshes every five seconds.
- The host selects a local ROM before creating a room.
- Clicking Join opens a Player 2 setup view before claiming the room. Player 2
  must select a local ROM explicitly.
- The first authenticated join succeeds atomically; later joins fail.
- Room directory entries include the host's complete ROM filename (basename
  plus extension) so Player 2 can choose a matching local file. They never
  include a ROM path, bytes, hash, emulator state, or connection secret.

## ROM Boundary

- Each machine reads its own ROM through the existing local Tauri command.
- Local loading accepts `.nes`, `.sfc`, `.smc`, `.fig`, and `.swc` files up to
  16 MiB. NES uses its iNES signature. SNES uses internal LoROM/HiROM/extended
  cartridge headers, with optional 512-byte copier prefixes; trailing zero/FF
  padding and stale translation checksums do not invalidate a plausible header.
- Console detection never rewrites the file or strips bytes from the returned
  payload. Size and SHA-256 continue to describe the exact selected file.
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
- The controller wire value is a 12-bit mask: the original NES buttons plus
  SNES X/Y/L/R. In particular, `2048` is the valid SNES R bit, not a 255-byte
  payload violation. The JSON room envelope plus WebSocket/TLS framing makes
  real traffic typically single-digit to low-tens of KiB/s per client.

## Local Controller Mapping

- NES and SNES use CLX's per-role keyboard mapping, including WASD, arrows,
  custom bindings, and SNES face/shoulder buttons.
- The SNES adapter translates direction bits to the bundled core's D-pad IDs
  4-7. Its separate EmulatorJS keyboard/gamepad bindings are cleared at startup,
  including restored bindings, so they cannot add buttons or bypass CLX remaps.
- Inputs received during SNES startup are applied after the core starts.

## Shared reactions

- While a two-player room is synchronized or paused, either player can choose one of eight fixed emoji reactions.
- The sender and peer each see the same short-lived P1/P2 overlay; no reaction history is stored.
- Reactions are validated by emoji ID and limited to one per player every 800 ms, so they cannot alter input lockstep or state hashes.

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
