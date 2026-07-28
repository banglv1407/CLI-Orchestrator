# Workspace

The workspace surface combines the activity bar, file explorer, and Git change
list for the active local project or SSH session.

## File Deletion Contract

- A file or directory may be deleted from the Explorer context menu only after
  an explicit confirmation dialog.
- Local deletion must be constrained to the active workspace root. The root
  itself and paths outside it must never be deleted by the workspace command.
- Directory deletion is recursive and the confirmation must identify that the
  directory and its contents will be removed.
- The Git changes list exposes the same context menu for entries that still
  exist on disk. An entry already reported as deleted cannot be deleted again.
- After a successful deletion, open-file state, Explorer caches, and Git status
  must be refreshed. Failures remain visible in the confirmation dialog.
- SSH Explorer deletion uses the active SSH connection and must not invoke the
  local filesystem deletion command.

## Activity Bar Contract

- The primary tools keep their configured order in the upper activity group.
- System Logs, Remote SSH, CliProxyAI, and Settings form a secondary group
  pinned to the bottom of the activity bar.
- User ordering may change the order within either group but cannot move a
  pinned item into the primary group.

## File Viewer Contract

- Opening a local or SSH UTF-8 text file displays the complete content without
  truncation.
- Edit and Git diff views own their vertical scrolling; viewing a long file
  must not scroll the application window.
- Opening a different file starts at the top, and the final line remains
  reachable above any terminal tray or editor padding.
- Images, PDFs, binary formats, large-file pagination, and multi-file editor
  tabs are outside the current viewer contract.
