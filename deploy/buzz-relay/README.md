# Buzz Relay Deployment Operator Pack

Standalone Linux Compose pack for deploying the pinned Buzz Relay (`relay-v0.2.1`).

## Pinned Image Manifest
- **Relay**: `block/buzz-relay:0.2.1` (`sha256:6e5c462ac524de60d7edb46c66130fd779cc9006`)
- **PostgreSQL**: `postgres:17-alpine`
- **Redis**: `redis:7-alpine`
- **MinIO**: `minio/minio:RELEASE.2024-11-07T00-52-19Z`

## Directives & Operating Scripts
- `bootstrap.sh`: Verify secrets & boot Compose stack.
- `healthcheck.sh`: Check Relay HTTP/WS endpoint status.
- `backup.sh`: Quiesce Relay, dump Postgres, MinIO & Git data volume.
- `restore.sh`: Verify checksums & restore stack data.
- `upgrade-preflight.sh`: Verify database compatibility before upgrade.
