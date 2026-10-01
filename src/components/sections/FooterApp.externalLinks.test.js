// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';

const capacitorMock = vi.hoisted(() => ({
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web')
}));

vi.mock('@capacitor/core', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Capacitor: {
            ...actual.Capacitor,
            isNativePlatform: capacitorMock.isNativePlatform,
            getPlatform: capacitorMock.getPlatform
        }
    };
});

/** WebView origin per platform (capacitor.config.json server.hostname = carpoolear.com.ar). */
const WEBVIEW_ORIGINS = {
    web: 'https://carpoolear.com.ar',
    android: 'https://carpoolear.com.ar',
    ios: 'capacitor://carpoolear.com.ar'
};

function setPlatform(platform) {
    capacitorMock.isNativePlatform.mockReturnValue(platform !== 'web');
    capacitorMock.getPlatform.mockReturnValue(platform);
    vi.stubGlobal('location', {
        origin: WEBVIEW_ORIGINS[platform],
        host: 'carpoolear.com.ar'
    });
    vi.stubEnv(
        'VITE_API_URL',
        platform === 'web'
            ? 'https://carpoolear.com.ar'
            : 'https://www.carpoolear.com.ar'
    );
}

async function mountFooter() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    useAuthStore().$patch({
        appConfig: { enable_footer: true, admin_email: 'a@b.c' }
    });
    const { default: FooterApp } = await import('./FooterApp.vue');
    return shallowMount(FooterApp, { global: { plugins: [pinia, i18n] } });
}

function hrefOfLinkWithText(wrapper, key) {
    return wrapper
        .findAll('a')
        .find((link) => link.text() === i18n.global.t(key))
        .attributes('href');
}

describe('FooterApp website links (target=_blank)', () => {
    afterEach(() => {
        setPlatform('web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it.each([
        ['web', 'https://carpoolear.com.ar'],
        ['android', 'https://www.carpoolear.com.ar'],
        ['ios', 'https://carpoolear.com.ar']
    ])(
        'on %s link team and recommendations pages on the remote site, not the bundled app host',
        async (platform, expectedOrigin) => {
            setPlatform(platform);
            const wrapper = await mountFooter();

            expect(hrefOfLinkWithText(wrapper, 'footerEquipo')).toBe(
                `${expectedOrigin}/acerca-de-equipo`
            );
            expect(hrefOfLinkWithText(wrapper, 'footerRecomendaciones')).toBe(
                `${expectedOrigin}/plataforma-recomendaciones`
            );
        }
    );
});
