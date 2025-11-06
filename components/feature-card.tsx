import type { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  items?: string[];
}

export function FeatureCard({ title, description, icon, items }: FeatureCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-blush-100 bg-[var(--card)] p-6 shadow-sm shadow-blush-500/5">
      <div className="flex items-center gap-3 text-blush-500">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-50 text-xl">{icon}</div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--muted)]">{description}</p>
      {items && items.length > 0 ? (
        <ul className="mt-auto list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
