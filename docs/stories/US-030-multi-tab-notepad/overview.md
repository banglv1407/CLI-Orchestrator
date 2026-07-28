# Overview

## Current Behavior

Notepad persists one `{text, language}` object. Its debounce timer is cancelled
when the modal unmounts, so a recent edit may not be flushed.

## Target Behavior

Notepad manages persistent named tabs, migrates the legacy note without loss,
confirms destructive tab closure, and uses recoverable writes.

## Affected Users

- Desktop users keeping local notes in CLX.

## Affected Product Docs

- `docs/product/notepad.md`

## Non-Goals

- Cloud sync, collaborative editing, rich text, or attachment storage.
