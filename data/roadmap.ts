import type { StackItem } from './tech-stack';

export const roadmap: StackItem[] = [
  {
    title: 'MVP (weeks 0–6)',
    description:
      'Core logging app with offline queue, sync, baseline insights, and exportable pediatrician packet.',
    icon: '🚀',
    items: ['Auth optional + single baby', 'Feeds/diapers/sleep timers', 'Morning digest + basic insights']
  },
  {
    title: 'v1 (weeks 6–16)',
    description:
      'Layer in medical modules, caregiver roles with key wrap, memories, and predictive nap recommendations.',
    icon: '🌱',
    items: ['Vaccines, meds, appointments', 'Invites + permission matrix', 'Memory timeline & keepsake export']
  },
  {
    title: 'Stretch & backlog',
    description:
      'Full-entity E2EE, CalDAV two-way sync, multi-baby dashboard, OCR on bottles, and on-device media intelligence.',
    icon: '🧭',
    items: ['Space-wide encryption mode', 'Advanced automations', 'AI-assisted photo tagging (on-device)']
  }
];
