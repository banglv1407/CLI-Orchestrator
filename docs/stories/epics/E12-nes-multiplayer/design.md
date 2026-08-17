# E12 NES Multiplayer Design

## Terms

- Host/P1 and guest/P2 each own a local ROM and local JSNES instance.
- A room ticket is short-lived, role-specific, and consumed by the WSS socket.
- Epoch separates reset generations; frame identifies deterministic progress.

## Happy Path

1. Host selects a ROM and creates a public room.
2. Guest clicks Join, selects a local ROM, then atomically claims the room.
3. Both authenticate WSS and send only `rom_ready {sha256}`.
4. Equal hashes start three-frame input pipelining; unequal hashes fail.
5. Each client receives both masks and advances the same local frame.
6. Every 300 frames, clients compare compact deterministic state hashes.

## Failure Rules

- Unknown/extra payload fields, ROM bytes, frame zero, invalid masks, stale
  sequence numbers, wrong room IDs, and reused tickets are rejected.
- Missing peer input stalls rather than predicts.
- State mismatch pauses and ends useful gameplay; v1 does not send snapshots.
- Disconnect releases controls and reports peer-left.

## Privacy

The public directory contains room/host occupancy only. ROM hashes travel only
inside the authenticated two-participant room and are not logged. ROM bytes,
filenames, paths, snapshots, video, and audio never enter server messages.
