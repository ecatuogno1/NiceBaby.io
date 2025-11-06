'use server';

import { revalidatePath } from 'next/cache';
import { addDiaperLog, addFeedingLog, addSleepLog } from '@/lib/log-store';

type FeedingPayload = {
  loggedAt: string;
  side: 'left' | 'right' | 'both' | 'bottle';
  durationMinutes: number;
  ounces?: number;
  note?: string;
};

type DiaperPayload = {
  loggedAt: string;
  type: 'wet' | 'dirty' | 'mixed';
  note?: string;
};

type SleepPayload = {
  loggedAt: string;
  durationMinutes: number;
  note?: string;
};

function sanitizeTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }
  const now = Date.now();
  if (date.getTime() > now) {
    return new Date(now).toISOString();
  }
  return date.toISOString();
}

export async function createFeedingEntry(payload: FeedingPayload) {
  const duration = Math.max(1, Math.round(payload.durationMinutes));
  await addFeedingLog({
    ...payload,
    durationMinutes: duration,
    loggedAt: sanitizeTimestamp(payload.loggedAt),
    ounces: payload.ounces != null ? Math.max(0, Number(payload.ounces)) : undefined,
    note: payload.note?.slice(0, 240),
  });
  revalidatePath('/logs');
}

export async function createDiaperEntry(payload: DiaperPayload) {
  await addDiaperLog({
    ...payload,
    loggedAt: sanitizeTimestamp(payload.loggedAt),
    note: payload.note?.slice(0, 240),
  });
  revalidatePath('/logs');
}

export async function createSleepEntry(payload: SleepPayload) {
  const duration = Math.max(1, Math.round(payload.durationMinutes));
  await addSleepLog({
    ...payload,
    durationMinutes: duration,
    loggedAt: sanitizeTimestamp(payload.loggedAt),
    note: payload.note?.slice(0, 240),
  });
  revalidatePath('/logs');
}
