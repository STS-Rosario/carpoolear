import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripPrice.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripPrice.vue voluntary contribution display', () => {
    it('uses seat price helpers so unset prices hide the block and -1 shows i18n phrase', () => {
        expect(viewSource).toContain('shouldShowTripSeatPriceSection');
        expect(viewSource).toContain('isVoluntaryContributionSeatPrice');
        expect(viewSource).toMatch(/tripSeatPrice\.js/);
    });
});
