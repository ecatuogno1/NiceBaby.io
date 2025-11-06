import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logCareEvent } from '@/app/actions/log-care-event';

describe('logCareEvent', () => {
  const fixedDate = new Date('2024-05-01T12:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a queued event with a deterministic id', async () => {
    const result = await logCareEvent({ caregiverId: 'caregiver-1', type: 'feed', note: '6oz bottle' });

    expect(result).toEqual({
      id: `caregiver-1-${fixedDate.getTime()}`,
      caregiverId: 'caregiver-1',
      type: 'feed',
      note: '6oz bottle',
      occurredAt: fixedDate,
      status: 'queued',
    });
  });

  it('throws when the caregiver id is missing', async () => {
    await expect(logCareEvent({ caregiverId: '   ', type: 'sleep' })).rejects.toThrow(/caregiverId/);
  });
});
