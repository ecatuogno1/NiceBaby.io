import { prisma } from '../lib/prisma';
import { loadAllPlaybookContent, syncContentToDatabase } from '../lib/playbook/content';

const seedPreferences = async () => {
  const demoPreference = await prisma.userPreference.upsert({
    where: { userId: 'demo-user' },
    update: {
      babyAgeMonths: 4,
      sleepGoal: 10,
      hydrationGoal: 6,
      optInEmail: true,
      optInPush: true,
      optInMatrix: true,
      quietHours: '21:00-07:00'
    },
    create: {
      userId: 'demo-user',
      babyAgeMonths: 4,
      sleepGoal: 10,
      hydrationGoal: 6,
      optInEmail: true,
      optInPush: true,
      optInMatrix: true,
      quietHours: '21:00-07:00'
    }
  });

  const partnerPreference = await prisma.userPreference.upsert({
    where: { userId: 'partner-user' },
    update: {
      babyAgeMonths: 4,
      optInEmail: false,
      optInPush: true,
      optInMatrix: false
    },
    create: {
      userId: 'partner-user',
      babyAgeMonths: 4,
      optInEmail: false,
      optInPush: true,
      optInMatrix: false
    }
  });

  return [demoPreference, partnerPreference];
};

const seedSavedArticles = async () => {
  const preference = await prisma.userPreference.findUnique({
    where: { userId: 'demo-user' }
  });

  if (!preference) return;

  const articles = await prisma.playbookArticle.findMany({
    where: { slug: { in: ['sleep-routine-blueprint', 'postpartum-reset-checklist'] } }
  });

  for (const article of articles) {
    await prisma.savedArticle.upsert({
      where: {
        preferenceId_articleId: {
          preferenceId: preference.id,
          articleId: article.id
        }
      },
      update: {},
      create: {
        preferenceId: preference.id,
        articleId: article.id
      }
    });
  }
};

export const seedPlaybook = async () => {
  const content = await loadAllPlaybookContent();
  console.log(`Loaded ${content.length} playbook entries from disk.`);
  await syncContentToDatabase();
  await seedPreferences();
  await seedSavedArticles();
  console.log('Seed data synced.');
};

const main = async () => {
  await seedPlaybook();
};

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
