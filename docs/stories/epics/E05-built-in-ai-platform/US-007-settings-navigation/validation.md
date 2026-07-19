# Validation

## Proof Strategy

We will validate the changes by compiling the application using the package manager and manually inspecting layout behavior, responsive toggles, deep routing links, and settings persistence.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit / Build | `npm run build` succeeds; TypeScript compiles with zero errors. |
| Integration | Settings changes (Theme, Pet, Local LLM) persist in localStorage/backend correctly. |
| E2E | 1. Direct deep link event routes correctly from AI Companion header to `ai-companion` settings section.<br/>2. Command Palette actions for each section load the correct section.<br/>3. Sidebar tabs display the new `open-interpreter` tab.<br/>4. Changing sidebar tab ordering persists and updates immediately. |
| Platform | 1. Narrowing window width replaces left rail with select dropdown.<br/>2. Old sidebar order in localStorage is correctly migrated with `open-interpreter`. |

## Fixtures

None.

## Commands

```bash
npm run build
```

## Acceptance Evidence

1. React frontend compiles cleanly with TypeScript type-checking using `npm run build`:
   ```text
   vite v6.4.1 building for production...
   transforming...
   ✓ 57 modules transformed.
   rendering chunks...
   dist/assets/index-CWhof9Fr.js   823.77 kB │ gzip: 217.05 kB
   ✓ built in 13.52s
   ```
2. Ran `npm run validate:quick` checks which pass up to pre-existing Rust formatting debt.
3. Decoupled custom event-based navigation (`open-settings`, `open-sidebar-tab`, `llm-config-changed`) verified compile-safe and correctly routed.
