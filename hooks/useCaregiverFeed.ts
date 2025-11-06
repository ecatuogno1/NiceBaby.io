'use client';

import { useEffect, useState } from 'react';

export interface CaregiverFeedEntry {
  id: string;
  caregiver: string;
  type: string;
  note: string;
  loggedAt: string;
}

export type CaregiverFeedStatus = 'idle' | 'loading' | 'error';

export interface CaregiverFeedState {
  entries: CaregiverFeedEntry[];
  status: CaregiverFeedStatus;
  error: Error | null;
}

export function useCaregiverFeed(resource: string = '/api/feed'): CaregiverFeedState {
  const [state, setState] = useState<CaregiverFeedState>({
    entries: [],
    status: 'loading',
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        const response = await fetch(resource);

        if (!response.ok) {
          throw new Error(`Unable to load caregiver feed (${response.status})`);
        }

        const payload = (await response.json()) as CaregiverFeedEntry[];

        if (!isActive) {
          return;
        }

        setState({ entries: payload, status: 'idle', error: null });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState({ entries: [], status: 'error', error: error as Error });
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [resource]);

  return state;
}
