import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewSource = fs.readFileSync(
    path.resolve(__dirname, 'AdminClubCarpoolear.vue'),
    'utf8'
);

describe('AdminClubCarpoolear', () => {
    it('switches current and former members and persists status in the URL', () => {
        expect(viewSource).toContain("{{ $t('adminClubCarpoolear') }}");
        expect(viewSource).toContain("{{ $t('miembrosActuales') }}");
        expect(viewSource).toContain("{{ $t('miembrosAnteriores') }}");
        expect(viewSource).toContain("status: 'former'");
        expect(viewSource).toContain('parseClubMembersListFromRoute');
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).toContain('item.joined_at');
        expect(viewSource).toContain('item.left_at');
        expect(viewSource).toContain('item.total_donated_cents');
        expect(viewSource).toContain('syncRouteQuery');
    });
});
