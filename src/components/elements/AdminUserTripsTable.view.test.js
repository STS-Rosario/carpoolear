import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const tablePath = path.resolve(__dirname, 'AdminUserTripsTable.vue');
const source = fs.readFileSync(tablePath, 'utf8');

describe('AdminUserTripsTable', () => {
    it('renders trip metadata columns with public id link', () => {
        expect(source).toContain("{{ $t('id') }}");
        expect(source).toContain("{{ $t('origen') }}");
        expect(source).toContain("{{ $t('destino') }}");
        expect(source).toContain("{{ $t('fecha') }}");
        expect(source).toContain("{{ $t('hora') }}");
        expect(source).toContain("{{ $t('asientosTotales') }}");
        expect(source).toContain("{{ $t('estado') }}");
        expect(source).toMatch(
            /<router-link[\s\S]*name: 'detail_trip'[\s\S]*target="_blank"[\s\S]*\{\{ trip\.id \}\}/
        );
    });

    it('opens trip detail popup from ver detalle action', () => {
        expect(source).toContain("{{ $t('verDetalleViaje') }}");
        expect(source).toContain('openDetail');
        expect(source).toContain("'open-detail'");
    });

    it('shows cancel button for active trips and calls cancel handler', () => {
        expect(source).toContain("{{ $t('cancelarViaje') }}");
        expect(source).toContain('cancelTrip');
        expect(source).toContain('!trip.deleted');
    });
});
