import { describe, expect, it } from 'vitest';
import {
    isAccountVerificationBanner,
    resolveAppBannerAsset,
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

describe('resolveAppBannerAsset', () => {
    const banner = {
        image: 'https://cdn.example.com/banner.png',
        url: 'https://example.com/desktop',
        image_mobile: 'https://cdn.example.com/banner_mobile.png',
        url_mobile: 'https://example.com/mobile'
    };

    it('returns null when there is no banner', () => {
        expect(resolveAppBannerAsset(null, false)).toBeNull();
        expect(resolveAppBannerAsset(undefined, true)).toBeNull();
    });

    it('returns desktop image and url when not mobile', () => {
        expect(resolveAppBannerAsset(banner, false)).toEqual({
            image: 'https://cdn.example.com/banner.png',
            url: 'https://example.com/desktop'
        });
    });

    it('returns mobile image and url when mobile', () => {
        expect(resolveAppBannerAsset(banner, true)).toEqual({
            image: 'https://cdn.example.com/banner_mobile.png',
            url: 'https://example.com/mobile'
        });
    });

    it('falls back to desktop image when mobile image is missing', () => {
        expect(
            resolveAppBannerAsset(
                { image: 'desktop.png', url: 'https://example.com/desktop' },
                true
            )
        ).toEqual({ image: 'desktop.png', url: 'https://example.com/desktop' });
    });

    it('falls back to desktop image when mobile image is empty', () => {
        expect(
            resolveAppBannerAsset(
                {
                    image: 'desktop.png',
                    url: 'https://example.com/desktop',
                    image_mobile: '',
                    url_mobile: 'https://example.com/mobile'
                },
                true
            )
        ).toEqual({
            image: 'desktop.png',
            url: 'https://example.com/mobile'
        });
    });

    it('falls back to desktop url when mobile url is empty', () => {
        expect(
            resolveAppBannerAsset(
                {
                    image: 'desktop.png',
                    url: 'https://example.com/desktop',
                    image_mobile: 'mobile.png',
                    url_mobile: ''
                },
                true
            )
        ).toEqual({
            image: 'mobile.png',
            url: 'https://example.com/desktop'
        });
    });
});
