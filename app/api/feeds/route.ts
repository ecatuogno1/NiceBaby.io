'use server';

import { revalidatePath } from 'next/cache';
import { addFeedingLog } from '@/lib/log-store';
import { FeedMethod, FeedSide } from '@prisma/client';

type FeedingPayload = {
  loggedAt: string;
  method: FeedMethod;
  side: FeedSide;
  durationMinutes: number;
  milliliters?: number;
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
    milliliters: payload.milliliters != null ? Math.max(0, Number(payload.milliliters)) : undefined,
    note: payload.note?.slice(0, 240),
  });
  revalidatePath('/logs');
}
