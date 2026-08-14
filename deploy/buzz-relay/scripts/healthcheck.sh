#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACK_DIR="$(dirname "$SCRIPT_DIR")"

RELAY_URL="${1:-http://localhost:8080/health}"
echo "[+] Checking Relay health at $RELAY_URL..."

if command -v curl >/dev/null 2>&1; then
    curl -fsS "$RELAY_URL" || (echo "[!] Health check failed" && exit 1)
    echo "[+] Relay is healthy."
else
    echo "[!] curl not found, skipping HTTP check."
fi
