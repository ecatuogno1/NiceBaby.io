import Link from 'next/link';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">NiceBaby</p>
            <h1 className="text-lg font-semibold text-slate-100">Care Dashboard</h1>
          </div>
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-300 sm:flex">
            <Link className="hover:text-slate-50" href="/">
              Marketing Site
            </Link>
            <Link className="hover:text-slate-50" href="/logs">
              Logs
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
