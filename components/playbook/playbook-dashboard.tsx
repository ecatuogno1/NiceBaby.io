'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateDeliveryOptIns, toggleSavedArticle } from '@/app/(dashboard)/playbook/actions';
import { ArticleCard } from './article-card';
import { FilterBar } from './filter-bar';
import type { PlaybookArticleSummary, PlaybookFilterState } from './types';

type Props = {
  userId: string;
  articles: PlaybookArticleSummary[];
  tags: string[];
  babyAgeMonths: number | null;
  optIns: {
    optInEmail: boolean;
    optInPush: boolean;
    optInMatrix: boolean;
  };
};

const defaultFilter = (babyAgeMonths: number | null): PlaybookFilterState => ({
  tag: null,
  savedOnly: false,
  babyAgeMonths
});

const matchesAge = (article: PlaybookArticleSummary, age: number | null) => {
  if (age === null) return true;
  const min = article.babyAgeMin ?? 0;
  const max = article.babyAgeMax ?? 48;
  return age >= min && age <= max;
};

export const PlaybookDashboard = ({ userId, articles, tags, babyAgeMonths, optIns }: Props) => {
  const [filter, setFilter] = useState<PlaybookFilterState>(defaultFilter(babyAgeMonths));
  const [optimisticArticles, setOptimisticArticles] = useState(articles);
  const [optInState, setOptInState] = useState(optIns);
  const [isPending, startTransition] = useTransition();

  const filteredArticles = useMemo(() => {
    return optimisticArticles.filter((article) => {
      if (filter.savedOnly && !article.saved) return false;
      if (filter.tag && !article.tags.includes(filter.tag)) return false;
      if (!matchesAge(article, filter.babyAgeMonths)) return false;
      return true;
    });
  }, [optimisticArticles, filter]);

  const handleFilterChange = (next: PlaybookFilterState) => {
    setFilter(next);
  };

  const handleToggleSaved = (slug: string) => {
    setOptimisticArticles((current) =>
      current.map((article) =>
        article.slug === slug ? { ...article, saved: !article.saved } : article
      )
    );

    startTransition(async () => {
      await toggleSavedArticle(userId, slug);
    });
  };

  const handleOptInChange = (field: keyof typeof optInState, value: boolean) => {
    const nextState = { ...optInState, [field]: value };
    setOptInState(nextState);
    startTransition(async () => {
      await updateDeliveryOptIns(userId, nextState);
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Delivery channels</h2>
        <p className="text-sm text-slate-600">
          Toggle where contextual nudges should arrive. Updates sync instantly with the
          notifications queue.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { field: 'optInEmail', label: 'Email digests', description: 'Nightly summary with upcoming nudges.' },
            { field: 'optInPush', label: 'Web push', description: 'Lightweight nudges when metrics drift.' },
            { field: 'optInMatrix', label: 'Matrix room', description: 'Send alerts to your caregiver channel.' }
          ].map(({ field, label, description }) => (
            <label
              key={field}
              className="flex cursor-pointer flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{label}</span>
                <input
                  type="checkbox"
                  checked={optInState[field as keyof typeof optInState]}
                  onChange={(event) =>
                    handleOptInChange(field as keyof typeof optInState, event.target.checked)
                  }
                  className="h-4 w-4"
                />
              </div>
              <p className="text-xs text-slate-500">{description}</p>
            </label>
          ))}
        </div>
        {isPending && <p className="mt-2 text-xs text-slate-500">Updating preferences…</p>}
      </div>

      <FilterBar tags={tags} initialFilter={filter} onChange={handleFilterChange} />

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recommended guidance</h2>
          <span className="text-sm text-slate-500">{filteredArticles.length} articles</span>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onToggleSaved={handleToggleSaved} />
          ))}
          {filteredArticles.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              No guidance matches those filters yet. Try broadening your search or lower the age range.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
