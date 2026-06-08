import dayjs from '../dayjs';

export function formatMemberSinceMonthYear(createdAt) {
    if (!createdAt) {
        return '';
    }

    const date = dayjs(createdAt);

    return date.isValid() ? date.format('MMMM YYYY') : '';
}

export function normalizeTripsCount(value) {
    const count = Number(value);

    if (!Number.isFinite(count) || count < 0) {
        return 0;
    }

    return Math.trunc(count);
}
