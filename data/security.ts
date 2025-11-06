import type { StackItem } from './tech-stack';

export const securityPrivacy: StackItem[] = [
  {
    title: 'Modes & key management',
    description:
      'Local-only mode never leaves the device; synced mode stores a per-family space key and wraps shares for invites.',
    icon: '🗝️',
    items: ['Device keypair per install', 'Key wrap on caregiver invite', 'Optional full-entity encryption']
  },
  {
    title: 'Access controls',
    description:
      'Passcode/biometric gate keeps app locked; roles govern write, invite, export, and admin actions for each baby.',
    icon: '🛡️',
    items: ['Owner, Parent, Helper, Viewer roles', 'Granular export/share permissions', 'Audit log of critical actions']
  },
  {
    title: 'Backups & safeguards',
    description:
      'Encrypted export bundles combine JSON + media; disclaimers prompt professional care on high-severity alerts.',
    icon: '🧳',
    items: ['Auto-lock inactivity timer', 'PII minimization in packets', 'Regular restore drills recommended']
  }
];
