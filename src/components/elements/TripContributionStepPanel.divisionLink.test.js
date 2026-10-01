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

async function mountPanel() {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/trips/create', name: 'new-trip', component: { render: () => null } },
            {
                path: '/division-de-gastos',
                name: 'division_de_gastos',
                component: { render: () => null }
            }
        ]
    });
    router.push('/trips/create');
    await router.isReady();
    const { default: TripContributionStepPanel } = await import(
        './TripContributionStepPanel.vue'
    );
    const wrapper = mount(TripContributionStepPanel, {
        global: {
            plugins: [router, i18n],
            stubs: { TripContributionBreakdown: true }
        }
    });
    return { wrapper, router };
}

function divisionLink(wrapper) {
    return wrapper
        .findAll('a')
        .find(
            (link) =>
                link.text() === i18n.global.t('tripContributionDivisionExplainerLink')
        );
}

describe('TripContributionStepPanel "división de gastos" link', () => {
    afterEach(() => {
        setPlatform('web');
    });

    it('opens in a new tab on web', async () => {
        setPlatform('web');
        const { wrapper } = await mountPanel();

        expect(divisionLink(wrapper).attributes('target')).toBe('_blank');
    });

    it.each(['android', 'ios'])(
        'on %s navigates in-app instead of opening a new window (which reloads or does nothing)',
        async (platform) => {
            setPlatform(platform);
            const { wrapper, router } = await mountPanel();

            const link = divisionLink(wrapper);
            expect(link.attributes('target')).toBeUndefined();
            await link.trigger('click');
            await flushPromises();
            expect(router.currentRoute.value.name).toBe('division_de_gastos');
        }
    );
});
