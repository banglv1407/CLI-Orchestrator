# Overview

## Current Behavior

One small canvas owns movement and a two-state idle/walk loop. Every pet has one
four-frame clip; extended effects, preview, reduced motion, and cache bounds do
not exist.

## Target Behavior

A bounded animation controller runs idle, travel, blink, signature, and recovery
states; renders crisp actor canvases with local effects; and powers both the
live overlay and an isolated Settings preview.

## Affected Users

- Users who enable desktop pets while working in terminals.

## Affected Product Docs

- `docs/product/pets.md`

## Non-Goals

- Combat, targets, sound, terminal interaction, or right-click commands.
