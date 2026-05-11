export function getContributionWarningAmountPart(n, maxContributionCents) {
    const cents = Number(maxContributionCents);
    if (!Number.isFinite(cents) || cents <= 0) {
        return '';
    }
    return ` (${n(cents / 100, 'currency')})`;
}
