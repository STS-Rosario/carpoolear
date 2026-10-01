import { describe, it, expect } from 'vitest';
import {
    REPORT_DATA_AVAILABLE_FROM,
    REPORT_GROUP_BY_OPTIONS,
    REPORT_METHOD_OPTIONS,
    defaultReportFilters,
    reportFiltersFromQuery,
    reportFiltersToQuery,
    validateReportFilters
} from './identityVerificationReportFilters';

const TODAY = new Date(2026, 9, 15, 12, 0, 0); // 2026-10-15 local time

describe('identity verification report filter options', () => {
    it('exposes the group by and method values the API accepts', () => {
        expect(REPORT_GROUP_BY_OPTIONS).toEqual(['month', 'week', 'day']);
        expect(REPORT_METHOD_OPTIONS).toEqual(['all', 'manual', 'mercado_pago']);
    });

    it('knows the first day with recorded data', () => {
        expect(REPORT_DATA_AVAILABLE_FROM).toBe('2026-09-17');
    });
});

describe('defaultReportFilters', () => {
    it('covers the last six months up to today, grouped by month, all methods', () => {
        expect(defaultReportFilters(TODAY)).toEqual({
            from: '2026-05-01',
            to: '2026-10-15',
            groupBy: 'month',
            method: 'all',
            surface: '',
            platform: '',
            appVersion: ''
        });
    });

    it('crosses year boundaries', () => {
        expect(defaultReportFilters(new Date(2027, 1, 3)).from).toBe('2026-09-01');
    });
});

describe('reportFiltersFromQuery', () => {
    it('returns defaults for an empty query', () => {
        expect(reportFiltersFromQuery({}, TODAY)).toEqual(defaultReportFilters(TODAY));
    });

    it('reads every filter from snake_case query params', () => {
        expect(
            reportFiltersFromQuery(
                {
                    from: '2026-09-17',
                    to: '2026-09-30',
                    group_by: 'day',
                    method: 'manual',
                    surface: 'choice_cards',
                    platform: 'ios',
                    app_version: '4.0.19'
                },
                TODAY
            )
        ).toEqual({
            from: '2026-09-17',
            to: '2026-09-30',
            groupBy: 'day',
            method: 'manual',
            surface: 'choice_cards',
            platform: 'ios',
            appVersion: '4.0.19'
        });
    });

    it('falls back to defaults for invalid values', () => {
        const filters = reportFiltersFromQuery(
            { from: '17/09/2026', to: '2026-13-45', group_by: 'year', method: 'sms' },
            TODAY
        );

        expect(filters.from).toBe('2026-05-01');
        expect(filters.to).toBe('2026-10-15');
        expect(filters.groupBy).toBe('month');
        expect(filters.method).toBe('all');
    });

    it('uses the first value when a param is repeated', () => {
        expect(reportFiltersFromQuery({ method: ['manual', 'all'] }, TODAY).method).toBe('manual');
    });
});

describe('reportFiltersToQuery', () => {
    it('always writes dates, group_by and method, and only non-empty optional filters', () => {
        expect(
            reportFiltersToQuery({
                from: '2026-09-01',
                to: '2026-10-31',
                groupBy: 'week',
                method: 'all',
                surface: '',
                platform: 'android',
                appVersion: ' 4.0.19 '
            })
        ).toEqual({
            from: '2026-09-01',
            to: '2026-10-31',
            group_by: 'week',
            method: 'all',
            platform: 'android',
            app_version: '4.0.19'
        });
    });

    it('round-trips through reportFiltersFromQuery', () => {
        const filters = {
            from: '2026-09-17',
            to: '2026-10-01',
            groupBy: 'day',
            method: 'mercado_pago',
            surface: 'pending_switch',
            platform: 'web',
            appVersion: ''
        };

        expect(reportFiltersFromQuery(reportFiltersToQuery(filters), TODAY)).toEqual(filters);
    });
});

describe('validateReportFilters', () => {
    it('accepts a valid range', () => {
        expect(validateReportFilters({ from: '2026-09-01', to: '2026-09-01' })).toBeNull();
    });

    it('requires both dates', () => {
        expect(validateReportFilters({ from: '', to: '2026-09-01' })).toBe('adminIvrErrorFechasRequeridas');
        expect(validateReportFilters({ from: '2026-09-01', to: '' })).toBe('adminIvrErrorFechasRequeridas');
    });

    it('rejects a range that ends before it starts', () => {
        expect(validateReportFilters({ from: '2026-10-01', to: '2026-09-30' })).toBe('adminIvrErrorRangoInvalido');
    });
});
