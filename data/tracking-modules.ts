import type { StackItem } from './tech-stack';

export const trackingModules: StackItem[] = [
  {
    title: 'Feeding & Diaper Logs',
    description:
      'Quick-add forms with timers for nursing sessions, bottle volumes, pump output, wet/dirty diaper classification, and anomaly detection.',
    icon: '🍼',
    items: ['Offline-first queue for entries', 'Automated summaries per caregiver', 'Alerts when patterns drift']
  },
  {
    title: 'Sleep & Soothing',
    description:
      'Start/stop timers for naps and nighttime sleep with soothing techniques tracked for correlation insights.',
    icon: '😴',
    items: ['Multi-device syncing', 'Noise machine + lighting integrations', 'Predictive nap recommendations']
  },
  {
    title: 'Growth Metrics',
    description:
      'Weight, length, and head circumference capture with WHO percentile charts and milestone overlays.',
    icon: '📈',
    items: ['WHO/CDC reference data import', 'Percentile calculators & alerts', 'Milestone streak visualizations']
  },
  {
    title: 'Medical & Vaccines',
    description:
      'Appointment scheduler, vaccine checklist, and medication logs with secure document storage.',
    icon: '🩺',
    items: ['Calendar sync via CalDAV', 'Reminder notifications & snooze', 'Encrypted file vault for records']
  },
  {
    title: 'Caregiver Coordination',
    description:
      'Role-based access for parents, relatives, and childcare helpers with activity feeds and checklists.',
    icon: '🤝',
    items: ['Delegated permissions', 'Activity digest emails', 'Shared task board for routines']
  },
  {
    title: 'Memory Timeline',
    description:
      'Capture milestones, journaling prompts, and media attachments to celebrate growth in context.',
    icon: '📸',
    items: ['Smart tags & search', 'Private share links', 'Export to printed keepsake book']
  }
];
