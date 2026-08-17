#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACK_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${PACK_DIR}/docker-compose.yml"
ENV_FILE="${PACK_DIR}/.env"

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

load_env() {
  [[ -f "${ENV_FILE}" ]] || die "${ENV_FILE} is missing; copy .env.example and edit it first"
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
}

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
  else
    die "Docker Compose v2 or docker-compose v1.29+ is required"
  fi
}

require_var() {
  local name="$1"
  [[ -n "${!name:-}" ]] || die "${name} must be set in ${ENV_FILE}"
}
