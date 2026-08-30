# US-051: Rebuild Rogue Node as a local playable 2D game

**Lane:** normal  
**Product contract:** `docs/product/rogue.md`

## User story

As a CLX user, I can open Rogue Node and play a complete, readable local round
with original 2D operators, instead of a static prototype with frame-dependent
movement and placeholder avatars.

## Acceptance criteria

1. A local round has a lobby, one controlled player, three local bots, tasks,
   meeting/voting, end state, and restart.
2. Movement is fixed-step, diagonal-safe and slow enough to be deliberate;
   its default speed is not dependent on display refresh rate.
3. Canvas rendering does not set React state on every animation frame, is
   paused when hidden, and uses original preloaded sprite frames.
4. Every sprite frame is transparent, bottom-anchored and validated as a 4x4
   atlas before it is served by the app.
5. The UI does not claim online synchronization or rely on the unfinished
   Rogue WebSocket server for this local slice.
6. The focused asset validation and production build pass; the desktop flow is
   manually exercised before the story is closed.

## Notes

This story intentionally does not add authentication, matchmaking, authoritative
server simulation, or persistence. Those require a separate online contract.
