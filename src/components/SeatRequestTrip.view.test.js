import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'SeatRequestTrip.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('SeatRequestTrip card', () => {
    it('renders trip info with a colored seat request status footer', () => {
        expect(source).toContain('<Trip');
        expect(source).toContain('seat-request-status');
        expect(source).toContain('getSeatRequestStatusClass');
        expect(source).toContain('getSeatRequestStatusLabelKey');
    });
});
