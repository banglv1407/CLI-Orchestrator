# US-045 Dual-local-ROM WSS lockstep

## Status

in_progress

Guest setup requires a local ROM before room claim. Both clients exchange only
SHA-256, then pipeline three frames of controller masks over authenticated WSS.
Each local emulator advances only with both masks. Pause/resume/reset are
synchronized, reset increments epoch, and state hashes compare every 300
frames.

Frontend build and server fan-out tests pass. Required remaining proof: two
physical clients, same-ROM success, different-ROM failure, induced state
divergence, reconnect behavior, and 30-minute soak.
