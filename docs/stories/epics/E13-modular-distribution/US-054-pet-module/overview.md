# US-054 Overview — Pet module

Status: Not started

Extract the Mythical Pet overlay into `clx.pet`. Pet is independent of all
other modules. Fresh background/overlay state is off.

Scope:
- `commands/pet_commands.rs` (~692 LOC)
- `src/components/MythicalPet.tsx` (~1,368 LOC)
- `src/lib/mythical-pets.ts` (~613 LOC)
- `public/assets/pets/` sprite sheets

Pet overlay is `position: fixed` canvas — module UI contribution type will be
`overlay` rather than `panel`.
