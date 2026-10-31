# US-068: SSH fingerprint buttons

## Current Behavior

AI backend SSH hops require a manually entered SHA256 fingerprint. The built-in
SSH server persists a host key but does not show its fingerprint. VM SSH, Buzz
and monitoring do not expose required fingerprint fields.

## Target Behavior

- AI backend Add/Edit SSH offers Get fingerprint using only the current host/port.
- The remote value is the negotiated public key's canonical SHA256 fingerprint.
- Host/port edits clear the old pin; obsolete requests cannot overwrite drafts.
- Remote Access > SSH Server offers the local fingerprint and Copy.
- Existing local host keys remain stable; an absent key is created once and used
  by server startup too.
- Network, validation and clipboard errors appear inline; no config is saved
  until the user saves the backend.

## Affected Product Docs

- `README.md`
- `docs/product/proxy.md`
- `docs/decisions/0015-per-backend-ai-proxy-hops.md`

## Non-Goals

Changing VM/Buzz/monitoring trust behavior, remote key generation, key rotation,
automatic backend saving or replacing the running desktop executable.

## Tracking

Intake #73 / US-068. Implemented; local SSH and browser IPC fixtures passed.
Native desktop and a new packaged executable were not attempted.
