import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripDescription.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripDescription trip patente display', () => {
    it('shows patente above the description for driver trips', () => {
        expect(viewSource).toContain('patenteDelAuto');
        expect(viewSource).toContain('trip.car.patente');
        expect(viewSource).toContain('showTripPatente');
        expect(viewSource).toContain('!this.trip.is_passenger');
        expect(viewSource).toContain('autoEliminado');
    });
});
