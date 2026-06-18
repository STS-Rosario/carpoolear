import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const { isNativePlatformMock } = vi.hoisted(() => ({
    isNativePlatformMock: vi.fn(() => false)
}));

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: isNativePlatformMock
    }
}));

import { resolveCapacitorBundledHostUrl } from './capacitorRemoteUrl.js';

describe('resolveCapacitorBundledHostUrl', () => {
    beforeEach(() => {
        isNativePlatformMock.mockReturnValue(false);
        globalThis.window = {
            location: { origin: 'https://carpoolear.com.ar' }
        };
        vi.stubEnv('VITE_API_URL', 'https://www.carpoolear.com.ar');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.clearAllMocks();
    });

    it('returns url unchanged on web', () => {
        const url = 'https://carpoolear.com.ar/img/banner_verificacion.png';
        expect(resolveCapacitorBundledHostUrl(url)).toBe(url);
    });

    it('rewrites same-origin absolute urls on native to VITE_API_URL origin', () => {
        isNativePlatformMock.mockReturnValue(true);
        expect(
            resolveCapacitorBundledHostUrl(
                'https://carpoolear.com.ar/img/banner_verificacion.png'
            )
        ).toBe('https://www.carpoolear.com.ar/img/banner_verificacion.png');
    });

    it('leaves external urls unchanged on native', () => {
        isNativePlatformMock.mockReturnValue(true);
        const url = 'https://cdn.example.com/banner.png';
        expect(resolveCapacitorBundledHostUrl(url)).toBe(url);
    });
});
