import { describe, it, expect } from 'vitest';
import {
    ANY_ALLOW_FILTER,
    ALLOW_PREFERENCE_FILTER_FIELDS,
    appendAllowPreferenceParams,
    appendDateSearchParams,
    hydrateAllowPreferenceFilters,
    hydrateDateRangeSearch,
    hasAdvancedSearchFilters,
    readAllowPreferenceParamsFromQuery
} from './searchAdvancedFilters.js';

describe('searchAdvancedFilters', () => {
    it('does not append allow preference params when filters are any', () => {
        const params = {};
        appendAllowPreferenceParams(params, {
            allowAnimals: ANY_ALLOW_FILTER,
            allowSmoking: ANY_ALLOW_FILTER,
            allowKids: ANY_ALLOW_FILTER
        });
        expect(params).toEqual({});
    });

    it('appends boolean allow preference params when set to yes or no', () => {
        const params = {};
        appendAllowPreferenceParams(params, {
            allowAnimals: 'yes',
            allowSmoking: 'no',
            allowKids: ANY_ALLOW_FILTER
        });
        expect(params).toEqual({
            allow_animals: true,
            allow_smoking: false
        });
    });

    it('hydrates allow preference filters from search params', () => {
        expect(
            hydrateAllowPreferenceFilters({
                allow_animals: true,
                allow_smoking: false
            })
        ).toEqual({
            allowAnimals: 'yes',
            allowSmoking: 'no',
            allowKids: ANY_ALLOW_FILTER
        });
    });

    it('detects when advanced search filters are active', () => {
        expect(hasAdvancedSearchFilters({ hide_carpooleado: true })).toBe(true);
        expect(hasAdvancedSearchFilters({ allow_kids: false })).toBe(true);
        expect(hasAdvancedSearchFilters({ is_passenger: true })).toBe(false);
        expect(hasAdvancedSearchFilters({ from_date: '2026-08-01' })).toBe(true);
        expect(hasAdvancedSearchFilters({ to_date: '2026-08-10' })).toBe(true);
    });

    it('appends fuzzy date when range mode is off', () => {
        const params = {};
        appendDateSearchParams(params, {
            dateRangeEnabled: false,
            date: '2026-08-05',
            fromDate: '2026-08-01',
            toDate: '2026-08-10'
        });
        expect(params).toEqual({ date: '2026-08-05' });
    });

    it('appends open-ended from_date and to_date in range mode without date', () => {
        const onlyFrom = {};
        appendDateSearchParams(onlyFrom, {
            dateRangeEnabled: true,
            date: '2026-08-05',
            fromDate: '2026-08-01',
            toDate: ''
        });
        expect(onlyFrom).toEqual({ from_date: '2026-08-01' });

        const onlyTo = {};
        appendDateSearchParams(onlyTo, {
            dateRangeEnabled: true,
            date: '',
            fromDate: '',
            toDate: '2026-08-10'
        });
        expect(onlyTo).toEqual({ to_date: '2026-08-10' });

        const both = {};
        appendDateSearchParams(both, {
            dateRangeEnabled: true,
            date: 'ignored',
            fromDate: '2026-08-01',
            toDate: '2026-08-10'
        });
        expect(both).toEqual({
            from_date: '2026-08-01',
            to_date: '2026-08-10'
        });
    });

    it('hydrates date range mode from from_date and to_date params', () => {
        expect(
            hydrateDateRangeSearch({
                from_date: '2026-08-01',
                to_date: '2026-08-10'
            })
        ).toEqual({
            dateRangeEnabled: true,
            fromDate: '2026-08-01',
            toDate: '2026-08-10'
        });

        expect(hydrateDateRangeSearch({ date: '2026-08-05' })).toEqual({
            dateRangeEnabled: false,
            fromDate: '2026-08-05',
            toDate: ''
        });

        expect(hydrateDateRangeSearch({})).toEqual({
            dateRangeEnabled: false,
            fromDate: '',
            toDate: ''
        });
    });

    it('defines allow preference filter field metadata for the search form', () => {
        expect(ALLOW_PREFERENCE_FILTER_FIELDS).toEqual([
            expect.objectContaining({
                modelKey: 'allowAnimalsFilter',
                labelKey: 'preferenciaPermitidoAnimales'
            }),
            expect.objectContaining({
                modelKey: 'allowSmokingFilter',
                labelKey: 'preferenciaPermitidoFumar'
            }),
            expect.objectContaining({
                modelKey: 'allowKidsFilter',
                labelKey: 'preferenciaPermitidoNinos'
            })
        ]);
    });

    it('reads allow preference params from route query values', () => {
        const parseBoolean = (value) =>
            value === 'true' || value === '1' || value === true;

        expect(
            readAllowPreferenceParamsFromQuery(
                {
                    allow_animals: 'true',
                    allow_smoking: 'false'
                },
                parseBoolean
            )
        ).toEqual({
            allow_animals: true,
            allow_smoking: false
        });
    });
});
