import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewSource = fs.readFileSync(
    path.resolve(__dirname, 'AdminDonaciones.vue'),
    'utf8'
);

describe('AdminDonaciones', () => {
    it('renders a sortable payments table with profile links and URL filters', () => {
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).toContain('parseDonationLedgerListFromRoute');
        expect(viewSource).toContain('syncRouteQuery');
        expect(viewSource).toContain('toggleSort');
        expect(viewSource).toContain("{{ $t('adminDonaciones') }}");
        expect(viewSource).toContain('item.kind');
        expect(viewSource).toContain('item.user_name');
        expect(viewSource).toContain('AdminPaginationBar');
        expect(viewSource).toContain('kind');
        expect(viewSource).toContain('status');
    });
});
