# US-050 Exec Plan — API Client and CliProxyAI modules

## Goal

Extract both HTTP feature surfaces through the signed E13 module boundary
without weakening streaming, cancellation, credential redaction, or approvals.

## Checkpoints

1. Add API Client signed UI/sidecar pack and deterministic HTTP fixtures.
2. Replace Core API Client UI/history and three feature commands with generic
   module contributions and RPC.
3. Add CliProxyAI pack and migrate config/usage/logs without moving secrets
   through command-line arguments or logs.
4. Replace Dashboard and AI Companion direct proxy ownership with optional
   module capability calls.
5. Prove Core-only absence, signed staging, installer selection, and feature
   regression.

## Stop Conditions

- Existing API Client or proxy data would need destructive migration.
- Streaming or cancellation would become UI-only or best-effort.
- Proxy credentials would cross manifests, process arguments, or logs.
- Core would retain feature-specific command registration after extraction.
