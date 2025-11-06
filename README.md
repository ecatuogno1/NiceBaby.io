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

## Testing & QA

The project ships with a complete QA toolchain covering linting, type-safety, unit tests, and Playwright journeys.

```bash
# Fast feedback during development
npm run lint
npm run type-check
npm run test:unit

# Watch mode for unit tests
npm run test:unit:watch

# Generate coverage reports (stored in coverage/unit)
npm run test:unit:coverage

# End-to-end caregiver journeys (requires a local dev server)
npx playwright install --with-deps   # one-time browser download
npm run test:e2e

# Run the full pre-merge pipeline
npm run qa
```

> **Coverage expectation:** New features should maintain ≥80% line coverage in the affected area. Prefer colocating specs beside the logic they verify (utilities, server actions, hooks) and expand the shared mocks in `tests/msw/handlers.ts` as new endpoints appear.

## Mocking network requests with MSW

Unit and hook tests rely on [MSW](https://mswjs.io/) to provide deterministic API responses. The server is configured in `tests/msw/server.ts` and automatically started via `test/setup-tests.ts`. Override or extend handlers within a spec by calling `server.use(...)`:

```ts
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/msw/server';

server.use(
  http.post('/api/logs', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...body, status: 'accepted' });
  })
);
```

This approach keeps tests hermetic without hitting real services and mirrors how the Playwright flows expect the API to behave.

## Project Highlights

- **Next.js App Router** foundation with typed routes and Tailwind CSS styling.
- **Component-driven sections** that describe the core modules (tracking, playbooks, deployment) to guide future builds.
- **Data blueprints** (`data/*.ts`) capturing roadmap items for backend, analytics, and self-hosting strategies.

## Continuous Integration

The `CI` GitHub Actions workflow enforces linting, type-checking, Vitest, Playwright (headless Chromium), and production builds on every push or pull request targeting `main`. Reuse that ordering locally with `npm run qa` before opening a pull request.

## Next Steps

- Implement authentication, persistence (Prisma + PostgreSQL), and API route handlers for log management.
- Add real tracking forms, dashboards, and background jobs based on the outlined modules.
- Containerize the application with Docker Compose including database, worker, and reverse proxy services.
