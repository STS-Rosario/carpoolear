import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'SearchTrip.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('SearchTrip hide carpooleado filter', () => {
    it('renders a hide carpooleado checkbox with i18n label on desktop and mobile', () => {
        expect(source).toContain("v-model=\"hideCarpooleado\"");
        expect(source).toContain("id=\"cbxHideCarpooleado\"");
        expect(source).toContain("$t('esconderViajesCarpooleados')");
        expect(source).toContain('hide-carpooleado-select-desktop');
        expect(source).toContain('hide-carpooleado-select-mobile');
    });

    it('places desktop checkbox beside foreign country filter with spacing', () => {
        expect(source).toContain('search-filters-desktop');
        expect(source).toContain('hide-carpooleado-select-desktop');
        expect(source).toContain('margin-left');
    });

    it('places mobile checkbox above the search button', () => {
        const mobileBlock = source.slice(
            source.indexOf('hide-carpooleado-select-mobile'),
            source.indexOf('btn-search')
        );
        expect(mobileBlock).toContain('hide-carpooleado-select-mobile');
        expect(mobileBlock).toContain('v-show="isMobile && !autoSearch"');
    });

    it('emits hide_carpooleado when the checkbox is checked', () => {
        expect(source).toContain('hideCarpooleado: false');
        expect(source).toContain('params.hide_carpooleado = this.hideCarpooleado');
        expect(source).toContain("this.$emit('trip-search', params)");
    });

    it('hydrates hide carpooleado from search params', () => {
        expect(source).toContain('parameters.hide_carpooleado');
        expect(source).toContain('this.hideCarpooleado = true');
    });

    it('resets hide carpooleado when clearing the search form', () => {
        expect(source).toContain('this.hideCarpooleado = false');
    });
});
