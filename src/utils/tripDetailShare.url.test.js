import { describe, expect, it, vi } from 'vitest';
import {
    buildAbsoluteTripDetailUrl,
    shareTripDetail
} from './tripDetailShare.js';

describe('buildAbsoluteTripDetailUrl', () => {
    it('builds a public web app url from VITE_WEB_URL and trip id', () => {
        expect(
            buildAbsoluteTripDetailUrl(482502, {
                VITE_WEB_URL: 'https://carpoolear.com.ar/app'
            })
        ).toBe('https://carpoolear.com.ar/app/trips/482502');
    });

    it('does not use hash-router hrefs from window.location.origin', () => {
        const router = {
            resolve: vi.fn(() => ({ href: '#/trips/482502' }))
        };

        expect(
            buildAbsoluteTripDetailUrl(482502, {
                VITE_WEB_URL: 'https://carpoolear.com.ar/app/',
                router,
                origin: 'https://carpoolear.com.ar'
            })
        ).toBe('https://carpoolear.com.ar/app/trips/482502');

        expect(router.resolve).not.toHaveBeenCalled();
    });
});

describe('shareTripDetail url', () => {
    it('shares the VITE_WEB_URL trip detail link', async () => {
        const shareContent = vi.fn(async () => ({ ok: true, method: 'navigator' }));
        const trip = {
            id: 482502,
            to_town: 'San Carlos de Bariloche',
            trip_date: '2026-10-08 12:00:00'
        };

        await shareTripDetail({
            trip,
            locale: 'es',
            translate: (key) => key,
            shareContent,
            env: { VITE_WEB_URL: 'https://carpoolear.com.ar/app' }
        });

        expect(shareContent).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://carpoolear.com.ar/app/trips/482502'
            })
        );
    });
});
