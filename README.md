# NiceBaby.io

A self-hosted newborn companion built with Next.js 14. This project scaffolds the front-end experience for tracking feeds,
diapers, sleep, growth, medical appointments, and curated guidance for new parents. It now ships with production-grade
Docker images, observability, and backup automation for home-lab and small scale deployments.

## Getting Started (Local Development)

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to explore the product blueprint.

## Container Images

Three hardened Node.js containers are available:

| Dockerfile | Purpose | Entrypoint |
| --- | --- | --- |
| `Dockerfile.app` | Production Next.js server | `node server.js` |
| `Dockerfile.worker` | Queue/async worker scaffold | `node scripts/worker.js` |
| `Dockerfile.job` | Interval-based scheduled runner | `node scripts/scheduled-job.js` |

Each image:

- Uses Node.js 20 on Alpine with multi-stage builds.
- Drops privileges to an application-specific non-root user.
- Includes health checks and environment parity via `.env` files and Docker secrets.

`.dockerignore` keeps build contexts lean. Customize the worker/scheduler scripts to integrate with your job queue of choice.

## Docker Compose Stack

The repository provides a batteries-included `docker-compose.yml` that orchestrates:

- Next.js app, worker, and scheduler containers
- PostgreSQL 16 with persistent volumes and health checks
- Redis 7 for queues
- Redis Exporter for Prometheus metrics
- Caddy reverse proxy with automatic HTTPS support
- Prometheus, Loki, Promtail, and Grafana for metrics/logs
- Restic-based backup automation for the PostgreSQL volume

### Bootstrap

1. Copy `.env.example` to `.env` and update values.
2. Create the secret files listed in `docker/secrets/README.md`.
3. Launch the stack:
   ```bash
   docker compose build --pull
   docker compose up -d
   ```
4. Verify health at `https://<CADDY_DOMAIN>/api/health` once DNS/TLS propagate.

Grafana auto-loads the sample "Next.js Service Health" dashboard showing request throughput and logs. Prometheus scrapes
`/api/metrics` exposed by the app. Loki receives container logs via Promtail.

## Backups & Restore

The `restic-backup` service snapshots the PostgreSQL volume on the cron defined by `RESTIC_BACKUP_CRON`. Adjust retention
with `RESTIC_KEEP_DAILY`, `RESTIC_KEEP_WEEKLY`, and `RESTIC_KEEP_MONTHLY`. Restoration steps and disaster recovery
checklists live in [`docs/operations.md`](docs/operations.md).

## Home-Lab Deployment Notes

- **Reverse proxy / TLS:** The provided Caddyfile handles automatic TLS via Let's Encrypt. For Traefik users, replicate the
  `reverse_proxy` block with middleware for HTTPS redirection and use Docker labels for ACME settings.
- **Firewall hardening:** Expose only ports 80/443 publicly. Limit database/queue/observability ports to your trusted
  network or WireGuard peers. Enable UFW/`nftables` rules that default to deny inbound.
- **Secrets management:** Keep secret files on encrypted storage. For Swarm/Kubernetes, translate the secrets into native
  secret resources.
- **Backups:** Ensure the Restic repository target is accessible (S3, Backblaze B2, or another NAS). Automate periodic
  restore drills to validate credentials and retention policies.

## CI Automation

GitHub Actions builds and caches the three container images on every push. See
[`.github/workflows/docker.yml`](.github/workflows/docker.yml) for details. Publish steps can be extended by defining the
`REGISTRY`, `REGISTRY_USERNAME`, and `REGISTRY_PASSWORD` secrets in your repository.

## Additional Documentation

Operational details, health checks, and restore playbooks are collected in [`docs/operations.md`](docs/operations.md).

## Project Highlights

- **Next.js App Router** foundation with typed routes and Tailwind CSS styling.
- **Component-driven sections** that describe the core modules (tracking, playbooks, deployment) to guide future builds.
- **Data blueprints** (`data/*.ts`) capturing roadmap items for backend, analytics, and self-hosting strategies.
- **Production operations** blueprint with Docker images, observability, backups, and CI automation.

## Next Steps

- Implement authentication, persistence (Prisma + PostgreSQL), and API route handlers for log management.
- Add real tracking forms, dashboards, and background jobs based on the outlined modules.
- Integrate queue processing and scheduled jobs into the provided worker containers.
