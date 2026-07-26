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

    it('renders prev/next pager controls when multiple pages exist', () => {
        expect(componentSource).toContain('pagination.total_pages > 1');
        expect(componentSource).toContain("{{ $t('anterior') }}");
        expect(componentSource).toContain("{{ $t('siguiente') }}");
        expect(componentSource).toContain("emit('prev')");
        expect(componentSource).toContain("emit('next')");
    });
});
