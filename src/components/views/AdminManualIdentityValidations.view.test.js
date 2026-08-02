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

    it('renders admin pagination bar with per-page selector', () => {
        expect(viewSource).toContain('AdminPaginationBar');
        expect(viewSource).toContain('getManualIdentityValidations');
        expect(viewSource).toContain('show_resolved');
    });

    it('reloads list from API when show-resolved preference changes', () => {
        expect(viewSource).toContain('getShowResolvedManualIdentityValidations');
        expect(viewSource).toContain('saveShowResolvedManualIdentityValidations');
        expect(viewSource).toContain('show_resolved');
        expect(viewSource).toContain(':data="displayedList"');
        expect(viewSource).toContain('v-for="item in displayedList"');
    });

    it('renders sortable column headers for manual validation rows', () => {
        expect(viewSource).toContain('MANUAL_IDENTITY_VALIDATION_SORT_COLUMNS');
        expect(viewSource).toContain('sortManualIdentityValidationsList');
        expect(viewSource).toContain('getNextManualIdentityValidationSortState');
        expect(viewSource).toContain('toggleSort(');
        expect(viewSource).toContain('admin-manual-th-sort');
        expect(viewSource).toContain('sortKey === column.key');
        expect(viewSource).toContain('toggleSort(column.key)');
        expect(viewSource).not.toContain("@click=\"toggleSort('acciones')\"");
    });

});
