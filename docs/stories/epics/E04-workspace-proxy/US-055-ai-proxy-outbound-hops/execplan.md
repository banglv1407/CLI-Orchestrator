# Exec Plan

## Goal

Complete per-backend hops and restore AI Companion from Command Palette.

## Scope

In scope: config/UI, HTTP/HTTPS/SOCKS4/SOCKS5/SSH, streaming, OAuth and terminal
consumers, chat rendering, local integration tests and production executable.

Out of scope: chains, system/browser proxy changes, credential migration,
installer deployment and overwriting a running user executable.

## Risk Classification

High-risk: external providers, credentials/security, public persisted contract,
streaming behavior and native desktop transport.

## Work Phases

1. Read contracts and live Harness matrix; record Intake #48 / US-055.
2. Implement bounded transport, SSH fingerprint verification and UI.
3. Restore chat rendering and explicit palette actions.
4. Verify network fixtures, existing proxy SSE tests, frontend and Rust check.
5. Build executable and record evidence.

## Stop Conditions

Unexpected overlap with user files or external deployment requiring approval.
Do not infer remote-provider or manual desktop proof from compilation.

## Progress

Implementation, automated tests and production executable build complete.
Manual desktop and real remote endpoint acceptance remain outstanding.
