# US-044 Local JSNES workspace and dual-ROM boundary

## Status

in_progress

Both host and guest explicitly choose a local `.nes` file. Each side renders
its own 256x240 canvas and audio. The emulator supports normal solo timing plus
manual deterministic `stepFrame(P1, P2)` for online lockstep.

Only SHA-256 leaves the local ROM boundary, inside an authenticated room. ROM
bytes, names, paths, and emulator snapshots never reach the service. Desktop
same-ROM/different-ROM acceptance remains pending.
