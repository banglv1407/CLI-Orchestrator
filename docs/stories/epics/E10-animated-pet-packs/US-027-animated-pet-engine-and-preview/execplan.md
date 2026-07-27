# Exec Plan

## Goal

Deliver attractive special moves without losing terminal focus, click routing,
visibility recovery, or runtime bounds.

## Scope

In scope:

- State machine, scheduler, actors and effects.
- Settings preview and automatic-move toggle.
- Reduced-motion and hidden-window handling.

Out of scope:

- Audio, physics, combat, and direct move controls on the live overlay.

## Risk Classification

Risk flags:

- Existing behavior.
- Weak proof.
- Runtime performance.
- Multi-domain.

Hard gates:

- Do not regress the staged pet visibility/resume fix.

## Work Phases

1. Extract registry and animation types.
2. Implement bounded actor/effect renderer.
3. Add move scheduler and preview.
4. Integrate Settings.
5. Build and soak.
6. Update Harness proof.

## Stop Conditions

Pause if effects require a full-window raster buffer, the live pet steals
terminal pointer input, or memory thresholds must be weakened.
