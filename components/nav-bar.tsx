'use client';

import Link from 'next/link';
import { useState } from 'react';
import { routes } from '@/data/routes';

export function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur border-b border-blush-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-blush-600">
          NiceBaby.io
        </Link>
        <button
          type="button"
          className="rounded-md border border-blush-200 px-3 py-2 text-sm font-medium text-blush-600 transition hover:bg-blush-50 sm:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          Menu
        </button>
        <div className="hidden gap-6 text-sm font-medium text-[var(--muted)] sm:flex">
          {routes.map((route) => (
            <a key={route.href} href={route.href} className="hover:text-blush-600">
              {route.label}
            </a>
          ))}
        </div>
      </nav>
      {open ? (
        <div className="border-t border-blush-100 bg-[var(--card)] px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-[var(--muted)]">
            {routes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                className="rounded-md px-3 py-2 hover:bg-blush-50 hover:text-blush-600"
              >
                {route.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
