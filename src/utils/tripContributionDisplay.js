export function formatContributionDisplayAmount(cents) {
    const value = Number(cents);
    if (!Number.isFinite(value) || value <= 0) {
        return '0,00';
    }
    return (value / 100).toFixed(2).replace('.', ',');
}

export function contributionUnitsFromCents(cents) {
    const value = Number(cents);
    if (!Number.isFinite(value) || value <= 0) {
        return '';
    }
    return String(value / 100);
}
