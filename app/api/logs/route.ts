import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Prisma } from '@prisma/client';
import {
  DiaperType,
  FeedMethod,
  FeedSide,
  SleepQuality,
  StoolConsistency
} from '@prisma/client';

import { authOptions } from '@/lib/auth';
import prisma from '@/prisma/client';

type LogType = 'feed' | 'diaper' | 'sleep' | 'growth';

type CreateLogPayload =
  | {
      type: 'feed';
      babyId: string;
      startTime: string;
      endTime?: string | null;
      method: FeedMethod;
      volumeMl?: number | null;
      side?: FeedSide | null;
      notes?: string | null;
    }
  | {
      type: 'diaper';
      babyId: string;
      occurredAt: string;
      diaperType: DiaperType;
      color?: string | null;
      consistency?: StoolConsistency | null;
      notes?: string | null;
    }
  | {
      type: 'sleep';
      babyId: string;
      startTime: string;
      endTime?: string | null;
      durationMinutes?: number | null;
      quality?: SleepQuality | null;
      notes?: string | null;
    }
  | {
      type: 'growth';
      babyId: string;
      recordedAt: string;
      weightGrams?: number | null;
      lengthCm?: number | null;
      headCircumferenceCm?: number | null;
      temperatureC?: number | null;
      notes?: string | null;
    };

type UpdateLogPayload = Partial<Omit<CreateLogPayload, 'type' | 'babyId'>>;

function isLogType(value: string | null): value is LogType {
  return value === 'feed' || value === 'diaper' || value === 'sleep' || value === 'growth';
}

function isEnumValue<T extends string>(values: readonly T[], candidate: unknown): candidate is T {
  return typeof candidate === 'string' && values.includes(candidate as T);
}

