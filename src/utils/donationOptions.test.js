import { describe, expect, it } from 'vitest';
import {
    DONATION_TIERS,
    appendDonationTrackingUserId,
    getDonationMonthlyUrl,
    getDonationOnceUrl
} from './donationOptions.js';

describe('donationOptions', () => {
    describe('DONATION_TIERS', () => {
        it('exposes three preset amounts with labels and icons', () => {
            expect(DONATION_TIERS).toHaveLength(3);
            expect(DONATION_TIERS.map((t) => t.amount)).toEqual([5000, 7500, 12000]);
            expect(DONATION_TIERS.map((t) => t.labelKey)).toEqual([
                'donationTierCafe',
                'donationTierBeer',
                'donationTierFood'
            ]);
            expect(DONATION_TIERS.map((t) => t.icon)).toEqual([
                'fa-coffee',
                'fa-beer',
                'fa-cutlery'
            ]);
        });
    });

    describe('getDonationOnceUrl', () => {
        it('returns Mercado Pago link for each preset amount', () => {
            expect(getDonationOnceUrl(5000)).toBe('https://mpago.la/1SB6on8');
            expect(getDonationOnceUrl(7500)).toBe('MP_LINK_UNIQUE_7500');
            expect(getDonationOnceUrl(12000)).toBe('MP_LINK_UNIQUE_12000');
        });

        it('returns default link for unknown amounts', () => {
            expect(getDonationOnceUrl(50)).toBe('https://mpago.la/jgap');
        });
    });

    describe('appendDonationTrackingUserId', () => {
        it('appends user id query param when provided', () => {
            expect(
                appendDonationTrackingUserId('https://mpago.la/abc', 42)
            ).toBe('https://mpago.la/abc?u=42');
            expect(
                appendDonationTrackingUserId(
                    'https://example.com?foo=1',
                    99
                )
            ).toBe('https://example.com?foo=1&u=99');
        });

        it('returns url unchanged when user id is missing', () => {
            expect(appendDonationTrackingUserId('https://mpago.la/abc')).toBe(
                'https://mpago.la/abc'
            );
        });
    });

    describe('getDonationMonthlyUrl', () => {
        it('returns subscription checkout for each preset amount', () => {
            expect(getDonationMonthlyUrl(5000)).toBe(
                'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848cee0ea5018d0e9ea71016d7'
            );
            expect(getDonationMonthlyUrl(7500)).toBe('MP_LINK_MONTHLY_7500');
            expect(getDonationMonthlyUrl(12000)).toBe('MP_LINK_MONTHLY_12000');
        });
    });
});
