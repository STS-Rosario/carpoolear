import { test, expect } from '@playwright/test';
import {
    login, setupAutocompleteMocks, setupConfigOverride, waitForSplash,
    loginViaAPI, createTripViaAPI, deleteTripViaAPI,
    requestSeatViaAPI, setUserPropertyViaAPI,
} from './helpers.js';

test.describe('Auto-Accept (user6 driver + user7 passenger)', () => {
    let driverToken, passengerToken;

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const driver = await loginViaAPI(page, 'user6@g.com', '123456');
        driverToken = driver.token;
        const passenger = await loginViaAPI(page, 'user7@g.com', '123456');
        passengerToken = passenger.token;
        await ctx.close();
    });

    test.afterAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        await setUserPropertyViaAPI(page, driverToken, 'autoaccept_requests', 0);
        await ctx.close();
    });

    test('request button shows Reservar when driver has auto-accept', async ({ page, browser }) => {
        test.setTimeout(90000);
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);

        // Enable auto-accept for driver
        const propResult = await setUserPropertyViaAPI(page, driverToken, 'autoaccept_requests', 1);
        console.log('setProperty result:', JSON.stringify(propResult).substring(0, 200));

        const trip = await createTripViaAPI(page, driverToken, { description: 'Auto-accept test' });
        const tripId = trip.id;

        try {
            // Login as passenger in a new context to view trip
            const ctx = await browser.newContext();
            const passengerPage = await ctx.newPage();
            await setupConfigOverride(passengerPage);
            await login(passengerPage, 'user7@g.com', '123456');
            await passengerPage.goto(`/trips/${tripId}`);
            await waitForSplash(passengerPage);
            await passengerPage.waitForTimeout(2000);

            // Should show "Reservar" instead of "Solicitar Asiento"
            const reserveBtn = passengerPage.locator('button').filter({ hasText: /Reservar/i }).first();
            await expect(reserveBtn).toBeVisible({ timeout: 15000 });
            await ctx.close();
        } finally {
            await deleteTripViaAPI(page, tripId, driverToken);
            await setUserPropertyViaAPI(page, driverToken, 'autoaccept_requests', 0);
        }
    });

    test('auto-accept immediately accepts passenger', async ({ page, browser }) => {
        test.setTimeout(90000);
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);

        // Enable auto-accept for driver
        await setUserPropertyViaAPI(page, driverToken, 'autoaccept_requests', 1);

        const trip = await createTripViaAPI(page, driverToken, { description: 'Auto-accept immediate test' });
        const tripId = trip.id;

        try {
            // Request seat via API — auto-accept will immediately accept (request_state: 1)
            const reqResult = await requestSeatViaAPI(page, passengerToken, tripId);
            console.log('requestSeat (auto-accept) result:', JSON.stringify(reqResult).substring(0, 200));

            // Login as passenger in a new context and view the trip
            const ctx = await browser.newContext();
            const passengerPage = await ctx.newPage();
            await setupConfigOverride(passengerPage);
            await login(passengerPage, 'user7@g.com', '123456');
            await passengerPage.goto(`/trips/${tripId}`);
            await waitForSplash(passengerPage);
            await passengerPage.waitForTimeout(2000);

            // Should show "Bajarme del Viaje" (accepted state, not pending)
            const leaveBtn = passengerPage.locator('button').filter({ hasText: /Bajarme del Viaje/i }).first();
            await expect(leaveBtn).toBeVisible({ timeout: 15000 });
            await ctx.close();
        } finally {
            await deleteTripViaAPI(page, tripId, driverToken);
            await setUserPropertyViaAPI(page, driverToken, 'autoaccept_requests', 0);
        }
    });
});
