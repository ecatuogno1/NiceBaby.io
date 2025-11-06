import { describe, expect, it } from 'vitest';
import { summarizeCareWindow, type CareWindowEntry } from '@/lib/utils/caregiver';

describe('summarizeCareWindow', () => {
  const baseNow = new Date('2024-05-01T12:00:00.000Z');

  const entries: CareWindowEntry[] = [
    {
      id: '1',
      caregiver: 'Jordan',
      type: 'feed',
      loggedAt: '2024-05-01T10:30:00.000Z',
      volumeMl: 120,
    },
    {
      id: '2',
      caregiver: 'Jordan',
      type: 'sleep',
      loggedAt: '2024-05-01T09:00:00.000Z',
    },
    {
      id: '3',
      caregiver: 'Alex',
      type: 'feed',
      loggedAt: '2024-05-01T11:45:00.000Z',
      volumeMl: 90,
    },
  ];

  it('filters entries that fall outside of the rolling window and sorts them chronologically', () => {
    const summary = summarizeCareWindow(entries, 120, baseNow);

    expect(summary.entries).toHaveLength(2);
    expect(summary.entries[0]?.id).toBe('1');
    expect(summary.entries[1]?.id).toBe('3');
  });

  it('calculates the total feed volume for entries in the window', () => {
    const summary = summarizeCareWindow(entries, 180, baseNow);

    expect(summary.totalVolume).toBe(210);
  });

  it('throws when the window is zero or negative', () => {
    expect(() => summarizeCareWindow(entries, 0, baseNow)).toThrow(/windowMinutes/);
  });
});
