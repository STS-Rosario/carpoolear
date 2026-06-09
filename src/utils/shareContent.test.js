import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const shareMock = vi.fn();
const socialShareMock = vi.fn();

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(() => false)
    }
}));

vi.mock('@capacitor/share', () => ({
    Share: {
        share: shareMock
    }
}));

vi.mock('../services/socialShare.js', () => ({
    default: {
        share: socialShareMock
    }
}));

describe('shareContent', () => {
    beforeEach(() => {
        shareMock.mockReset();
        socialShareMock.mockReset();
        vi.stubGlobal('navigator', {});
        vi.stubGlobal('window', {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    async function loadShareContent() {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        return import('./shareContent.js');
    }

    it('uses Capacitor Share on native platforms', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(true);
        shareMock.mockResolvedValue(undefined);
        const { shareContent } = await import('./shareContent.js');

        const result = await shareContent({
            title: 'Live location',
            text: 'Share my live location',
            url: 'https://carpoolear.com.ar/live/token'
        });

        expect(shareMock).toHaveBeenCalledWith({
            title: 'Live location',
            text: 'Share my live location',
            url: 'https://carpoolear.com.ar/live/token',
            dialogTitle: 'Live location'
        });
        expect(result).toEqual({ ok: true, method: 'capacitor' });
    });

    it('falls back to navigator.share when Capacitor Share fails on native', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(true);
        shareMock.mockRejectedValue(new Error('Share plugin unavailable'));
        const navigatorShare = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { share: navigatorShare });
        const { shareContent } = await import('./shareContent.js');

        const result = await shareContent({
            title: 'Live location',
            url: 'https://carpoolear.com.ar/live/token'
        });

        expect(navigatorShare).toHaveBeenCalledWith({
            title: 'Live location',
            text: 'Live location',
            url: 'https://carpoolear.com.ar/live/token'
        });
        expect(result).toEqual({ ok: true, method: 'navigator' });
    });

    it('uses navigator.share on web when available', async () => {
        const navigatorShare = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { share: navigatorShare });
        const { shareContent } = await loadShareContent();

        const result = await shareContent({
            title: 'Live location',
            text: 'Share my live location',
            url: 'https://carpoolear.com.ar/live/token'
        });

        expect(shareMock).not.toHaveBeenCalled();
        expect(navigatorShare).toHaveBeenCalledWith({
            title: 'Live location',
            text: 'Share my live location',
            url: 'https://carpoolear.com.ar/live/token'
        });
        expect(result).toEqual({ ok: true, method: 'navigator' });
    });

    it('falls back to cordova social sharing when web share is unavailable', async () => {
        vi.stubGlobal('window', {
            plugins: {
                socialsharing: {
                    shareWithOptions: vi.fn()
                }
            }
        });
        const { shareContent } = await loadShareContent();

        const result = await shareContent({
            title: 'Live location',
            text: 'Share my live location',
            url: 'https://carpoolear.com.ar/live/token'
        });

        expect(socialShareMock).toHaveBeenCalledWith({
            message: 'Share my live location',
            subject: 'Live location',
            url: 'https://carpoolear.com.ar/live/token'
        });
        expect(result).toEqual({ ok: true, method: 'cordova' });
    });

    it('returns cancelled when the user dismisses the native share sheet', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(true);
        shareMock.mockRejectedValue(new Error('Share canceled'));
        vi.stubGlobal('navigator', {
            share: vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'))
        });
        const { shareContent } = await import('./shareContent.js');

        const result = await shareContent({
            title: 'Live location',
            url: 'https://carpoolear.com.ar/live/token'
        });

        expect(result).toEqual({
            ok: false,
            cancelled: true,
            method: 'capacitor'
        });
    });

    it('returns none when no share method is available', async () => {
        const { shareContent } = await loadShareContent();

        const result = await shareContent({
            title: 'Live location',
            url: 'https://carpoolear.com.ar/live/token'
        });

        expect(result).toEqual({
            ok: false,
            cancelled: false,
            method: 'none'
        });
    });
});
