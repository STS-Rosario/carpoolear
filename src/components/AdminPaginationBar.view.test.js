import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AdminPaginationBar.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('AdminPaginationBar component', () => {
    it('renders per-page selector with allowed options', () => {
        expect(componentSource).toContain("{{ $t('adminItemsPerPage') }}");
        expect(componentSource).toContain('ADMIN_PER_PAGE_OPTIONS');
        expect(componentSource).toContain('@change="onPerPageChange"');
        expect(componentSource).toContain("emit('update:perPage'");
    });

    it('renders pager before per-page selector so pagination stays on the left', () => {
        const pagerIndex = componentSource.indexOf('admin-pagination-bar__pager');
        const perPageIndex = componentSource.indexOf('admin-pagination-bar__per-page');
        expect(pagerIndex).toBeGreaterThan(-1);
        expect(perPageIndex).toBeGreaterThan(pagerIndex);
        expect(componentSource).toContain("{{ $t('anterior') }}");
        expect(componentSource).toContain("{{ $t('siguiente') }}");
    });
});
