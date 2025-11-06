import type { NudgeChannel, NudgeStatus } from '@prisma/client';

export type MetricSample = {
  metric: string;
  value: number;
  collectedAt: Date;
};

export type MetricThreshold = {
  metric: string;
  min?: number;
  max?: number;
  rollingWindowMinutes?: number;
  channel: NudgeChannel;
  articleSlug?: string;
  message: string;
  title: string;
};

export type NudgeJob = {
  preferenceId: string;
  channel: NudgeChannel;
  title: string;
  body: string;
  triggeredBy: string;
  articleId?: string;
  scheduledAt?: Date;
  status?: NudgeStatus;
};

export type DeliveryResult = {
  channel: NudgeChannel;
  delivered: boolean;
  details?: string;
};
