# Exec Plan

## Goal

Add a secure, versioned local pet-pack boundary without changing bundled pets.

## Scope

In scope:

- Manifest types and validation.
- Folder import with confirmed replacement.
- Pack listing and lazy PNG loading.
- Settings integration and fallback behavior.

Out of scope:

- Network sources, ZIP, export, marketplace, and deletion.

## Risk Classification

Risk flags:

- Public contracts.
- Cross-platform paths.
- Existing behavior.
- Weak proof.
- Multi-domain.

Hard gates:

- Untrusted local filesystem input must remain pack-root bounded.

## Work Phases

1. Add manifest fixtures and validators.
2. Add install/list/load commands.
3. Add typed frontend bridge and registry.
4. Add Settings import flow.
5. Run Rust tests and desktop smoke.
6. Update Harness proof.

## Stop Conditions

Pause if broad filesystem permission becomes necessary, replacement cannot be
made rollback-safe, or the manifest contract must become executable code.
