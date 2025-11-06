'use server';

import { revalidatePath } from 'next/cache';
import { addDiaperLog } from '@/lib/log-store';
import { DiaperType } from '@prisma/client';

type DiaperPayload = {
  loggedAt: string;
  type: DiaperType;
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

export async function createDiaperEntry(payload: DiaperPayload) {
  await addDiaperLog({
    ...payload,
    loggedAt: sanitizeTimestamp(payload.loggedAt),
    note: payload.note?.slice(0, 240),
  });
  revalidatePath('/logs');
}
