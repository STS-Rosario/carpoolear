export function formatContributionDisplayAmount(cents) {
    const value = Number(cents);
    if (!Number.isFinite(value) || value <= 0) {
        return '0,00';
    }
    return (value / 100).toFixed(2).replace('.', ',');
}

export function formatPesoIntegerFromCents(cents) {
    const value = Number(cents);
    const pesos = Number.isFinite(value) && value > 0 ? Math.round(value / 100) : 0;
    return String(pesos).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function contributionUnitsFromCents(cents) {
    const value = Number(cents);
    if (!Number.isFinite(value) || value <= 0) {
        return '';
    }
    return String(value / 100);
}
