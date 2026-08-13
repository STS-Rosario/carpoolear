import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const listPath = path.resolve(__dirname, 'AdminExcesoContribucion.vue');
const detailPath = path.resolve(__dirname, 'AdminExcesoContribucionDetail.vue');

describe('AdminExcesoContribucion list view', () => {
    it('renders enriched columns and detail navigation', () => {
        const viewSource = fs.readFileSync(listPath, 'utf8');

        expect(viewSource).toContain("{{ $t('usuario') }}");
        expect(viewSource).toContain("{{ $t('ticketSoporte') }}");
        expect(viewSource).toContain("{{ $t('estado') }}");
        expect(viewSource).toContain('user_name');
        expect(viewSource).toContain('exceso_contribucion_status');
        expect(viewSource).toContain('excess_contribution_support_tickets_count');
        expect(viewSource).toContain('adminTripSearchRoute');
        expect(viewSource).toContain('adminExcessContributionDetailRoute');
        expect(viewSource).toContain('excessContributionSupportTicketsRoute');
        expect(viewSource).toContain('excessContributionStatusLabel');
    });
});

describe('AdminExcesoContribucionDetail view', () => {
    it('loads detail from API and exposes status actions', () => {
        const viewSource = fs.readFileSync(detailPath, 'utf8');

        expect(viewSource).toContain('getTripExcessContribution');
        expect(viewSource).toContain('updateTripExcessContributionStatus');
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).toContain('adminTripSearchRoute');
        expect(viewSource).toContain('excessContributionSupportTicketsRoute');
        expect(viewSource).toContain('excessContributionStatusActions');
        expect(viewSource).toContain("{{ $t('marcarExcesoContribucionResuelto') }}");
    });
});
