import { http, HttpResponse } from 'msw';

export const defaultFeedResponse = [
  {
    id: 'entry-1',
    caregiver: 'Jordan',
    type: 'feed',
    note: '6oz bottle feed',
    loggedAt: '2024-05-01T06:30:00.000Z',
  },
  {
    id: 'entry-2',
    caregiver: 'Alex',
    type: 'nudge',
    note: 'Time to start the bedtime wind-down',
    loggedAt: '2024-05-01T18:45:00.000Z',
  },
];

export const handlers = [
  http.get('/api/feed', () => {
    return HttpResponse.json(defaultFeedResponse);
  }),
];
