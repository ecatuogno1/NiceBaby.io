import { prisma } from '@/lib/prisma';
import type { PlaybookArticle, UserPreference } from '@prisma/client';
import { z } from 'zod';
import { createNudgeJob, enqueueNudge } from './queue';
import type { MetricSample, MetricThreshold, NudgeJob } from './types';

const metricSampleSchema = z.object({
  metric: z.string().min(1),
  value: z.number().finite(),
  collectedAt: z.coerce.date()
});

const thresholdSchema = z.object({
  metric: z.string(),
  min: z.number().finite().optional(),
  max: z.number().finite().optional(),
  rollingWindowMinutes: z.number().int().positive().optional(),
  channel: z.enum(['EMAIL', 'PUSH', 'MATRIX', 'IN_APP']),
  articleSlug: z.string().optional(),
  message: z.string(),
  title: z.string()
});

export const defaultThresholds: MetricThreshold[] = [
  {
    metric: 'wet_diapers_last_24h',
    min: 6,
    channel: 'PUSH',
    articleSlug: 'hydration-tracking-basics',
    title: 'Hydration check',
    message: 'Diaper counts dipped below the recommended range. Review hydration tips.'
  },
  {
    metric: 'night_sleep_hours',
    min: 8,
    channel: 'EMAIL',
    articleSlug: 'sleep-routine-blueprint',
    title: 'Sleep support',
    message: 'Night sleep totals look light. Here are calming routines to try tonight.'
  },
  {
    metric: 'parent_mood_score',
    max: 3,
    channel: 'MATRIX',
    title: 'Check-in reminder',
    message: 'Mood check-ins show a tough day. Reach out to your support circle.'
  }
];

type EvaluationContext = {
  preference: UserPreference;
  thresholds: MetricThreshold[];
  metrics: MetricSample[];
};

const buildArticleLookup = async (thresholds: MetricThreshold[]) => {
  const slugs = thresholds
    .map((threshold) => threshold.articleSlug)
    .filter((slug): slug is string => Boolean(slug));

  if (slugs.length === 0) {
    return new Map<string, PlaybookArticle>();
  }

  const articles = await prisma.playbookArticle.findMany({
    where: { slug: { in: slugs } }
  });

  return new Map<string, PlaybookArticle>(articles.map((article) => [article.slug, article]));
};

const evaluateThreshold = (
  threshold: MetricThreshold,
  sample: MetricSample
) => {
  if (threshold.min !== undefined && sample.value < threshold.min) return true;
  if (threshold.max !== undefined && sample.value > threshold.max) return true;
  return false;
};

const selectLatestSample = (
  samples: MetricSample[],
  metric: string
): MetricSample | undefined => {
  const matches = samples.filter((sample) => sample.metric === metric);
  return matches.sort((a, b) => b.collectedAt.getTime() - a.collectedAt.getTime())[0];
};

const createJobsForThresholds = async ({
  preference,
  thresholds,
  metrics
}: EvaluationContext): Promise<NudgeJob[]> => {
  const articleLookup = await buildArticleLookup(thresholds);
  const jobs: NudgeJob[] = [];

  thresholds.forEach((threshold) => {
    const sample = selectLatestSample(metrics, threshold.metric);
    if (!sample) return;
    if (!evaluateThreshold(threshold, sample)) return;

    const article = threshold.articleSlug
      ? articleLookup.get(threshold.articleSlug)
      : undefined;

    const job = createNudgeJob(
      preference.id,
      threshold.channel,
      threshold.title,
      threshold.message,
      `${threshold.metric}:${sample.value}`,
      article?.id
    );

    jobs.push(job);
  });

  return jobs;
};

export const evaluateMetricsForNudges = async (
  userId: string,
  metrics: MetricSample[],
  thresholds: MetricThreshold[] = defaultThresholds
) => {
  const parsedMetrics = metrics.map((metric) => metricSampleSchema.parse(metric));
  const parsedThresholds = thresholds.map((threshold) => thresholdSchema.parse(threshold));

  const preference = await prisma.userPreference.findUnique({
    where: { userId }
  });

  if (!preference) {
    throw new Error(`No user preference found for ${userId}`);
  }

  const jobs = await createJobsForThresholds({
    preference,
    thresholds: parsedThresholds,
    metrics: parsedMetrics
  });

  await Promise.all(jobs.map((job) => enqueueNudge(job)));

  return jobs;
};
