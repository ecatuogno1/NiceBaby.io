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

Create a `.env` file (or export the variables) before running the application:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/nicebaby"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="http://localhost:3000"
```

`DATABASE_URL` should point to the PostgreSQL instance backing Prisma. `NEXTAUTH_SECRET` secures JWT sessions and should
be a long, random string in production. `NEXTAUTH_URL` must reflect the public URL where the app is served.

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
- Containerize the application with Docker Compose including database, worker, and reverse proxy services.
