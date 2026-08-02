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

    it('uses AppButton and AppField for pager and per-page selector', () => {
        expect(componentSource).toContain("import AppButton from './ui/AppButton.vue'");
        expect(componentSource).toContain("import AppField from './ui/AppField.vue'");
        expect(componentSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?size="sm"[\s\S]*?\$emit\('prev'\)/
        );
        expect(componentSource).toMatch(
            /<AppField[\s\S]*?perPageSelectId[\s\S]*?admin-pagination-bar__per-page-select/
        );
        expect(componentSource).not.toContain('form-control');
        expect(componentSource).not.toContain('btn btn-default');
    });
});
