// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
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

vi.mock('../../router', () => ({ default: { push: vi.fn(), stack: [] } }));

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

/**
 * Mounts the trips list with one trip and donation config that shows the donation panel
 * (split panel when logged in, per-trip panel for guests).
 */
async function mountTrips({ user = { id: 42, name: 'Ana' }, banner } = {}) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    const { useTripsStore } = await import('../../stores/trips');
    const { useSubscriptionsStore } = await import('../../stores/subscriptions');
    const { useProfileStore } = await import('../../stores/profile');
    const { useMyTripsStore } = await import('../../stores/myTrips');
    const { useFriendsStore } = await import('../../stores/friends');

    useAuthStore().$patch({
        auth: !!user,
        user,
        appConfig: {
            donation: { month_days: 32, trips_offset: 0, trips_count: 1 },
            banner
        }
    });
    const tripsStore = useTripsStore();
    tripsStore.$patch({
        trips: [{ id: 1, trip_date: '2099-01-01 10:00:00', points: [] }]
    });
    tripsStore.tripsSearch = vi.fn(() => Promise.resolve());
    tripsStore.refreshListAction = vi.fn();
    tripsStore.setScrollOffset = vi.fn();
    useSubscriptionsStore().index = vi.fn(() => Promise.resolve());
    useSubscriptionsStore().create = vi.fn(() => Promise.resolve());
    useProfileStore().registerDonation = vi.fn(() => Promise.resolve());
    useMyTripsStore().fetchOngoingTrip = vi.fn(() => Promise.resolve());
    useFriendsStore().pending = vi.fn(() => Promise.resolve());

    const routerPush = vi.fn();
    const { default: Trips } = await import('./Trips.vue');
    const wrapper = shallowMount(Trips, {
        global: {
            plugins: [pinia, i18n],
            mocks: {
                $router: { push: routerPush, resolve: () => ({ href: '' }) },
                $route: { query: {}, params: {}, name: 'trips' },
                $publicImg: () => ''
            },
            directives: { imgSrc: {}, jump: {} },
            stubs: {
                Loading: { template: '<div><slot /></div>' },
                AppButton: false
            }
        }
    });
    await flushPromises();
    return { wrapper, routerPush };
}

function linkWithText(wrapper, key) {
    return wrapper
        .findAll('a')
        .find((link) => link.text() === i18n.global.t(key));
}

function buttonWithText(wrapper, key) {
    return wrapper
        .findAll('button')
        .find((button) => button.text() === i18n.global.t(key));
}

describe('Trips external links', () => {
    let open;
    let consoleError;

    // Trips.vue pulls in a large module graph; a cold import can exceed the 5s test timeout.
    beforeAll(async () => {
        await import('./Trips.vue');
    }, 30000);

    beforeEach(() => {
        open = vi.fn();
        vi.stubGlobal('open', open);
        consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleError.mockRestore();
        setPlatform('web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it('on ios the Donar button opens /aportar in Safari without the nonexistent App.openUrl', async () => {
        setPlatform('ios');
        const { wrapper } = await mountTrips();

        await buttonWithText(wrapper, 'donar').trigger('click');
        await flushPromises();

        expect(consoleError).not.toHaveBeenCalled();
        expect(open).toHaveBeenCalledWith(
            'https://carpoolear.com.ar/aportar?u=42',
            '_blank'
        );
    });

    it('on ios "por qué aportar" opens in Safari without the nonexistent App.openUrl', async () => {
        setPlatform('ios');
        const { wrapper } = await mountTrips();

        await linkWithText(wrapper, 'porQueDonar').trigger('click');
        await flushPromises();

        expect(consoleError).not.toHaveBeenCalled();
        expect(open).toHaveBeenCalledWith(
            'https://carpoolear.com.ar/aportar?u=42',
            '_blank'
        );
    });
});
