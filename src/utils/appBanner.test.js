import { describe, expect, it } from 'vitest';
import {
    resolveAppBannerAsset,
    shouldShowAppBanner
} from './appBanner.js';

describe('shouldShowAppBanner', () => {
    const banner = {
        image: 'https://cdn.example.com/banner-verif.png',
        url: 'https://www.carpoolear.com.ar/lucro'
    };

    it('returns false when banner has no url', () => {
        expect(shouldShowAppBanner({ image: 'x', url: '' })).toBe(false);
        expect(shouldShowAppBanner(null)).toBe(false);
    });

    it('shows the banner whenever url is set, regardless of verification', () => {
        expect(shouldShowAppBanner(banner)).toBe(true);
        expect(
            shouldShowAppBanner({
                image: 'https://cdn.example.com/donation.png',
                url: '/donate'
            })
        ).toBe(true);
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
