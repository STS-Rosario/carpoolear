import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminExcesoContribucion.vue');

describe('AdminExcesoContribucion view', () => {
    it('exists and loads trip excess contribution list from admin API', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain('getTripExcessContributions');
        expect(viewSource).toContain('formatTripContributionPesosLabel');
    });

    it('renders required table columns and profile link', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain("{{ $t('id') }}");
        expect(viewSource).toContain("{{ $t('origen') }}");
        expect(viewSource).toContain("{{ $t('destino') }}");
        expect(viewSource).toContain("{{ $t('contribucion') }}");
        expect(viewSource).toContain("{{ $t('contribucionPotencial') }}");
        expect(viewSource).toContain("{{ $t('tieneNotas') }}");
        expect(viewSource).toContain("{{ $t('verPerfil') }}");
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).toContain('has_private_note');
        expect(viewSource).toContain('AdminPaginationBar');
    });
});
