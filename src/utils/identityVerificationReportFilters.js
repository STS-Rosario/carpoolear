import dayjs from '../dayjs';

export const REPORT_GROUP_BY_OPTIONS = ['month', 'week', 'day'];
export const REPORT_METHOD_OPTIONS = ['all', 'manual', 'mercado_pago'];
export const REPORT_PLATFORM_OPTIONS = ['android', 'ios', 'web'];

/** Identity verification events are recorded from this day on (no backfill). */
export const REPORT_DATA_AVAILABLE_FROM = '2026-09-17';

const DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_MONTHS_BACK = 5;

function firstValue(value) {
    return Array.isArray(value) ? value[0] : value;
}

function queryString(value) {
    const first = firstValue(value);
    return first == null ? '' : String(first).trim();
}

function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && dayjs(value, DATE_FORMAT, true).isValid();
}

function oneOf(value, options, fallback) {
    return options.includes(value) ? value : fallback;
}

export function defaultReportFilters(today = new Date()) {
    const now = dayjs(today);
    return {
        from: now.subtract(DEFAULT_MONTHS_BACK, 'month').startOf('month').format(DATE_FORMAT),
        to: now.format(DATE_FORMAT),
        groupBy: 'month',
        method: 'all',
        surface: '',
        platform: '',
        appVersion: ''
    };
}

export function reportFiltersFromQuery(query = {}, today = new Date()) {
    const defaults = defaultReportFilters(today);
    const from = queryString(query.from);
    const to = queryString(query.to);
    return {
        from: isValidDate(from) ? from : defaults.from,
        to: isValidDate(to) ? to : defaults.to,
        groupBy: oneOf(queryString(query.group_by), REPORT_GROUP_BY_OPTIONS, defaults.groupBy),
        method: oneOf(queryString(query.method), REPORT_METHOD_OPTIONS, defaults.method),
        surface: queryString(query.surface),
        platform: queryString(query.platform),
        appVersion: queryString(query.app_version)
    };
}

export function reportFiltersToQuery(filters) {
    const query = {
        from: filters.from,
        to: filters.to,
        group_by: filters.groupBy,
        method: filters.method
    };
    const optional = {
        surface: filters.surface,
        platform: filters.platform,
        app_version: filters.appVersion
    };
    Object.keys(optional).forEach((key) => {
        const value = queryString(optional[key]);
        if (value) {
            query[key] = value;
        }
    });
    return query;
}

/** Returns an i18n key describing the problem, or null when the filters can be sent. */
export function validateReportFilters(filters) {
    if (!filters.from || !filters.to) {
        return 'adminIvrErrorFechasRequeridas';
    }
    if (filters.from > filters.to) {
        return 'adminIvrErrorRangoInvalido';
    }
    return null;
}
