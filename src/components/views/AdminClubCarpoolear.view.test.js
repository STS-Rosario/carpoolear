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
        expect(viewSource).toContain("this.$t('miembrosActuales')");
        expect(viewSource).toContain("this.$t('miembrosAnteriores')");
        expect(viewSource).toContain("status: 'former'");
        expect(viewSource).toContain('parseClubMembersListFromRoute');
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).toContain('item.joined_at');
        expect(viewSource).toContain('item.left_at');
        expect(viewSource).toContain('item.total_donated_cents');
        expect(viewSource).toContain('syncRouteQuery');
    });

    it('uses AppSegmentToggle for current vs former members', () => {
        expect(viewSource).toContain('AppSegmentToggle');
        expect(viewSource).toContain('membershipStatusOptions');
        expect(viewSource).not.toContain('btn-primary');
        expect(viewSource).not.toContain('btn-default');
        expect(viewSource).not.toContain('admin-club-status-switch');
    });

    it('uses AppField, AppInput and AppButton for filters', () => {
        expect(viewSource).toContain('AppField');
        expect(viewSource).toContain('AppInput');
        expect(viewSource).toContain('AppButton');
        expect(viewSource).not.toContain('class="btn btn-default"');
    });
});
