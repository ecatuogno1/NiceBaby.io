'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FeedMethod, FeedSide } from '@prisma/client';

export type FeedFormInput = {
  loggedAt: string;
  method: FeedMethod;
  side: FeedSide;
  durationMinutes: number;
  milliliters?: number;
  note?: string;
};

type FeedQuickAddProps = {
  onSubmit: (input: FeedFormInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
};

const METHOD_OPTIONS: FeedMethod[] = [FeedMethod.BREAST, FeedMethod.BOTTLE, FeedMethod.PUMPED, FeedMethod.SOLID];
const SIDE_OPTIONS: FeedSide[] = [FeedSide.LEFT, FeedSide.RIGHT, FeedSide.BOTH];

export function FeedQuickAdd({ onSubmit, isPending = false, error }: FeedQuickAddProps) {
  const [loggedAt, setLoggedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [method, setMethod] = useState<FeedMethod>(FeedMethod.BREAST);
  const [side, setSide] = useState<FeedSide>(FeedSide.LEFT);
  const [duration, setDuration] = useState('15');
  const [ounces, setOunces] = useState('');
  const [note, setNote] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    const parsedDuration = Number(duration);
    return Number.isFinite(parsedDuration) && parsedDuration > 0 && !!loggedAt;
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
      method,
      side,
      durationMinutes: Number(duration),
      milliliters: ounces ? Number(ounces) * 29.5735 : undefined,
      note: note ? note.trim() : undefined,
    });
    setDuration('15');
    setOunces('');
    setNote('');
    setLoggedAt(new Date().toISOString().slice(0, 16));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
      <header>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Quick feed</h3>
        <p className="text-xs text-slate-500">Track the latest nursing or bottle session.</p>
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
        <span className="text-xs uppercase tracking-wide text-slate-400">Method</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {METHOD_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMethod(option)}
              className={`rounded-md border px-3 py-2 text-sm capitalize transition focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${
                method === option
                  ? 'border-sky-500 bg-sky-500/20 text-slate-50'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </label>
      {method === FeedMethod.BREAST && (
        <label className="flex flex-col gap-1 text-sm text-slate-200">
          <span className="text-xs uppercase tracking-wide text-slate-400">Side</span>
          <div className="grid grid-cols-3 gap-2">
            {SIDE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSide(option)}
                className={`rounded-md border px-3 py-2 text-sm capitalize transition focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${
                  side === option
                    ? 'border-sky-500 bg-sky-500/20 text-slate-50'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </label>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <span className="text-xs uppercase tracking-wide text-slate-400">Volume (oz)</span>
          <input
            type="number"
            min={0}
            step="0.1"
            value={ounces}
            onChange={(event) => setOunces(event.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            placeholder="Optional"
          />
        </label>
      </div>
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
        className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isPending ? 'Saving…' : 'Log feeding'}
      </button>
    </form>
  );
}
