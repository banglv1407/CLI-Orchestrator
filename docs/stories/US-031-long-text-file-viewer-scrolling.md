# US-031 Long text file viewer scrolling

## Status

implemented

## Lane

normal

## Product Contract

The local/SSH text editor and Git diff viewer expose their complete long content
through an internal scroll region whose final line is unobstructed.

## Relevant Product Docs

- `docs/product/workspace.md`

## Acceptance Criteria

- Opening a different file resets the viewer to its first line.
- Edit and diff views scroll internally and can reach the last line.
- Bottom/right terminal trays do not cover the last line.
- Existing file read/write commands and UTF-8 behavior remain unchanged.

## Design Notes

- Add explicit `min-h-0` flex boundaries and `overflow-auto` content surfaces.
- Key editor/diff surfaces by file path and reset their scroll refs after load.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Frontend type/build proof |
| Integration | Local and SSH read results render without truncation |
| E2E | 10,000-line marker reachable in edit and diff modes |
| Platform | Viewer with bottom/right trays at Windows scaling |
| Release | Frontend build and desktop smoke |

## Harness Delta

Adds a long-content proof requirement to the workspace file viewer contract.

## Evidence

`npm.cmd run build` passes, and the full Rust suite passes 65 tests with one
live-provider test ignored. Manual 10,000-line, terminal-tray, and live SSH
proof remain pending.
