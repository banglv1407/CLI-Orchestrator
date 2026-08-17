# US-048 NES Public Join and Buzz Identity Rendering Regressions

## Status

implemented

## Lane

normal

## Product Contract

A second CLX instance can list and atomically claim a public NES room without
NIP-98 identity or replay checks; the returned role ticket continues to protect
the two-player signaling channel. Buzz chat resolves the latest profile for
each message author independently of member-list timing, shows channel and user
IDs, and opens a newly selected conversation at its newest message.

## Relevant Product Docs

- `docs/stories/epics/E12-nes-multiplayer/plan.md`
- `docs/stories/epics/E11-buzz-collaboration/plan.md`

## Acceptance Criteria

- `GET /v1/rooms` and `POST /v1/rooms/{room_id}/join` succeed without an
  Authorization header; room creation remains NIP-98 authenticated.
- Exactly one Player 2 can claim a room, and the WSS connection still requires
  the returned guest ticket.
- Message cards prefer the latest resolved `display_name`/`name` and avatar,
  even when the channel-member enrichment request finishes late or fails.
- The active chat header displays the channel ID, and every message displays
  the author user ID with the full value available via tooltip.
- The first completed message load after selecting a channel or DM always
  scrolls to the bottom; later updates preserve a user who scrolled upward.

## Design Notes

- Commands: the existing Tauri command names and connection bundle remain
  unchanged.
- API: only public discovery/claim lose NIP-98; host ownership endpoints and
  short-lived signaling tickets remain protected.
- Domain rules: the service assigns an opaque guest participant ID during the
  public claim, so two CLX windows sharing one Buzz key cannot collide.
- UI surfaces: Buzz conversation header, message cards, initial-load scroll,
  main messages, and thread messages.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | NES session HTTP integration tests prove unauthenticated list/join, atomic claim, and ticketed WSS. |
| Integration | Frontend production build type-checks and bundles Buzz changes. |
| E2E | Two CLX instances join one room; Buzz loads renamed users and starts at the newest message. |
| Platform | Windows Tauri smoke with the configured NES/Buzz services. |
| Release | Focused Rust tests, `git diff --check`, and relevant formatting checks pass. |

## Harness Delta

US-048 records that public room admission and post-admission signaling have
separate trust boundaries, and that Buzz author identity must not depend on the
member-list fetch race.

## Evidence

- `cargo test --manifest-path crates/nes-session/Cargo.toml` — passed: 9
  unit tests and 6 HTTP/WebSocket integration tests; 1 live-service smoke test
  remains ignored unless `NES_LIVE_BASE` is configured.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --lib nes_identity`
  — passed and compiled the updated desktop NES client.
- `npm.cmd run build` — passed: TypeScript and Vite production build, 122
  modules transformed.
- `cargo fmt --manifest-path crates/nes-session/Cargo.toml -- --check` — passed.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` — passed.
- `git diff --check` — passed; only line-ending conversion warnings were emitted.
- Manual two-instance NES and renamed-profile Buzz desktop validation remains
  pending, so E2E and platform proof stay false.
