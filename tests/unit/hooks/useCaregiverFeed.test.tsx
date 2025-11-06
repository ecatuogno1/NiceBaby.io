import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useCaregiverFeed } from '@/hooks/useCaregiverFeed';
import { server } from '@/tests/msw/server';
import { defaultFeedResponse } from '@/tests/msw/handlers';

describe('useCaregiverFeed', () => {
  it('loads caregiver feed entries', async () => {
    const { result } = renderHook(() => useCaregiverFeed());

    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.status).toBe('idle');
    });

    expect(result.current.entries).toEqual(defaultFeedResponse);
    expect(result.current.error).toBeNull();
  });

  it('surfaces network failures as errors', async () => {
    server.use(
      http.get('/api/feed', () => {
        return HttpResponse.json({ message: 'nope' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useCaregiverFeed());

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.entries).toHaveLength(0);
    expect(result.current.error?.message).toMatch(/Unable to load caregiver feed/);
  });
});
