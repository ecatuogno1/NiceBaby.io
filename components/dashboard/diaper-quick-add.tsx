'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

export type DiaperFormInput = {
  loggedAt: string;
  type: 'wet' | 'dirty' | 'mixed';
  note?: string;
};

type DiaperQuickAddProps = {
  onSubmit: (input: DiaperFormInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
};

const DIAPER_TYPES: DiaperFormInput['type'][] = ['wet', 'dirty', 'mixed'];

export function DiaperQuickAdd({ onSubmit, isPending = false, error }: DiaperQuickAddProps) {
  const [loggedAt, setLoggedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [type, setType] = useState<DiaperFormInput['type']>('wet');
  const [note, setNote] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const isValid = useMemo(() => Boolean(loggedAt), [loggedAt]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setLocalError('Please choose a time.');
      return;
    }
    setLocalError(null);
    await onSubmit({
      loggedAt: new Date(loggedAt).toISOString(),
      type,
      note: note ? note.trim() : undefined,
    });
    setNote('');
    setLoggedAt(new Date().toISOString().slice(0, 16));
    setType('wet');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
      <header>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Quick diaper</h3>
        <p className="text-xs text-slate-500">Record diaper changes and output mix.</p>
      </header>
      <label className="flex flex-col gap-1 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wide text-slate-400">Change time</span>
        <input
          type="datetime-local"
          value={loggedAt}
          onChange={(event) => setLoggedAt(event.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          max={new Date().toISOString().slice(0, 16)}
          required
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {DIAPER_TYPES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`rounded-md border px-3 py-2 text-sm capitalize transition focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${
              type === option
                ? 'border-sky-500 bg-sky-500/20 text-slate-50'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
            }`}
          >
            {option}
          </button>
        ))}
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
        className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isPending ? 'Saving…' : 'Log diaper'}
      </button>
    </form>
  );
}
