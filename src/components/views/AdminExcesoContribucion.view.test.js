import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const listPath = path.resolve(__dirname, 'AdminExcesoContribucion.vue');
const detailPath = path.resolve(__dirname, 'AdminExcesoContribucionDetail.vue');

describe('AdminExcesoContribucion list view', () => {
    it('renders enriched columns and detail navigation', () => {
        const viewSource = fs.readFileSync(listPath, 'utf8');

        expect(viewSource).toContain('$t(column.labelKey)');
        expect(viewSource).toContain('TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS');
        expect(viewSource).toContain('user_name');
        expect(viewSource).toContain('exceso_contribucion_status');
        expect(viewSource).toContain('excess_contribution_support_tickets_count');
        expect(viewSource).toContain('adminExcessContributionDetailRoute');
        expect(viewSource).toContain('variant="primary"');
        expect(viewSource).toContain('AppButton');
        expect(viewSource).toContain('excessContributionSupportTicketsRoute');
        expect(viewSource).toContain('excessContributionStatusLabel');
        expect(viewSource).toContain("{{ $t('soloRequierenAccion') }}");
        expect(viewSource).toContain('requiresActionOnly');
        expect(viewSource).toContain('toggleSort');
        expect(viewSource).toContain('saveRequiresActionOnlyExcessContributions');
        expect(viewSource).toContain('getRequiresActionOnlyExcessContributions');
        expect(viewSource).toContain('admin-exceso-th-sort');
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
        expect(viewSource).toContain('excessContributionStatusActionLabel');
        expect(viewSource).toContain('excessContributionStatusButtonVariant');
        expect(viewSource).toContain('admin-exceso-action-links--top');
        expect(viewSource).toContain('admin-exceso-action-link');
        expect(viewSource).toContain("{{ $t('verPerfil') }}");
        expect(viewSource).toContain('router-link');
    });
});
