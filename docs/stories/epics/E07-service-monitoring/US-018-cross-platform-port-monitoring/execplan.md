# Exec Plan

## Goal

Deliver reliable local and SSH TCP monitoring with live service logs and guarded
process termination across Linux-family and Windows targets.

## Scope

In scope:

- Local, direct SSH, and one-jump SSH targets.
- TCP IPv4/IPv6 listeners, multiple PIDs, live logs, and normal/force kill.
- Password and encrypted private-key authentication per hop.

Out of scope:

- UDP, multi-jump chains, service start/restart, remote macOS, and remote agent
  installation.

## Risk Classification

Risk flags:

- Auth, audit/security, external systems, cross-platform, existing behavior,
  weak proof, public IPC contracts, and multi-domain changes.

Hard gates:

- Credentials and remote process termination.

## Work Phases

1. Add versioned monitor contracts, storage, and secret vault.
2. Add direct/jump SSH execution and OS adapters.
3. Add source discovery, streaming, cancellation, and safe kill.
4. Migrate Dashboard state and add the monitor editor/log drawer.
5. Run automated and real-host platform validation.
6. Update Harness evidence and trace.

## Stop Conditions

Pause if secrets would need plaintext persistence, a force action cannot
revalidate process identity, or required platform proof must be weakened.

