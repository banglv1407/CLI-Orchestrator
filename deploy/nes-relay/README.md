# CLX NES Input-Sync Server for Linux

The Linux server runs one component: `nes-session`. It provides authenticated
room APIs and relays tiny input/state messages over WSS. Both players select
the exact same ROM locally and run JSNES on their own machines.

The server never receives ROM bytes, emulator snapshots, audio, or video.
There is no WebRTC and no coturn dependency.

## Host requirements

- 64-bit Linux, Docker Engine, and Compose v2 (or docker-compose v1.29+).
- One DNS name such as `nes.example.com`.
- Nginx or Caddy with a valid TLS certificate for that hostname.
- A small VM is sufficient for the v1 room cap; traffic consists of controller
  masks plus a periodic eight-character state hash.

## Network exposure

Only `443/TCP` is public. `nes-session` binds to `127.0.0.1:18080` and must not
be exposed directly. No TURN, UDP, or relay port range is required.

```bash
sudo ufw allow 443/tcp
sudo ufw deny 18080/tcp
```

## Deploy

Run from the repository or extracted release-bundle root:

```bash
cd deploy/nes-relay
cp .env.example .env
nano .env
bash scripts/bootstrap.sh
```

Replace `nes.example.com` in `nginx.conf.example`, install it in Nginx, then
validate and reload:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/clx-nes-session
sudo ln -s /etc/nginx/sites-available/clx-nes-session /etc/nginx/sites-enabled/clx-nes-session
sudo nginx -t
sudo systemctl reload nginx
```

Configure CLX with `https://nes.example.com`.

## Operations

```bash
bash scripts/healthcheck.sh
bash scripts/logs.sh
bash scripts/upgrade.sh --confirm-room-loss
docker compose --env-file .env down
```

Room state is intentionally in memory. Restarting or upgrading the service
ends active rooms. Docker's `restart: unless-stopped` starts it after a host or
daemon restart.

## Multiplayer contract

Before frame sync starts, both clients privately exchange their local ROM
SHA-256 through the authenticated room. A mismatch fails closed. Once matched,
each side pipelines three frames of local controller masks and advances only
when both masks exist. Every 300 frames the clients exchange a compact state
hash and stop if emulation diverges.

The meaningful controller state is one byte per player per frame. The current
validated JSON envelope plus WebSocket/TLS framing normally puts real traffic
in the single-digit to low-tens of KiB/s per client. Measure the final rate in
the required two-machine soak; it is still far below media streaming.
