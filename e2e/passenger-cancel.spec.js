import { test, expect } from '@playwright/test';
import {
    login, setupAutocompleteMocks, setupConfigOverride, waitForSplash,
    loginViaAPI, createTripViaAPI, deleteTripViaAPI,
    requestSeatViaAPI, acceptPassengerViaAPI, cancelPassengerViaAPI,
} from './helpers.js';

test.describe('Passenger Cancel (user8 driver + user9 passenger)', () => {
    let driverToken, passengerToken, user9Id;

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const driver = await loginViaAPI(page, 'user8@g.com', '123456');
        driverToken = driver.token;
        const passenger = await loginViaAPI(page, 'user9@g.com', '123456');
        passengerToken = passenger.token;
        user9Id = passenger.userId;
        await ctx.close();
    });

    test('passenger can cancel pending request', async ({ page, browser }) => {
        test.setTimeout(90000);
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const trip = await createTripViaAPI(page, driverToken, { description: 'Cancel pending test' });
        const tripId = trip.id;

        try {
            // Passenger requests seat via API
            const reqResult = await requestSeatViaAPI(page, passengerToken, tripId);
            console.log('requestSeat result:', JSON.stringify(reqResult).substring(0, 200));

            // Login as passenger in a new context to view trip
            const ctx = await browser.newContext();
            const passengerPage = await ctx.newPage();
            await setupConfigOverride(passengerPage);
            await login(passengerPage, 'user9@g.com', '123456');
            await passengerPage.goto(`/trips/${tripId}`);
            await waitForSplash(passengerPage);
            await passengerPage.waitForTimeout(2000);

            // Handle the window.confirm() dialog that cancelRequest triggers
            passengerPage.on('dialog', async (dialog) => {
                await dialog.accept();
            });

            // Click "Solicitado" / withdraw button
            const withdrawBtn = passengerPage.locator('button').filter({ hasText: /Solicitado/i }).first();
            await expect(withdrawBtn).toBeVisible({ timeout: 15000 });
            await withdrawBtn.click();
            await passengerPage.waitForTimeout(3000);

            // Reload the page to get fresh state (the store's cancel has a bug
            // where tripsStore isn't passed, so client-side state doesn't update)
            await passengerPage.reload();
            await waitForSplash(passengerPage);
            await passengerPage.waitForTimeout(2000);

            // "Solicitar Asiento" should be visible after reload
            const requestBtn = passengerPage.locator('button').filter({ hasText: /Solicitar Asiento/i }).first();
            await expect(requestBtn).toBeVisible({ timeout: 15000 });
            await ctx.close();
        } finally {
            await deleteTripViaAPI(page, tripId, driverToken);
        }
    });

    test('accepted passenger can leave trip', async ({ page, browser }) => {
        test.setTimeout(90000);
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const trip = await createTripViaAPI(page, driverToken, { total_seats: 2, description: 'Leave trip test' });
        const tripId = trip.id;

        try {
            // Request and accept passenger via API
            const reqResult = await requestSeatViaAPI(page, passengerToken, tripId);
            console.log('requestSeat result:', JSON.stringify(reqResult).substring(0, 200));
            const accResult = await acceptPassengerViaAPI(page, driverToken, tripId, user9Id);
            console.log('acceptPassenger result:', JSON.stringify(accResult).substring(0, 200));

            // Login as passenger in a new context
            const ctx = await browser.newContext();
            const passengerPage = await ctx.newPage();
            await setupConfigOverride(passengerPage);
            await login(passengerPage, 'user9@g.com', '123456');
            await passengerPage.goto(`/trips/${tripId}`);
            await waitForSplash(passengerPage);
            await passengerPage.waitForTimeout(2000);

            // Handle the window.confirm() dialog
            passengerPage.on('dialog', async (dialog) => {
                await dialog.accept();
            });

            // Click "Bajarme del Viaje" button
            const leaveBtn = passengerPage.locator('button').filter({ hasText: /Bajarme del Viaje/i }).first();
            await expect(leaveBtn).toBeVisible({ timeout: 15000 });
            await leaveBtn.click();
            await passengerPage.waitForTimeout(3000);

            // Reload the page to get fresh state from API
            await passengerPage.reload();
            await waitForSplash(passengerPage);
            await passengerPage.waitForTimeout(2000);

            // "Solicitar Asiento" should be visible after reload
            const requestBtn = passengerPage.locator('button').filter({ hasText: /Solicitar Asiento/i }).first();
            await expect(requestBtn).toBeVisible({ timeout: 15000 });
            await ctx.close();
        } finally {
            await deleteTripViaAPI(page, tripId, driverToken);
        }
    });

    test('seat count restores after passenger cancels', async ({ page }) => {
        test.setTimeout(90000);
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const trip = await createTripViaAPI(page, driverToken, { total_seats: 2, description: 'Seat restore test' });
        const tripId = trip.id;

        try {
            // Accept passenger via API and verify
            const reqResult = await requestSeatViaAPI(page, passengerToken, tripId);
            console.log('requestSeat result:', JSON.stringify(reqResult).substring(0, 200));
            const accResult = await acceptPassengerViaAPI(page, driverToken, tripId, user9Id);
            console.log('acceptPassenger result:', JSON.stringify(accResult).substring(0, 200));

            // View as owner to check seat count
            await login(page, 'user8@g.com', '123456');
            await page.goto(`/trips/${tripId}`);
            await waitForSplash(page);
            await page.waitForTimeout(3000);

            const seatsEl = page.locator('.trip_seats-available_value, .seats-available').first();
            await expect(seatsEl).toBeVisible({ timeout: 15000 });
            const seatsText = await seatsEl.textContent();
            console.log('Seats available after accept:', seatsText);

            // Cancel the passenger via API
            await cancelPassengerViaAPI(page, driverToken, tripId, user9Id);

            // Reload and verify seats restored
            await page.reload();
            await waitForSplash(page);
            await page.waitForTimeout(3000);
            const seatsAfter = await seatsEl.textContent();
            console.log('Seats available after cancel:', seatsAfter);

            // After cancel, seats should be back to 2
            await expect(seatsEl).toContainText('2', { timeout: 15000 });
        } finally {
            await deleteTripViaAPI(page, tripId, driverToken);
        }
    });
});
