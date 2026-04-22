const { test, expect } = require('@playwright/test');
const {
  setupCatchAllMock,
  setupCommonMocks,
  waitForPageReady,
} = require('./shared/mocks');

/**
 * Test to reproduce the clickOutside directive error in Vue 3 compat mode.
 *
 * The v-clickoutside directive uses `vnode.context[binding.expression]` which
 * was removed in Vue 3. This causes:
 *   "Uncaught TypeError: n.context[t.expression] is not a function"
 *
 * The Autocomplete component (used in search and create-trip pages) registers
 * this directive, and any click outside the component triggers the error.
 */
test.describe('clickOutside directive', () => {
  test.beforeEach(async ({ page }) => {
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
  });

  test('clicking outside autocomplete should not throw TypeError', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Go to trips page which has the search Autocomplete component
    await page.goto('/trips');
    await waitForPageReady(page);

    // Remove webpack dev server overlay that intercepts pointer events
    await page.evaluate(() => {
      const iframe = document.getElementById('webpack-dev-server-client-overlay');
      if (iframe) iframe.remove();
    });

    // Click on the autocomplete input to focus it
    const autocompleteInput = page.locator('.osm-autocomplete input').first();
    await autocompleteInput.waitFor({ state: 'visible', timeout: 10000 });
    await autocompleteInput.click();

    // Click outside the autocomplete (e.g. on the page header) to trigger v-clickoutside
    await page.locator('.header').first().click();

    // Check for the clickOutside TypeError
    const clickOutsideErrors = errors.filter(msg =>
      msg.includes('is not a function') && msg.includes('context')
    );

    expect(clickOutsideErrors).toEqual([]);
  });
});
