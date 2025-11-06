'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import type { ReactNode } from 'react';
import type { DiaperEntry, FeedingEntry, SleepEntry } from '@/lib/log-store';
import { ActivityBarChart, type ActivityBarChartDatum } from '@/components/visualizations/activity-bar-chart';
import { StreakCounter } from '@/components/visualizations/streak-counter';
import { FeedQuickAdd, type FeedFormInput } from './feed-quick-add';
import { DiaperQuickAdd, type DiaperFormInput } from './diaper-quick-add';
import { SleepQuickAdd, type SleepFormInput } from './sleep-quick-add';
import { createDiaperEntry, createFeedingEntry, createSleepEntry } from '@/app/(dashboard)/logs/actions';

const formatRelativeTime = (iso: string) => {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

type DashboardLogsProps = {
  initialFeedings: FeedingEntry[];
  initialDiapers: DiaperEntry[];
  initialSleeps: SleepEntry[];
  feedSummary: ActivityBarChartDatum[];
  diaperSummary: ActivityBarChartDatum[];
  sleepSummary: ActivityBarChartDatum[];
  feedingStreak: number;
  diaperStreak: number;
  sleepStreak: number;
};

type OptimisticEntry<T extends FeedingEntry | DiaperEntry | SleepEntry> = T & { id: string };

export function DashboardLogs({
  initialFeedings,
  initialDiapers,
  initialSleeps,
  feedSummary,
  diaperSummary,
  sleepSummary,
  feedingStreak,
  diaperStreak,
  sleepStreak,
}: DashboardLogsProps) {
  const router = useRouter();
  const [feedings, setFeedings] = useState(initialFeedings);
  const [diapers, setDiapers] = useState(initialDiapers);
  const [sleeps, setSleeps] = useState(initialSleeps);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [diaperError, setDiaperError] = useState<string | null>(null);
  const [sleepError, setSleepError] = useState<string | null>(null);
  const [isFeedPending, startFeedTransition] = useTransition();
  const [isDiaperPending, startDiaperTransition] = useTransition();
  const [isSleepPending, startSleepTransition] = useTransition();

  useEffect(() => {
    setFeedings(initialFeedings);
  }, [initialFeedings]);

  useEffect(() => {
    setDiapers(initialDiapers);
  }, [initialDiapers]);

  useEffect(() => {
    setSleeps(initialSleeps);
  }, [initialSleeps]);

  const refreshLogs = () => {
    router.refresh();
  };

  const handleFeedingSubmit = async (input: FeedFormInput) => {
    setFeedError(null);
    const optimistic: OptimisticEntry<FeedingEntry> = {
      id: `optimistic-${Date.now()}`,
      module: 'feeding',
      createdAt: Date.now(),
      ...input,
    };
    setFeedings((entries) => [optimistic, ...entries].slice(0, 20));
    startFeedTransition(() => {
      createFeedingEntry(input)
        .catch((error) => {
          console.error('Failed to create feeding', error);
          setFeedError('Unable to save feeding right now. Please try again.');
        })
        .finally(refreshLogs);
    });
  };

  const handleDiaperSubmit = async (input: DiaperFormInput) => {
    setDiaperError(null);
    const optimistic: OptimisticEntry<DiaperEntry> = {
      id: `optimistic-${Date.now()}`,
      module: 'diaper',
      createdAt: Date.now(),
      ...input,
    };
    setDiapers((entries) => [optimistic, ...entries].slice(0, 20));
    startDiaperTransition(() => {
      createDiaperEntry(input)
        .catch((error) => {
          console.error('Failed to create diaper', error);
          setDiaperError('Unable to save diaper right now. Please try again.');
        })
        .finally(refreshLogs);
    });
  };

  const handleSleepSubmit = async (input: SleepFormInput) => {
    setSleepError(null);
    const optimistic: OptimisticEntry<SleepEntry> = {
      id: `optimistic-${Date.now()}`,
      module: 'sleep',
      createdAt: Date.now(),
      ...input,
    };
    setSleeps((entries) => [optimistic, ...entries].slice(0, 20));
    startSleepTransition(() => {
      createSleepEntry(input)
        .catch((error) => {
          console.error('Failed to create sleep', error);
          setSleepError('Unable to save sleep right now. Please try again.');
        })
        .finally(refreshLogs);
    });
  };

  const feedingsInsight = useMemo(() => {
    const total = feedings.reduce((sum, entry) => sum + entry.durationMinutes, 0);
    return `${Math.round(total)} total minutes logged this view`;
  }, [feedings]);

  const diaperInsight = useMemo(() => {
    const wetCount = diapers.filter((entry) => entry.type === 'wet').length;
    return `${wetCount} wet diapers in the latest batch`;
  }, [diapers]);

  const sleepInsight = useMemo(() => {
    const totalMinutes = sleeps.reduce((sum, entry) => sum + entry.durationMinutes, 0);
    const hours = totalMinutes / 60;
    const formatted = hours >= 10 ? Math.round(hours).toString() : hours.toFixed(1).replace(/\.0$/, '');
    return `${formatted} hours of rest tracked here`;
  }, [sleeps]);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[2fr,2fr,2fr,1fr]">
        <FeedQuickAdd onSubmit={handleFeedingSubmit} isPending={isFeedPending} error={feedError} />
        <DiaperQuickAdd onSubmit={handleDiaperSubmit} isPending={isDiaperPending} error={diaperError} />
        <SleepQuickAdd onSubmit={handleSleepSubmit} isPending={isSleepPending} error={sleepError} />
        <div className="flex flex-col gap-4">
          <StreakCounter
            label="Feeding streak"
            value={feedingStreak}
            target={7}
            description="Days in a row with 8+ feeds captured"
          />
          <StreakCounter
            label="Diaper streak"
            value={diaperStreak}
            target={7}
            description="Consistency helps spot hydration changes sooner"
          />
          <StreakCounter
            label="Sleep streak"
            value={sleepStreak}
            target={4}
            description="Days meeting 12h combined rest"
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ActivityBarChart title="Feeding minutes" data={feedSummary} valueUnit="min" />
        <ActivityBarChart title="Diaper changes" data={diaperSummary} valueUnit="changes" emphasis="muted" />
        <ActivityBarChart title="Sleep duration" data={sleepSummary} valueUnit="min" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <LogColumn title="Latest feedings" empty="No feedings yet" insight={feedingsInsight}>
          {feedings.map((entry) => (
            <LogCard key={entry.id} title={`${entry.side} • ${entry.durationMinutes} min`} timestamp={entry.loggedAt}>
              {entry.ounces != null && (
                <p className="text-sm text-slate-300">{entry.ounces} oz recorded</p>
              )}
              {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
            </LogCard>
          ))}
        </LogColumn>
        <LogColumn title="Latest diapers" empty="No diaper changes yet" insight={diaperInsight}>
          {diapers.map((entry) => (
            <LogCard key={entry.id} title={`${entry.type} change`} timestamp={entry.loggedAt}>
              {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
            </LogCard>
          ))}
        </LogColumn>
        <LogColumn title="Latest sleeps" empty="No sleep logged yet" insight={sleepInsight}>
          {sleeps.map((entry) => (
            <LogCard key={entry.id} title={formatSleepDuration(entry.durationMinutes)} timestamp={entry.loggedAt}>
              {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
            </LogCard>
          ))}
        </LogColumn>
      </section>
    </div>
  );
}

type LogColumnProps = {
  title: string;
  empty: string;
  insight: string;
  children: ReactNode;
};

function LogColumn({ title, empty, insight, children }: LogColumnProps) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
          <p className="text-xs text-slate-500">{insight}</p>
        </div>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {hasChildren ? children : <p className="text-sm text-slate-500">{empty}</p>}
      </div>
    </div>
  );
}

type LogCardProps = {
  title: string;
  timestamp: string;
  children?: ReactNode;
};

function LogCard({ title, timestamp, children }: LogCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <h4 className="font-medium capitalize">{title}</h4>
        <span className="text-xs text-slate-500">{formatRelativeTime(timestamp)}</span>
      </div>
      {children}
      <p className="mt-2 text-xs text-slate-500">
        {new Date(timestamp).toLocaleString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </article>
  );
}

function formatSleepDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  const hoursLabel = `${hours} hr${hours === 1 ? '' : 's'}`;
  if (remaining === 0) {
    return hoursLabel;
  }
  return `${hoursLabel} ${remaining} min`;
}
