import Link from 'next/link';

export function Hero() {
  return (
    <section id="vision" className="bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-blush-200 bg-blush-50 px-4 py-1 text-sm font-medium text-blush-600">
            Privacy-first newborn tracker blueprint
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Build Baby Rhythm: lightning-fast capture, offline-first sync, and pediatrician-ready insights.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--muted)]">
            This implementation guide distills the MVP → v1 path for a collaborative baby tracker. Explore
            the goals, personas, architecture, and roadmap to ship a trustworthy companion without leaning
            on self-hosted Docker stacks.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="#goals"
            className="rounded-lg bg-blush-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blush-500/30 transition hover:bg-blush-600"
          >
            Start with the goals
          </Link>
          <Link
            href="#platforms"
            className="rounded-lg border border-blush-200 px-6 py-3 text-sm font-semibold text-blush-600 transition hover:border-blush-400 hover:text-blush-700"
          >
            Review the tech stack
          </Link>
        </div>
      </div>
    </section>
  );
}
