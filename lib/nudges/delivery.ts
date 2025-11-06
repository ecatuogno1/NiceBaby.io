import type { NudgeChannel, UserPreference } from '@prisma/client';
import type { DeliveryResult, NudgeJob } from './types';

const channelLabels: Record<NudgeChannel, string> = {
  EMAIL: 'email',
  PUSH: 'web push',
  MATRIX: 'Matrix',
  IN_APP: 'in-app banner'
};

export const isChannelEnabled = (preference: UserPreference, channel: NudgeChannel) => {
  switch (channel) {
    case 'EMAIL':
      return preference.optInEmail;
    case 'PUSH':
      return preference.optInPush;
    case 'MATRIX':
      return preference.optInMatrix;
    case 'IN_APP':
      return true;
    default:
      return false;
  }
};

const simulateWebhook = async (job: NudgeJob) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return `${channelLabels[job.channel]} delivery enqueued`;
};

export const deliverNudge = async (
  preference: UserPreference,
  job: NudgeJob
): Promise<DeliveryResult> => {
  const enabled = isChannelEnabled(preference, job.channel);
  if (!enabled) {
    return {
      channel: job.channel,
      delivered: false,
      details: `${channelLabels[job.channel]} delivery suppressed (opt-out)`
    };
  }

  const details = await simulateWebhook(job);
  return {
    channel: job.channel,
    delivered: true,
    details
  };
};
