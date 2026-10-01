// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';
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

vi.mock('../../router', () => ({ default: { push: vi.fn() } }));
vi.mock('../../cordova/push-capacitor.js', () => ({ default: { init: vi.fn() } }));

function setPlatform(platform) {
    stubCapacitorPlatform(capacitorMock, platform);
}

async function mountNotificationsWith(notification) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useNotificationsStore } = await import('../../stores/notifications');
    const notificationsStore = useNotificationsStore();
    notificationsStore.$patch({ list: [notification] });
    notificationsStore.indexAction = vi.fn(() => Promise.resolve());

    const { default: Notifications } = await import('./Notifications.vue');
    const wrapper = shallowMount(Notifications, {
        global: {
            plugins: [pinia, i18n],
            mocks: { $publicImg: () => '' },
            stubs: { Loading: { template: '<div><slot /></div>' } }
        }
    });
    await flushPromises();
    return wrapper;
}

describe('Notifications announcement external link', () => {
    let open;

    beforeAll(async () => {
        await import('./Notifications.vue');
    }, 30000);

    beforeEach(() => {
        open = vi.fn();
        vi.stubGlobal('open', open);
    });

    afterEach(() => {
        setPlatform('web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it.each([
        ['web', 'https://carpoolear.com.ar/novedades'],
        ['android', 'https://www.carpoolear.com.ar/novedades'],
        ['ios', 'https://carpoolear.com.ar/novedades']
    ])(
        'on %s opens an app-host announcement url on the remote site',
        async (platform, expectedUrl) => {
            setPlatform(platform);
            const wrapper = await mountNotificationsWith({
                id: 1,
                text: 'Novedades',
                readed: true,
                created_at: '2026-10-01 10:00:00',
                extras: {
                    type: 'announcement',
                    external_url: 'https://carpoolear.com.ar/novedades'
                }
            });

            await wrapper.find('.notifications-list .list-group-item').trigger('click');

            expect(open).toHaveBeenCalledTimes(1);
            expect(open.mock.calls[0][0]).toBe(expectedUrl);
        }
    );
});
