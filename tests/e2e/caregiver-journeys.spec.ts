import { expect, test } from '@playwright/test';

test.describe('Caregiver journeys', () => {
  test('log feed entry flow surfaces tracking modules', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'View features' }).click();

    await expect(page.locator('#modules').getByRole('heading', { level: 2, name: /Logging modules/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Feeding & Diaper Logs' })).toBeVisible();
    await expect(page.getByText('Offline-first queue for entries')).toBeVisible();
  });

  test('review dashboard journey highlights analytics', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: /Capture every feed/ })).toBeVisible();
    await page.getByRole('link', { name: 'Explore the stack' }).click();

    await expect(page.locator('#stack').getByRole('heading', { level: 2, name: /Next.js core/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vitest + Playwright' })).toBeVisible();
  });

  test('receive nudge journey confirms guidance section', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Parent Playbook' }).click();

    await expect(page.locator('#playbook').getByRole('heading', { level: 2, name: /Curated playbooks/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contextual Nudges' })).toBeVisible();
    await expect(page.getByText('contextual nudges', { exact: false })).toBeVisible();
  });
});
