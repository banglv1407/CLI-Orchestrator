# Notepad

CLX Notepad stores a versioned collection of local note tabs under
`~/.ai-cli-manager/notepad.json`.

## Tab Contract

- Users may add, select, rename, and close tabs. Every tab owns a stable ID,
  title, text content, and language.
- The active tab persists across modal and application restarts.
- At least one tab always exists. Closing the last tab creates a new blank tab.
- Empty tabs close immediately. Closing a tab with content requires explicit
  confirmation.

## Persistence Contract

- Schema version 2 stores `schemaVersion`, `activeTabId`, and `tabs`.
- Legacy `{text, language}` storage loads as `Note 1` without changing its
  content.
- Autosave is debounced, but closing Notepad flushes pending changes before the
  modal disappears.
- Saves validate the full document, stage and flush a replacement, retain the
  previous valid file as a backup, and restore it if installation fails.
- Malformed existing storage remains untouched and produces an actionable
  error.
