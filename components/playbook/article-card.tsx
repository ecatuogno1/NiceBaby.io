'use client';

import type { PlaybookArticleSummary } from './types';

interface Props {
  article: PlaybookArticleSummary;
  onToggleSaved?: (slug: string) => Promise<void> | void;
}

export const ArticleCard = ({ article, onToggleSaved }: Props) => {
  const ageRange =
    article.babyAgeMin !== null || article.babyAgeMax !== null
      ? `${article.babyAgeMin ?? 0} - ${article.babyAgeMax ?? 12} months`
      : 'All ages';

  return (
    <article className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
          <button
            onClick={() => onToggleSaved?.(article.slug)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              article.saved
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            {article.saved ? 'Saved' : 'Save'}
          </button>
        </div>
        <p className="text-sm text-slate-600">{article.summary}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1 font-medium">{ageRange}</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-1 font-medium capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
