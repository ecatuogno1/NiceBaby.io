import { DashboardLogs } from '@/components/dashboard/dashboard-logs';
import {
  getDiaperBreakdown,
  getDiaperStreak,
  getFeedDurationSummary,
  getFeedingsStreak,
  getRecentDiapers,
  getRecentFeedings,
  getRecentSleeps,
  getSleepDurationSummary,
  getSleepStreak,
} from '@/lib/log-store';

export const metadata = {
  title: 'Care logs | NiceBaby',
  description: 'Review the latest feedings, diapers, and trends across your care team.',
};

export default async function LogsPage() {
  const [feedings, diapers, sleeps] = await Promise.all([
    getRecentFeedings(12),
    getRecentDiapers(12),
    getRecentSleeps(12),
  ]);

  const feedSummary = getFeedDurationSummary(4);
  const diaperSummary = getDiaperBreakdown(4);
  const sleepSummary = getSleepDurationSummary(4);
  const feedingStreak = getFeedingsStreak();
  const diaperStreak = getDiaperStreak();
  const sleepStreak = getSleepStreak();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <p className="text-xs uppercase tracking-wide text-slate-400">Overview</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-50">Daily activity logs</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Capture feedings, diapers, and sleep patterns without friction. Optimistic updates keep the team synced while
          server actions persist every detail to your self-hosted backend.
        </p>
      </section>

      <DashboardLogs
        initialFeedings={feedings}
        initialDiapers={diapers}
        initialSleeps={sleeps}
        feedSummary={feedSummary}
        diaperSummary={diaperSummary}
        sleepSummary={sleepSummary}
        feedingStreak={feedingStreak}
        diaperStreak={diaperStreak}
        sleepStreak={sleepStreak}
      />
    </div>
  );
}
