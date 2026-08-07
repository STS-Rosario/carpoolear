const { expect } = require('@playwright/test');

/**
 * Dismiss splash screen and onboarding overlay through UI interaction.
 *
 * The OnBoarding component has a two-phase init:
 *   1) mount + 600 ms delay → adds "show" class (opacity transition starts)
 *   2) transitionend → sets cardsLength from config → v-for renders actual cards
 */
async function dismissOverlays(page) {
  await page
    .locator('.custom-splash-screen')
    .waitFor({ state: 'hidden', timeout: 5000 })
    .catch(() => {});

  const overlay = page.locator('.on-boarding--overlay');
  try {
    await overlay.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    return;
  }

  await overlay
    .locator('.on-boarding--container')
    .nth(1)
    .waitFor({ state: 'attached', timeout: 10000 })
    .catch(() => {});

  for (let i = 0; i < 10; i += 1) {
    const start = overlay.getByRole('button', { name: /^comenzar$/i });
    if (await start.isVisible().catch(() => false)) {
      await start.click();
      break;
    }
    const next = overlay.getByRole('button', { name: /^siguiente$/i });
    if (!(await next.isVisible().catch(() => false))) {
      break;
    }
    await next.click();
    await page.waitForTimeout(600);
  }

  await overlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
}

async function dismissIdentityPromptIfPresent(page) {
  const later = page.getByRole('button', { name: /más tarde|remind me later/i });
  if (await later.isVisible().catch(() => false)) {
    await later.click();
  }
}

/**
 * Login via the UI and dismiss any overlays that appear afterwards.
 */
async function uiLogin(page, email, password) {
  await page.goto('/login');
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/^contraseña$/i).fill(password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  await dismissOverlays(page);
  await dismissIdentityPromptIfPresent(page);
}

async function selectAutocompleteSuggestion(page, placeholder, query) {
  const input = page.getByPlaceholder(new RegExp(`^${placeholder}$`, 'i')).first();
  await input.click();
  await input.fill('');
  await input.pressSequentially(query, { delay: 40 });
  const suggestion = page
    .getByRole('button', { name: new RegExp(query, 'i') })
    .first();
  await suggestion.waitFor({ state: 'visible', timeout: 15000 });
  await suggestion.click();
}

async function clickWizardNext(page) {
  await page.getByRole('button', { name: /^siguiente$/i }).click();
}

async function pickFutureDate(page) {
  // Vue DatePicker calendar grid is third-party markup.
  await page.getByPlaceholder(/^fecha$/i).click();
  const futureDays = page.locator(
    '.dp__calendar .dp__calendar_item:not(.dp__cell_disabled) .dp__cell_inner'
  );
  await futureDays.first().waitFor({ state: 'visible', timeout: 10000 });
  await futureDays.last().click();
}

async function setAvailableSeats(page, availableSeats) {
  const seatsSection = page
    .getByText(/lugares disponibles|cupos necesarios/i)
    .locator('..');
  const value = seatsSection.locator('.total_seats').first();
  let current = Number(await value.innerText());
  while (current < availableSeats) {
    await seatsSection
      .getByRole('button', { name: /aumentar|increase/i })
      .first()
      .click();
    current = Number(await value.innerText());
  }
  while (current > availableSeats) {
    await seatsSection
      .getByRole('button', { name: /disminuir|decrease/i })
      .first()
      .click();
    current = Number(await value.innerText());
  }
}

/**
 * Drive the multi-step trip creation wizard as a driver.
 * Leaves intermediate stops unchecked so the stops step is skipped.
 */
async function fillDriverTripWizard(
  page,
  {
    originQuery = 'Rosario',
    destinationQuery = 'Mendoza',
    originDetail = 'Plaza 25 de Mayo',
    destinationDetail = 'Terminal de ómnibus',
    time = '14:00',
    description = 'Viaje de prueba e2e',
    availableSeats = 2,
    seatPrice = '0',
  } = {}
) {
  await expect(page.getByTestId('trip-creation-wizard-step-1')).toBeVisible({
    timeout: 10000,
  });
  await page.getByRole('button', { name: /soy conductor/i }).click();
  await clickWizardNext(page);

  await expect(page.getByTestId('trip-creation-wizard-step-2')).toBeVisible();
  await selectAutocompleteSuggestion(page, 'origen', originQuery);
  await page.getByLabel(/punto de partida/i).fill(originDetail);
  await clickWizardNext(page);

  await expect(page.getByTestId('trip-creation-wizard-step-3')).toBeVisible();
  await selectAutocompleteSuggestion(page, 'destino', destinationQuery);
  await page.getByLabel(/punto de llegada/i).fill(destinationDetail);
  await clickWizardNext(page);

  // Stops step is skipped when intermediate stops are not requested.
  await expect(page.getByTestId('trip-creation-wizard-step-5')).toBeVisible({
    timeout: 15000,
  });
  await pickFutureDate(page);
  await page.locator('input[type="time"]').fill(time);
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
  await setAvailableSeats(page, availableSeats);
  const priceField = page.getByLabel(/contribución por persona/i);
  if (await priceField.isVisible().catch(() => false)) {
    await priceField.fill(String(seatPrice));
  }
  await clickWizardNext(page);

  await expect(page.getByTestId('trip-creation-wizard-step-8')).toBeVisible();
  await page
    .getByPlaceholder(/comentario|pasajeros|contanos/i)
    .fill(description);
  await clickWizardNext(page);

  await expect(page.getByTestId('trip-creation-wizard-step-9')).toBeVisible();
  await page.getByLabel(/me comprometo/i).check({ force: true });
  await page.getByRole('button', { name: /crear viaje/i }).click();
}

async function deleteOwnedTripsFromMyTrips(page) {
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
  await page.goto('/my-trips');
  await page.waitForTimeout(2000);

  let cancelBtn = page.getByRole('button', { name: /cancelar viaje/i }).first();
  while (await cancelBtn.isVisible().catch(() => false)) {
    await cancelBtn.click();
    await page.waitForTimeout(2500);
    cancelBtn = page.getByRole('button', { name: /cancelar viaje/i }).first();
  }
}

module.exports = {
  dismissOverlays,
  dismissIdentityPromptIfPresent,
  uiLogin,
  selectAutocompleteSuggestion,
  clickWizardNext,
  pickFutureDate,
  setAvailableSeats,
  fillDriverTripWizard,
  deleteOwnedTripsFromMyTrips,
};
