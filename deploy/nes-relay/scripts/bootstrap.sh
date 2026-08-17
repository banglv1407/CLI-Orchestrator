#!/usr/bin/env bash

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if [[ ! -f "${ENV_FILE}" ]]; then
  cp "${PACK_DIR}/.env.example" "${ENV_FILE}"
  printf 'Created %s. Edit its hostnames, public IP, and TLS paths, then rerun bootstrap.\n' "${ENV_FILE}"
  exit 2
fi

bash "${SCRIPT_DIR}/preflight.sh"
compose build --pull nes-session
compose up -d --remove-orphans
bash "${SCRIPT_DIR}/healthcheck.sh"
