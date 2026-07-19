# Design

## Domain Model

`MonitorConfig` owns a TCP service port and a local or SSH target. SSH targets
may include one jump hop. `ProcessIdentity` combines PID with a start token.
`LogSource` is auto, file, systemd, container, Windows Event Log, or an expert
follow command. Persisted records contain only secret references.

## Application Flow

1. Load and migrate monitors.
2. Group probes by final route and return typed snapshots.
3. Discover high-confidence log sources or ask the user to select one.
4. Start one cancellable log stream for the open drawer.
5. Confirm process identities, re-probe, then perform normal or force stop.

## Interface Contract

Tauri commands list/test/upsert/delete/probe monitors, discover log sources,
start/stop log streams, and kill selected process identities. Log chunks and
stream state are delivered as Tauri events. Secrets are write-only inputs.

## Data Model

`monitoring.json` is versioned and stored under the CLX app-data directory.
Legacy local port arrays are imported once by the frontend. Credential values
are stored in the OS vault or held only for the current process.

## UI / Platform Impact

Port cards show route, target OS, listener rows, stale/error state, and actions.
Add/Edit Monitor covers local, direct SSH, and jump SSH. Live output opens in a
full-height drawer with bounded buffering, search, copy, clear, pause, and
reconnect status.

## Observability

CLX system logs record monitor IDs, state transitions, and sanitized failures.
Hosts, commands containing secrets, passwords, passphrases, and sudo input are
never logged.

## Alternatives Considered

1. Continue shelling out to OpenSSH. Rejected for two-hop credential handling.
2. Treat every log as a nearby file. Rejected because journals, containers,
   Windows services, and stdout pipes require explicit adapters.

