import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripData.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripData trip car display', () => {
    it('shows patente on driver trips when car is present', () => {
        expect(viewSource).toContain('trip.car.patente');
        expect(viewSource).toContain('!trip.is_passenger');
        expect(viewSource).toContain('autoEliminado');
    });
});
