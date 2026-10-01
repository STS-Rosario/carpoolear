import { describe, expect, it, vi } from 'vitest';
import {
    isPlatformDonationsApiEnabled,
    startDonationCheckout
} from './donationCheckout.js';

vi.mock('../services/api/Donation.js', () => ({
    default: {
        checkoutOnce: vi.fn(async () => ({ init_point: 'https://mp.test/once' })),
        checkoutMonthly: vi.fn(async () => ({ init_point: 'https://mp.test/monthly' })),
        getTiers: vi.fn(async () => [])
    }
}));

describe('donationCheckout', () => {
    it('detects platform donations API flag from app config', () => {
        expect(isPlatformDonationsApiEnabled({ platform_donations_api_enabled: true })).toBe(true);
        expect(isPlatformDonationsApiEnabled({ platform_donations_api_enabled: false })).toBe(false);
    });

    it('uses checkout API when platform donations are enabled', async () => {
        const url = await startDonationCheckout({
            type: 'once',
            amount: 5000,
            source: 'after_rating',
            tripId: 12,
            userId: 7,
            appConfig: { platform_donations_api_enabled: true }
        });

        expect(url).toBe('https://mp.test/once');
    });

    it('falls back to static donation URLs when API is disabled', async () => {
        const url = await startDonationCheckout({
            type: 'monthly',
            amount: 5000,
            userId: 7,
            appConfig: { platform_donations_api_enabled: false }
        });

        expect(url).toContain('preapproval_plan_id');
        expect(url).toContain('u=7');
    });
});
