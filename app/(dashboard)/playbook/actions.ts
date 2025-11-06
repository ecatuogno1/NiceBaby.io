'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type OptInPayload = {
  optInEmail?: boolean;
  optInPush?: boolean;
  optInMatrix?: boolean;
};

export const updateDeliveryOptIns = async (userId: string, payload: OptInPayload) => {
  await prisma.userPreference.update({
    where: { userId },
    data: payload
  });
  revalidatePath('/playbook');
};

export const toggleSavedArticle = async (userId: string, articleSlug: string) => {
  const preference = await prisma.userPreference.findUnique({
    where: { userId }
  });

  if (!preference) return;

  const article = await prisma.playbookArticle.findUnique({
    where: { slug: articleSlug }
  });

  if (!article) return;

  const existing = await prisma.savedArticle.findUnique({
    where: {
      preferenceId_articleId: {
        preferenceId: preference.id,
        articleId: article.id
      }
    }
  });

  if (existing) {
    await prisma.savedArticle.delete({ where: { id: existing.id } });
  } else {
    await prisma.savedArticle.create({
      data: {
        preferenceId: preference.id,
        articleId: article.id
      }
    });
  }

  revalidatePath('/playbook');
};
