import type { StackItem } from './tech-stack';

export const integrations: StackItem[] = [
  {
    title: 'Calendar & scheduling',
    description:
      'Appointments export ICS files and optionally sync two-way with Google or iCloud via CalDAV connectors.',
    icon: '🗓️',
    items: ['Store externalCalId for reconciliation', 'Smart reminders with snooze', 'Sync pediatric visits & meds']
  },
  {
    title: 'Automations via n8n',
    description:
      'Dedicated flows send 07:00 digests, route insights to push/email, and manage pediatrician packet link lifecycles.',
    icon: '🤖',
    items: ['Webhook from rules engine', 'Matrix/Slack fan-out', 'Signed URL revocation after expiry']
  },
  {
    title: 'API surface',
    description:
      'Minimal REST endpoints support batched outbox submission, timeline queries, and PDF packet generation.',
    icon: '🌐',
    items: ['POST /outbox for batch ops', 'GET /timeline?babyId&since', 'POST /pdf/doctor-packet returns fileRef']
  }
];
