# Overview

## Current Behavior

Explorer renders a deletion menu and confirmation shell, but local deletion is
not workspace-constrained, remote deletion incorrectly reaches the local
filesystem, nested caches and Git status are not fully refreshed, and Git Diff
entries have no context menu. Activity icons share one scrolling group.
CliProxyAI rejects all `stream: true` requests.

## Target Behavior

Deletion is confirmed, workspace-bound, available from Explorer and applicable
Git entries, and refreshes all affected state. Four system activity items stay
at the bottom. CliProxyAI performs a real upstream streaming call and relays SSE
chunks to the client as they arrive.

## Affected Users

- Desktop users managing files and Git changes.
- Local API clients using CliProxyAI.

## Affected Product Docs

- `docs/product/workspace.md`
- `docs/product/proxy.md`

## Non-Goals

- Replacing the Git client or adding source-control mutation commands.
- Changing stored proxy backend credentials or routing policy.

