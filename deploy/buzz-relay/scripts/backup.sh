#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACK_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${1:-$PACK_DIR/backups}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TARGET_DIR="$BACKUP_DIR/relay_backup_$TIMESTAMP"

mkdir -p "$TARGET_DIR"
echo "[+] Quiescing Relay container for backup..."
docker compose -f "$PACK_DIR/docker-compose.yml" stop relay

echo "[+] Dumping PostgreSQL database..."
docker compose -f "$PACK_DIR/docker-compose.yml" exec -T postgres pg_dumpall -U buzz > "$TARGET_DIR/postgres_dump.sql" || true

echo "[+] Writing metadata manifest..."
cat <<EOF > "$TARGET_DIR/manifest.json"
{
  "timestamp": "$TIMESTAMP",
  "relay_version": "0.2.1",
  "commit": "6e5c462ac524de60d7edb46c66130fd779cc9006"
}
EOF

echo "[+] Restarting Relay container..."
docker compose -f "$PACK_DIR/docker-compose.yml" start relay

echo "[+] Backup completed at $TARGET_DIR"
