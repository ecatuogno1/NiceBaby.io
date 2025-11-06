import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PlaybookDashboard } from '@/components/playbook/playbook-dashboard';
import type { PlaybookArticleSummary } from '@/components/playbook/types';

const fallbackUserId = 'demo-user';

const buildArticleSummaries = (
  articles: Awaited<ReturnType<typeof prisma.playbookArticle.findMany>>,
  savedIds: Set<string>
): PlaybookArticleSummary[] =>
  articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    babyAgeMin: article.babyAgeMin,
    babyAgeMax: article.babyAgeMax,
    tags: article.tags.map((tag) => tag.tag.slug),
    saved: savedIds.has(article.id)
  }));

export default async function PlaybookPage({
  searchParams
}: {
  searchParams?: { userId?: string };
}) {
  const userId = searchParams?.userId ?? fallbackUserId;

  const preference = await prisma.userPreference.findUnique({
    where: { userId },
    include: {
      savedArticles: true
    }
  });

  if (!preference) {
    notFound();
  }

  const articles = await prisma.playbookArticle.findMany({
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  });

  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  const savedIds = new Set(preference.savedArticles.map((item) => item.articleId));
  const summaries = buildArticleSummaries(articles, savedIds);
  const tagNames = tags.map((tag) => tag.slug);

  return (
    <main className="mx-auto max-w-5xl space-y-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Playbook</p>
        <h1 className="text-3xl font-bold text-slate-900">Personalized guidance</h1>
        <p className="text-sm text-slate-600">
          Smart filters and saved items tailor the playbook to your baby&apos;s age and the goals you
          care about most.
        </p>
      </header>
      <PlaybookDashboard
        userId={userId}
        articles={summaries}
        tags={tagNames}
        babyAgeMonths={preference.babyAgeMonths}
        optIns={{
          optInEmail: preference.optInEmail,
          optInPush: preference.optInPush,
          optInMatrix: preference.optInMatrix
        }}
      />
    </main>
  );
}
