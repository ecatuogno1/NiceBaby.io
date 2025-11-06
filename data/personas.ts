import type { StackItem } from './tech-stack';

export const personas: StackItem[] = [
  {
    title: 'Parent (primary logger)',
    description:
      'Needs ultra-fast capture, reassurance on what is normal, and a quick view of what is due next.',
    icon: '👶',
    items: ['Start feed/diaper/sleep in two taps', 'Home screen “due next” bar', 'Context-rich insights without noise']
  },
  {
    title: 'Partner & relatives',
    description:
      'Jump in to help with logging, follow checklists, and know the current routine without long explanations.',
    icon: '🤗',
    items: ['Quick logging shortcuts', 'Shared handoff notes', 'Role-based permissions to limit edits']
  },
  {
    title: 'Pediatrician recipients',
    description:
      'Receive concise packets that synthesize trends, growth curves, medications, and vaccines on demand.',
    icon: '🩺',
    items: ['PDF summary with charts', 'Time-limited read-only link', 'Exportable data bundle for records']
  }
];
