// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';

const donationApi = vi.hoisted(() => ({
    getTiers: vi.fn(() => Promise.reject(new Error('offline'))),
    checkoutOnce: vi.fn(() =>
        Promise.resolve({ init_point: 'https://mp.test/once' })
    ),
    checkoutMonthly: vi.fn(() =>
        Promise.resolve({ init_point: 'https://mp.test/monthly' })
    )
}));

vi.mock('../../services/api/Donation.js', () => ({ default: donationApi }));

async function mountPage(props = {}) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    const { useProfileStore } = await import('../../stores/profile');
    useAuthStore().$patch({
        auth: true,
        user: { id: 42, name: 'Ana' },
        appConfig: { platform_donations_api_enabled: true }
    });
    const registerDonation = vi.fn(() => Promise.resolve());
    useProfileStore().registerDonation = registerDonation;
    const push = vi.fn();

    const { default: DonationAfterRating } = await import(
        './DonationAfterRating.vue'
    );
    const wrapper = mount(DonationAfterRating, {
        props,
        global: {
            plugins: [pinia, i18n],
            mocks: { $router: { push }, $publicImg: () => '' },
            stubs: { DonationAfterRatingHero: true }
        }
    });
    await flushPromises();
    return { wrapper, registerDonation, push };
}

function buttonWithText(wrapper, key) {
    return wrapper
        .findAll('button')
        .find((button) => button.text().includes(i18n.global.t(key)));
}

describe('DonationAfterRating without a trip (Aportar page)', () => {
    let open;

    beforeAll(async () => {
        await import('./DonationAfterRating.vue');
    }, 30000);

    beforeEach(() => {
        open = vi.fn();
        vi.stubGlobal('open', open);
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        donationApi.checkoutOnce.mockClear();
        donationApi.checkoutMonthly.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('renders the monthly and one-time CTAs', async () => {
        const { wrapper } = await mountPage();

        expect(
            buttonWithText(wrapper, 'donationAfterRatingJoinCommunityMonthly')
        ).toBeTruthy();
        expect(buttonWithText(wrapper, 'donationAfterRatingOnceCta')).toBeTruthy();
    });

    it('hides the rating-specific "No puedo aportar" skip link', async () => {
        const { wrapper } = await mountPage();

        expect(wrapper.find('.donation-after-rating__skip-link').exists()).toBe(
            false
        );
        expect(wrapper.text()).not.toContain(
            i18n.global.t('donationAfterRatingCannotContributeLink')
        );
    });

    it('starts the monthly checkout without a trip and opens it outside the app', async () => {
        const { wrapper, registerDonation, push } = await mountPage();
        await wrapper.find('input#donationAfterRatingMonthly-7500').setValue(true);

        await buttonWithText(
            wrapper,
            'donationAfterRatingJoinCommunityMonthly'
        ).trigger('click');
        await flushPromises();

        expect(donationApi.checkoutMonthly).toHaveBeenCalledWith({
            amount: 7500,
            source: 'donate_page',
            trip_id: undefined
        });
        expect(open).toHaveBeenCalledWith('https://mp.test/monthly', '_blank');
        expect(registerDonation).not.toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith({ name: 'trips' });
    });

    it('starts the one-time checkout without a trip', async () => {
        const { wrapper } = await mountPage();
        await wrapper.find('input#donationAfterRatingOnce-5000').setValue(true);

        await buttonWithText(wrapper, 'donationAfterRatingOnceCta').trigger(
            'click'
        );
        await flushPromises();

        expect(donationApi.checkoutOnce).toHaveBeenCalledWith({
            amount: 5000,
            source: 'donate_page',
            trip_id: undefined
        });
        expect(open).toHaveBeenCalledWith('https://mp.test/once', '_blank');
    });

    it('keeps the after-rating skip link and trip source when a trip is given', async () => {
        const { wrapper } = await mountPage({ tripId: 7 });
        await wrapper.find('input#donationAfterRatingOnce-5000').setValue(true);

        await buttonWithText(wrapper, 'donationAfterRatingOnceCta').trigger(
            'click'
        );
        await flushPromises();

        expect(wrapper.find('.donation-after-rating__skip-link').exists()).toBe(
            true
        );
        expect(donationApi.checkoutOnce).toHaveBeenCalledWith({
            amount: 5000,
            source: 'after_rating',
            trip_id: 7
        });
    });
});
