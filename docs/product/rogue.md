# Rogue Node: local 2D playable slice

## Purpose

Rogue Node is an original, local-first social-deduction mini-game inside the
Entertainment workspace.  This release makes the existing prototype playable
without presenting the unfinished WebSocket server as production multiplayer.

## Player contract

- Start a local round from the Rogue Node lobby.
- Control one operator with keyboard movement at a deliberately measured speed
  (145 world units/second alive; 165 as a ghost) rather than frame-based
  movement.
- Complete nearby tasks as an Engineer, or use the Rogue role's close-range
  action and report flow.
- Play with deterministic local bots, meetings, voting, win/loss checks, and
  restart.  No account, network connection, or online-room claim is made.
- See original 2D pixel operators, generated for CLX.  The art must not use or
  imitate third-party game characters.

## Technical guardrails

- A fixed-step simulation owns gameplay state; React receives a throttled UI
  snapshot and does not run the game logic per render.
- Rendering is canvas-based, DPR-aware, paused while the workspace is hidden,
  and uses preloaded sprite atlases with nearest-neighbour sampling.
- Sprite sheets are 4 directions by 4 frames.  Asset preparation finds opaque
  bounds and bottom-aligns every frame so anchors remain stable.
- The existing `crates/rogue-server` remains a future online transport seam;
  this local release must not depend on it.

## Verification

- `npm.cmd run test:rogue-assets`
- `npm.cmd run build`
- A manual desktop pass: lobby, movement, task completion, report/meeting,
  vote, both win paths, restart, and hidden-workspace pause.
