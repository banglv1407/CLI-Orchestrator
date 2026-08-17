# US-046 Security hardening and release acceptance

## Status

planned

- Verify logs redact tickets, ROM hashes, payloads, and NIP-98 authorization.
- Prove exact-field validation rejects ROM bytes, snapshots, oversized input,
  cross-room messages, stale sequences, and ticket reuse.
- Run ten rooms without cross-talk or unbounded memory growth.
- Run two physical Windows machines for 30 minutes with synchronized input,
  pause/reset, state hashes, leave/end, and no stuck controls.
- Confirm a different ROM fails before frame 1 and induced divergence stops.
- Verify Linux one-container cold start, health, restart, and upgrade behavior.
