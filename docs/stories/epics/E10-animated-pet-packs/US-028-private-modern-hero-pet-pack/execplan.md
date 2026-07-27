# Exec Plan

## Goal

Produce a visually consistent private animation pack with explicit human art
approval.

## Scope

In scope:

- Goku and Naruto master candidates plus one original deterministic Web Ranger
  master.
- Common clips and two signature moves per character.
- Chroma-key removal, packing, and visual QA.

Out of scope:

- Public assets, audio, marketplace packaging, and model-path downgrade without
  approval.

## Risk Classification

Risk flags:

- Existing visual behavior.
- Weak proof.
- Third-party character art.

Hard gates:

- Master and Goku animation approvals.

## Work Phases

1. Generate available masters and record any blocked outputs.
2. Human master selection or explicit fallback authorization.
3. Produce and integrate Goku clips.
4. Human Goku animation approval.
5. Produce remaining clips.
6. Final visual and runtime proof.

## Stop Conditions

Pause if chroma-key extraction fails or a different generation model is
needed. A deterministic original asset may proceed only after explicit fallback
authorization.
