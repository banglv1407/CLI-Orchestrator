# E10 - Animated pet packs

## Outcome

CLX keeps its four built-in mythical pets while gaining validated local pet
packs, crisp high-definition pixel animation, signature moves, and an isolated
Settings preview.

## Delivery

- `US-026`: local pet-pack contract, secure folder import, discovery, and asset
  loading.
- `US-027`: bounded animation state machine, special effects, and Settings
  preview.
- `US-028`: local-only modern hero art pack produced through two visual approval
  gates.

## Guardrails

- Never bundle or commit private character art.
- Keep click-to-open-AI and existing localStorage choices compatible.
- Reject pack paths outside the installed pack root.
- Avoid a full-window raster canvas and bound decoded image caches.
- Do not claim final art acceptance before both human review gates pass.
