import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripDescription.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripDescription trip car display', () => {
    it('shows structured car details above the description for driver trips', () => {
        expect(viewSource).toContain('TripCarDetails');
        expect(viewSource).toContain('showTripCar');
        expect(viewSource).toContain('!this.trip.is_passenger');
    });
});
