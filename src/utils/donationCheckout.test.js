import { describe, expect, it, vi } from 'vitest';
import {
    isPlatformDonationsApiEnabled,
    isPlatformDonationsQrEnabled,
    startDonationCheckout,
    startDonationQrCheckout
} from './donationCheckout.js';

vi.mock('../services/api/Donation.js', () => ({
    default: {
        checkoutOnce: vi.fn(async () => ({ init_point: 'https://mp.test/once' })),
        checkoutMonthly: vi.fn(async () => ({ init_point: 'https://mp.test/monthly' })),
        checkoutQrOrder: vi.fn(async () => ({
            payment_id: 11,
            qr_data: 'DONATE_QR',
            order_id: 'ord-1'
        })),
        getPaymentStatus: vi.fn(async () => ({
            payment_id: 11,
            status: 'pending'
        })),
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
        const donationApi = (await import('../services/api/Donation.js')).default;
        expect(donationApi.checkoutOnce).toHaveBeenCalledWith({
            amount: 5000,
            source: 'after_rating',
            trip_id: 12,
            user_id: 7
        });
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

    it('detects platform donations QR flag from the conjunctive app config', () => {
        expect(
            isPlatformDonationsQrEnabled({
                platform_donations_qr_enabled: true
            })
        ).toBe(true);
        expect(
            isPlatformDonationsQrEnabled({
                platform_donations_qr_enabled: false
            })
        ).toBe(false);
        expect(isPlatformDonationsQrEnabled({})).toBe(false);
    });

    it('creates a QR order when platform donations QR is enabled', async () => {
        const result = await startDonationQrCheckout({
            amount: 5000,
            source: 'donate_page',
            userId: 7,
            appConfig: { platform_donations_qr_enabled: true }
        });

        expect(result).toEqual({
            payment_id: 11,
            qr_data: 'DONATE_QR',
            order_id: 'ord-1'
        });
        const donationApi = (await import('../services/api/Donation.js'))
            .default;
        expect(donationApi.checkoutQrOrder).toHaveBeenCalledWith({
            amount: 5000,
            source: 'donate_page',
            trip_id: undefined,
            user_id: 7
        });
    });

    it('refuses QR checkout when the QR flag is off', async () => {
        await expect(
            startDonationQrCheckout({
                amount: 5000,
                source: 'donate_page',
                appConfig: { platform_donations_qr_enabled: false }
            })
        ).rejects.toThrow('QR payment is not available');
    });
});
