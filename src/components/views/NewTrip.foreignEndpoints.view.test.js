import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const newTripViewPath = path.resolve(__dirname, 'NewTrip.vue');
const newTripViewSource = fs.readFileSync(newTripViewPath, 'utf8');

describe('NewTrip foreign endpoint validation', () => {
    it('allows one foreign endpoint when the other is in the home country', () => {
        expect(newTripViewSource).toContain('hasTooManyForeignTripEndpoints');
        expect(newTripViewSource).not.toMatch(
            /foreignPoints\s*\+=\s*p\.json\.country === this\.config\.osm_country \? 0 : 1/
        );
    });
});
