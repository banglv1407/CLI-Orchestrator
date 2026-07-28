# Exec Plan

## Goal

Deliver recoverable, versioned multi-tab Notepad persistence without losing the
existing note.

## Scope

In scope:

- Dynamic tabs, active-tab persistence, rename and confirmed close.
- Legacy migration, validation, staged save, backup and rollback.

Out of scope:

- Sync, attachments, rich text, or external-editor integration.

## Risk Classification

Risk flags:

- Data model.
- Existing behavior.
- Weak proof.

Hard gates:

- Data migration and user-requested tab deletion.

## Work Phases

1. Define and validate schema v2.
2. Add lossless legacy parsing and recoverable persistence.
3. Move the UI to one state object with safe autosave.
4. Add tab interactions and confirmation.
5. Run focused migration/storage tests and desktop smoke.
6. Update product and Harness evidence.

## Stop Conditions

Pause if migration changes legacy text, a failed save removes the prior valid
file, or deletion can bypass confirmation.
