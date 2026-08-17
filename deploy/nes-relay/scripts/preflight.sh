#!/usr/bin/env bash

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

[[ "$(uname -s)" == "Linux" ]] || die "this deployment pack must run on Linux"
command -v docker >/dev/null 2>&1 || die "Docker Engine is not installed"
docker info >/dev/null 2>&1 || die "Docker daemon is unavailable to the current user"
load_env

require_var NES_PUBLIC_HOST

[[ "${NES_PUBLIC_HOST}" != *://* && "${NES_PUBLIC_HOST}" != */* ]] \
  || die "NES_PUBLIC_HOST must be a hostname without scheme or path"
compose config >/dev/null
printf 'Preflight OK: wss://%s -> 127.0.0.1:%s\n' \
  "${NES_PUBLIC_HOST}" "${NES_SESSION_PORT:-18080}"
