// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
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

function setPlatform(platform) {
    capacitorMock.isNativePlatform.mockReturnValue(platform !== 'web');
    capacitorMock.getPlatform.mockReturnValue(platform);
}

async function mountTable() {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/admin/users/:userId/trips', name: 'admin-user-trips', component: { render: () => null } },
            { path: '/trips/:id', name: 'detail_trip', component: { render: () => null } }
        ]
    });
    router.push('/admin/users/5/trips');
    await router.isReady();
    const { default: AdminUserTripsTable } = await import('./AdminUserTripsTable.vue');
    const wrapper = mount(AdminUserTripsTable, {
        props: {
            emptyMessage: 'none',
            trips: [
                {
                    id: 123,
                    from_town: 'Rosario',
                    to_town: 'Córdoba',
                    trip_date: '2099-01-01 10:00:00',
                    total_seats: 3
                }
            ]
        },
        global: { plugins: [router, i18n], stubs: { AppButton: true } }
    });
    return { wrapper, router };
}

function tripIdLink(wrapper) {
    return wrapper.findAll('a').find((link) => link.text() === '123');
}

describe('AdminUserTripsTable trip id link', () => {
    afterEach(() => {
        setPlatform('web');
    });

    it('opens the trip in a new tab on web', async () => {
        setPlatform('web');
        const { wrapper } = await mountTable();

        expect(tripIdLink(wrapper).attributes('target')).toBe('_blank');
    });

    it.each(['android', 'ios'])(
        'on %s navigates to the trip in-app instead of opening a new window',
        async (platform) => {
            setPlatform(platform);
            const { wrapper, router } = await mountTable();

            const link = tripIdLink(wrapper);
            expect(link.attributes('target')).toBeUndefined();
            await link.trigger('click');
            await flushPromises();
            expect(router.currentRoute.value.name).toBe('detail_trip');
        }
    );
});
