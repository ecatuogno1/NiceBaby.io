import type { StackItem } from './tech-stack';

export const trackingModules: StackItem[] = [
  {
    title: 'Feeding & Diaper Logs',
    description:
      'One-tap timers, bottle presets, and diaper classifiers tuned for sleep-deprived parents with anomaly nudges.',
    icon: '🍼',
    items: [
      'Side alternation + volume suggestions',
      'Few wet diaper rule (24h window)',
      '7am digest of totals & averages'
    ]
  },
  {
    title: 'Sleep & Soothing',
    description:
      'Start/stop sessions with soothing technique tags that power predictive wake windows and insight correlations.',
    icon: '😴',
    items: [
      'Timers survive app restarts',
      'Integrate white-noise & lights',
      'Insights on soothe-to-sleep success'
    ]
  },
  {
    title: 'Growth Metrics',
    description:
      'WHO/CDC LMS data powers percentile charts, alerts on major band crossings, and milestone overlays.',
    icon: '📈',
    items: ['Auto-calc Z scores', 'Alerts for >7% weight loss', '14-day stagnant growth flag']
  },
  {
    title: 'Medical & Vaccines',
    description:
      'Age-based vaccine checklist, medication reminders with safety windows, and encrypted document vault.',
    icon: '🩺',
    items: ['ICS export + optional CalDAV', 'Dose reminders with snooze', 'Secure PDF/image storage']
  },
  {
    title: 'Caregiver Coordination',
    description:
      'Roles, invites, and shared task boards keep everyone aligned while preserving audit trails.',
    icon: '🤝',
    items: ['Owner/Parent/Helper/Viewer matrix', 'Activity feed per baby', 'Handoff checklists & notes']
  },
  {
    title: 'Memory Timeline',
    description:
      'Prompted journaling and media capture woven into the daily log for keepsakes and contextual storytelling.',
    icon: '📸',
    items: ['Smart tags from event data', 'Private, time-limited share links', 'Printable keepsake export']
  }
];
