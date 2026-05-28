import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripData.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripData trip car display', () => {
    it('does not duplicate patente (shown in TripDescription instead)', () => {
        expect(viewSource).not.toContain('trip.car.patente');
    });
});
