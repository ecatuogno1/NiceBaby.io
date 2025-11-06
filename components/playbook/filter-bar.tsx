'use client';

import { useState, useEffect } from 'react';
import type { PlaybookFilterState } from './types';

type Props = {
  tags: string[];
  initialFilter: PlaybookFilterState;
  onChange: (filter: PlaybookFilterState) => void;
};

export const FilterBar = ({ tags, initialFilter, onChange }: Props) => {
  const [filter, setFilter] = useState<PlaybookFilterState>(initialFilter);

  useEffect(() => {
    onChange(filter);
  }, [filter, onChange]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4 md:items-center">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Baby age (months)
          <input
            type="number"
            value={filter.babyAgeMonths ?? ''}
            min={0}
            placeholder="Any"
            onChange={(event) =>
              setFilter((current) => ({
                ...current,
                babyAgeMonths: event.target.value === '' ? null : Number(event.target.value)
              }))
            }
            className="rounded border border-slate-200 px-3 py-2 text-sm shadow-inner"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Tag
          <select
            value={filter.tag ?? ''}
            onChange={(event) =>
              setFilter((current) => ({
                ...current,
                tag: event.target.value === '' ? null : event.target.value
              }))
            }
            className="rounded border border-slate-200 px-3 py-2 text-sm shadow-inner"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={filter.savedOnly}
            onChange={(event) =>
              setFilter((current) => ({ ...current, savedOnly: event.target.checked }))
            }
            className="h-4 w-4"
          />
          Saved only
        </label>
        <div className="text-sm text-slate-500">
          <p className="font-medium text-slate-700">Filters active</p>
          <p>
            {filter.tag ? `${filter.tag} • ` : ''}
            {filter.babyAgeMonths !== null ? `${filter.babyAgeMonths}m ` : 'All ages '}
            {filter.savedOnly ? '• Saved' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
