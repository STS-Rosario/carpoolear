import donationApi from '../services/api/Donation.js';
import {
    appendDonationTrackingUserId,
    DONATION_TIERS,
    getDonationMonthlyUrl,
    getDonationOnceUrl
} from './donationOptions.js';

let cachedTiers = null;

export async function fetchDonationTiers() {
    if (cachedTiers) {
        return cachedTiers;
    }

    try {
        const response = await donationApi.getTiers();
        const tiers = Array.isArray(response) ? response : response?.data;
        if (Array.isArray(tiers) && tiers.length > 0) {
            cachedTiers = tiers.map(normalizeTier);
            return cachedTiers;
        }
    } catch (error) {
        console.warn('fetchDonationTiers: falling back to static tiers.', error);
    }

    return DONATION_TIERS;
}

function normalizeTier(tier) {
    return {
        id: tier.id,
        amount: tier.amount ?? Math.round((tier.amount_cents || 0) / 100),
        labelKey: tier.label_key ?? tier.labelKey,
        icon: tier.icon,
        onceUrl: tier.onceUrl,
        monthlyUrl: tier.monthlyUrl
    };
}

export function isPlatformDonationsApiEnabled(appConfig) {
    return Boolean(appConfig?.['platform_donations_api_enabled']);
}

export function isPlatformDonationsQrEnabled(appConfig) {
    return Boolean(appConfig?.['platform_donations_qr_enabled']);
}

function buildDonationCheckoutPayload({ amount, source, tripId, userId }) {
    const payload = {
        amount: parseInt(amount, 10),
        source,
        trip_id: tripId || undefined
    };
    if (userId) {
        payload.user_id = userId;
    }
    return payload;
}

export async function startDonationCheckout({
    type,
    amount,
    source,
    tripId,
    userId,
    appConfig
}) {
    if (isPlatformDonationsApiEnabled(appConfig)) {
        const payload = buildDonationCheckoutPayload({
            amount,
            source,
            tripId,
            userId
        });
        const response =
            type === 'monthly'
                ? await donationApi.checkoutMonthly(payload)
                : await donationApi.checkoutOnce(payload);

        const initPoint =
            response?.['init_point'] ?? response?.data?.['init_point'];
        if (initPoint) {
            return initPoint;
        }
    }

    const staticUrl =
        type === 'monthly'
            ? getDonationMonthlyUrl(amount)
            : getDonationOnceUrl(amount);

    return appendDonationTrackingUserId(staticUrl, userId);
}

export async function startDonationQrCheckout({
    amount,
    source,
    tripId,
    userId,
    appConfig
}) {
    if (!isPlatformDonationsQrEnabled(appConfig)) {
        throw new Error('QR payment is not available');
    }

    const payload = buildDonationCheckoutPayload({
        amount,
        source,
        tripId,
        userId
    });
    const response = await donationApi.checkoutQrOrder(payload);
    return response?.data ?? response;
}

export async function fetchDonationPaymentStatus(paymentId) {
    const response = await donationApi.getPaymentStatus(paymentId);
    return response?.data ?? response;
}
