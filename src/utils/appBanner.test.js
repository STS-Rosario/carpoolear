import { describe, expect, it } from 'vitest';
import {
    isAccountVerificationBanner,
    shouldShowAppBanner
} from './appBanner.js';

describe('isAccountVerificationBanner', () => {
    it('returns true when banner image URL contains "verif"', () => {
        expect(
            isAccountVerificationBanner({
                image: 'https://cdn.example.com/banner-verif-2026.png',
                url: '/identity-validation'
            })
        ).toBe(true);
    });

    it('returns false when banner image URL does not contain "verif"', () => {
        expect(
            isAccountVerificationBanner({
                image: 'https://cdn.example.com/donation-banner.png',
                url: '/donate'
            })
        ).toBe(false);
    });
});

describe('shouldShowAppBanner', () => {
    const verificationBanner = {
        image: 'https://cdn.example.com/banner-verif.png',
        url: '/identity-validation'
    };
    const regularBanner = {
        image: 'https://cdn.example.com/donation.png',
        url: '/donate'
    };

    it('returns false when banner has no url', () => {
        expect(shouldShowAppBanner({ image: 'x', url: '' }, null)).toBe(false);
    });

    it('shows regular banners regardless of verification status', () => {
        const verifiedUser = { identity_validated: true };
        expect(shouldShowAppBanner(regularBanner, verifiedUser)).toBe(true);
    });

    it('shows verification banner for unverified users', () => {
        expect(
            shouldShowAppBanner(verificationBanner, { identity_validated: false })
        ).toBe(true);
    });

    it('hides verification banner for verified users', () => {
        expect(
            shouldShowAppBanner(verificationBanner, { identity_validated: true })
        ).toBe(false);
    });

    it('hides verification banner when user is not logged in', () => {
        expect(shouldShowAppBanner(verificationBanner, null)).toBe(false);
    });
});
