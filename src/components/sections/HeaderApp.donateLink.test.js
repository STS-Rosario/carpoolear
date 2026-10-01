// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
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

vi.mock('../../router', () => ({ default: { push: vi.fn() } }));

const HEADER_ROUTE_NAMES = [
    'trips',
    'my-trips',
    'conversations-list',
    'new-trip',
    'login',
    'register',
    'notifications'
];

const stubs = {
    IdentityValidationCountdownBanner: true,
    PendingRatingsBanner: true,
    HeaderMenuDropdown: true,
    UserRatingsCounts: true,
    svgItem: true,
    dropdown: true
};

function setPlatform(platform) {
    capacitorMock.isNativePlatform.mockReturnValue(platform !== 'web');
    capacitorMock.getPlatform.mockReturnValue(platform);
}

async function mountLoggedInMobileHeader() {
    const pinia = createPinia();
    setActivePinia(pinia);

    const { useAuthStore } = await import('../../stores/auth');
    const { useDeviceStore } = await import('../../stores/device');
    useAuthStore().$patch({ auth: true, user: { id: 42, name: 'Ana' } });
    useDeviceStore().$patch({ resolution: { width: 375, height: 800 } });

    const router = createRouter({
        history: createMemoryHistory(),
        routes: HEADER_ROUTE_NAMES.map((name) => ({
            path: name === 'trips' ? '/' : `/${name}`,
            name,
            component: { render: () => null }
        }))
    });
    router.push('/');
    await router.isReady();

    const { default: HeaderApp } = await import('./HeaderApp.vue');
    return mount(HeaderApp, {
        global: {
            plugins: [pinia, router, i18n],
            stubs,
            directives: { imgSrc: {} }
        }
    });
}

/** Both Aportar buttons (branded mobile bar and desktop bar) link to `href`. */
function expectDonateButtonsToLinkTo(wrapper, href) {
    const hrefs = wrapper
        .findAll('a.app-button--header-donate')
        .map((link) => link.attributes('href'));
    expect(hrefs).toEqual([href, href]);
}

describe('HeaderApp Aportar button', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'https://www.carpoolear.com.ar');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        setPlatform('web');
    });

    it('keeps the relative /aportar link on web', async () => {
        setPlatform('web');
        const wrapper = await mountLoggedInMobileHeader();

        expectDonateButtonsToLinkTo(wrapper, '/aportar');
    });

    it.each(['android', 'ios'])(
        'on %s points to the remote site instead of the bundled WebView host (which reloads the app)',
        async (platform) => {
            setPlatform(platform);
            const wrapper = await mountLoggedInMobileHeader();

            expectDonateButtonsToLinkTo(
                wrapper,
                'https://www.carpoolear.com.ar/aportar'
            );
        }
    );
});
