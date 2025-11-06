# Operations Runbook

## Prerequisites

1. Copy `.env.example` to `.env` and adjust values.
2. Populate required secrets under `docker/secrets/` (see `docker/secrets/README.md`).
3. Ensure Docker Engine 24+ and Docker Compose v2 are installed on the host.

## Bootstrapping the Stack

```bash
docker compose pull
docker compose build --pull
docker compose up -d
```

Key services:

| Service | Purpose |
| --- | --- |
| app | Next.js production server |
| worker | Queue consumer (Node.js) |
| scheduler | Interval-based job runner |
| postgres | Primary relational database |
| redis | Job/queue broker |
| redis-exporter | Redis Prometheus metrics |
| caddy | Reverse proxy / TLS termination |
| prometheus | Metrics scraping |
| loki | Log aggregation |
| promtail | Log shipping |
| grafana | Observability dashboards |
| restic-backup | Scheduled persistent volume backups |

## Health Checks

* Application: `GET /api/health` (proxied via Caddy)
* Metrics: `GET /api/metrics` for Prometheus scraping
* PostgreSQL: `pg_isready`
* Redis: `redis-cli ping`
* Promtail/Loki: Grafana > Explore > Loki datasource

`docker compose ps --status=running` and `docker compose logs SERVICE` are the first diagnostics when troubleshooting.

## Log Shipping

Promtail tails container logs via the Docker socket and forwards entries to Loki. In Grafana, use the "Recent Application Logs" panel or query `{container="app"}` to explore raw logs.

## Metrics Dashboards

Prometheus scrapes the app, Redis, and itself. Grafana auto-loads dashboards from `ops/grafana/dashboards/`. The sample "Next.js Service Health" dashboard charts HTTP throughput and recent logs.

## Backups

The `restic-backup` service snapshots the PostgreSQL volume every six hours by default. Adjust retention with `RESTIC_KEEP_*` variables. Backup archives are stored in the `RESTIC_REPOSITORY` backend.

## Restore Playbook

1. Stop services that write to the database:
   ```bash
   docker compose stop app worker scheduler
   ```
2. Trigger a restore shell inside the backup container:
   ```bash
   docker compose run --rm \
     -e RESTIC_PASSWORD_FILE=/run/secrets/restic_password \
     restic-backup sh
   ```
3. Inside the container, list snapshots and restore:
   ```bash
   restic snapshots
   restic restore latest --target /restore
   ```
4. Copy the restored database files back to the PostgreSQL volume (on the host) and restart services:
   ```bash
   sudo rsync -a /path/to/restore/data/postgres/ <docker-volume-mount>
   docker compose up -d postgres
   docker compose up -d app worker scheduler
   ```

For point-in-time recovery beyond the snapshot cadence, pair Restic with WAL archiving or integrate with managed backups.

## Disaster Recovery Checklist

- Confirm DNS and TLS certificates via Caddy logs.
- Validate database integrity (`psql -c 'SELECT 1'`).
- Ensure Grafana dashboards load and Prometheus targets are healthy.
- Run smoke tests against the public endpoints.
