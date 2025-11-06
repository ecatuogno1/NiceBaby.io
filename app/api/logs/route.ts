import { NextRequest, NextResponse } from 'next/server';

import {
  DIAPER_TYPES,
  FEED_SIDES,
  addDiaperLog,
  addFeedingLog,
  addSleepLog,
  getRecentDiapers,
  getRecentFeedings,
  getRecentSleeps,
  removeDiaperLog,
  removeFeedingLog,
  removeSleepLog,
  updateDiaperLog,
  updateFeedingLog,
  updateSleepLog,
} from '@/lib/log-store';

type LogType = 'feed' | 'diaper' | 'sleep';

type FeedCreation = {
  type: 'feed';
  loggedAt: string;
  side: (typeof FEED_SIDES)[number];
  durationMinutes: number;
  ounces?: number | null;
  note?: string | null;
};

type DiaperCreation = {
  type: 'diaper';
  loggedAt: string;
  diaperType: (typeof DIAPER_TYPES)[number];
  note?: string | null;
};

type SleepCreation = {
  type: 'sleep';
  loggedAt: string;
  durationMinutes: number;
  note?: string | null;
};

type CreateLogPayload = FeedCreation | DiaperCreation | SleepCreation;

type UpdateLogPayload =
  | ({ type: 'feed'; id: string } & Partial<Omit<FeedCreation, 'type'>>)
  | ({ type: 'diaper'; id: string } & Partial<Omit<DiaperCreation, 'type'>>)
  | ({ type: 'sleep'; id: string } & Partial<Omit<SleepCreation, 'type'>>);

function isLogType(value: string | null): value is LogType {
  return value === 'feed' || value === 'diaper' || value === 'sleep';
}

function parseLimit(value: string | null): number {
  if (!value) {
    return 10;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 10;
  }
  return Math.min(Math.max(parsed, 1), 50);
}

function isValidDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export async function GET(request: NextRequest) {
  const typeParam = request.nextUrl.searchParams.get('type');

  if (!isLogType(typeParam)) {
    return NextResponse.json({ error: 'Missing or invalid log type' }, { status: 400 });
  }

  const limit = parseLimit(request.nextUrl.searchParams.get('limit'));

  switch (typeParam) {
    case 'feed': {
      const feeds = await getRecentFeedings(limit);
      return NextResponse.json(feeds);
    }
    case 'diaper': {
      const diapers = await getRecentDiapers(limit);
      return NextResponse.json(diapers);
    }
    case 'sleep': {
      const sleeps = await getRecentSleeps(limit);
      return NextResponse.json(sleeps);
    }
    default:
      return NextResponse.json({ error: 'Unsupported log type' }, { status: 400 });
  }
}

function invalid(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let payload: CreateLogPayload;

  try {
    payload = (await request.json()) as CreateLogPayload;
  } catch (error) {
    return invalid('Invalid JSON payload');
  }

  if (!payload || typeof payload !== 'object' || !('type' in payload)) {
    return invalid('Missing log type');
  }

  switch (payload.type) {
    case 'feed': {
      if (typeof payload.loggedAt !== 'string' || !isValidDate(payload.loggedAt)) {
        return invalid('loggedAt must be an ISO timestamp');
      }
      if (!FEED_SIDES.includes(payload.side)) {
        return invalid(`side must be one of: ${FEED_SIDES.join(', ')}`);
      }
      if (typeof payload.durationMinutes !== 'number' || payload.durationMinutes <= 0) {
        return invalid('durationMinutes must be a positive number');
      }
      if (
        payload.ounces !== undefined &&
        payload.ounces !== null &&
        (typeof payload.ounces !== 'number' || payload.ounces < 0)
      ) {
        return invalid('ounces must be a non-negative number');
      }
      const record = await addFeedingLog({
        loggedAt: payload.loggedAt,
        side: payload.side,
        durationMinutes: payload.durationMinutes,
        ounces: payload.ounces ?? undefined,
        note: payload.note ?? undefined,
      });
      return NextResponse.json(record, { status: 201 });
    }
    case 'diaper': {
      if (typeof payload.loggedAt !== 'string' || !isValidDate(payload.loggedAt)) {
        return invalid('loggedAt must be an ISO timestamp');
      }
      if (!DIAPER_TYPES.includes(payload.diaperType)) {
        return invalid(`diaperType must be one of: ${DIAPER_TYPES.join(', ')}`);
      }
      const record = await addDiaperLog({
        loggedAt: payload.loggedAt,
        type: payload.diaperType,
        note: payload.note ?? undefined,
      });
      return NextResponse.json(record, { status: 201 });
    }
    case 'sleep': {
      if (typeof payload.loggedAt !== 'string' || !isValidDate(payload.loggedAt)) {
        return invalid('loggedAt must be an ISO timestamp');
      }
      if (typeof payload.durationMinutes !== 'number' || payload.durationMinutes <= 0) {
        return invalid('durationMinutes must be a positive number');
      }
      const record = await addSleepLog({
        loggedAt: payload.loggedAt,
        durationMinutes: payload.durationMinutes,
        note: payload.note ?? undefined,
      });
      return NextResponse.json(record, { status: 201 });
    }
    default:
      return invalid('Unsupported log type');
  }
}

