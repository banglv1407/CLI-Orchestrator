# E12 NES Multiplayer Overview

Two authenticated Windows CLX clients run the same ROM locally. The host is
Player 1 and the guest is Player 2. A standalone Linux `nes-session` service
provides live rooms, atomic join, and an authenticated WSS relay for controller
input and synchronization hashes.

The ROM, emulator state, rendered video, and audio stay on each client. The
server exposes no ROM metadata in the public room directory and has no coturn,
WebRTC, UDP, database, or object-storage dependency.

V1 includes public live rooms, explicit guest ROM selection, SHA-256 match,
three-frame lockstep buffering, synchronized pause/reset, periodic state hash,
solo play, and one-container Linux deployment.

Rollback, snapshot repair, ROM sharing, spectators, browser clients, and more
than two players are out of scope.
