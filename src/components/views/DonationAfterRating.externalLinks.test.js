// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
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

const externalLinkSpies = vi.hoisted(() => ({
    openExternalUrl: null,
    resolveExternalUrl: null
}));

vi.mock('../../utils/externalLink.js', async (importOriginal) => {
    const actual = await importOriginal();
    externalLinkSpies.openExternalUrl = vi.fn(actual.openExternalUrl);
    externalLinkSpies.resolveExternalUrl = vi.fn(actual.resolveExternalUrl);
    return {
        ...actual,
        openExternalUrl: externalLinkSpies.openExternalUrl,
        resolveExternalUrl: externalLinkSpies.resolveExternalUrl
    };
});

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

    // The page pulls in a large module graph; a cold import can exceed the 5s test timeout.
    beforeAll(async () => {
        await import('./DonationAfterRating.vue');
    }, 30000);

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

describe('DonationAfterRating social and volunteer links', () => {
    let open;

    beforeEach(() => {
        open = vi.fn();
        vi.stubGlobal('open', open);
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        externalLinkSpies.openExternalUrl.mockClear();
        externalLinkSpies.resolveExternalUrl.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        setPlatform('web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    function linkWithText(wrapper, text) {
        return wrapper.findAll('a').find((link) => link.text() === text);
    }

    it('renders Instagram and Facebook as links inside the social paragraph', async () => {
        const wrapper = await mountDonationAfterRating();
        const instagram = linkWithText(wrapper, 'Instagram');
        const facebook = linkWithText(wrapper, 'Facebook');

        expect(instagram.attributes('href')).toBe(
            'https://instagram.com/carpoolear'
        );
        expect(facebook.attributes('href')).toBe(
            'https://facebook.com/carpoolear'
        );
        [instagram, facebook].forEach((link) => {
            expect(link.attributes('target')).toBe('_blank');
            expect(link.attributes('rel')).toBe('noopener noreferrer');
        });
        expect(instagram.element.closest('li')).toBe(facebook.element.closest('li'));
        expect(instagram.element.closest('li').textContent.trim()).toBe(
            'Si usas las redes sociales virtuales Instagram, Facebook y compartí nuestras publicaciones/historias.'
        );
        expect(externalLinkSpies.resolveExternalUrl).toHaveBeenCalledWith(
            'https://instagram.com/carpoolear'
        );
        expect(externalLinkSpies.resolveExternalUrl).toHaveBeenCalledWith(
            'https://facebook.com/carpoolear'
        );
    });

    it.each(['web', 'android', 'ios'])(
        'on %s opens Instagram, Facebook and the volunteer page through openExternalUrl',
        async (platform) => {
            setPlatform(platform);
            const wrapper = await mountDonationAfterRating();

            await linkWithText(wrapper, 'Instagram').trigger('click');
            await linkWithText(wrapper, 'Facebook').trigger('click');
            await linkWithText(
                wrapper,
                i18n.global.t('donationAfterRatingVolunteerLink')
            ).trigger('click');

            expect(externalLinkSpies.openExternalUrl.mock.calls).toEqual([
                ['https://instagram.com/carpoolear'],
                ['https://facebook.com/carpoolear'],
                ['https://carpoolear.com.ar/colabora-como-colaborar']
            ]);
            expect(open).toHaveBeenCalledWith(
                'https://instagram.com/carpoolear',
                '_blank'
            );
            expect(open).toHaveBeenCalledWith(
                'https://facebook.com/carpoolear',
                '_blank'
            );
        }
    );
});
