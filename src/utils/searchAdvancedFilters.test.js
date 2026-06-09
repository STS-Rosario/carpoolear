import { describe, it, expect } from 'vitest';
import {
    ANY_ALLOW_FILTER,
    appendAllowPreferenceParams,
    hydrateAllowPreferenceFilters,
    hasAdvancedSearchFilters
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
    });
});
