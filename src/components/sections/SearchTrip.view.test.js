import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'SearchTrip.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('SearchTrip advanced filters', () => {
    it('renders filtros avanzados as cog link beside foreign country filter on desktop', () => {
        expect(source).toContain('search-filters-desktop');
        expect(source).toContain('advanced-filters-toggle-desktop');
        expect(source).toContain('advanced-filters-toggle_link');
        expect(source).toContain('fa-cog');
        expect(source).toContain('toggleAdvancedFilters');
        expect(source).toContain("@click.prevent=\"toggleAdvancedFilters\"");
        expect(source).toContain("$t('filtrosAvanzados')");
        expect(source).toContain('cursor: pointer');
        expect(source).toContain('margin-left');
        expect(source).not.toContain('id="cbxAdvancedFilters"');
    });

    it('renders filtros avanzados toggle above search button on mobile', () => {
        const mobileBlock = source.slice(
            source.indexOf('advanced-filters-toggle-mobile'),
            source.indexOf('btn-search')
        );
        expect(mobileBlock).toContain('advanced-filters-toggle-mobile');
        expect(mobileBlock).toContain('advanced-filters-toggle_link');
        expect(mobileBlock).toContain('fa-cog');
        expect(mobileBlock).toContain('v-show="isMobile && !autoSearch"');
        expect(mobileBlock).not.toContain('id="cbxAdvancedFiltersMobile"');
    });

    it('toggles advanced filters section with hide carpooleado and allow preferences', () => {
        expect(source).toContain('search-advanced-filters');
        expect(source).toMatch(/v-show="showAdvancedFilters/);
        expect(source).toContain("$t('esconderViajesCarpooleados')");
        expect(source).toContain('$t(field.labelKey)');
        expect(source).toContain('allowPreferenceFilterFields');
        expect(source).toContain('v-model="$data[field.modelKey]"');
        expect(source).toContain('ALLOW_PREFERENCE_FILTER_FIELDS');
        expect(source).toContain("$t('filtroCualquiera')");
    });

    it('emits advanced filter params through appendAllowPreferenceParams', () => {
        expect(source).toContain('appendAllowPreferenceParams');
        expect(source).toContain('params.hide_carpooleado = this.hideCarpooleado');
        expect(source).toContain("this.$emit('trip-search', params)");
    });

    it('hydrates advanced filters from search params', () => {
        expect(source).toContain('hydrateAllowPreferenceFilters');
        expect(source).toContain('hasAdvancedSearchFilters');
        expect(source).toContain('parameters.hide_carpooleado');
    });

    it('resets advanced filters when clearing the search form', () => {
        expect(source).toContain('resetAdvancedFilters');
    });
});
