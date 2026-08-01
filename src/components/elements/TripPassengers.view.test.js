import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(__dirname, 'TripPassengers.vue'), 'utf8');

describe('TripPassengers.vue public joined list', () => {
    it('shows accepted passengers from trip.passenger using first_name', () => {
        expect(src).toContain('trip.passenger');
        expect(src).toContain('first_name');
        expect(src).toContain("$t('tripDetailJoined')");
        expect(src).not.toMatch(/\{\{\s*p\.name\s*\}\}/);
    });

    it('keeps owner-only remove/chat actions', () => {
        expect(src).toContain('removePassenger');
        expect(src).toMatch(/v-if="owner"/);
    });
});
