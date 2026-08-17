#!/usr/bin/env bash

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

[[ "${1:-}" == "--confirm-room-loss" ]] \
  || die "upgrade restarts nes-session and ends active rooms; rerun with --confirm-room-loss"

load_env
bash "${SCRIPT_DIR}/preflight.sh"
compose build --pull nes-session
compose up -d --remove-orphans
bash "${SCRIPT_DIR}/healthcheck.sh"
