import type { ReactNode } from 'react';

export interface StackItem {
  title: string;
  description: string;
  icon: ReactNode;
  items?: string[];
}

export const techStack: StackItem[] = [
  {
    title: 'Next.js 14 + App Router',
    description:
      'Hybrid SSR/ISR pages, server actions for secure log mutation endpoints, and static generation for knowledge base content.',
    icon: '⚡',
    items: [
      'Typed routes & metadata for SEO',
      'Server components for dashboards',
      'Edge runtime ready where latency matters'
    ]
  },
  {
    title: 'tRPC or RESTful API layer',
    description:
      'Use Next.js route handlers to expose typed APIs consumed by client hooks. Supports incremental adoption of workers.',
    icon: '🔌',
    items: ['Input validation with Zod schemas', 'Session aware mutations', 'Optimistic UI patterns']
  },
  {
    title: 'Prisma + PostgreSQL',
    description:
      'Relational schema modeling multiple babies, caregivers, and logs with row-level security patterns for privacy.',
    icon: '🗄️',
    items: ['Prisma migrations and seed scripts', 'Connection pooling via pgBouncer', 'Daily backup cron container']
  },
  {
    title: 'Tailwind CSS + Radix UI',
    description:
      'Accessible component primitives with custom theming for quick entry forms and data visualization wrappers.',
    icon: '🎨',
    items: ['Responsive data cards', 'Dark mode ready tokens', 'Radix dialogs for quick add flows']
  },
  {
    title: 'Vitest + Playwright',
    description:
      'Fast unit tests for utilities and component logic, plus headless e2e checks for core logging flows.',
    icon: '🧪',
    items: ['Storybook stories double as visual specs', 'msw for API mocking', 'CI ready workflows']
  },
  {
    title: 'Docker Compose Deployment',
    description:
      'Multi-service stack with Next.js server, PostgreSQL, worker queue, and Caddy reverse proxy tuned for home-lab hosting.',
    icon: '🐳',
    items: ['Health checks and restart policies', 'Automated TLS via Caddy', 'Off-site encrypted backups']
  }
];
