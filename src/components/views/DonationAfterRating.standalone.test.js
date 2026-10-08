// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';
import dialogs from '../../services/dialogs.js';

const donationApi = vi.hoisted(() => ({
    getTiers: vi.fn(() => Promise.reject(new Error('offline'))),
    checkoutOnce: vi.fn(() =>
        Promise.resolve({ init_point: 'https://mp.test/once' })
    ),
    checkoutMonthly: vi.fn(() =>
        Promise.resolve({ init_point: 'https://mp.test/monthly' })
    ),
    checkoutQrOrder: vi.fn(() =>
        Promise.resolve({
            payment_id: 88,
            qr_data: 'DONATE_QR',
            order_id: 'ord-donate'
        })
    ),
    getPaymentStatus: vi.fn(() =>
        Promise.resolve({ payment_id: 88, status: 'pending' })
    )
}));

vi.mock('../../services/api/Donation.js', () => ({ default: donationApi }));

async function mountPage(props = {}, appConfig = {}) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    const { useProfileStore } = await import('../../stores/profile');
    useAuthStore().$patch({
        auth: true,
        user: { id: 42, name: 'Ana' },
        appConfig: {
            platform_donations_api_enabled: true,
            platform_donations_qr_enabled: true,
            ...appConfig
        }
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
        donationApi.checkoutQrOrder.mockClear();
        donationApi.getPaymentStatus.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
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

    it('hides the rating-specific "Continuar sin aportar" skip button', async () => {
        const { wrapper } = await mountPage();

        expect(wrapper.find('.donation-after-rating__btn-skip').exists()).toBe(
            false
        );
        expect(wrapper.text()).not.toContain(
            'Continuar sin aportar'
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
            trip_id: undefined,
            user_id: 42
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
            trip_id: undefined,
            user_id: 42
        });
        expect(open).toHaveBeenCalledWith('https://mp.test/once', '_blank');
    });

    it('records the refusal and returns to trips from the after-rating "Continuar sin aportar" button', async () => {
        const { wrapper, registerDonation, push } = await mountPage({ tripId: 7 });
        const skip = wrapper.find('.donation-after-rating__btn-skip');

        expect(skip.exists()).toBe(true);
        expect(skip.element.tagName).toBe('BUTTON');
        expect(skip.text().replace(/\s+/g, ' ').trim()).toBe(
            'Continuar sin aportar'
        );

        await skip.trigger('click');
        await flushPromises();

        expect(registerDonation).toHaveBeenCalledWith({
            has_donated: 0,
            has_denied: 1,
            ammount: 0,
            trip_id: 7
        });
        expect(push).toHaveBeenCalledWith({ name: 'trips' });
    });

    it('does not record a refusal from the skip button in preview mode', async () => {
        const message = vi.spyOn(dialogs, 'message').mockImplementation(() => {});
        const { wrapper, registerDonation, push } = await mountPage({
            tripId: 7,
            preview: true
        });

        await wrapper.find('.donation-after-rating__btn-skip').trigger('click');
        await flushPromises();

        expect(message).toHaveBeenCalled();
        expect(registerDonation).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });

    it('uses the after-rating source and trip when a trip is given', async () => {
        const { wrapper } = await mountPage({ tripId: 7 });
        await wrapper.find('input#donationAfterRatingOnce-5000').setValue(true);

        await buttonWithText(wrapper, 'donationAfterRatingOnceCta').trigger(
            'click'
        );
        await flushPromises();

        expect(wrapper.find('.donation-after-rating__btn-skip').exists()).toBe(
            true
        );
        expect(donationApi.checkoutOnce).toHaveBeenCalledWith({
            amount: 5000,
            source: 'after_rating',
            trip_id: 7,
            user_id: 42
        });
    });

    it('hides the QR payment button when QR donations are disabled', async () => {
        const { wrapper } = await mountPage(
            {},
            { platform_donations_qr_enabled: false }
        );

        expect(buttonWithText(wrapper, 'pagarConQR')).toBeFalsy();
    });

    it('starts a QR order for a one-time aporte and keeps the user on the page', async () => {
        const { wrapper, push } = await mountPage();
        await wrapper.find('input#donationAfterRatingOnce-5000').setValue(true);

        await buttonWithText(wrapper, 'pagarConQR').trigger('click');
        await flushPromises();

        expect(donationApi.checkoutQrOrder).toHaveBeenCalledWith({
            amount: 5000,
            source: 'donate_page',
            trip_id: undefined,
            user_id: 42
        });
        expect(open).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
        expect(wrapper.find('.qr-payment-panel').exists()).toBe(true);
        expect(wrapper.text()).toContain(i18n.global.t('escaneáConAppMercadoPago'));
    });

    it('polls QR payment status and returns to trips when approved', async () => {
        vi.useFakeTimers();
        donationApi.getPaymentStatus
            .mockResolvedValueOnce({ payment_id: 88, status: 'pending' })
            .mockResolvedValueOnce({ payment_id: 88, status: 'approved' });

        const { wrapper, push } = await mountPage();
        await wrapper.find('input#donationAfterRatingOnce-5000').setValue(true);
        await buttonWithText(wrapper, 'pagarConQR').trigger('click');
        await flushPromises();

        await vi.advanceTimersByTimeAsync(3000);
        await flushPromises();
        expect(push).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(3000);
        await flushPromises();

        expect(donationApi.getPaymentStatus).toHaveBeenCalledWith(88);
        expect(push).toHaveBeenCalledWith({ name: 'trips' });
        expect(wrapper.find('.qr-payment-panel').exists()).toBe(false);
    });
});
