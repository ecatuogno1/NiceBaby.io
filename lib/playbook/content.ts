import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { prisma } from '@/lib/prisma';

export type PlaybookFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  babyAgeMin?: number;
  babyAgeMax?: number;
  publishedAt?: string;
};

export type PlaybookContent = PlaybookFrontmatter & {
  body: string;
};

const PLAYBOOK_DIR = path.join(process.cwd(), 'content', 'playbook');

export const readPlaybookDirectory = async () => {
  const filenames = await fs.readdir(PLAYBOOK_DIR);
  return filenames
    .filter((filename) => filename.endsWith('.mdx') || filename.endsWith('.md'))
    .map((filename) => path.join(PLAYBOOK_DIR, filename));
};

export const loadPlaybookFile = async (filepath: string): Promise<PlaybookContent> => {
  const file = await fs.readFile(filepath, 'utf-8');
  const { data, content } = matter(file);

  return {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    tags: data.tags ?? [],
    babyAgeMin: data.babyAgeMin,
    babyAgeMax: data.babyAgeMax,
    publishedAt: data.publishedAt,
    body: content.trim()
  };
};

export const loadAllPlaybookContent = async (): Promise<PlaybookContent[]> => {
  const files = await readPlaybookDirectory();
  const contents = await Promise.all(files.map((file) => loadPlaybookFile(file)));
  return contents.sort((a, b) => a.title.localeCompare(b.title));
};

export const syncContentToDatabase = async () => {
  const entries = await loadAllPlaybookContent();

  for (const entry of entries) {
    const publishedAt = entry.publishedAt ? new Date(entry.publishedAt) : new Date();
    const article = await prisma.playbookArticle.upsert({
      where: { slug: entry.slug },
      update: {
        title: entry.title,
        summary: entry.summary,
        content: entry.body,
        babyAgeMin: entry.babyAgeMin ?? null,
        babyAgeMax: entry.babyAgeMax ?? null,
        publishedAt
      },
      create: {
        slug: entry.slug,
        title: entry.title,
        summary: entry.summary,
        content: entry.body,
        babyAgeMin: entry.babyAgeMin ?? null,
        babyAgeMax: entry.babyAgeMax ?? null,
        publishedAt
      }
    });

    if (entry.tags?.length) {
      for (const tagSlug of entry.tags) {
        const titleCase = tagSlug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name: titleCase },
          create: { slug: tagSlug, name: titleCase }
        });

        await prisma.articleTag.upsert({
          where: {
            articleId_tagId: {
              articleId: article.id,
              tagId: tag.id
            }
          },
          update: {},
          create: {
            articleId: article.id,
            tagId: tag.id
          }
        });
      }
    }
  }
};
