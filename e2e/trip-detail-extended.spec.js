import { test, expect } from '@playwright/test';
import {
    login, setupAutocompleteMocks, setupConfigOverride, waitForSplash,
    loginViaAPI, createTripViaAPI, deleteTripViaAPI,
    requestSeatViaAPI, acceptPassengerViaAPI,
} from './helpers.js';

test.describe('Trip Detail Extended (user8 + user9)', () => {
    let driverToken, passengerToken, tripId, user9Id;

    test.afterEach(async ({ page }) => {
        if (tripId && driverToken) {
            await deleteTripViaAPI(page, tripId, driverToken);
            tripId = null;
        }
    });

    test('trip detail shows driver info and name', async ({ page, browser }) => {
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const driver = await loginViaAPI(page, 'user8@g.com', '123456');
        driverToken = driver.token;
        const trip = await createTripViaAPI(page, driverToken, { description: 'Driver info test' });
        tripId = trip.id;

        // View as non-owner in a new context
        const ctx = await browser.newContext();
        const otherPage = await ctx.newPage();
        await setupConfigOverride(otherPage);
        await login(otherPage, 'user9@g.com', '123456');
        await otherPage.goto(`/trips/${tripId}`);
        await waitForSplash(otherPage);
        await otherPage.waitForTimeout(2000);

        // Driver name should be visible - actual class is .trip_driver_name
        const driverInfo = otherPage.locator('.trip_driver_name, .trip_driver_details, .driver-data').first();
        await expect(driverInfo).toBeVisible({ timeout: 15000 });
        await ctx.close();
    });

    test('trip detail shows available seats count', async ({ page }) => {
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const driver = await loginViaAPI(page, 'user8@g.com', '123456');
        driverToken = driver.token;
        const trip = await createTripViaAPI(page, driverToken, { total_seats: 3, description: 'Seats test' });
        tripId = trip.id;

        await login(page, 'user8@g.com', '123456');
        await page.goto(`/trips/${tripId}`);
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        const seatsEl = page.locator('.trip_seats-available_value, .seats-available').first();
        await expect(seatsEl).toBeVisible({ timeout: 15000 });
        await expect(seatsEl).toContainText('3');
    });

    test('trip detail shows description text', async ({ page }) => {
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const driver = await loginViaAPI(page, 'user8@g.com', '123456');
        driverToken = driver.token;
        const trip = await createTripViaAPI(page, driverToken, { description: 'Texto descripcion unico e2e' });
        tripId = trip.id;

        await login(page, 'user8@g.com', '123456');
        await page.goto(`/trips/${tripId}`);
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        await expect(page.getByText('Texto descripcion unico e2e')).toBeVisible({ timeout: 15000 });
    });

    test('trip shows Viaje Carpooleado when full', async ({ page }) => {
        test.setTimeout(90000);
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const driver = await loginViaAPI(page, 'user8@g.com', '123456');
        driverToken = driver.token;
        const passenger = await loginViaAPI(page, 'user9@g.com', '123456');
        passengerToken = passenger.token;
        user9Id = passenger.userId;

        const trip = await createTripViaAPI(page, driverToken, { total_seats: 1, description: 'Full trip test' });
        tripId = trip.id;

        // Fill the single seat
        await requestSeatViaAPI(page, passengerToken, tripId);
        await acceptPassengerViaAPI(page, driverToken, tripId, user9Id);

        // Login as a different user (not owner, not passenger) to view
        await login(page, 'user8@g.com', '123456');
        await page.goto(`/trips/${tripId}`);
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        // When trip is full, shows "Viaje Carpooleado" text or .carpooled-trip class
        // Note: carpooled-trip only shows for non-passengers when seats_available === 0
        const fullIndicator = page.locator('.carpooled-trip').first();
        const fullText = page.getByText(/carpooleado/i).first();
        const hasClass = await fullIndicator.isVisible({ timeout: 10000 }).catch(() => false);
        const hasText = await fullText.isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasClass || hasText).toBeTruthy();
    });
});
