import { prisma } from '@/lib/prisma';
import type { NudgeChannel, NudgeStatus } from '@prisma/client';
import { deliverNudge } from './delivery';
import type { NudgeJob } from './types';

const queue: NudgeJob[] = [];
let processing = false;

const persistJob = async (job: NudgeJob, status: NudgeStatus) => {
  await prisma.nudge.create({
    data: {
      preferenceId: job.preferenceId,
      channel: job.channel,
      title: job.title,
      body: job.body,
      triggeredBy: job.triggeredBy,
      status,
      scheduledAt: job.scheduledAt ?? null,
      articleId: job.articleId ?? null
    }
  });
};

const processNext = async () => {
  if (processing) return;
  processing = true;
  while (queue.length > 0) {
    const job = queue.shift()!;
    const preference = await prisma.userPreference.findUnique({
      where: { id: job.preferenceId }
    });

    if (!preference) {
      await persistJob(job, 'SUPPRESSED');
      continue;
    }

    const delivery = await deliverNudge(preference, job);
    const status: NudgeStatus = delivery.delivered ? 'SENT' : 'SUPPRESSED';
    await persistJob(job, status);
  }
  processing = false;
};

export const enqueueNudge = async (job: NudgeJob) => {
  queue.push(job);
  await processNext();
};

export const listPendingJobs = () => [...queue];

export const resetQueue = () => {
  queue.length = 0;
  processing = false;
};

export const createNudgeJob = (
  preferenceId: string,
  channel: NudgeChannel,
  title: string,
  body: string,
  triggeredBy: string,
  articleId?: string
): NudgeJob => ({
  preferenceId,
  channel,
  title,
  body,
  triggeredBy,
  articleId
});
