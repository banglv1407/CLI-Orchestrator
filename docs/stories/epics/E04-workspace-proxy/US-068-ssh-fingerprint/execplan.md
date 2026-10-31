# Exec Plan

## Goal

Provide correct SHA256 fingerprints directly in the AI backend SSH hop editor
and built-in SSH server panel.

## Scope

- Probe the configured remote host and port without authentication.
- Display/copy the local server fingerprint, creating its host key once if absent.
- Preserve exact key pinning, existing server identity and unrelated SSH flows.
- Translate new controls and errors in English, Vietnamese and Korean.

## Risk Classification

High-risk: SSH authentication boundary, security, IPC contract and existing
behavior. The user explicitly requested fingerprint buttons. Direction is
defined: discover actual server keys, never generate a random remote fingerprint
or weaken key verification.

## Work Phases

1. Inspect all SSH surfaces and current validation.
2. Add bounded native discovery and shared local host-key loading.
3. Wire localized UI with request cancellation and copy support.
4. Verify real local SSH handshakes, pinning, UI behavior and builds.
5. Update product docs and Harness proof/trace.

## Stop Conditions

Revisit scope if key rotation, credential migration or changed SSH trust policy
becomes necessary. None is required by this implementation.
