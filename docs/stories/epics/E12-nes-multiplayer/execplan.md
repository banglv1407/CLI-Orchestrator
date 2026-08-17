# E12 Execution Plan

## Scope

Implement dual-local-ROM NES play with input-only WSS lockstep, live public
rooms, NIP-98 identity, and a one-binary Linux service.

## Sequence

1. Protocol: exact-field `rom_ready`, `input`, `state_hash`, lifecycle messages.
2. Service: atomic rooms, role tickets, validated room WebSocket fan-out.
3. Client: explicit ROM picker for both roles and SHA-256 match gate.
4. Emulator: manual one-frame stepping with P1/P2 masks.
5. Netplay: three-frame pipeline, epoch reset, periodic state hash.
6. Deployment: one loopback-bound container behind HTTPS/WSS.
7. Verification: builds/tests, Linux smoke, then two-machine acceptance.

## Escalation

Stop for scope clarification if ROM bytes/snapshots must cross the network,
prediction/rollback replaces strict lockstep, or more than two players are
required.
