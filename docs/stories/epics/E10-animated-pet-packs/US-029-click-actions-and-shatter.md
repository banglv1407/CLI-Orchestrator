# US-029 Click-driven pet actions and shatter effects

## Status

implemented

## Lane

normal

## Product Contract

Live pets rest longer, travel for bounded two-second segments, and start actions
only from clicks. Impact moves may render one bounded glass-shatter overlay.

## Relevant Product Docs

- `docs/product/pets.md`

## Acceptance Criteria

- Idle is 6.6-15 seconds; travel is two seconds and always returns to idle.
- No signature or blink action starts from a timer.
- Clicks select a non-repeating move, with at most one queued click.
- Actions run at 2x duration with a 1.8 second minimum.
- Teleport/blink relocate safely; beam/orb-lunge/web-shot shatter once at impact.
- Effects never receive input or allocate unbounded DOM/SVG content.

## Design Notes

- The live React animation controller owns action requests and the one-slot
  queue.
- Existing full-viewport SVG hosts bounded crack paths and shards.
- Click-to-Web-AI wiring and the automatic-special setting are removed.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | TypeScript build covers state and move-kind exhaustiveness |
| Integration | Pet registry switching and failed-clip fallback remain stable |
| E2E | Built-in/local click actions, queued clicks, relocation and impact effects |
| Platform | Windows scaling and resize clamp |
| Release | Frontend build and interaction soak |

## Harness Delta

Adds click-driven action and bounded-impact proof expectations to E10.

## Evidence

`npm.cmd run build` passes after the implementation. The full Rust suite passes
65 tests with one live-provider test ignored. Manual desktop action/shatter and
Windows scaling proof remain to be recorded.
