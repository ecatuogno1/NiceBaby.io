import Link from 'next/link';

export function Hero() {
  return (
    <section id="vision" className="bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-blush-200 bg-blush-50 px-4 py-1 text-sm font-medium text-blush-600">
            Private newborn companion
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Capture every feed, diaper, milestone, and gentle reminder from day one.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--muted)]">
            NiceBaby.io helps you stay present during the newborn whirlwind with lightning-fast logging,
            thoughtful analytics, and curated guidance for both parents. Self-hosted, private, and tailored to
            your family.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="#stack"
            className="rounded-lg bg-blush-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blush-500/30 transition hover:bg-blush-600"
          >
            Explore the stack
          </Link>
          <Link
            href="#modules"
            className="rounded-lg border border-blush-200 px-6 py-3 text-sm font-semibold text-blush-600 transition hover:border-blush-400 hover:text-blush-700"
          >
            View features
          </Link>
        </div>
      </div>
    </section>
  );
}
