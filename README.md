# NiceBaby.io

A self-hosted newborn companion built with Next.js 14. This project scaffolds the front-end experience for tracking feeds,
diapers, sleep, growth, medical appointments, and curated guidance for new parents. It also outlines the surrounding
architecture for API services, data modeling, and Docker-based deployment.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to explore the product blueprint.

## Project Highlights

- **Next.js App Router** foundation with typed routes and Tailwind CSS styling.
- **Component-driven sections** that describe the core modules (tracking, playbooks, deployment) to guide future builds.
- **Data blueprints** (`data/*.ts`) capturing roadmap items for backend, analytics, and self-hosting strategies.

## Next Steps

- Implement authentication, persistence (Prisma + PostgreSQL), and API route handlers for log management.
- Add real tracking forms, dashboards, and background jobs based on the outlined modules.
- Containerize the application with Docker Compose including database, worker, and reverse proxy services.
