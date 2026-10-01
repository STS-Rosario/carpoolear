import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const capacitorMock = vi.hoisted(() => ({
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web')
}));

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: capacitorMock.isNativePlatform,
        getPlatform: capacitorMock.getPlatform
    }
}));

/**
 * The WebView origin per platform (capacitor.config.json server.hostname = carpoolear.com.ar)
 * and the API base each build gets (native builds use VITE_API_URL_NATIVE = www).
 */
const PLATFORMS = {
    web: {
        origin: 'https://carpoolear.com.ar',
        apiUrl: 'https://carpoolear.com.ar'
    },
    android: {
        origin: 'https://carpoolear.com.ar',
        apiUrl: 'https://www.carpoolear.com.ar'
    },
    ios: {
        origin: 'capacitor://carpoolear.com.ar',
        apiUrl: 'https://www.carpoolear.com.ar'
    }
};

function setPlatform(platform) {
    const { origin, apiUrl } = PLATFORMS[platform];
    capacitorMock.isNativePlatform.mockReturnValue(platform !== 'web');
    capacitorMock.getPlatform.mockReturnValue(platform);
    vi.stubGlobal('window', {
        location: { origin, host: 'carpoolear.com.ar' }
    });
    vi.stubEnv('VITE_API_URL', apiUrl);
}

async function loadHelper() {
    return import('./externalLink.js');
}

describe('resolveExternalUrl', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    describe('on web', () => {
        it.each([
            '/aportar',
            'https://carpoolear.com.ar/aportar?u=42',
            'https://mpago.la/1SB6on8'
        ])('leaves %s unchanged', async (url) => {
            setPlatform('web');
            const { resolveExternalUrl } = await loadHelper();

            expect(resolveExternalUrl(url)).toBe(url);
        });
    });

    describe('on android (WebView served as https://carpoolear.com.ar)', () => {
        it('moves app-host urls to the remote www site so they leave the app', async () => {
            setPlatform('android');
            const { resolveExternalUrl } = await loadHelper();

            expect(
                resolveExternalUrl('https://carpoolear.com.ar/aportar?u=42')
            ).toBe('https://www.carpoolear.com.ar/aportar?u=42');
        });

        it('turns server-only relative paths into the remote www site', async () => {
            setPlatform('android');
            const { resolveExternalUrl } = await loadHelper();

            expect(resolveExternalUrl('/aportar')).toBe(
                'https://www.carpoolear.com.ar/aportar'
            );
        });
    });

    describe('on ios (WebView served as capacitor://carpoolear.com.ar)', () => {
        it('keeps https app-host urls, which are already off the capacitor:// app host', async () => {
            setPlatform('ios');
            const { resolveExternalUrl } = await loadHelper();

            expect(
                resolveExternalUrl('https://carpoolear.com.ar/aportar?u=42')
            ).toBe('https://carpoolear.com.ar/aportar?u=42');
        });

        it('turns server-only relative paths into the https site', async () => {
            setPlatform('ios');
            const { resolveExternalUrl } = await loadHelper();

            expect(resolveExternalUrl('/aportar')).toBe(
                'https://carpoolear.com.ar/aportar'
            );
        });
    });

    it.each(['android', 'ios'])(
        'leaves third-party urls unchanged on %s',
        async (platform) => {
            setPlatform(platform);
            const { resolveExternalUrl } = await loadHelper();

            expect(resolveExternalUrl('https://mpago.la/1SB6on8')).toBe(
                'https://mpago.la/1SB6on8'
            );
        }
    );
});
