import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(
    path.resolve(__dirname, 'TripDetailRoute.vue'),
    'utf8'
);

describe('TripDetailRoute.vue', () => {
    it('renders trip-card style route timeline and date/time chips', () => {
        expect(src).toContain('trip-detail__route');
        expect(src).toContain('getTripLocationLabels');
        expect(src).toContain('formatTripCardDate');
        expect(src).toContain('formatTripCardTime');
        expect(src).toContain('trip-detail__chip');
        expect(src).toContain('fa-calendar');
        expect(src).toContain('fa-clock-o');
    });
});
