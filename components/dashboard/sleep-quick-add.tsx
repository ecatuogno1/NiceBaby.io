'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

export type SleepFormInput = {
  loggedAt: string;
  durationMinutes: number;
  note?: string;
};

type SleepQuickAddProps = {
  onSubmit: (input: SleepFormInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
};

export function SleepQuickAdd({ onSubmit, isPending = false, error }: SleepQuickAddProps) {
  const [loggedAt, setLoggedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState('90');
  const [note, setNote] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    const parsedDuration = Number(duration);
    return Number.isFinite(parsedDuration) && parsedDuration > 0 && Boolean(loggedAt);
  }, [duration, loggedAt]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setLocalError('Enter a duration greater than zero.');
      return;
    }

    setLocalError(null);
    await onSubmit({
      loggedAt: new Date(loggedAt).toISOString(),
      durationMinutes: Number(duration),
      note: note ? note.trim() : undefined,
    });
    setDuration('90');
    setNote('');
    setLoggedAt(new Date().toISOString().slice(0, 16));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
      <header>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Quick sleep</h3>
        <p className="text-xs text-slate-500">Log naps and overnight stretches.</p>
      </header>
      <label className="flex flex-col gap-1 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wide text-slate-400">Start time</span>
        <input
          type="datetime-local"
          value={loggedAt}
          onChange={(event) => setLoggedAt(event.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          max={new Date().toISOString().slice(0, 16)}
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wide text-slate-400">Duration (minutes)</span>
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wide text-slate-400">Notes</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          placeholder="Optional context"
        />
      </label>
      {(localError || error) && <p className="text-sm text-rose-400">{localError ?? error}</p>}
      <button
        type="submit"
        disabled={!isValid || isPending}
        className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isPending ? 'Saving…' : 'Log sleep'}
      </button>
    </form>
  );
}
