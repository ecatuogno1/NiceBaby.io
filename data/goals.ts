import type { StackItem } from './tech-stack';

export const productGoals: StackItem[] = [
  {
    title: 'Fast capture',
    description:
      'Every common action completes in one or two taps so caregivers can log while half asleep or one-handed.',
    icon: '⚡',
    items: ['Sticky timers', 'Smart defaults for repeats', 'Voice-friendly interactions (stretch)']
  },
  {
    title: 'Trustworthy insights',
    description:
      'Highlight only the deviations that matter at each age by pairing context with actionable next steps.',
    icon: '🧠',
    items: ['Age-aware baselines', 'Inline anomaly explanations', 'Doctor-friendly summaries']
  },
  {
    title: 'Privacy-first collaboration',
    description:
      'Local-first data ownership with optional end-to-end encrypted sync for families that want multi-device access.',
    icon: '🔒',
    items: ['Local-only mode available', 'Client-held keys for E2EE scopes', 'Share invites with wrapped keys']
  },
  {
    title: 'Offline resilience',
    description:
      'Design assumes dead zones and airplane mode—logs queue locally, conflicts resolve gracefully, and data stays usable.',
    icon: '🛰️',
    items: ['Outbox-first architecture', 'Conflict policies per entity', 'Background sync on reconnect']
  }
];

export const successMetrics: StackItem[] = [
  {
    title: 'Speed to log',
    description: 'Feeding, diaper, and sleep start actions must complete in ≤5 seconds on a mid-tier device.',
    icon: '⏱️',
    items: ['Pre-filled forms & recent templates', 'No network dependency to start', 'Timer cards visible on home']
  },
  {
    title: 'Offline coverage',
    description: '≥95% of logs recorded without connectivity should persist and sync within 10 seconds of reconnecting.',
    icon: '📶',
    items: ['Optimistic local writes', 'Batched sync with retry', 'Progress indicators for uploads']
  },
  {
    title: 'Signal-rich nudges',
    description: 'Keep false nudges under one per day on average by tuning rules and sensitivity controls.',
    icon: '📉',
    items: ['Per-rule quiet periods', 'Age-specific thresholds', 'Feedback loop to mute or adjust']
  }
];
