# E11 - Buzz Collaboration Workspace Plan

## Status

Planned. This is a docs-only initiative. Implementation has not started.

The research baseline was verified on 2026-08-13 against the official
[`block/buzz`](https://github.com/block/buzz) repository. CLX will be a
Buzz-compatible client; it will not embed Buzz Desktop or manage the Relay
process.

## Goal

Add a **Buzz** activity to the CLX Activity Sidebar. It opens a CLX-native
collaboration workspace with:

- Public/private stream channels and direct messages.
- Realtime text chat, history, threads, reactions, mentions, presence, unread
  state, notifications, and search.
- Community membership and basic owner/admin actions.
- Project-bound Buzz agents whose lifecycle and tool permissions are managed by
  CLX.

The Relay is deployed independently on Linux. CLX connects to one active Relay
URL and owns only client identity, workspace state, and local agent processes.

## Confirmed Product Decisions

- Windows x64 is the first CLX client and agent platform.
- The Relay is an independent Linux Compose deployment; CLX does not start,
  stop, back up, or administer the Relay host.
- V1 supports streams, private streams, and DMs only. Forums, canvas, huddles,
  media, and file uploads are deferred.
- Buzz is a full main-area workspace reached from a new Activity Sidebar icon
  immediately after Dashboard.
- CLX uses one active Relay profile at a time.
- Human identities can be generated or imported. Private keys are kept in
  Windows Credential Manager and exported only as passphrase-protected NIP-49.
- DM privacy follows Buzz semantics: Relay-enforced participant membership,
  but plaintext message content on the Relay. V1 does not claim E2EE.
- Managed agents use upstream `buzz-acp` and `buzz-agent`, plus a hardened CLX
  fork of `buzz-dev-mcp`.
- Managed agents call an OpenAI-compatible endpoint directly per agent. They do
  not route through CliProxyAI.
- Agents are bound to one local project, start manually by default, and may
  opt in to autostart.
- Agent triggers are restricted to the owner and an explicit pubkey allowlist.
  An `anyone` mode is not exposed.
- Tool permissions are per-process-run grants for project read, project write,
  and full host shell. Grants are never remembered permanently.
- A host-shell grant is explicitly full trust under the current Windows user;
  it is not a filesystem sandbox.
- Sidecars ship in the portable CLX folder/ZIP and are never downloaded at
  runtime.
- Relay backup/restore is operator-invoked. The deployment does not include a
  backup scheduler or bundled TLS reverse proxy.

## Pinned Upstream Baseline

| Component | Pin | Delivery |
| --- | --- | --- |
| Relay | `relay-v0.2.1`, commit `6e5c462ac524de60d7edb46c66130fd779cc9006` | Linux Compose image pinned by digest |
| Client crates and upstream sidecars | `desktop-v0.5.10`, commit `1fb49103002e898607a7f6fd554cb51e94d92e08` | Built for Windows x64 |
| Tool server | CLX fork of `buzz-dev-mcp` from the same desktop pin | `clx-buzz-dev-mcp.exe` |
| UI | CLX-native React/Tauri | No Buzz Desktop embedding or source copy |

Every Buzz dependency must lock the source commit, Cargo lockfile, produced
binary SHA-256, and Apache-2.0 provenance. CLX must not track `main` or silently
update the sidecars. An upgrade requires an explicit pin change, fork rebase,
and the complete compatibility/security suite.

Relevant upstream references:

- [Buzz architecture](https://github.com/block/buzz/blob/desktop-v0.5.10/ARCHITECTURE.md)
- [Relay Compose deployment](https://github.com/block/buzz/tree/relay-v0.2.1/deploy/compose)
- [`buzz-acp` configuration](https://github.com/block/buzz/blob/desktop-v0.5.10/crates/buzz-acp/README.md)
- [`buzz-agent` OpenAI-compatible configuration](https://github.com/block/buzz/blob/desktop-v0.5.10/crates/buzz-agent/README.md)
- [NIP-RS read-state protocol](https://github.com/block/buzz/blob/desktop-v0.5.10/docs/nips/NIP-RS.md)
- [Buzz license](https://github.com/block/buzz/blob/desktop-v0.5.10/LICENSE)

## Architecture

### Relay deployment

Add a standalone `deploy/buzz-relay/` operator pack containing:

- Compose manifest for Relay, PostgreSQL 17, Redis 7, MinIO, and the git data
  volume expected by the pinned Relay.
- `.env.example`, bootstrap validation, health checks, upgrade preflight, and
  documented minimum host requirements.
- Closed-community defaults: NIP-42/NIP-98 authentication, required Relay
  membership, NIP-OA support, owner pubkey, and stable Relay/HMAC/database/
  Redis/S3 secrets.
- A private or localhost bind by default. The operator supplies TLS termination
  and WebSocket forwarding. Documentation must state the required forwarded
  headers, timeouts, body limits, and `wss://` public URL.

Pin the Relay image by both `0.2.1` tag and immutable digest. Pin compatible
PostgreSQL, Redis, and MinIO versions rather than floating latest tags.

Backup must stop Relay writes, dump PostgreSQL, copy MinIO and the git volume,
write version metadata and checksums, then restart Relay. Redis is disposable
cache and is not restored. Secrets are backed up separately by the operator and
must not be silently included in the data archive.

Restore runs only against a stopped stack, validates archive checksums and
versions, requires an explicit confirmation flag, and refuses an incompatible
target. Upgrade begins with a verified backup and compatibility preflight;
database migration rollback is not promised.

### CLX backend

Add a `BuzzManager` to Rust `AppState` with these owned subsystems:

- `IdentityVault`: generate/import identities, sign Nostr events, and interact
  with Windows Credential Manager.
- `RelaySession`: one WebSocket/REST connection and its authentication state.
- `SubscriptionManager`: channel windows, realtime subscriptions, reconnect,
  replay, deduplication, and backpressure.
- `ReadStateSync`: NIP-RS storage, merge, manual-unread state, and flush policy.
- `NotificationService`: unread aggregation and Windows toast routing.
- `AgentSupervisor`: sidecar verification, process trees, approval broker,
  logs, and runtime status.

Link the pinned `buzz-core`, `buzz-sdk`, and `buzz-ws-client` crates. Keep the
private signing key and all Relay network I/O in Rust; React receives typed
snapshots and deltas only.

The connection state machine must expose `disconnected`, `connecting`,
`authenticating`, `syncing`, `ready`, `backoff`, and terminal `auth_failed`
states. Reconnect uses bounded exponential backoff with jitter, a stall
watchdog, and a terminal latch for invalid identity/membership errors. On
reconnect, replay the visible channel first, followed by DMs, other subscribed
channels, presence, and background metadata.

Handle the complete relevant Nostr Relay flow: `EVENT`, `REQ`, `CLOSE`, `AUTH`,
`EOSE`, `OK`, `CLOSED`, `NOTICE`, authentication challenges, batch events,
rate limits, and duplicate event IDs. An event is locally `sent` only after a
successful Relay `OK`; timeout or reject produces a visible retryable failure.
V1 has no durable offline outbox.

### Activity workspace

Add `buzz` to the existing main-view union and Activity Sidebar ordering. The
main view uses a responsive three-column layout:

1. Channel/DM navigation, connection state, unread badges, mute state, and
   workspace actions.
2. Selected conversation, history pagination, thread drawer, composer, search,
   and message actions.
3. Collapsible member/agent rail with identity, role, presence, assignments,
   and agent runtime status.

The UX must use the CLX theme and interaction patterns rather than duplicating
Buzz Desktop styling. At narrow widths the right rail becomes a drawer and the
channel rail can collapse; the selected conversation remains the primary
surface.

V1 chat behavior includes:

- Public and private stream creation, rename, archive, and membership controls
  according to Relay authorization.
- One-to-one and group DMs using Buzz's immutable participant set.
- Keyset-paginated history and realtime insertion without duplicates.
- Threads using root/parent event tags.
- Reactions and reaction removal.
- Mentions with identity lookup and correct event tags.
- Message edit and delete with author/role checks and Relay result handling.
- Member/agent presence and a best-effort online/away/offline display.
- Server search through `/query`; never expose unauthorized private hits.

The DM creation screen and conversation details must say that access is private
to members but message bodies are not end-to-end encrypted.

### Identity and onboarding

The first-use flow is:

1. Enter and normalize the single Relay URL.
2. Perform health and protocol checks without exposing credentials.
3. Generate a new identity or import an `nsec`, hex key, or NIP-49 backup.
4. Store the key in Windows Credential Manager and discard plaintext input.
5. Authenticate, claim an invite if needed, then fetch membership and workspace
   state.

Non-local plaintext Relay URLs are rejected by default. A deliberately enabled
insecure mode may be used for development and must show a persistent warning.

NIP-49 export requires a newly entered passphrase and confirmation. CLX never
stores that passphrase or exposes a raw private key. Credential Manager failure
is fatal for identity creation/import; there is no silent session-only fallback
for Buzz identities.

### Read state and notifications

Implement NIP-RS compatibility rather than a CLX-only unread format:

- Kind `30078` events with `d=read-state:<slot-id>` and `t=read-state` tags.
- NIP-44 self-encrypted canonical payloads.
- Per-client slot IDs, slot collision recovery, bounded/multi-slot state, and
  grow-only maximum merge across devices.
- The formal single-coordinate manual-unread override layer with clear-wins
  semantics.
- Debounced writes after local state settles, plus flush on background and
  orderly shutdown. Do not write for every individual read event.

Toasts are emitted only for new live DMs or `@mentions` when CLX is not focused,
the event is not authored by the current user, and the conversation is not
muted. Historical replay never triggers a toast. Clicking a toast opens Buzz at
the exact channel/thread. The Activity Sidebar badge shows aggregate unread.

### Community administration

V1 basic administration includes:

- Claim invite during onboarding.
- Owner/admin invite creation with TTL and maximum-use values.
- Member roster and role display from Relay-signed membership state.
- Add/remove members and managed agents according to upstream permission rules.
- Owner-only role changes; no ownership-transfer workflow.

Relay `0.2.1` does not provide a public invite list/revoke API. The invite
secret is shown once, copied deliberately, and cannot be revoked early from
CLX. The UI must communicate this before minting and recommend short TTLs.

## Managed Agents

### Agent configuration and lifecycle

Each agent owns a separate Nostr identity and stores:

- Display profile and public key.
- Instructions.
- One canonical project root.
- Assigned stream/DM IDs.
- Owner pubkey and trigger allowlist.
- OpenAI-compatible base URL, model, and explicit `auto`, `chat`, or `responses`
  API dialect.
- An opaque Credential Manager reference for the provider API key.
- Manual-start default and optional autostart flag.

CLX launches a Windows Job Object process tree:

```text
buzz-acp.exe -> buzz-agent.exe -> clx-buzz-dev-mcp.exe
```

The agent also receives the pinned `buzz.exe` CLI for protocol actions. Start
fails closed if a binary/hash, Relay connection, identity, membership, assigned
channel, project root, or provider credential is invalid. A crash remains
stopped and visible; V1 does not enter an automatic restart loop.

Autostart remains opt-in and only occurs after Relay sync and all preflight
checks pass. Stop/restart uses the Job Object so descendants cannot be orphaned.

### Trigger policy

`buzz-acp` is configured to react only to explicit mentions in assigned
channels. CLX validates that the author is either the owner or is present in the
agent's explicit allowlist. The backend never accepts or serializes an `anyone`
trigger mode.

Removing an agent from a channel invalidates its channel session. Changing
project, Relay, identity, provider, assignments, or allowlist requires a clean
agent restart.

### Approval bridge

Upstream `buzz-acp` can auto-select `allow_once`, while upstream
`buzz-dev-mcp` explicitly does not enforce workspace containment. Neither is a
CLX security boundary. The hardened MCP fork is therefore mandatory.

The fork communicates with CLX through a current-user-only Windows named pipe
and a random token unique to the agent process run. It supports three separate
session capabilities:

- `read_project`: list, read, search, and view within the canonical project.
- `write_project`: create, update, and delete within the canonical project.
- `host_shell`: full PowerShell execution as the current Windows user,
  including access outside the project and to the network.

All grants start denied. The first attempted use pauses and emits a structured
approval request showing agent, capability, project, operation, and risk. The
user may grant that capability for the current process run or deny it. Closing
or timing out the prompt is a denial.

A grant is keyed by `agent_id + run_id + canonical_project` and stays in memory
only. It expires on stop, crash, restart, project change, Relay change, identity
change, or CLX exit. There is no persistent or global approval.

Revoking a file capability blocks subsequent calls. Revoking host shell also
kills every active shell process in the agent Job Object. The UI must describe
host shell as full host trust; setting a working directory is not containment.

### File containment and safe reply lane

Project file tools must reject:

- Absolute paths outside the canonical project.
- UNC paths, device paths, alternate data streams, and traversal.
- Symlink, junction, or reparse-point escapes.
- A create/rename target whose canonical parent or post-operation target escapes
  the project.

Containment is checked before and after mutations. Race-resistant OS handles
should be used where Windows APIs permit them.

An agent may reply or react to its current triggering event without a tool
grant. This is a narrow protocol lane, not shell access:

- Accept only a standalone `buzz messages send --reply-to ...` or
  `buzz reactions add ...` grammar.
- Require the current triggering event, channel, and agent identity.
- Reject pipes, redirection, command chaining, wrapper shells, arbitrary Relay
  options, and unrelated targets.
- Invoke the pinned `buzz.exe` using a validated argv array, never through a
  shell command string.

Any other shell-shaped operation requires `host_shell`. This lane preserves the
upstream `buzz-agent` reply guard without converting chat publication into an
arbitrary command bypass.

### Logs and redaction

Agent runtime logs are bounded and rotated. Structured audit entries cover
start, stop, crash, grant, deny, revoke, shell start/exit/kill, and safe-lane
publication.

Logs, Tauri events, errors, and exported diagnostics redact private keys,
provider keys, Relay tokens, approval tokens, authorization headers, and common
secret-bearing environment variables. Raw sidecar environments are never sent
to React.

## Public Interfaces and Persistence

Persist `BuzzConfigV1` atomically with a schema version and recovery backup. It
contains only:

- `RelayProfileV1`: one canonical Relay URL, insecure-development flag, and an
  opaque human identity reference.
- `NotificationPrefsV1`: conversation mute and toast preferences.
- `ManagedAgentConfigV1`: public profile, instructions, project, channel IDs,
  owner/allowlist, autostart, OpenAI-compatible metadata, and opaque identity/
  provider credential references.
- NIP-RS client and slot identifiers.

Never persist session grants, plaintext keys, process IDs as authoritative
state, pending approvals, or live connection state.

Expose grouped Tauri command contracts for:

- Config and connection state.
- Identity generation/import/NIP-49 export.
- Channels, DMs, messages, threads, reactions, and search.
- Read-state and notification preferences.
- Membership, invites, and role administration.
- Agent configuration, start/stop/status/logs, grants, denials, and revocation.

Emit these event families:

- `buzz-connection`
- `buzz-delta`
- `buzz-agent-runtime`
- `buzz-approval-request`

Every workspace delta includes a monotonic sequence. A sequence gap triggers a
fresh backend snapshot instead of applying uncertain state. Public DTOs contain
no raw secrets and return typed error codes for transport, protocol, auth,
membership, validation, permission, sidecar integrity, and agent runtime
failures.

Use upstream builders/parsers for the relevant event contracts, including
stream messages, edits, deletions, reactions, channel metadata/membership,
threads, and NIP-RS state. Do not hand-assemble event JSON in React.

## Portable Windows Bundle

Build and package these Windows x64 binaries:

```text
CLX (...).exe
sidecars/buzz/buzz.exe
sidecars/buzz/buzz-acp.exe
sidecars/buzz/buzz-agent.exe
sidecars/buzz/clx-buzz-dev-mcp.exe
sidecars/buzz/manifest.json
sidecars/buzz/LICENSE
sidecars/buzz/NOTICE
```

`manifest.json` records upstream/fork commits, build target, Rust version,
features, file sizes, and SHA-256 values. Expected hashes are also embedded in
the CLX backend. A missing or modified executable fails closed with a repair
message. CLX performs no executable download or self-update in V1.

Keep the current portable build model. Do not switch the application to NSIS or
enable Tauri bundling solely for this initiative.

## Harness Classification and Delivery

- Input type: `new_initiative`.
- Risk lane: `high_risk`.
- Risk areas: third-party protocol and binaries, external service deployment,
  identity/secrets, authorization, realtime data, destructive admin actions,
  local process control, arbitrary host shell, notifications, and persistent
  client state.
- Proposed epic: `E11-buzz-collaboration`.
- Proposed delivery stories:
  - Relay pack, bootstrap, health, backup/restore, and upgrade preflight.
  - Rust protocol foundation, identity vault, Relay session, and persistence.
  - Activity workspace, streams/DMs, messaging, threads, and search.
  - Read-state, presence, notifications, invites, roster, and roles.
  - Managed-agent lifecycle, trigger policy, and OpenAI-compatible runtime.
  - Hardened MCP, approval bridge, containment, safe replies, and audit.
  - Portable sidecar build, provenance, integrity verification, and release
    acceptance.

Before source implementation, run Harness feature intake, assign concrete story
IDs from the current matrix, and create high-risk trace/proof packets. This
docs-only planning turn must not mutate Harness state.

## Test Plan and Acceptance Criteria

### Relay and protocol

- Linux CI validates Compose configuration, closed-community bootstrap, cold
  start, health, restart persistence, membership enforcement, and stable
  secrets.
- Backup/restore proves equality of PostgreSQL, MinIO, and git data and confirms
  Redis reconstruction.
- Integration tests against Relay `0.2.1` cover NIP-42 authentication, invite
  claim, public/private/DM authorization, history/realtime, thread, mention,
  edit/delete, reaction, presence, `/query`, reconnect, and subscription replay.
- A non-member cannot receive private-channel/DM events or unauthorized search
  hits.

### Buzz compatibility

- Run one CLX client and one official Buzz Desktop `0.5.10` identity against the
  same Relay.
- Messages, replies, reactions, edits, deletes, membership, presence, and search
  appear equivalently in both clients.
- NIP-RS state merges correctly across both clients, including same-second
  replacements, multiple slots, client slot collision, and manual-unread
  clear-wins behavior.
- Unsupported Buzz event kinds are ignored safely without corrupting state.

### Client UX

- Onboarding covers generate/import, wrong passphrase/key, invalid URL,
  unauthenticated Relay, missing membership, invite claim, and reconnect.
- Pagination and realtime insertion do not duplicate or reorder messages.
- Relay rejection makes optimistic messages visibly failed and retryable.
- Toast suppression covers focus, mute, own messages, historical replay, and
  non-mention channel traffic; toast navigation opens the exact thread.
- Responsive tests cover normal, narrow, minimized/restored, and reconnecting
  states.

### Administration

- Tests cover the owner/admin/member permission matrix for invite, add, remove,
  role change, and agent membership.
- Invite TTL and max-use are enforced, and the UI never suggests early revoke is
  available.
- Destructive member/channel actions require explicit confirmation and display
  the Relay result.

### Agent safety

- Unit and adversarial tests cover traversal, absolute/UNC/device/ADS paths,
  symlink/junction/reparse escapes, rename/create escapes, and canonicalization
  races.
- Named-pipe tests cover wrong user, wrong token, stale run, spoofed agent,
  expired grant, prompt timeout, restart, project change, and CLX shutdown.
- Trigger tests cover owner, allowlisted author, blocked author, unassigned
  channel, removed membership, non-mention, duplicate event, and replay.
- Safe-lane tests cover valid current-event reply/reaction and reject arbitrary
  channel, alternate Relay, pipes, redirection, chaining, wrapper shell, and
  substring spoofing.
- Host-shell tests prove the warning/approval boundary, full Windows-user
  access after grant, grant expiration, process-tree kill on revoke/stop, and no
  orphan descendant.
- Redaction tests inject secrets into env, arguments, stderr, protocol errors,
  and provider responses and prove they never reach UI logs or diagnostics.

### Packaging and repository gates

- On a clean Windows x64 VM, unzip the portable bundle, connect to the pinned
  Relay, exchange chat, and run a managed agent without installing Buzz.
- Missing and tampered sidecars fail closed; no runtime download occurs.
- Verify license/NOTICE and provenance against the manifest.
- Run frontend production build, focused/full Rust tests as appropriate,
  compatibility tests, `rustfmt --check`, `git diff --check`, and Harness proof
  gates.
- Relay acceptance must run on a real Linux Docker/Compose environment. The
  current Windows workstation lacking a usable Linux Docker daemon is not
  accepted as Relay deployment proof.

## Out of Scope for V1

- Bundling Relay inside CLX or controlling its process.
- Multiple simultaneous Relay profiles.
- Forums, canvas, huddles, workflows, media, and file uploads.
- E2EE DMs.
- Codex, Claude, Goose, or arbitrary external ACP agents.
- Personas, teams, agent memory, snapshots, and unattended autonomous work.
- `anyone` agent triggers or permanent tool grants.
- A filesystem sandbox claim for host shell.
- Invite listing or early revocation without an upstream Relay API.
- Bundled TLS ingress, scheduled backups, server-secret management UI, and
  sidecar auto-update.