async function ensureBabyAccess(caregiverId: string, babyId: string) {
  const baby = await prisma.baby.findFirst({
    where: {
      id: babyId,
      caregivers: {
        some: { id: caregiverId }
      }
    },
    select: { id: true }
  });

  if (!baby) {
    throw new Error('FORBIDDEN');
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const typeParam = request.nextUrl.searchParams.get('type');
  if (!isLogType(typeParam)) {
    return NextResponse.json({ error: 'Missing or invalid log type' }, { status: 400 });
  }

  const babyId = request.nextUrl.searchParams.get('babyId') ?? undefined;
  const limit = request.nextUrl.searchParams.get('limit');
  const parsedLimit = limit ? Number.parseInt(limit, 10) : Number.NaN;
  const take = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 50;

  const caregiverId = session.user.id;

  try {
    switch (typeParam) {
      case 'feed': {
        const feeds = await prisma.feedLog.findMany({
          where: {
            ...(babyId ? { babyId } : {}),
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          },
          orderBy: { startTime: 'desc' },
          take
        });
        return NextResponse.json(feeds);
      }
      case 'diaper': {
        const diapers = await prisma.diaperLog.findMany({
          where: {
            ...(babyId ? { babyId } : {}),
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          },
          orderBy: { occurredAt: 'desc' },
          take
        });
        return NextResponse.json(diapers);
      }
      case 'sleep': {
        const sleeps = await prisma.sleepLog.findMany({
          where: {
            ...(babyId ? { babyId } : {}),
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          },
          orderBy: { startTime: 'desc' },
          take
        });
        return NextResponse.json(sleeps);
      }
      case 'growth': {
        const growth = await prisma.growthLog.findMany({
          where: {
            ...(babyId ? { babyId } : {}),
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          },
          orderBy: { recordedAt: 'desc' },
          take
        });
        return NextResponse.json(growth);
      }
      default:
        return NextResponse.json({ error: 'Unsupported log type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as CreateLogPayload;
  const caregiverId = session.user.id;

  try {
    switch (payload.type) {
      case 'feed': {
        if (!payload.babyId) {
          return NextResponse.json({ error: 'Missing babyId' }, { status: 400 });
        }
        if (!payload.startTime) {
          return NextResponse.json({ error: 'Missing feed startTime' }, { status: 400 });
        }
        await ensureBabyAccess(caregiverId, payload.babyId);
        if (!isEnumValue(Object.values(FeedMethod), payload.method)) {
          return NextResponse.json({ error: 'Invalid feed method' }, { status: 400 });
        }
        if (
          payload.side !== undefined &&
          payload.side !== null &&
          !isEnumValue(Object.values(FeedSide), payload.side)
        ) {
          return NextResponse.json({ error: 'Invalid feed side' }, { status: 400 });
        }
        const feed = await prisma.feedLog.create({
          data: {
            babyId: payload.babyId,
            caregiverId,
            startTime: new Date(payload.startTime),
            endTime: payload.endTime ? new Date(payload.endTime) : null,
            method: payload.method,
            volumeMl: payload.volumeMl ?? null,
            side: payload.side ?? null,
            notes: payload.notes ?? null
          }
        });
        return NextResponse.json(feed, { status: 201 });
      }
      case 'diaper': {
        if (!payload.babyId) {
          return NextResponse.json({ error: 'Missing babyId' }, { status: 400 });
        }
        if (!payload.occurredAt) {
          return NextResponse.json({ error: 'Missing occurredAt' }, { status: 400 });
        }
        await ensureBabyAccess(caregiverId, payload.babyId);
        if (!isEnumValue(Object.values(DiaperType), payload.diaperType)) {
          return NextResponse.json({ error: 'Invalid diaper type' }, { status: 400 });
        }
        if (
          payload.consistency !== undefined &&
          payload.consistency !== null &&
          !isEnumValue(Object.values(StoolConsistency), payload.consistency)
        ) {
          return NextResponse.json({ error: 'Invalid stool consistency' }, { status: 400 });
        }
        const diaper = await prisma.diaperLog.create({
          data: {
            babyId: payload.babyId,
            caregiverId,
            occurredAt: new Date(payload.occurredAt),
            type: payload.diaperType,
            color: payload.color ?? null,
            consistency: payload.consistency ?? null,
            notes: payload.notes ?? null
          }
        });
        return NextResponse.json(diaper, { status: 201 });
      }
      case 'sleep': {
        if (!payload.babyId) {
          return NextResponse.json({ error: 'Missing babyId' }, { status: 400 });
        }
        if (!payload.startTime) {
          return NextResponse.json({ error: 'Missing sleep startTime' }, { status: 400 });
        }
        await ensureBabyAccess(caregiverId, payload.babyId);
        if (
          payload.quality !== undefined &&
          payload.quality !== null &&
          !isEnumValue(Object.values(SleepQuality), payload.quality)
        ) {
          return NextResponse.json({ error: 'Invalid sleep quality' }, { status: 400 });
        }
        const sleep = await prisma.sleepLog.create({
          data: {
            babyId: payload.babyId,
            caregiverId,
            startTime: new Date(payload.startTime),
            endTime: payload.endTime ? new Date(payload.endTime) : null,
            durationMinutes: payload.durationMinutes ?? null,
            quality: payload.quality ?? null,
            notes: payload.notes ?? null
          }
        });
        return NextResponse.json(sleep, { status: 201 });
      }
      case 'growth': {
        if (!payload.babyId) {
          return NextResponse.json({ error: 'Missing babyId' }, { status: 400 });
        }
        if (!payload.recordedAt) {
          return NextResponse.json({ error: 'Missing recordedAt' }, { status: 400 });
        }
        await ensureBabyAccess(caregiverId, payload.babyId);
        const growth = await prisma.growthLog.create({
          data: {
            babyId: payload.babyId,
            caregiverId,
            recordedAt: new Date(payload.recordedAt),
            weightGrams: payload.weightGrams ?? null,
            lengthCm: payload.lengthCm ?? null,
            headCircumferenceCm: payload.headCircumferenceCm ?? null,
            temperatureC: payload.temperatureC ?? null,
            notes: payload.notes ?? null
          }
        });
        return NextResponse.json(growth, { status: 201 });
      }
      default:
        return NextResponse.json({ error: 'Unsupported log type' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as { id: string; type: LogType } & UpdateLogPayload;
  const caregiverId = session.user.id;

  if (!body.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    switch (body.type) {
      case 'feed': {
        const existing = await prisma.feedLog.findFirst({
          where: {
            id: body.id,
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        if ('method' in body && body.method && !isEnumValue(Object.values(FeedMethod), body.method)) {
          return NextResponse.json({ error: 'Invalid feed method' }, { status: 400 });
        }
        if (
          'side' in body &&
          body.side !== undefined &&
          body.side !== null &&
          !isEnumValue(Object.values(FeedSide), body.side)
        ) {
          return NextResponse.json({ error: 'Invalid feed side' }, { status: 400 });
        }
        const data: Prisma.FeedLogUpdateInput = {};

        if ('startTime' in body && typeof body.startTime === 'string') {
          data.startTime = new Date(body.startTime);
        }

        if ('endTime' in body) {
          if (body.endTime === null) {
            data.endTime = null;
          } else if (typeof body.endTime === 'string') {
            data.endTime = new Date(body.endTime);
          }
        }

        if ('method' in body && body.method) {
          data.method = body.method as FeedMethod;
        }

        if ('volumeMl' in body) {
          data.volumeMl = body.volumeMl ?? null;
        }

        if ('side' in body) {
          data.side = body.side === null ? null : (body.side as FeedSide | undefined);
        }

        if ('notes' in body) {
          data.notes = body.notes ?? null;
        }

        const feed = await prisma.feedLog.update({
          where: { id: body.id },
          data
        });
        return NextResponse.json(feed);
      }
      case 'diaper': {
        const existing = await prisma.diaperLog.findFirst({
          where: {
            id: body.id,
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        if ('diaperType' in body && body.diaperType && !isEnumValue(Object.values(DiaperType), body.diaperType)) {
          return NextResponse.json({ error: 'Invalid diaper type' }, { status: 400 });
        }
        if (
          'consistency' in body &&
          body.consistency !== undefined &&
          body.consistency !== null &&
          !isEnumValue(Object.values(StoolConsistency), body.consistency)
        ) {
          return NextResponse.json({ error: 'Invalid stool consistency' }, { status: 400 });
        }
        const data: Prisma.DiaperLogUpdateInput = {};

        if ('occurredAt' in body && typeof body.occurredAt === 'string') {
          data.occurredAt = new Date(body.occurredAt);
        }

        if ('diaperType' in body && body.diaperType) {
          data.type = body.diaperType as DiaperType;
        }

        if ('color' in body) {
          data.color = body.color ?? null;
        }

        if ('consistency' in body) {
          data.consistency =
            body.consistency === null
              ? null
              : (body.consistency as StoolConsistency | undefined);
        }

        if ('notes' in body) {
          data.notes = body.notes ?? null;
        }

        const diaper = await prisma.diaperLog.update({
          where: { id: body.id },
          data
        });
        return NextResponse.json(diaper);
      }
      case 'sleep': {
        const existing = await prisma.sleepLog.findFirst({
          where: {
            id: body.id,
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        if (
          'quality' in body &&
          body.quality !== undefined &&
          body.quality !== null &&
          !isEnumValue(Object.values(SleepQuality), body.quality)
        ) {
          return NextResponse.json({ error: 'Invalid sleep quality' }, { status: 400 });
        }
        const data: Prisma.SleepLogUpdateInput = {};

        if ('startTime' in body && typeof body.startTime === 'string') {
          data.startTime = new Date(body.startTime);
        }

        if ('endTime' in body) {
          if (body.endTime === null) {
            data.endTime = null;
          } else if (typeof body.endTime === 'string') {
            data.endTime = new Date(body.endTime);
          }
        }

        if ('durationMinutes' in body) {
          data.durationMinutes = body.durationMinutes ?? null;
        }

        if ('quality' in body && body.quality) {
          data.quality = body.quality as SleepQuality;
        }

        if ('notes' in body) {
          data.notes = body.notes ?? null;
        }

        const sleep = await prisma.sleepLog.update({
          where: { id: body.id },
          data
        });
        return NextResponse.json(sleep);
      }
      case 'growth': {
        const existing = await prisma.growthLog.findFirst({
          where: {
            id: body.id,
            baby: {
              caregivers: {
                some: { id: caregiverId }
              }
            }
          }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        const data: Prisma.GrowthLogUpdateInput = {};

        if ('recordedAt' in body && typeof body.recordedAt === 'string') {
          data.recordedAt = new Date(body.recordedAt);
        }

        if ('weightGrams' in body) {
          data.weightGrams = body.weightGrams ?? null;
        }

        if ('lengthCm' in body) {
          data.lengthCm = body.lengthCm ?? null;
        }

        if ('headCircumferenceCm' in body) {
          data.headCircumferenceCm = body.headCircumferenceCm ?? null;
        }

        if ('temperatureC' in body) {
          data.temperatureC = body.temperatureC ?? null;
        }

        if ('notes' in body) {
          data.notes = body.notes ?? null;
        }

        const growth = await prisma.growthLog.update({
          where: { id: body.id },
          data
        });
        return NextResponse.json(growth);
      }
      default:
        return NextResponse.json({ error: 'Unsupported log type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update log' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get('type');
  const id = request.nextUrl.searchParams.get('id');

  if (!isLogType(type) || !id) {
    return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
  }

  const caregiverId = session.user.id;

  try {
    switch (type) {
      case 'feed': {
        const existing = await prisma.feedLog.findFirst({
          where: {
            id,
            baby: { caregivers: { some: { id: caregiverId } } }
          },
          select: { id: true }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        await prisma.feedLog.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      case 'diaper': {
        const existing = await prisma.diaperLog.findFirst({
          where: {
            id,
            baby: { caregivers: { some: { id: caregiverId } } }
          },
          select: { id: true }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        await prisma.diaperLog.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      case 'sleep': {
        const existing = await prisma.sleepLog.findFirst({
          where: {
            id,
            baby: { caregivers: { some: { id: caregiverId } } }
          },
          select: { id: true }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        await prisma.sleepLog.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      case 'growth': {
        const existing = await prisma.growthLog.findFirst({
          where: {
            id,
            baby: { caregivers: { some: { id: caregiverId } } }
          },
          select: { id: true }
        });
        if (!existing) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        await prisma.growthLog.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: 'Unsupported log type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
  }
}
