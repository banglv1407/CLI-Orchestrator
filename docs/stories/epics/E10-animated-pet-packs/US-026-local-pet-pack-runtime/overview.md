# Overview

## Current Behavior

The frontend has a static four-item pet array and loads one bundled horizontal
sprite sheet per pet. There is no local pack contract, import flow, or
validation boundary.

## Target Behavior

Users can import a validated pet-pack folder. CLX installs it under the existing
application data root, lists its pets alongside built-ins, and lazily loads only
allowlisted assets without exposing arbitrary filesystem reads to the frontend.

## Affected Users

- Desktop users installing private or custom pet art.

## Affected Product Docs

- `docs/product/pets.md`

## Non-Goals

- ZIP archives, marketplace distribution, remote downloads, export, or pack
  deletion.
