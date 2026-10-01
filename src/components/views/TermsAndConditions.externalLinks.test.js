// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { stubCapacitorPlatform } from '../../utils/capacitorPlatform.fixture.js';

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

const TERMS_HTML = `
    <a id="site" href="https://carpoolear.com.ar/plataforma-terminos-condiciones">Términos</a>
    <a id="webapp" href="http://www.carpoolear.com.ar/app">App</a>
    <a id="mail" href="mailto:carpoolear@stsrosario.org.ar">Mail</a>
`;

async function mountTerms() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useProfileStore } = await import('../../stores/profile');
    useProfileStore().getTermsText = vi.fn(() =>
        Promise.resolve({ content: TERMS_HTML })
    );
    const { default: TermsAndConditions } = await import('./TermsAndConditions.vue');
    const wrapper = shallowMount(TermsAndConditions, {
        global: {
            plugins: [pinia],
            stubs: { AccountSettingsLayout: { template: '<div><slot /></div>' } }
        }
    });
    await flushPromises();
    return wrapper;
}

function hrefs(wrapper) {
    return Object.fromEntries(
        wrapper
            .findAll('a')
            .map((link) => [link.attributes('id'), link.attributes('href')])
    );
}

describe('TermsAndConditions links in server HTML', () => {
    beforeAll(async () => {
        await import('./TermsAndConditions.vue');
    }, 30000);

    afterEach(() => {
        stubCapacitorPlatform(capacitorMock, 'web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it.each([
        ['web', 'https://carpoolear.com.ar'],
        ['android', 'https://www.carpoolear.com.ar'],
        ['ios', 'https://carpoolear.com.ar']
    ])(
        'on %s points app-host links at the remote site and leaves other links alone',
        async (platform, siteOrigin) => {
            stubCapacitorPlatform(capacitorMock, platform);
            const wrapper = await mountTerms();

            expect(hrefs(wrapper)).toEqual({
                site: `${siteOrigin}/plataforma-terminos-condiciones`,
                webapp: 'http://www.carpoolear.com.ar/app',
                mail: 'mailto:carpoolear@stsrosario.org.ar'
            });
        }
    );
});
