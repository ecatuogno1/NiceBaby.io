import type { ReactNode } from 'react';

export interface StackItem {
  title: string;
  description: string;
  icon: ReactNode;
  items?: string[];
}

export const techStack: StackItem[] = [
  {
    title: 'PWA-first client',
    description:
      'React (or lightweight Preact) UI with Tailwind-style utilities tuned for mobile logging flows and installable offline.',
    icon: '📱',
    items: [
      'App Router + server components for data hydration',
      'Service worker handles caching & background sync',
      'Utility-first design for one-handed capture'
    ]
  },
  {
    title: 'Local-first data layer',
    description:
      'IndexedDB/SQLite store accessed via Dexie, RxDB, or Capacitor SQLite with an outbox queue for resilient writes.',
    icon: '🗃️',
    items: ['Append-only outbox with lamport clocks', 'Conflict-tolerant merges for timers', 'Device-kept E2EE keys']
  },
  {
    title: 'Sync & API surface',
    description:
      'Supabase/Postgres or Firebase/Firestore backend exposing REST/GraphQL endpoints for batched sync and insights.',
    icon: '🔗',
    items: ['Batch apply up to 50 ops per reconnect', 'Server recompute for rules & digests', 'File storage with encrypted blobs']
  },
  {
    title: 'Auth & access',
    description:
      'Email/password with passkey enrollment plus local-only anonymous mode for families that never want to sync.',
    icon: '🔐',
    items: ['Role-based caregiver permissions', 'Device passcode/biometric gate', 'Invite flows wrap shared space keys']
  },
  {
    title: 'Automations & messaging',
    description:
      'n8n orchestrates digests, calendar sync, and webhook fan-out to push/email/Slack or Matrix notifications.',
    icon: '⚙️',
    items: ['07:00 caregiver digests', 'ICS + CalDAV connectors', 'Smart-home hooks for soothing scenes']
  }
];
