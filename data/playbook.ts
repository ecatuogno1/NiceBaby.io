import type { StackItem } from './tech-stack';

export const playbookHighlights: StackItem[] = [
  {
    title: 'Age-based guides',
    description:
      '0–3 month soothing library, feeding troubleshooting, and postpartum support that stay cached for offline nights.',
    icon: '📚',
    items: ['Context by adjusted age', 'Printable cheat sheets', 'Postpartum recovery trackers']
  },
  {
    title: 'Contextual nudges',
    description:
      'Rules engine surfaces timely tips only when thresholds are crossed, with configurable sensitivity per family.',
    icon: '💡',
    items: ['Lamport-aware rule evaluation', 'Quiet hours & coalesced alerts', 'Learn-more paths with resources']
  },
  {
    title: 'Resource collections',
    description:
      'Bookmarkable knowledge base, vetted references, and saved searches that sync privately across caregivers.',
    icon: '🧭',
    items: ['Offline cache & background refresh', 'Custom tags and filters', 'Shareable read-only packs']
  }
];
