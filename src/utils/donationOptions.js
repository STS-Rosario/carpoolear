/** Preset donation tiers shown in donation modals (ARS). */
export const DONATION_TIERS = [
    {
        amount: 3000,
        labelKey: 'donationTierCafe',
        icon: 'fa-coffee',
        onceUrl: 'https://mpago.la/1WhaoLf',
        monthlyUrl:
            'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848a2fd5c9018a33702cc50181'
    },
    {
        amount: 6000,
        labelKey: 'donationTierBeer',
        icon: 'fa-beer',
        onceUrl: 'https://mpago.la/1SB6on8',
        monthlyUrl:
            'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848cee0ea5018d0e9ea71016d7'
    },
    {
        amount: 12000,
        labelKey: 'donationTierFood',
        icon: 'fa-cutlery',
        onceUrl: 'https://mpago.la/2USgEBv',
        monthlyUrl:
            'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497030fc7019705478b370068'
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
