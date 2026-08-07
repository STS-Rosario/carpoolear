import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'SearchTrip.vue');
const cssPath = path.resolve(
    __dirname,
    '../../styles/components/trips-search.css'
);
const source = fs.readFileSync(viewPath, 'utf8');
const cssSource = fs.readFileSync(cssPath, 'utf8');

describe('SearchTrip advanced filters', () => {
    it('renders filtros avanzados as cog link beside foreign country filter on desktop', () => {
        expect(source).toContain('search-filters-desktop');
        expect(source).toContain('advanced-filters-toggle-desktop');
        expect(source).toContain('advanced-filters-toggle_link');
        expect(source).toContain('fa-cog');
        expect(source).toContain('toggleAdvancedFilters');
        expect(source).toContain('@click.prevent="toggleAdvancedFilters"');
        expect(source).toContain("$t('filtrosAvanzados')");
        expect(source).toContain('cursor: pointer');
        expect(source).toContain('advanced-filters-toggle-desktop');
        expect(source).not.toContain('id="cbxAdvancedFilters"');
    });

    it('renders filtros avanzados toggle above search button on mobile', () => {
        const mobileBlock = source.slice(
            source.indexOf('advanced-filters-toggle-mobile'),
            source.indexOf('trips-search__submit--mobile')
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

    it('stacks hide-carpooleado and date-range checkboxes with matching dark grey labels', () => {
        expect(source).toContain('trips-search__advanced-checkboxes');
        const desktop = source.slice(
            source.indexOf('search-advanced-filters-desktop'),
            source.indexOf('search-advanced-filters-mobile')
        );
        const mobile = source.slice(
            source.indexOf('search-advanced-filters-mobile')
        );
        for (const block of [desktop, mobile]) {
            const dateAt = block.indexOf('date-range-search-select_wrapper');
            const hideAt = block.indexOf('hide-carpooleado-select_wrapper');
            expect(dateAt).toBeGreaterThan(-1);
            expect(hideAt).toBeGreaterThan(dateAt);
        }
        expect(cssSource).toMatch(
            /\.trips-search__advanced-checkboxes\s*\{[^}]*flex-direction:\s*column/
        );
        expect(cssSource).toMatch(
            /\.trips-search__advanced-checkboxes[\s\S]*?\.cbx_label\s*\{[^}]*color:\s*var\(--ds-input-label\)/
        );
    });

    it('adds Buscar en rango de fechas checkbox and Desde/Hasta date pickers', () => {
        expect(source).toContain("$t('buscarEnRangoDeFechas')");
        expect(source).toContain('v-model="dateRangeEnabled"');
        expect(source).toContain('id="cbxDateRangeSearch"');
        expect(source).toContain('id="cbxDateRangeSearchMobile"');
        expect(source).toContain("$t('desde')");
        expect(source).toContain("$t('hasta')");
        expect(source).toContain('v-if="dateRangeEnabled"');
        expect(source).toContain('ref="datepickerTo"');
        expect(source).toContain('appendDateSearchParams');
        expect(source).toContain('hydrateDateRangeSearch');
        expect(source).toContain('date_changed');
    });
});

describe('SearchTrip mobile submit', () => {
    it('shows a primary Buscar button on mobile with a stable test id', () => {
        expect(source).toContain('data-testid="trips-search-submit"');
        expect(source).toMatch(
            /isMobile && !autoSearch[\s\S]*?data-testid="trips-search-submit"[\s\S]*?variant="primary"[\s\S]*?\$t\('buscar'\)/
        );
    });

    it('keeps the mobile Buscar button in document flow at the end of the form', () => {
        expect(cssSource).toMatch(
            /\.trips-search--mobile\s+\.trips-search__submit\s*\{[^}]*position:\s*static/
        );
        expect(cssSource).not.toMatch(
            /\.trips-search--mobile\s+\.trips-search__submit\s*\{[^}]*position:\s*fixed/
        );
        expect(source).toMatch(
            /trips-search__submit--mobile[\s\S]*\$t\('buscar'\)[\s\S]*<\/div>\s*<\/div>\s*<\/div>\s*<\/template>/
        );
    });
});
