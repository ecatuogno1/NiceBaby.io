import type { StackItem } from './tech-stack';

export const offlineStrategy: StackItem[] = [
  {
    title: 'Outbox queue',
    description:
      'All mutations append to a local outbox record with entity, payload, and lamport timestamp for deterministic replay.',
    icon: '📬',
    items: ['Batch push max 50 ops', 'Retry with exponential backoff', 'Vector clock included per device']
  },
  {
    title: 'Conflict policies',
    description:
      'Timers merge when overlaps are short, while text fields follow last-write-wins and keep history for review.',
    icon: '⚖️',
    items: ['Session merge for <10 min overlap', 'History table for previous values', 'Link sibling sessions when split']
  },
  {
    title: 'Attachment workflow',
    description:
      'Media uploads stage locally with content-hash references and resume-safe transfers when the network returns.',
    icon: '🗂️',
    items: ['Temporary queue for blobs', 'Encrypted before upload', 'Integrity verified post-sync']
  }
];

export const rulesEngine: StackItem[] = [
  {
    title: 'Sliding window evaluation',
    description:
      'Rules examine event streams per baby on write, every 30 minutes, and after reconnect to keep nudges fresh.',
    icon: '🪟',
    items: ['Few wet diapers <6/24h', 'Long wake window >3h @0–3mo', 'Asymmetric breast usage >70%']
  },
  {
    title: 'Threshold management',
    description:
      'Zod-validated RuleThreshold records store per-baby configs with sensitivity presets and overrides.',
    icon: '🎚️',
    items: ['Defaults by age band', 'Caregiver-tunable sensitivity', 'History of adjustments']
  },
  {
    title: 'Delivery channels',
    description:
      'In-app, push, email, and Slack/Matrix notifications triggered via n8n workflows with quiet hours.',
    icon: '📣',
    items: ['Channel preferences per caregiver', 'One nudge per 6h per rule', 'Dismiss + learn-more actions']
  }
];
