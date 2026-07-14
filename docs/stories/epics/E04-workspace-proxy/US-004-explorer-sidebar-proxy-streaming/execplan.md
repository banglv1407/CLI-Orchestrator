# Exec Plan

## Goal

Add confirmed workspace deletion, pin the four system activity items to the
bottom, and make CliProxyAI stream end to end.

## Scope

In scope:

- Local and SSH Explorer file/directory deletion with confirmation.
- Deletion from local Git Diff entries that still exist.
- Explorer, editor, and Git refresh after deletion.
- Bottom-pinned Logs, Remote, CliProxyAI, and Settings activity items.
- OpenAI-compatible SSE relay using the current proxy backend configuration.

Out of scope:

- Trash/recycle-bin restoration.
- Git discard, restore, stage, or unstage commands.
- Retrying a different provider after response bytes reached the client.

## Risk Classification

Risk flags:

- Data loss.
- External systems.
- Public contracts.
- Cross-platform behavior.
- Existing behavior.
- Weak proof.
- Multi-domain change.

Hard gates:

- Recursive file and directory deletion.
- External provider streaming behavior.

The user's request explicitly confirms both behaviors. Implementation must
retain a per-operation confirmation dialog and workspace-boundary checks.

## Work Phases

1. Document contracts and deterministic proof.
2. Harden and connect deletion flows.
3. Split the activity bar into primary and pinned groups.
4. Implement upstream and downstream streaming.
5. Run unit, integration, build, and live-config smoke checks.
6. Update Harness evidence and trace.

## Stop Conditions

Pause for human confirmation if:

- Deletion would need to operate outside the active workspace.
- Provider compatibility requires credential or model changes.
- Existing validation requirements need to be weakened.

