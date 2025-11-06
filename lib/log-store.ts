import { randomUUID } from 'crypto';

type BaseEntry = {
  id: string;
  loggedAt: string;
  createdAt: number;
  note?: string;
};

export type FeedingEntry = BaseEntry & {
  module: 'feeding';
  side: 'left' | 'right' | 'both' | 'bottle';
  durationMinutes: number;
  ounces?: number;
};

export type DiaperEntry = BaseEntry & {
  module: 'diaper';
  type: 'wet' | 'dirty' | 'mixed';
};

export type SleepEntry = BaseEntry & {
  module: 'sleep';
  durationMinutes: number;
};

type Entry = FeedingEntry | DiaperEntry | SleepEntry;

type SummaryBucket = { label: string; value: number };

type LogStore = {
  feedings: FeedingEntry[];
  diapers: DiaperEntry[];
  sleeps: SleepEntry[];
};

const store: LogStore = {
  feedings: [
    {
      id: randomUUID(),
      module: 'feeding',
      loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
      side: 'left',
      durationMinutes: 18,
      ounces: 3.5,
      note: 'Good latch and calm.',
    },
    {
      id: randomUUID(),
      module: 'feeding',
      loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      side: 'bottle',
      durationMinutes: 12,
      ounces: 4.2,
      note: 'Pumped milk, partner handled feed.',
    },
    {
      id: randomUUID(),
      module: 'feeding',
      loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 60 * 9,
      side: 'right',
      durationMinutes: 16,
      ounces: 3.1,
    },
  ],
  diapers: [
    {
      id: randomUUID(),
      module: 'diaper',
      loggedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 45,
      type: 'wet',
      note: 'Lots of output.',
    },
    {
      id: randomUUID(),
      module: 'diaper',
      loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 60 * 6,
      type: 'dirty',
    },
    {
      id: randomUUID(),
      module: 'diaper',
      loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 60 * 12,
      type: 'mixed',
    },
  ],
  sleeps: [
    {
      id: randomUUID(),
      module: 'sleep',
      loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 60 * 3.5,
      durationMinutes: 95,
      note: 'Contact nap on parent.',
    },
    {
      id: randomUUID(),
      module: 'sleep',
      loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      createdAt: Date.now() - 1000 * 60 * 60 * 8,
      durationMinutes: 120,
    },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function getRecentFeedings(limit = 10): Promise<FeedingEntry[]> {
  return clone(store.feedings.slice(-limit).reverse());
}

export async function getRecentDiapers(limit = 10): Promise<DiaperEntry[]> {
  return clone(store.diapers.slice(-limit).reverse());
}

export async function getRecentSleeps(limit = 10): Promise<SleepEntry[]> {
  return clone(store.sleeps.slice(-limit).reverse());
}

export async function addFeedingLog(entry: {
  loggedAt: string;
  side: FeedingEntry['side'];
  durationMinutes: number;
  ounces?: number;
  note?: string;
}): Promise<FeedingEntry> {
  const record: FeedingEntry = {
    id: randomUUID(),
    module: 'feeding',
    createdAt: Date.now(),
    ...entry,
  };
  store.feedings.push(record);
  return clone(record);
}

export async function addDiaperLog(entry: {
  loggedAt: string;
  type: DiaperEntry['type'];
  note?: string;
}): Promise<DiaperEntry> {
  const record: DiaperEntry = {
    id: randomUUID(),
    module: 'diaper',
    createdAt: Date.now(),
    ...entry,
  };
  store.diapers.push(record);
  return clone(record);
}

export async function addSleepLog(entry: {
  loggedAt: string;
  durationMinutes: number;
  note?: string;
}): Promise<SleepEntry> {
  const record: SleepEntry = {
    id: randomUUID(),
    module: 'sleep',
    createdAt: Date.now(),
    ...entry,
  };
  store.sleeps.push(record);
  return clone(record);
}

function groupByDay(entries: Entry[]): Map<string, Entry[]> {
  const map = new Map<string, Entry[]>();
  for (const entry of entries) {
    const date = new Date(entry.loggedAt);
    const key = date.toISOString().slice(0, 10);
    const existing = map.get(key) ?? [];
    existing.push(entry);
    map.set(key, existing);
  }
  return map;
}

export function getFeedDurationSummary(days = 3): SummaryBucket[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const feedings = store.feedings.filter((f) => new Date(f.loggedAt).getTime() >= cutoff);
  const byDay = groupByDay(feedings);
  return Array.from(byDay.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([day, items]) => ({
      label: day,
      value: Math.round(items.reduce((acc, item) => acc + item.durationMinutes, 0)),
    }));
}

export function getDiaperBreakdown(days = 3): SummaryBucket[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const diapers = store.diapers.filter((d) => new Date(d.loggedAt).getTime() >= cutoff);
  const totals: Record<DiaperEntry['type'], number> = { wet: 0, dirty: 0, mixed: 0 };
  diapers.forEach((entry) => {
    totals[entry.type] += 1;
  });
  return Object.entries(totals)
    .map(([label, value]) => ({ label, value }))
    .filter((bucket) => bucket.value > 0);
}

export function calculateStreak(entries: Entry[], predicate: (entries: Entry[]) => boolean): number {
  const byDay = Array.from(groupByDay(entries).entries()).sort((a, b) => (a[0] > b[0] ? -1 : 1));
  let streak = 0;
  const current = new Date();
  for (const [day, items] of byDay) {
    const dayDate = new Date(day + 'T00:00:00');
    const diff = Math.floor((current.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > streak) {
      break;
    }
    if (predicate(items)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export function getFeedingsStreak(minPerDay = 8): number {
  return calculateStreak(store.feedings, (entries) => entries.length >= minPerDay);
}

export function getDiaperStreak(minPerDay = 6): number {
  return calculateStreak(store.diapers, (entries) => entries.length >= minPerDay);
}

