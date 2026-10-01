// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
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

vi.mock('../../services/api/Donation.js', () => ({
    default: {
        getTiers: vi.fn(() => Promise.reject(new Error('offline'))),
        checkoutOnce: vi.fn(),
        checkoutMonthly: vi.fn()
    }
}));

function setPlatform(platform) {
    stubCapacitorPlatform(capacitorMock, platform);
}

async function mountDonationAfterRating() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    const { useProfileStore } = await import('../../stores/profile');
    useAuthStore().$patch({ auth: true, user: { id: 42, name: 'Ana' } });
    useProfileStore().registerDonation = vi.fn(() => Promise.resolve());

    const { default: DonationAfterRating } = await import(
        './DonationAfterRating.vue'
    );
    const wrapper = mount(DonationAfterRating, {
        props: { tripId: 7 },
        global: {
            plugins: [pinia, i18n],
            mocks: { $router: { push: vi.fn() }, $publicImg: () => '' },
            stubs: { DonationAfterRatingHero: true }
        }
    });
    await flushPromises();
    return wrapper;
}

function volunteerLink(wrapper) {
    return wrapper
        .findAll('a')
        .find(
            (link) =>
                link.text() === i18n.global.t('donationAfterRatingVolunteerLink')
        );
}

describe('DonationAfterRating external links', () => {
    let open;
    let consoleError;
    let consoleWarn;

    beforeEach(() => {
        open = vi.fn();
        vi.stubGlobal('open', open);
        consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleError.mockRestore();
        consoleWarn.mockRestore();
        setPlatform('web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it('on ios opens the Mercado Pago checkout without the nonexistent App.openUrl', async () => {
        setPlatform('ios');
        const wrapper = await mountDonationAfterRating();
        await wrapper.find('input#donationAfterRatingOnce-5000').setValue(true);

        await wrapper
            .findAll('button')
            .find(
                (button) =>
                    button.text() === i18n.global.t('donationAfterRatingOnceCta')
            )
            .trigger('click');
        await flushPromises();

        expect(consoleError).not.toHaveBeenCalled();
        expect(open).toHaveBeenCalledWith(
            'https://mpago.la/1SB6on8?u=42',
            '_blank'
        );
    });

    it.each([
        ['web', 'https://carpoolear.com.ar/colabora-como-colaborar'],
        ['android', 'https://www.carpoolear.com.ar/colabora-como-colaborar'],
        ['ios', 'https://carpoolear.com.ar/colabora-como-colaborar']
    ])(
        'on %s points the volunteer link at the remote site (not the bundled app host)',
        async (platform, expectedUrl) => {
            setPlatform(platform);
            const wrapper = await mountDonationAfterRating();

            expect(volunteerLink(wrapper).attributes('href')).toBe(expectedUrl);
        }
    );
});
