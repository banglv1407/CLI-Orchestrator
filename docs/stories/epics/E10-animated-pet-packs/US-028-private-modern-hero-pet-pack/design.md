# Design

## Domain Model

Each character has a master identity anchor, a thumbnail, common idle/travel/
blink clips, and two one-shot signature clips. Source and final files remain in
an ignored local-pack directory.

## Application Flow

Generate and approve the Goku anchor and animation pack, produce Naruto with
the same frame contract, then finish the third slot with Web Ranger after
Spider-Man and original image-generation attempts are moderation-blocked. Web
Ranger remains an explicitly original deterministic asset.

## Interface Contract

The final folder conforms to `PetPackManifestV1`; no character-specific names or
assets are required in tracked application code.

## Data Model

PNG horizontal strips use 128x128 cells. Visible character height is about 96
pixels with a stable pivot.

## UI / Platform Impact

Artwork is judged in the 320x220 Settings preview and at live 96-pixel scale
across all themes.

## Observability

Generation prompts and final local file paths are recorded in the handoff, not
in application logs.

## Alternatives Considered

1. One-shot full sprite-sheet generation was rejected because identity and
   costume drift are too likely.
2. A model/API fallback was rejected because the user did not request a model
   downgrade and the imagegen workflow forbids switching silently.
