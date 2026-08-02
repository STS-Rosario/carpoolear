import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSearchTrips.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminSearchTrips user search', () => {
    it('uses UserSearchAutocomplete with maxResults for admin trip filter', () => {
        expect(source).toContain('UserSearchAutocomplete');
        expect(source).toContain(':max-results="3"');
    });

    it('hydrates filters from route-style params and emits initial persisted search', () => {
        expect(source).toContain("props: ['params']");
        expect(source).toContain('applyParams');
        expect(source).toContain('this.emit(true)');
        expect(source).toContain('params.user_id');
    });

    it('watches params so browser back updates filters and re-emits search', () => {
        expect(source).toContain('paramsSignature');
        expect(source).toMatch(/watch:\s*\{[\s\S]*paramsSignature/);
        expect(source).toContain('immediate: true');
        expect(source).toContain('applyParams');
    });

    it('matches app search DS: segment toggle, AppFields, compact Buscar', () => {
        expect(source).toContain(
            "import AppSegmentToggle from '../ui/AppSegmentToggle.vue'"
        );
        expect(source).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(source).toContain("import AppField from '../ui/AppField.vue'");
        expect(source).toContain('AppSegmentToggle');
        expect(source).toContain('roleToggleOptions');
        expect(source).not.toContain('btn-option');
        expect(source).not.toContain('btn-search');
        expect(source).not.toContain('optional-warning');
        expect(source).not.toContain('date-picker--cross');
        expect(source).toMatch(
            /<AppField[\s\S]*?:label="\$t\('origen'\)"[\s\S]*?optional/
        );
        expect(source).toMatch(
            /<AppField[\s\S]*?:label="\$t\('destino'\)"[\s\S]*?optional/
        );
        expect(source).toMatch(
            /<AppField[\s\S]*?:label="\$t\('fecha'\)"[\s\S]*?optional[\s\S]*?<DatePicker[\s\S]*?from_date/
        );
        expect(source).toMatch(
            /<AppField[\s\S]*?:label="\$t\('fecha'\)"[\s\S]*?optional[\s\S]*?<DatePicker[\s\S]*?to_date/
        );
        expect(source).toMatch(
            /<AppField[\s\S]*?optional[\s\S]*?UserSearchAutocomplete/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?size="sm"[\s\S]*?submitSearch/
        );
        expect(source).toContain('admin-search-trips');
        expect(source).toMatch(
            /\.admin-search-trips[\s\S]*?\.carpoolear-vue-dp[\s\S]*?\.dp__input/
        );
        expect(source).not.toContain('form-control');
        expect(source).not.toContain('btn btn-primary');
    });
});
