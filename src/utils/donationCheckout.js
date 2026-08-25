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
    return Boolean(appConfig?.platform_donations_api_enabled);
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
        const payload = {
            amount: parseInt(amount, 10),
            source,
            trip_id: tripId || undefined
        };
        const response =
            type === 'monthly'
                ? await donationApi.checkoutMonthly(payload)
                : await donationApi.checkoutOnce(payload);

        const initPoint = response?.init_point ?? response?.data?.init_point;
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
