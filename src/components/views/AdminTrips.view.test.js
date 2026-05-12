import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminTrips.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminTrips table', () => {
    it('lists trip id and keeps rows clickable for the detail modal', () => {
        expect(source).toContain("{{ $t('id') }}");
        expect(source).toContain('{{ viaje.id }}');
        expect(source).toContain('openTrip(viaje)');
        expect(source).toContain('admin-trips-row-clickable');
        expect(source).toMatch(/:key="viaje\.id"/);
    });
});
