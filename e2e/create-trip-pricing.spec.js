const { test, expect } = require('@playwright/test');
const {
  uiLogin,
  selectAutocompleteSuggestion,
  clickWizardNext,
  pickFutureDate,
} = require('./helpers');

function expectedSeatPriceCents(totalTripPriceCents, rearMaxTwoPassengers) {
  const occupants = rearMaxTwoPassengers ? 4 : 5;
  return Math.round(totalTripPriceCents / occupants);
}

async function setupRouteMocks(page, mockedTripInfo) {
  await page.route('**/api/trips/autocomplete**', (route) => {
    const url = new URL(route.request().url());
    const name = (url.searchParams.get('name') || '').toLowerCase();
    const results = {
      rosario: [{ id: 1, name: 'Rosario, Santa Fe', lat: -32.9468, lng: -60.6393, type: 'city', state: 'Santa Fe', country: 'ARG' }],
      buenos: [{ id: 2, name: 'Buenos Aires, Buenos Aires', lat: -34.6075682, lng: -58.4370894, type: 'city', state: 'Buenos Aires', country: 'ARG' }],
    };
    const match = Object.keys(results).find((key) => name.includes(key));
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ nodes_geos: match ? results[match] : [] }),
    });
  });

  await page.route('**/api/trips/trip-info', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: true,
        data: mockedTripInfo,
      }),
    });
  });

  // Ensure pricing validation is enabled in UI regardless of backend defaults.
  await page.route('**/api/login', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    if (json.config) {
      json.config.module_seat_price_enabled = true;
      json.config.module_max_price_enabled = true;
      json.config.identity_validation_enabled = false;
      json.config.identity_validation_optional = false;
      json.config.identity_validation_required_new_users = false;
      json.config.identity_validation_days_for_current_users = 0;
    }
    if (json.data && typeof json.data === 'object') {
      if (json.data.user && typeof json.data.user === 'object') {
        json.data.user.identity_validated = true;
        json.data.user.identity_validation_type = 'mercado_pago';
      }
      if ('identity_validated' in json.data) {
        json.data.identity_validated = true;
      }
    }
    await route.fulfill({ response, json });
  });
  await page.route('**/api/config', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    if (json.config) {
      json.config.module_seat_price_enabled = true;
      json.config.module_max_price_enabled = true;
      json.config.identity_validation_enabled = false;
      json.config.identity_validation_optional = false;
      json.config.identity_validation_required_new_users = false;
      json.config.identity_validation_days_for_current_users = 0;
    } else {
      json.module_seat_price_enabled = true;
      json.module_max_price_enabled = true;
      json.identity_validation_enabled = false;
      json.identity_validation_optional = false;
      json.identity_validation_required_new_users = false;
      json.identity_validation_days_for_current_users = 0;
    }
    await route.fulfill({ response, json });
  });
}

async function goToSeatsStep(page) {
  await page.getByRole('link', { name: /crear viaje/i }).click();
  await expect(page).toHaveURL(/\/trips\/create/);

  await page.getByRole('button', { name: /soy conductor/i }).click();
  await clickWizardNext(page);

  await selectAutocompleteSuggestion(page, 'origen', 'Rosario');
  await page.getByLabel(/punto de partida/i).fill('Plaza 25 de Mayo');
  await clickWizardNext(page);

  await selectAutocompleteSuggestion(page, 'destino', 'Buenos');
  await page.getByLabel(/punto de llegada/i).fill('Obelisco');
  await clickWizardNext(page);

  await expect(page.getByTestId('trip-creation-wizard-step-5')).toBeVisible({
    timeout: 15000,
  });
  await pickFutureDate(page);
  await page.locator('input[type="time"]').fill('14:00');
  await clickWizardNext(page);

  if (await page.getByTestId('trip-creation-wizard-step-6').isVisible().catch(() => false)) {
    const carSelect = page.getByLabel(/seleccionar auto/i);
    if (await carSelect.isVisible().catch(() => false)) {
      const options = await carSelect.locator('option').allTextContents();
      const selectable = options.findIndex((text, index) => index > 0 && text.trim());
      if (selectable > 0) {
        await carSelect.selectOption({ index: selectable });
      }
    }
    await clickWizardNext(page);
  }

  await expect(page.getByTestId('trip-creation-wizard-step-7')).toBeVisible({
    timeout: 10000,
  });
}

test.describe('Trip creation recommended contribution', () => {
  test.setTimeout(120000);

  test('recalculates max contribution with comfort preference divisor', async ({ page }) => {
    const mockedTripInfo = {
      distance: 291088.8,
      duration: 11805.6,
      co2: 43663.32,
      route_needs_payment: true,
      maximum_trip_price_cents: 7297139,
      recommended_trip_price_cents: 6345351,
    };

    await setupRouteMocks(page, mockedTripInfo);
    await uiLogin(page, 'user0@g.com', '123456');
    await goToSeatsStep(page);

    const priceField = page.getByLabel(/contribución por persona/i);
    await expect(priceField).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByLabel(/atrás viajan|atras viajan|only 2 people in the back/i)
    ).toBeVisible();

    const defaultMaxUnits = Math.round(
      expectedSeatPriceCents(mockedTripInfo.maximum_trip_price_cents, false) / 100
    );
    const comfortMaxUnits = Math.round(
      expectedSeatPriceCents(mockedTripInfo.maximum_trip_price_cents, true) / 100
    );
    // Price between the two caps: over default (÷5), under comfort (÷4).
    const midPrice = Math.round((defaultMaxUnits + comfortMaxUnits) / 2);

    await priceField.fill(String(midPrice));
    await expect(
      page.getByText(/excede|máximo|maximum/i).first()
    ).toBeVisible({ timeout: 10000 });

    await page
      .getByLabel(/atrás viajan|atras viajan|only 2 people in the back/i)
      .check();

    await expect.poll(async () => {
      return page
        .getByText(/excede|máximo|maximum/i)
        .first()
        .isVisible()
        .catch(() => false);
    }).toBe(false);

    // Changing available seats must not change the comfort-based max divisor.
    await page.getByRole('button', { name: /aumentar|increase/i }).first().click();
    await priceField.fill(String(midPrice));
    await expect(page.getByText(/excede|máximo|maximum/i)).toHaveCount(0);
  });
});
