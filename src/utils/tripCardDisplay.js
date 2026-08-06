export function getSeatsPillTone(seatsAvailable) {
    const n = Number(seatsAvailable) || 0;
    if (n <= 0) return 'full';
    if (n === 1) return 'low';
    if (n === 2) return 'medium';
    return 'high';
}

export function getSeatsPillLabel(seatsAvailable, t) {
    const n = Number(seatsAvailable) || 0;
    if (n <= 0) return t('Carpooleado');
    if (n === 1) return `1 ${String(t('Lugar')).toLowerCase()}`;
    return `${n} ${String(t('Lugares')).toLowerCase()}`;
}

export function formatTripCardDate(tripDate, dayjsFn) {
    if (!tripDate) return '';
    const formatted = dayjsFn(tripDate).format('ddd, D MMM');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatTripCardTime(tripDate, dayjsFn) {
    if (!tripDate) return '';
    return `${dayjsFn(tripDate).format('HH:mm')} hs`;
}

export function shouldShowTripCardPointDetail(user, pointDetail) {
    return Boolean(user) && Boolean(pointDetail);
}
