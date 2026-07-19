# Overview

## Current Behavior

The Dashboard stores local port numbers in browser storage, probes them with a
Windows-specific netstat command, returns one PID, guesses one `.log` file, and
provides an immediate kill action. Remote SSH monitoring does not exist.

## Target Behavior

Users can persist local, direct-SSH, and one-jump SSH TCP monitors; distinguish
closed ports from connection and permission failures; inspect all listeners;
follow a reliable or explicitly selected log source; and stop a revalidated
process normally before choosing force kill.

## Affected Users

- Operators monitoring development and service hosts from CLX.

## Affected Product Docs

- `docs/product/monitoring.md`

## Non-Goals

- UDP, macOS remote adapters, multiple chained jump hosts, service lifecycle
  management, or installing a remote CLX agent.

