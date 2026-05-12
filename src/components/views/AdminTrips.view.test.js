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

describe('AdminTrips URL state', () => {
    it('pushes list and trip detail query so back navigation can restore state', () => {
        expect(source).toContain('trip_id');
        expect(source).toContain('$router.push');
        expect(source).toContain('buildListRouteQuery');
        expect(source).toContain('pushListQueryToRouter');
        expect(source).toContain('syncTripDetailFromRoute');
        expect(source).toContain('routeQueryToSearchParams');
        expect(source).toMatch(/\$route\.query/);
    });

    it('deduplicates route query serialization for list vs full URL', () => {
        expect(source).toContain('normalizedRouteQuerySnapshot');
    });
});
