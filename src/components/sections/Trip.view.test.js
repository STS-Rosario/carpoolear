import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Trip.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('Trip card quick actions', () => {
    it('does not link My Trips cards to the passenger-only trip detail route', () => {
        expect(source).not.toContain("location: 'passenger'");
        expect(source).not.toContain("$t('verPasajerosSubidos')");
        expect(source).not.toContain('detail_trip_location');
    });
});
