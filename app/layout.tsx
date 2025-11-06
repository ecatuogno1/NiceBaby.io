import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/footer';
import { NavBar } from '@/components/nav-bar';

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
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
