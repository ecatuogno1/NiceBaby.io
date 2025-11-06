import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/footer';
import { NavBar } from '@/components/nav-bar';
import { AuthSessionProvider } from '@/components/providers/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NiceBaby.io | Newborn Companion',
  description:
    'Self-hosted newborn companion for tracking feeds, diapers, sleep, health milestones, and curated parenting guidance.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col`}
      >
        <AuthSessionProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
        </AuthSessionProvider>
        <Footer />
      </body>
    </html>
  );
}
