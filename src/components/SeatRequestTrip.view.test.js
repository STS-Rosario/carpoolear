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

    it('wraps trip and status in a shared card shell with grid column sizing', () => {
        expect(source).toContain('seat-request-trip__card');
        expect(source).toContain(':class="tripCardCountClass"');
        expect(source).toContain(':embeddedInSeatRequest="true"');
        expect(source).toMatch(
            /\.seat-request-trip__card :deep\(\.card-trip\) \{[\s\S]*?border-radius: 0;[\s\S]*?box-shadow: none;/
        );
    });
});
