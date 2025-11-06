import type { StackItem } from './tech-stack';

export const analyticsAndQa: StackItem[] = [
  {
    title: 'In-app analytics',
    description:
      'Rolling 7-day charts visualize feeds, diaper counts, sleep totals, soothing effectiveness, and growth percentiles.',
    icon: '📊',
    items: ['WHO percentile overlays', 'Wake window trends', 'Soothing technique correlations']
  },
  {
    title: 'Pediatrician packet',
    description:
      'Auto-generated PDF summarizing baby profile, feeding patterns, diaper counts, sleep summaries, and medications.',
    icon: '🗂️',
    items: ['Include QR to read-only timeline', 'Configurable date ranges', 'Ephemeral packet storage']
  },
  {
    title: 'Testing & QA',
    description:
      'Offline stress tests, race conditions, E2EE key exchange, PWA install, accessibility, and background sync coverage.',
    icon: '✅',
    items: ['48h offline log then sync', 'Two caregivers start/stop timer', 'VoiceOver/TalkBack audit']
  }
];
