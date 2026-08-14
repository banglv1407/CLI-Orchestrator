#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACK_DIR="$(dirname "$SCRIPT_DIR")"

if [ ! -f "$PACK_DIR/.env" ]; then
    echo "[!] .env missing. Copying from .env.example..."
    cp "$PACK_DIR/.env.example" "$PACK_DIR/.env"
fi

echo "[+] Validating Relay stack configuration..."
docker compose -f "$PACK_DIR/docker-compose.yml" config > /dev/null
echo "[+] Starting Buzz Relay services..."
docker compose -f "$PACK_DIR/docker-compose.yml" up -d
echo "[+] Relay bootstrap triggered successfully."
