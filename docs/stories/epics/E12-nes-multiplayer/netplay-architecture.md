# NES Netplay Architecture: Local ROM + WSS Input Lockstep

## Decision

Both players own and select the same ROM locally. CLX never transfers the ROM
or streams rendered media. The existing authenticated `nes-session` WebSocket
relays only ROM hashes, controller masks, lifecycle controls, and periodic
state hashes.

This replaces the earlier host-media/WebRTC design. coturn is not part of the
NES stack.

## Flow

```text
Host CLX                         nes-session                        Guest CLX
local ROM -> SHA-256        authenticated room WSS          SHA-256 <- local ROM
         rom_ready(hash) ----------> | <---------- rom_ready(hash)
                    mismatch: fail closed

frame N P1 mask -----------> validate + relay -----------> P1 mask
frame N P2 mask <----------- validate + relay <----------- P2 mask
both clients run exactly one local NES frame with the same P1/P2 masks
```

## Messages

Every message uses the existing versioned room envelope. Payloads accept exact
fields only.

| Type | Payload | Purpose |
| --- | --- | --- |
| `rom_ready` | `{sha256}` | compare local ROM identity; no ROM bytes |
| `input` | `{epoch, frame, mask}` | one local 8-bit controller state |
| `state_hash` | `{epoch, frame, hash}` | detect deterministic divergence |
| `pause` / `resume` | `{epoch}` | synchronized lifecycle |
| `reset` | `{epoch}` | discard stale frames and reset both emulators |
| `peer_left` / `end` / `error` | bounded control fields | terminal behavior |

Payloads are capped at 1 KiB. Unknown fields, invalid hashes, frame zero,
invalid masks, cross-room messages, stale sequences, and reused tickets fail
closed.

## Lockstep

- Both sides start at epoch 1, frame 1 after SHA-256 equality.
- Each client samples its local controller at 60 Hz and pipelines at most three
  frames ahead.
- A frame runs only when local and remote masks for that frame exist.
- Network delay can stall emulation but cannot make one peer invent input.
- Reset increments the epoch so delayed frames from the previous run are
  ignored.
- Every 300 frames, each side hashes `NES.toJSON()` with the same deterministic
  FNV-1a function. A mismatch pauses both clients. Snapshot repair/rollback is
  deferred; snapshots never cross the network in v1.

## Bandwidth

The meaningful controller state is one byte per player per frame. The current
implementation wraps it in a validated JSON room envelope, so measured wire
traffic should be expected in the single-digit to low-tens of KiB/s per client
rather than the sub-KiB/s raw-mask figure. It remains orders of magnitude below
video/audio streaming; the two-machine soak records the final measured rate.

## Server

The Linux host runs one `nes-session` binary/container behind HTTPS/WSS. The
same room socket authenticates with a role-specific single-use ticket and then
relays validated input-sync envelopes. No WebRTC negotiation, STUN, TURN,
coturn, UDP firewall range, or media codec is involved.
