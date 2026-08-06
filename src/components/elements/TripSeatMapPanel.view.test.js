import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripSeatMapPanel.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripSeatMapPanel.vue', () => {
    it('renders a fixed driver seat and toggleable passenger seats', () => {
        expect(componentSource).toContain("$t('tripSeatMapDriver')");
        expect(componentSource).toContain("$t('tripSeatMapDriverRole')");
        expect(componentSource).toContain('passengerSeatAvailability');
        expect(componentSource).toContain('toggleSeat');
        expect(componentSource).toContain("$t('tripSeatMapAvailable')");
        expect(componentSource).toContain("$t('tripSeatMapUnavailable')");
        expect(componentSource).toContain('volante.svg');
        expect(componentSource).toContain('asiento.svg');
    });

    it('shows offering count or at-least-one message', () => {
        expect(componentSource).toContain("$t('tripSeatMapOffering'");
        expect(componentSource).toContain("$t('tripSeatMapOfferAtLeastOne')");
        expect(componentSource).toContain("$t('tripSeatMapHint')");
        expect(componentSource).toContain('countAvailableSeats');
    });
});
