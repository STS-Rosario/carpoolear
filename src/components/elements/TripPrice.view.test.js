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

    it('derives reference contribution from comfort preference occupants', () => {
        expect(viewSource).toMatch(/from '\.\.\/\.\.\/utils\/tripPriceOccupants\.js'/);
        expect(viewSource).toContain('seatPriceCentsFromTripPriceCents');
        expect(viewSource).toMatch(
            /recommendedPricePerSeat\(\)[\s\S]*?seatPriceCentsFromTripPriceCents\([\s\S]*?this\.trip\.rear_max_two_passengers/s
        );
        expect(viewSource).not.toMatch(
            /recommendedPricePerSeat\(\)[\s\S]*?this\.trip\.total_seats \+ 1/s
        );
    });
});
