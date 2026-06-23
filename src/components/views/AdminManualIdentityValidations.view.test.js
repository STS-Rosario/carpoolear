import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminManualIdentityValidations.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminManualIdentityValidations view', () => {
    it('links user profile action to the admin user profile route', () => {
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).not.toContain("name: 'profile'");
    });

    it('renders a show-resolved checkbox above the table', () => {
        expect(viewSource).toContain("{{ $t('mostrarResueltos') }}");
        expect(viewSource).toContain('v-model="showResolved"');
        expect(viewSource.indexOf('mostrarResueltos')).toBeLessThan(viewSource.indexOf('<table'));
    });

    it('filters the displayed list using resolved-case helpers', () => {
        expect(viewSource).toContain('filterManualIdentityValidationsList');
        expect(viewSource).toContain('getShowResolvedManualIdentityValidations');
        expect(viewSource).toContain('saveShowResolvedManualIdentityValidations');
        expect(viewSource).toContain(':data="displayedList"');
        expect(viewSource).toContain('v-for="item in displayedList"');
    });

    it('renders sortable column headers for manual validation rows', () => {
        expect(viewSource).toContain('sortManualIdentityValidationsList');
        expect(viewSource).toContain('getNextManualIdentityValidationSortState');
        expect(viewSource).toContain('toggleSort(');
        expect(viewSource).toContain('admin-manual-th-sort');
        expect(viewSource).toContain('sortKey ===');
        expect(viewSource).toContain("@click=\"toggleSort('id')\"");
        expect(viewSource).toContain("@click=\"toggleSort('user_name')\"");
        expect(viewSource).toContain("@click=\"toggleSort('paid_at')\"");
        expect(viewSource).toContain("@click=\"toggleSort('submitted_at')\"");
        expect(viewSource).toContain("@click=\"toggleSort('waiting_time')\"");
        expect(viewSource).toContain("@click=\"toggleSort('paid')\"");
        expect(viewSource).toContain("@click=\"toggleSort('review_status')\"");
        expect(viewSource).not.toContain("@click=\"toggleSort('acciones')\"");
    });
});
