import { describe, expect, it, vi } from 'vitest';
import {
    buildAbsoluteTripDetailUrl,
    shareTripDetail
} from './tripDetailShare.js';

describe('buildAbsoluteTripDetailUrl', () => {
    it('builds an absolute url for the trip detail route', () => {
        const router = {
            resolve: vi.fn(() => ({ href: '/app/trips/42' }))
        };

        expect(
            buildAbsoluteTripDetailUrl(router, 42, 'https://carpoolear.com.ar')
        ).toBe('https://carpoolear.com.ar/app/trips/42');

        expect(router.resolve).toHaveBeenCalledWith({
            name: 'detail_trip',
            params: { id: 42 }
        });
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
            router: { resolve: () => ({ href: '/app/trips/7' }) },
            origin: 'https://carpoolear.com.ar',
            locale: 'es',
            translate,
            shareContent
        });

        expect(shareContent).toHaveBeenCalledWith({
            title: 'Compartir viaje',
            text: 'Viaje a Rosario',
            url: 'https://carpoolear.com.ar/app/trips/7'
        });
    });
});
