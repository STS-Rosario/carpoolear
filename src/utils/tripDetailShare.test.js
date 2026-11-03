import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const messageMock = vi.fn();

vi.mock('../services/dialogs.js', () => ({
    default: {
        message: messageMock
    }
}));

const copyTextToClipboardMock = vi.fn();

vi.mock('./copyTextToClipboard.js', () => ({
    copyTextToClipboard: copyTextToClipboardMock
}));

describe('buildAbsoluteTripDetailUrl', () => {
    it('builds an absolute url for the trip detail route from VITE_WEB_URL', async () => {
        const { buildAbsoluteTripDetailUrl } = await import('./tripDetailShare.js');
        expect(
            buildAbsoluteTripDetailUrl(42, {
                VITE_WEB_URL: 'https://carpoolear.com.ar/app'
            })
        ).toBe('https://carpoolear.com.ar/app/trips/42');
    });

    it('normalizes a trailing slash on VITE_WEB_URL', async () => {
        const { buildAbsoluteTripDetailUrl } = await import('./tripDetailShare.js');
        expect(
            buildAbsoluteTripDetailUrl(482502, {
                VITE_WEB_URL: 'https://carpoolear.com.ar/app/'
            })
        ).toBe('https://carpoolear.com.ar/app/trips/482502');
    });
});

describe('shareTripDetail', () => {
    beforeEach(() => {
        messageMock.mockReset();
        copyTextToClipboardMock.mockReset();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shares localized trip text and detail url', async () => {
        const { shareTripDetail } = await import('./tripDetailShare.js');
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
        const { shareTripDetail } = await import('./tripDetailShare.js');
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

    it('copies to clipboard and toasts when share is unavailable', async () => {
        const { shareTripDetail } = await import('./tripDetailShare.js');
        copyTextToClipboardMock.mockResolvedValue(true);
        const shareContent = vi.fn(async () => ({
            ok: false,
            cancelled: false,
            method: 'none',
            reason: 'no_share_api'
        }));
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
            if (key === 'liveLocationCopySuccess') {
                return 'Enlace copiado';
            }
            return key;
        });

        const result = await shareTripDetail({
            trip,
            locale: 'es',
            translate,
            shareContent,
            env: { VITE_WEB_URL: 'https://carpoolear.com.ar/app' }
        });

        expect(copyTextToClipboardMock).toHaveBeenCalledWith(
            'Viaje a Rosario\n\nhttps://carpoolear.com.ar/app/trips/7'
        );
        expect(messageMock).toHaveBeenCalledWith('Enlace copiado', {
            estado: 'success'
        });
        expect(result).toMatchObject({
            ok: true,
            method: 'clipboard',
            copied: true
        });
    });

    it('does not copy or toast when the user cancels share', async () => {
        const { shareTripDetail } = await import('./tripDetailShare.js');
        const shareContent = vi.fn(async () => ({
            ok: false,
            cancelled: true,
            method: 'navigator'
        }));

        const result = await shareTripDetail({
            trip: { id: 7, to_town: 'Rosario', trip_date: '2026-10-15T10:30:00' },
            locale: 'es',
            translate: (key) => key,
            shareContent,
            env: { VITE_WEB_URL: 'https://carpoolear.com.ar/app' }
        });

        expect(copyTextToClipboardMock).not.toHaveBeenCalled();
        expect(messageMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            ok: false,
            cancelled: true,
            method: 'navigator'
        });
    });

    it('returns failure without toast when clipboard copy fails', async () => {
        const { shareTripDetail } = await import('./tripDetailShare.js');
        copyTextToClipboardMock.mockResolvedValue(false);
        const shareContent = vi.fn(async () => ({
            ok: false,
            cancelled: false,
            method: 'none',
            reason: 'no_share_api'
        }));

        const result = await shareTripDetail({
            trip: { id: 7, to_town: 'Rosario', trip_date: '2026-10-15T10:30:00' },
            locale: 'es',
            translate: (key) => key,
            shareContent,
            env: { VITE_WEB_URL: 'https://carpoolear.com.ar/app' }
        });

        expect(messageMock).not.toHaveBeenCalled();
        expect(result).toMatchObject({
            ok: false,
            reason: 'no_share_api'
        });
    });
});
