import type { StackItem } from './tech-stack';

export const deploymentPlan: StackItem[] = [
  {
    title: 'Dockerized Services',
    description:
      'Multi-stage builds for web, worker, and background scheduler containers orchestrated via docker-compose with health checks.',
    icon: '🧱',
    items: ['Non-root user images', 'Environment variable templating', 'Watchtower-compatible updates']
  },
  {
    title: 'Security & Privacy',
    description:
      'Caddy reverse proxy handles TLS, password-protected dashboards, fail2ban on exposed ports, and automatic log rotation.',
    icon: '🔐',
    items: ['Built-in OIDC provider option', 'Encrypted volumes', 'Audit logging with Loki']
  },
  {
    title: 'Observability & Backups',
    description:
      'Grafana dashboards for vitals, Prometheus exporters, and nightly encrypted PostgreSQL dumps synced to off-site storage.',
    icon: '🛰️',
    items: ['Restic/Borg backup container', 'Heartbeat alerts', 'Runbook docs for restore tests']
  }
];
