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
    return mount(DonationAfterRating, {
        props: { tripId: 7 },
        global: {
            plugins: [pinia, i18n],
            mocks: { $router: { push: vi.fn() }, $publicImg: () => '' }
        }
    });
}

function learnMoreLink(wrapper) {
    return wrapper
        .findAll('a')
        .find((link) => link.text() === i18n.global.t('conoceMasDonar'));
}

describe('DonationAfterRating external links', () => {
    let open;
    let consoleError;

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

    it('on ios opens "conocé más" in the system browser without the nonexistent App.openUrl', async () => {
        setPlatform('ios');
        const wrapper = await mountDonationAfterRating();

        await learnMoreLink(wrapper).trigger('click');
        await flushPromises();

        expect(consoleError).not.toHaveBeenCalled();
        expect(open).toHaveBeenCalledWith(
            'https://carpoolear.com.ar/aportar?u=42',
            '_blank'
        );
    });

    it('on ios opens the Mercado Pago checkout without the nonexistent App.openUrl', async () => {
        setPlatform('ios');
        const wrapper = await mountDonationAfterRating();
        await wrapper.find('input#donation-5000').setValue(true);

        await wrapper
            .findAll('button')
            .find((button) => button.text() === i18n.global.t('unicaVez'))
            .trigger('click');
        await flushPromises();

        expect(consoleError).not.toHaveBeenCalled();
        expect(open).toHaveBeenCalledWith(
            'https://mpago.la/1SB6on8?u=42',
            '_blank'
        );
    });

    it.each([
        ['web', 'https://carpoolear.com.ar/aportar?u=42'],
        ['android', 'https://www.carpoolear.com.ar/aportar?u=42']
    ])(
        'on %s opens "conocé más" on the remote site (not the bundled app host)',
        async (platform, expectedUrl) => {
            setPlatform(platform);
            const wrapper = await mountDonationAfterRating();

            await learnMoreLink(wrapper).trigger('click');
            await flushPromises();

            expect(open).toHaveBeenCalledWith(expectedUrl, '_blank');
        }
    );
});
