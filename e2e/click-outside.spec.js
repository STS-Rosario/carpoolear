const { test, expect } = require('@playwright/test');

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
    // Mock the API calls so we don't need a backend
    await page.route('**/api/app/config', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          module_trip_creation_payment_enabled: false,
          onboarding: [],
        }),
      })
    );

    await page.route('**/api/trips/search*', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          total: 0,
          per_page: 20,
          current_page: 1,
          last_page: 1,
        }),
      })
    );

    // Catch-all for other API calls
    await page.route('**/api/**', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    );
  });

  test('clicking outside autocomplete should not throw TypeError', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Go to trips page which has the search Autocomplete component
    await page.goto('/trips');
    await page.waitForLoadState('networkidle');

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
