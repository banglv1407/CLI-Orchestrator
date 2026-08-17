# US-047 Buzz Unread Counts, Icon Picker, and Direct DMs

## Status

implemented

## Lane

normal

## Product Contract

Message Buzz counts only new messages from other users. Relay history replay
must not create unread badges, duplicate live delivery must count once, and
opening Buzz marks only the conversation currently visible as read. Users can
choose Unicode icons from each composer and can open or create a direct-message
conversation by selecting another user's displayed name. A message viewport
follows new content only while the user is already at the bottom.

## Relevant Product Docs

- `docs/stories/epics/E11-buzz-collaboration/plan.md`

## Acceptance Criteria

- Initial relay replay before EOSE produces no unread count; messages first seen
  after initial sync count once per event and conversation, excluding own
  messages. Live delivery and the five-second polling fallback share the same
  event-id deduplication and unread counter.
- Main chat and thread viewports scroll to the newest message when already at
  the bottom, but preserve the user's position when they have scrolled upward.
- Opening a channel or DM clears only its unread count, while unread badges for
  other conversations and the aggregate Activity Sidebar badge remain correct.
  The aggregate badge stays visible when Buzz is active if another conversation
  still has unread messages.
- Both the main-message and thread composers expose a fixed icon list; selecting
  an icon inserts it into the input and the existing send flow publishes it.
- Selecting another user's displayed name in a message or member list opens or
  creates that user's DM immediately without the pubkey modal.

## Design Notes

- Commands: existing `buzz_open_dm`, `buzz_send_message`,
  `buzz_subscribe_live`, and `buzz_unsubscribe_live` commands remain unchanged.
- Events: `buzz-live-eose` marks the boundary between stored relay history and
  realtime events.
- Domain rules: unread state is session-local and keyed by channel/DM id; event
  ids deduplicate relay replay and reconnect delivery.
- UI surfaces: Buzz left rail, message cards, member roster, main composer,
  thread composer, Settings notification toggle, and Activity Sidebar badge.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Focused Rust `buzz_live` tests pass. |
| Integration | Frontend production build type-checks and bundles the Buzz UI. |
| E2E | Manually exchange messages across two identities and multiple channels/DMs. |
| Platform | Manually verify the Tauri desktop picker, per-conversation badges, reconnect replay, and name-to-DM navigation. |
| Release | `git diff --check` passes for touched files; full repo validation remains governed by the E11 release plan. |

## Harness Delta

Added EOSE as an explicit validation boundary for unread-count work so future
realtime clients do not confuse Relay history with live activity.

## Evidence

- `npm.cmd run build` — passed, 121 modules transformed.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --bin clx buzz_live` — passed, 3 tests.
- `rustfmt --edition 2021 --check src-tauri/src/core/buzz_live.rs` — passed.
- `git diff --check -- src/components/BuzzWorkspacePanel.tsx src/components/CliSidebar.tsx src/components/BuzzNesSettings.tsx src-tauri/src/core/buzz_live.rs` — passed.
- Follow-up `npm.cmd run build` after sticky-bottom scrolling and polling unread
  fallback — passed, 121 modules transformed.
- Manual two-identity desktop validation remains pending.
