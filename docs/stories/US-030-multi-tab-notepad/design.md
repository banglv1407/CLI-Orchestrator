# Design

## Domain Model

`NotepadState` schema version 2 contains an active tab ID and one or more
`NotepadTab` records. IDs are unique; titles and languages are non-empty.

## Application Flow

The frontend loads once, updates one state object, and debounces whole-document
saves. Modal close flushes the latest state. Non-empty tab deletion saves the
post-deletion state before committing the UI change.

## Interface Contract

`get_notepad` and `save_notepad` retain their command names and exchange
`NotepadState`. The reader accepts the legacy object and returns an in-memory
version 2 state.

## Data Model

Writes validate the existing and replacement documents, flush a staged file,
move the previous target to `notepad.json.bak`, install the staged file, and
restore the backup on failure.

## UI / Platform Impact

The modal gains a horizontally scrolling tab strip, inline rename, add/close
controls, and an in-app deletion confirmation.

## Observability

Load and save failures remain visible in the modal and do not overwrite storage.

## Alternatives Considered

1. Independent files per tab were rejected because they complicate atomic
   active-tab persistence and legacy migration.
