import dayjs from '../dayjs';

export function formatMemberSinceMonthYear(createdAt) {
    if (!createdAt) {
        return '';
    }

    const date = dayjs(createdAt);

    return date.isValid() ? date.format('MMMM YYYY') : '';
}

export function getMembershipDuration(createdAt, now = dayjs()) {
    if (!createdAt) {
        return null;
    }

    const start = dayjs(createdAt);
    const end = dayjs(now);

    if (!start.isValid() || !end.isValid()) {
        return null;
    }

    const years = end.diff(start, 'year');
    if (years >= 1) {
        return { unit: 'years', count: years };
    }

    const months = end.diff(start, 'month');
    if (months >= 1) {
        return { unit: 'months', count: months };
    }

    const days = Math.max(end.diff(start, 'day'), 0);
    return { unit: 'days', count: days };
}

export function normalizeTripsCount(value) {
    const count = Number(value);

    if (!Number.isFinite(count) || count < 0) {
        return 0;
    }

    return Math.trunc(count);
}
