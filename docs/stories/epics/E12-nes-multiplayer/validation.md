# E12 NES Multiplayer Validation

## Mechanical Gates

```text
npm.cmd run build
cargo test --manifest-path crates/nes-protocol/Cargo.toml
cargo test --manifest-path crates/nes-session/Cargo.toml
cargo fmt --check
bash -n deploy/nes-relay/scripts/*.sh
docker compose --env-file deploy/nes-relay/.env.example -f deploy/nes-relay/docker-compose.yml config
git diff --check
```

## Required Cases

- Protocol: valid hash/input/lifecycle; reject ROM bytes, extra fields, invalid
  hash/mask/frame/epoch, oversized payload, stale sequence, wrong room.
- Service: NIP-98, replay rejection, directory redaction, atomic join, two-role
  WSS fan-out, peer-left, no TURN fields.
- Client: both roles select local ROM; same hash starts; mismatch fails; local
  canvases/audio run; P1/P2 controls map correctly; pause/reset synchronize.
- Soak: periodic state hashes match for 30 minutes; induced mismatch fails;
  record actual WSS bytes per client (expected single-digit to low-tens of
  KiB/s); no runaway buffers/timers/audio/controllers.
- Platform: one Linux service behind WSS and two Windows clients on separate
  networks.

Build/test evidence may mark implementation progress but cannot replace the
two-machine acceptance run.
