import { NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateMetricsForNudges } from '@/lib/nudges/rules';
import { prisma } from '@/lib/prisma';

const payloadSchema = z.object({
  userId: z.string().min(1),
  metrics: z
    .array(
      z.object({
        metric: z.string().min(1),
        value: z.number(),
        collectedAt: z.union([z.string(), z.number(), z.date()])
      })
    )
    .min(1)
});

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const json = await request.json();
  const payload = payloadSchema.parse(json);

  const metrics = payload.metrics.map((metric) => ({
    ...metric,
    collectedAt: new Date(metric.collectedAt)
  }));

  const jobs = await evaluateMetricsForNudges(payload.userId, metrics);

  return NextResponse.json({ enqueued: jobs.length });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const nudges = await prisma.nudge.findMany({
    where: userId
      ? {
          preference: {
            userId
          }
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: 25
  });

  return NextResponse.json({ nudges });
}
