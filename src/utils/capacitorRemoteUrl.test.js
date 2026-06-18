import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(() => false)
    }
}));

describe('resolveCapacitorBundledHostUrl', () => {
    beforeEach(() => {
        globalThis.window = {
            location: { origin: 'https://carpoolear.com.ar' }
        };
        vi.stubEnv('VITE_API_URL', 'https://www.carpoolear.com.ar');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    async function loadResolver() {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        return import('./capacitorRemoteUrl.js');
    }

    it('returns url unchanged on web', async () => {
        const { resolveCapacitorBundledHostUrl } = await loadResolver();
        const url = 'https://carpoolear.com.ar/img/banner_verificacion.png';
        expect(resolveCapacitorBundledHostUrl(url)).toBe(url);
    });

    it('rewrites same-origin absolute urls on native to VITE_API_URL origin', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(true);
        const { resolveCapacitorBundledHostUrl } = await import(
            './capacitorRemoteUrl.js'
        );

        expect(
            resolveCapacitorBundledHostUrl(
                'https://carpoolear.com.ar/img/banner_verificacion.png'
            )
        ).toBe('https://www.carpoolear.com.ar/img/banner_verificacion.png');
    });

    it('leaves external urls unchanged on native', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(true);
        const { resolveCapacitorBundledHostUrl } = await import(
            './capacitorRemoteUrl.js'
        );
        const url = 'https://cdn.example.com/banner.png';
        expect(resolveCapacitorBundledHostUrl(url)).toBe(url);
    });
});
