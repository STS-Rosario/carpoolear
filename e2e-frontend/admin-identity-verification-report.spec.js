const { test, expect } = require('@playwright/test');
const {
  MOCK_IDENTITY_STATS_ADMIN_USER,
  MOCK_IDENTITY_VERIFICATION_REPORT,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
} = require('./shared/mocks');

const REPORT_URL = '**/api/admin/identity-verification-report**';

/**
 * Mock the report endpoint and keep the query params of every request,
 * so tests can assert how filters are sent to the backend.
 */
async function mockReport(page, body = MOCK_IDENTITY_VERIFICATION_REPORT) {
  const requests = [];
  await page.route(REPORT_URL, (route) => {
    const url = new URL(route.request().url());
    requests.push(Object.fromEntries(url.searchParams.entries()));
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
  return requests;
}

test.describe('Admin identity verification report', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-15T12:00:00Z'));
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page, MOCK_IDENTITY_STATS_ADMIN_USER);
  });

  test('admin opens the report from the nav, sees totals and refetches when a filter changes', async ({ page }) => {
    const requests = await mockReport(page);

    await page.goto('/admin');
    await waitForPageReady(page);
    await page.locator('.admin-nav-list').getByRole('link', { name: 'Reporte de verificaciones' }).click();

    await expect(page).toHaveURL(/\/admin\/identity-verification-report/);
    await expect(page.getByTestId('ivr-total-attempts')).toContainText('150');
    await expect(page.getByTestId('ivr-manual-table').locator('[data-outcome="approved"]')).toContainText('13');
    await expect(page.getByTestId('ivr-manual-table').locator('[data-outcome="approved"]')).toContainText('43,33');
    await expect(page.getByTestId('ivr-automatic-table').locator('[data-outcome="abandoned"]')).toContainText('10');
    await expect(page.getByTestId('ivr-series-table')).toContainText('2026-09');
    await expect(page.getByTestId('ivr-funnel')).toContainText('21');
    await expect(page.getByTestId('ivr-data-availability-note')).toContainText('17/09/2026');

    expect(requests[0]).toMatchObject({
      from: '2026-05-01',
      to: '2026-10-15',
      group_by: 'month',
      method: 'all',
    });

    await page.getByLabel('Método').selectOption('mercado_pago');

    await expect.poll(() => requests.length).toBe(2);
    expect(requests[1]).toMatchObject({ method: 'mercado_pago', group_by: 'month' });
    await expect(page).toHaveURL(/method=mercado_pago/);

    await page.getByLabel('Agrupar por').selectOption('week');

    await expect.poll(() => requests.length).toBe(3);
    expect(requests[2]).toMatchObject({ method: 'mercado_pago', group_by: 'week' });
    await expect(page).toHaveURL(/group_by=week/);
  });

  test('restores filters from the URL query and sends them to the API', async ({ page }) => {
    const requests = await mockReport(page);

    await page.goto(
      '/admin/identity-verification-report?from=2026-09-17&to=2026-09-30&group_by=day&method=manual&platform=android&app_version=4.0.19'
    );
    await waitForPageReady(page);

    await expect(page.getByTestId('ivr-total-attempts')).toContainText('150');
    expect(requests[0]).toEqual({
      from: '2026-09-17',
      to: '2026-09-30',
      group_by: 'day',
      method: 'manual',
      platform: 'android',
      app_version: '4.0.19',
    });
    await expect(page.getByLabel('Agrupar por')).toHaveValue('day');
    await expect(page.getByLabel('Método')).toHaveValue('manual');
  });

  test('shows an error state with retry when the API fails', async ({ page }) => {
    let calls = 0;
    await page.route(REPORT_URL, (route) => {
      calls += 1;
      if (calls === 1) {
        route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
        return;
      }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_IDENTITY_VERIFICATION_REPORT),
      });
    });

    await page.goto('/admin/identity-verification-report');
    await waitForPageReady(page);

    await expect(page.getByTestId('ivr-error')).toBeVisible();
    await page.getByTestId('ivr-error').getByRole('button').click();
    await expect(page.getByTestId('ivr-total-attempts')).toContainText('150');
  });
});
