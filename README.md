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

## Environment Variables

Create a `.env` file (or export the variables) before running the application locally or inside Docker:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/nicebaby"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="http://localhost:3000"
```

`DATABASE_URL` should point to the PostgreSQL instance backing Prisma. `NEXTAUTH_SECRET` secures JWT sessions and should
be a long, random string in production. `NEXTAUTH_URL` must reflect the public URL where the app is served.

## Docker & Compose Workflow

The repository ships with a multi-stage `Dockerfile` and `docker-compose.yml` for local development and production-like
validation.

1. Create a `.env` file (if you have not already) and populate at minimum `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and
   `DATABASE_URL`. For Compose, the default `DATABASE_URL` already points at the bundled Postgres container.
2. Build and start the stack:

   ```bash
   docker compose up --build
   ```

   This launches:

   - `web`: the Next.js application served from the production build. On start it runs `npx prisma migrate deploy` to
     ensure the schema is current before executing `npm run start`.
   - `postgres`: a persistent PostgreSQL 16 database seeded with credentials that match the default `DATABASE_URL`.

3. Visit http://localhost:3000 to confirm the UI is available.
4. When finished, stop the stack with `Ctrl+C`, then run `docker compose down` to shut down services (append
   `--volumes` to clear the Postgres data volume).

### Prisma inside containers

Execute Prisma commands against the Compose services by running them within the `web` container:

```bash
docker compose run --rm web npx prisma migrate deploy
docker compose run --rm web npx prisma db seed
```

These commands reuse the container's installed dependencies and networked database.

## Database & Prisma

Prisma is configured under `prisma/schema.prisma` with models for caregivers, babies, and the primary log tables. Helpful
commands are exposed through `package.json` scripts:

```bash
# Apply schema changes locally (creates a new migration if needed)
npm run prisma:migrate

# Re-generate the Prisma client after editing the schema
npm run prisma:generate

# Apply existing migrations in production environments
npm run prisma:deploy

# Inspect and edit data visually
npm run prisma:studio
```

The repository includes an initial migration at `prisma/migrations/0001_init/migration.sql` that provisions the schema
for all caregivers, babies, and log tables.

## Seeding Guidance

To load starter caregivers, babies, or log entries, create a `prisma/seed.ts` script that hashes passwords with
[`bcryptjs`](https://www.npmjs.com/package/bcryptjs) and inserts records via the Prisma client. Example outline:

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash('changeme', 12);

  const caregiver = await prisma.caregiver.upsert({
    where: { email: 'caregiver@example.com' },
    update: {},
    create: {
      email: 'caregiver@example.com',
      name: 'Primary Caregiver',
      passwordHash,
      babies: {
        create: {
          name: 'Baby Doe',
          birthDate: new Date('2024-01-01')
        }
      }
    }
  });

  console.log('Seeded caregiver', caregiver.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Then execute (after wiring a seed command in `package.json` such as `"prisma": { "seed": "ts-node prisma/seed.ts" }`):

```bash
npx prisma db seed
```

Adjust the script to suit production data-loading needs (multiple caregivers, cross-linked babies, and initial log
entries). For JavaScript environments, rename the file to `seed.js` and swap the `import` statements for `require`.

## Project Highlights

- **Next.js App Router** foundation with typed routes and Tailwind CSS styling.
- **Component-driven sections** that describe the core modules (tracking, playbooks, deployment) to guide future builds.
- **Data blueprints** (`data/*.ts`) capturing roadmap items for backend, analytics, and self-hosting strategies.

## Next Steps

- Extend the new authentication and log APIs with UI components for recording daily activity.
- Add dashboards, reminders, and background jobs based on the outlined modules.
- Expand Docker orchestration with workers, background jobs, and reverse proxy services as the platform grows.
