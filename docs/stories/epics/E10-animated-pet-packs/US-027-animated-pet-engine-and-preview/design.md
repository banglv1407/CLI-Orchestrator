# Design

## Domain Model

Animation states are loading, idle, travel, special, and recovery. Supported
move kinds are blink, teleport, beam, clone, orb-lunge, web-shot, and web-zip.

## Application Flow

One controller owns movement time, sprite time, the 25-45 second scheduler, and
cleanup. Actor canvases render sprite frames; bounded canvas/SVG effect layers
render particles, beams, and web paths. Settings reuses the same clip renderer
without moving the live overlay.

## Interface Contract

The live overlay consumes the merged pet registry. Preview receives a pet ID
and clip ID. Existing `mythical-pet-change` remains compatible and gains
registry refresh and special-move settings.

## Data Model

Existing enabled and selected-pet localStorage keys remain. One additional
boolean key stores whether automatic special moves are enabled.

## UI / Platform Impact

The root overlay is pointer-transparent except for the main pet's accessible
click target. No full-viewport bitmap is allocated.

## Observability

Asset decode errors disable only the affected clip and fall back to idle.

## Alternatives Considered

1. A full-window canvas was rejected because of memory and clear-rate cost.
2. Right-click move selection was rejected to avoid context-menu ownership
   conflicts.
