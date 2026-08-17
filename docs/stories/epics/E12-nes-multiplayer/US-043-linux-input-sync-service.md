# US-043 Linux single-service input-sync deployment

## Status

in_progress

`deploy/nes-relay/` is retained as the operator-pack path for compatibility but
runs only `nes-session`. It builds one container, binds `127.0.0.1:18080`, and
expects external Nginx/Caddy to publish HTTPS/WSS on 443/TCP.

There is no coturn service, TURN secret, UDP firewall range, or media relay.
Preflight, bootstrap, health, logs, upgrade, Compose rendering, Linux native
build, and health smoke are covered. A real public Linux cold start remains a
platform gate.