export async function PATCH(request: NextRequest) {
  let payload: UpdateLogPayload;

  try {
    payload = (await request.json()) as UpdateLogPayload;
  } catch (error) {
    return invalid('Invalid JSON payload');
  }

  if (!payload || typeof payload !== 'object' || !('type' in payload) || typeof payload.id !== 'string') {
    return invalid('Missing log id or type');
  }

  switch (payload.type) {
    case 'feed': {
      const updates: Parameters<typeof updateFeedingLog>[1] = {};
      if ('loggedAt' in payload) {
        if (typeof payload.loggedAt !== 'string' || !isValidDate(payload.loggedAt)) {
          return invalid('loggedAt must be an ISO timestamp');
        }
        updates.loggedAt = payload.loggedAt;
      }
      if ('side' in payload) {
        if (payload.side && FEED_SIDES.includes(payload.side)) {
          updates.side = payload.side;
        } else {
          return invalid(`side must be one of: ${FEED_SIDES.join(', ')}`);
        }
      }
      if ('durationMinutes' in payload) {
        if (payload.durationMinutes === undefined) {
          // ignore undefined updates
        } else if (typeof payload.durationMinutes !== 'number' || payload.durationMinutes <= 0) {
          return invalid('durationMinutes must be a positive number');
        } else {
          updates.durationMinutes = payload.durationMinutes;
        }
      }
      if ('ounces' in payload) {
        if (
          payload.ounces === null ||
          payload.ounces === undefined ||
          (typeof payload.ounces === 'number' && payload.ounces >= 0)
        ) {
          updates.ounces = payload.ounces;
        } else {
          return invalid('ounces must be a non-negative number');
        }
      }
      if ('note' in payload) {
        if (payload.note === null || payload.note === undefined || typeof payload.note === 'string') {
          updates.note = payload.note;
        } else {
          return invalid('note must be a string');
        }
      }
      const record = await updateFeedingLog(payload.id, updates);
      if (!record) {
        return NextResponse.json({ error: 'Log not found' }, { status: 404 });
      }
      return NextResponse.json(record);
    }
    case 'diaper': {
      const updates: Parameters<typeof updateDiaperLog>[1] = {};
      if ('loggedAt' in payload) {
        if (typeof payload.loggedAt !== 'string' || !isValidDate(payload.loggedAt)) {
          return invalid('loggedAt must be an ISO timestamp');
        }
        updates.loggedAt = payload.loggedAt;
      }
      if ('diaperType' in payload) {
        if (payload.diaperType && DIAPER_TYPES.includes(payload.diaperType)) {
          updates.type = payload.diaperType;
        } else {
          return invalid(`diaperType must be one of: ${DIAPER_TYPES.join(', ')}`);
        }
      }
      if ('note' in payload) {
        if (payload.note === null || payload.note === undefined || typeof payload.note === 'string') {
          updates.note = payload.note;
        } else {
          return invalid('note must be a string');
        }
      }
      const record = await updateDiaperLog(payload.id, updates);
      if (!record) {
        return NextResponse.json({ error: 'Log not found' }, { status: 404 });
      }
      return NextResponse.json(record);
    }
    case 'sleep': {
      const updates: Parameters<typeof updateSleepLog>[1] = {};
      if ('loggedAt' in payload) {
        if (typeof payload.loggedAt !== 'string' || !isValidDate(payload.loggedAt)) {
          return invalid('loggedAt must be an ISO timestamp');
        }
        updates.loggedAt = payload.loggedAt;
      }
      if ('durationMinutes' in payload) {
        if (payload.durationMinutes === undefined) {
          // ignore undefined updates
        } else if (typeof payload.durationMinutes !== 'number' || payload.durationMinutes <= 0) {
          return invalid('durationMinutes must be a positive number');
        } else {
          updates.durationMinutes = payload.durationMinutes;
        }
      }
      if ('note' in payload) {
        if (payload.note === null || payload.note === undefined || typeof payload.note === 'string') {
          updates.note = payload.note;
        } else {
          return invalid('note must be a string');
        }
      }
      const record = await updateSleepLog(payload.id, updates);
      if (!record) {
        return NextResponse.json({ error: 'Log not found' }, { status: 404 });
      }
      return NextResponse.json(record);
    }
    default:
      return invalid('Unsupported log type');
  }
}

export async function DELETE(request: NextRequest) {
  const typeParam = request.nextUrl.searchParams.get('type');
  const id = request.nextUrl.searchParams.get('id');

  if (!isLogType(typeParam) || !id) {
    return invalid('Missing type or id');
  }

  switch (typeParam) {
    case 'feed': {
      const removed = await removeFeedingLog(id);
      return removed
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }
    case 'diaper': {
      const removed = await removeDiaperLog(id);
      return removed
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }
    case 'sleep': {
      const removed = await removeSleepLog(id);
      return removed
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }
    default:
      return invalid('Unsupported log type');
  }
}
