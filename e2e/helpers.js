const { expect } = require('@playwright/test');

/**
 * Dismiss splash screen and onboarding overlay through UI interaction.
 *
 * The OnBoarding component has a two-phase init:
 *   1) mount + 600 ms delay → adds "show" class (opacity transition starts)
 *   2) transitionend → sets cardsLength from config → v-for renders actual cards
 */
async function dismissOverlays(page) {
  // Wait for splash screen to disappear
  await page.locator('.custom-splash-screen').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

  // Dismiss onboarding overlay if it appears (has a 600ms mount delay before showing)
  const overlay = page.locator('.on-boarding--overlay');
  try {
    await overlay.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    return; // Overlay didn't appear within timeout
  }

  // Wait for the carousel cards to render (second phase of init)
  await overlay.locator('.on-boarding--container').nth(1).waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});

  // Click through all "siguiente" buttons (one per card except the last)
  const nextBtns = overlay.locator('.btn-primary');
  const clickCount = await nextBtns.count();
  for (let i = 0; i < clickCount; i++) {
    await nextBtns.first().dispatchEvent('click');
    await page.waitForTimeout(600);
  }

  // Click "comenzar" on the last card
  await overlay.locator('.btn-success').first().dispatchEvent('click');

  // Wait for overlay to disappear
  await overlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
}

/**
 * Login via the UI and dismiss any overlays that appear afterwards.
 */
async function uiLogin(page, email, password) {
  await page.goto('/login');
  await page.fill('#txt_user', email);
  await page.fill('#txt_password', password);
  await page.click('#btn_login');
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  await dismissOverlays(page);
}

module.exports = { dismissOverlays, uiLogin };
