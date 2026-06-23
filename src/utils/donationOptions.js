/** Preset donation tiers shown in donation modals (ARS). */
export const DONATION_TIERS = [
    {
        amount: 5000,
        labelKey: 'donationTierCafe',
        icon: 'fa-coffee',
        onceUrl: 'https://mpago.la/1SB6on8',
        monthlyUrl:
            'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848cee0ea5018d0e9ea71016d7'
    },
    {
        amount: 7500,
        labelKey: 'donationTierBeer',
        icon: 'fa-beer',
        onceUrl: 'MP_LINK_UNIQUE_7500',
        monthlyUrl: 'MP_LINK_MONTHLY_7500'
    },
    {
        amount: 12000,
        labelKey: 'donationTierFood',
        icon: 'fa-cutlery',
        onceUrl: 'MP_LINK_UNIQUE_12000',
        monthlyUrl: 'MP_LINK_MONTHLY_12000'
    }
];

const DEFAULT_ONCE_URL = 'https://mpago.la/jgap';
const DEFAULT_MONTHLY_URL = 'http://mpago.la/2XdoxpF';

const TIER_BY_AMOUNT = new Map(DONATION_TIERS.map((tier) => [tier.amount, tier]));

function tierForAmount(amount) {
    const numeric = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    return TIER_BY_AMOUNT.get(numeric);
}

export function getDonationOnceUrl(amount) {
    return tierForAmount(amount)?.onceUrl ?? DEFAULT_ONCE_URL;
}

export function getDonationMonthlyUrl(amount) {
    return tierForAmount(amount)?.monthlyUrl ?? DEFAULT_MONTHLY_URL;
}

export function appendDonationTrackingUserId(url, userId) {
    if (!userId) {
        return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}u=${userId}`;
}
