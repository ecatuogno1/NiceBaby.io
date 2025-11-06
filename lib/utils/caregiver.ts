export type CareWindowEntry = {
  id: string;
  caregiver: string;
  type: 'feed' | 'sleep' | 'diaper' | 'nudge';
  loggedAt: string | Date;
  volumeMl?: number;
};

export type CareWindowSummary = {
  entries: CareWindowEntry[];
  totalVolume: number;
  windowMinutes: number;
};

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * Aggregates caregiver entries for the trailing time window.
 */
export function summarizeCareWindow(
  entries: CareWindowEntry[],
  windowMinutes: number,
  now: Date = new Date(),
): CareWindowSummary {
  if (windowMinutes <= 0) {
    throw new Error('windowMinutes must be greater than 0');
  }

  const windowStart = now.getTime() - windowMinutes * 60 * 1000;

  const normalized = entries
    .map((entry) => ({
      ...entry,
      loggedAt: toDate(entry.loggedAt),
    }))
    .filter((entry) => entry.loggedAt.getTime() >= windowStart)
    .sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());

  const totalVolume = normalized.reduce((total, entry) => {
    if (entry.type !== 'feed' || typeof entry.volumeMl !== 'number') {
      return total;
    }

    return total + entry.volumeMl;
  }, 0);

  return {
    entries: normalized,
    totalVolume,
    windowMinutes,
  };
}
