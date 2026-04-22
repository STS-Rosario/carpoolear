const { test, expect } = require('@playwright/test');
const { uiLogin } = require('./helpers');

function expectedSeatPriceCents(totalTripPriceCents, availableSeats) {
  return Math.round(totalTripPriceCents / (availableSeats + 1));
}

function parseCurrencyTextToUnits(text) {
  const numberPart = (text.match(/([0-9][0-9.,\s]*)/) || [])[1];
  if (!numberPart) {
    return null;
  }

  const compact = numberPart.replace(/\s/g, '');
  const lastComma = compact.lastIndexOf(',');
  const lastDot = compact.lastIndexOf('.');
  const hasComma = lastComma >= 0;
  const hasDot = lastDot >= 0;

  let normalized = compact;
  if (hasComma && hasDot) {
    const decimalIndex = Math.max(lastComma, lastDot);
    const integer = compact.slice(0, decimalIndex).replace(/[.,]/g, '');
    const decimals = compact.slice(decimalIndex + 1).replace(/[.,]/g, '');
    normalized = `${integer}.${decimals}`;
  } else if (hasComma) {
    const parts = compact.split(',');
    normalized = parts.length > 1 && parts[parts.length - 1].length === 3
      ? parts.join('')
      : `${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`;
  } else if (hasDot) {
    const parts = compact.split('.');
    normalized = parts.length > 1 && parts[parts.length - 1].length === 3
      ? parts.join('')
      : `${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`;
  } else {
    normalized = compact;
  }

  return Math.round(Number(normalized));
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

  // Ensure pricing cards are enabled in UI regardless of backend defaults.
  await page.route('**/api/login', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    if (json.config) {
      json.config.module_seat_price_enabled = true;
      json.config.module_max_price_enabled = true;
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
      json.config.identity_validation_required_new_users = false;
      json.config.identity_validation_days_for_current_users = 0;
    } else {
      json.module_seat_price_enabled = true;
      json.module_max_price_enabled = true;
      json.identity_validation_required_new_users = false;
      json.identity_validation_days_for_current_users = 0;
    }
    await route.fulfill({ response, json });
  });
}

test.describe('Trip creation recommended contribution', () => {
  test.setTimeout(120000);

  test('recalculates Contribución promedio with seats + driver divisor', async ({ page }) => {
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
    const identityModalLaterButton = page.locator('.identity-validation-prompt-btn-later').first();
    if (await identityModalLaterButton.isVisible().catch(() => false)) {
      await identityModalLaterButton.click();
    }

    await page.getByRole('link', { name: /crear viaje/i }).click();
    await expect(page).toHaveURL(/\/trips\/create/);

    await page.click('label[for="type-driver"]');

    const originInput = page.locator('.trip_point').first().locator('.osm-autocomplete input');
    await originInput.click();
    await originInput.pressSequentially('Rosario', { delay: 30 });
    await page.locator('.trip_point').first().locator('.osm-autocomplete-results button').first().click();

    const destinationInput = page.locator('.trip_point').last().locator('.osm-autocomplete input');
    await destinationInput.click();
    await destinationInput.pressSequentially('Buenos', { delay: 30 });
    await page.locator('.trip_point').last().locator('.osm-autocomplete-results button').first().click();

    await expect(page.locator('.trip-contribucion-recomendada-card__main strong').first()).toBeVisible({ timeout: 15000 });

    // Seats = 2 => divide by (2 + 1)
    await page.click('label[for="seats-two"]');
    const seatsTwoExpectedUnits = Math.round(expectedSeatPriceCents(mockedTripInfo.recommended_trip_price_cents, 2) / 100);
    const seatsTwoText = await page.locator('.trip-contribucion-recomendada-card__main strong').first().innerText();
    expect(parseCurrencyTextToUnits(seatsTwoText)).toBe(seatsTwoExpectedUnits);

    // Seats = 4 => divide by (4 + 1)
    await page.click('label[for="seats-four"]');
    const seatsFourExpectedUnits = Math.round(expectedSeatPriceCents(mockedTripInfo.recommended_trip_price_cents, 4) / 100);
    await expect.poll(async () => {
      const text = await page.locator('.trip-contribucion-recomendada-card__main strong').first().innerText();
      return parseCurrencyTextToUnits(text);
    }).toBe(seatsFourExpectedUnits);
  });
});
