// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';

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

vi.mock('../../router', () => ({ default: { push: vi.fn(), back: vi.fn() } }));

// Same kind of links the backend FAQ (static-pages/plataforma-preguntas-frecuentes) contains.
const FAQ_HTML = `
    <a id="aportar" href="https://carpoolear.com.ar/aportar">Aportar</a>
    <a id="colaborar" href="https://carpoolear.com.ar/colabora-como-colaborar">Colaborar</a>
    <a id="division" href="/division-de-gastos">División de gastos</a>
    <a id="facebook" href="https://facebook.com/carpoolear">Facebook</a>
    <a id="mail" href="mailto:carpoolear@stsrosario.org.ar">Mail</a>
`;

vi.mock('../../services/api/StaticPage', () => ({
    default: class {
        getPage() {
            return Promise.resolve({ content: FAQ_HTML });
        }
    }
}));

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

async function mountFaq() {
    const { default: StaticHtmlPage } = await import('./StaticHtmlPage.vue');
    const wrapper = shallowMount(StaticHtmlPage, {
        props: { pageSlug: 'faq', pageTitleKey: 'preguntasFrecuentes' },
        global: {
            stubs: {
                AccountSettingsLayout: { template: '<div><slot /></div>' }
            }
        }
    });
    await flushPromises();
    return wrapper;
}

function hrefs(wrapper) {
    return Object.fromEntries(
        wrapper.findAll('a').map((link) => [
            link.attributes('id'),
            link.attributes('href')
        ])
    );
}

describe('StaticHtmlPage links in server HTML (FAQ)', () => {
    beforeAll(async () => {
        await import('./StaticHtmlPage.vue');
    }, 30000);

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
        'on %s points website links at the remote site and leaves in-app and third-party links alone',
        async (platform, siteOrigin) => {
            setPlatform(platform);
            const wrapper = await mountFaq();

            expect(hrefs(wrapper)).toEqual({
                aportar: `${siteOrigin}/aportar`,
                colaborar: `${siteOrigin}/colabora-como-colaborar`,
                division: '/division-de-gastos',
                facebook: 'https://facebook.com/carpoolear',
                mail: 'mailto:carpoolear@stsrosario.org.ar'
            });
        }
    );
});
