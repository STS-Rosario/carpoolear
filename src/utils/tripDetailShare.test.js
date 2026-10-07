import { describe, expect, it, vi } from 'vitest';
import {
    buildAbsoluteTripDetailUrl,
    shareTripDetail
} from './tripDetailShare.js';

describe('buildAbsoluteTripDetailUrl', () => {
    it('builds an absolute url for the trip detail route from VITE_WEB_URL', () => {
        expect(
            buildAbsoluteTripDetailUrl(42, {
                VITE_WEB_URL: 'https://carpoolear.com.ar/app'
            })
        ).toBe('https://carpoolear.com.ar/app/trips/42');
    });

    it('normalizes a trailing slash on VITE_WEB_URL', () => {
        expect(
            buildAbsoluteTripDetailUrl(482502, {
                VITE_WEB_URL: 'https://carpoolear.com.ar/app/'
            })
        ).toBe('https://carpoolear.com.ar/app/trips/482502');
    });
});

describe('shareTripDetail', () => {
    it('shares localized trip text and detail url', async () => {
        const shareContent = vi.fn(async () => ({ ok: true, method: 'navigator' }));
        const trip = {
            id: 7,
            to_town: 'Rosario',
            trip_date: '2026-10-15T10:30:00'
        };
        const translate = vi.fn((key) => {
            if (key === 'tripShareMessage') {
                return 'Viaje a Rosario';
            }
            if (key === 'tripCreationShareTrip') {
                return 'Compartir viaje';
            }
            return key;
        });

        await shareTripDetail({
            trip,
            locale: 'es',
            translate,
            shareContent,
            env: { VITE_WEB_URL: 'https://carpoolear.com.ar/app' }
        });

        expect(shareContent).toHaveBeenCalledWith({
            title: 'Compartir viaje',
            text: 'Viaje a Rosario',
            url: 'https://carpoolear.com.ar/app/trips/7'
        });
    });

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
