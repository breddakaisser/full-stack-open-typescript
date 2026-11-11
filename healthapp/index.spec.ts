import { test, expect } from '@playwright/test';

test('basic system verification check', async ({ page }) => {
await page.goto('https://playwright.dev/', {
waitUntil: 'commit',
timeout: 60000,
});

await expect(page).toHaveTitle(/Playwright/);

}); 
