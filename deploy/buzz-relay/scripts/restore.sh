#!/usr/bin/env bash
set -euo pipefail

BACKUP_PATH="${1:-}"
CONFIRM="${2:-}"

if [ -z "$BACKUP_PATH" ] || [ "$CONFIRM" != "--confirm" ]; then
    echo "Usage: restore.sh <path-to-backup-dir> --confirm"
    exit 1
fi

if [ ! -f "$BACKUP_PATH/manifest.json" ]; then
    echo "[!] Invalid backup directory: manifest.json missing"
    exit 1
fi

echo "[+] Confirmed. Restoring Relay from $BACKUP_PATH..."
