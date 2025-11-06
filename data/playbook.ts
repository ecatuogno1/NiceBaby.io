import type { StackItem } from './tech-stack';

export const playbookHighlights: StackItem[] = [
  {
    title: 'Age-Based Guides',
    description:
      'Curated MD-reviewed tips aligned with baby age and upcoming leaps, plus postpartum support checklists.',
    icon: '📚',
    items: ['0-3 month soothing library', 'Feeding troubleshooting tree', 'Mom & dad recovery trackers']
  },
  {
    title: 'Contextual Nudges',
    description:
      'Rules engine suggests timely advice when metrics deviate, like hydration reminders after few wet diapers.',
    icon: '💡',
    items: ['Zod validated thresholds', 'Configurable sensitivity', 'Slack/Matrix notifications']
  },
  {
    title: 'Resource Collections',
    description:
      'Bookmarkable guides, vetted external articles, and embedded videos for quick reference during night shifts.',
    icon: '🧭',
    items: ['Offline-first caching', 'Saved searches', 'Printable cheat sheets']
  }
];
