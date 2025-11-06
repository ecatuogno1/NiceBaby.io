import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
}

export function Section({ id, title, eyebrow, description, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-blush-100 bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="space-y-4 pb-10 text-left">
          {eyebrow ? (
            <span className="inline-flex rounded-full border border-blush-200 bg-blush-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blush-600">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">{title}</h2>
          {description ? <p className="max-w-3xl text-base text-[var(--muted)]">{description}</p> : null}
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      </div>
    </section>
  );
}
