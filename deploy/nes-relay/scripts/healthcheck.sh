#!/usr/bin/env bash

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
load_env

session_port="${NES_SESSION_PORT:-18080}"
curl --fail --silent --show-error "http://127.0.0.1:${session_port}/health/live" >/dev/null
curl --fail --silent --show-error "http://127.0.0.1:${session_port}/health/ready" >/dev/null
compose ps
printf 'Health OK: nes-session live/ready answered.\n'
