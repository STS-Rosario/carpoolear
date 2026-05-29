import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripSeats.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripSeats.vue rear seat comfort preference', () => {
    it('shows rear seat comfort copy alongside available seats when enabled', () => {
        expect(viewSource).toContain("$t('atrasViajanSolo2Personas')");
        expect(viewSource).toMatch(
            /class="trip-seats__availability"[\s\S]*?trip_seats-available_label[\s\S]*?trip-seats__rear-comfort-note/s
        );
        expect(viewSource).toContain('trip-seats__rear-comfort-note');
    });
});

describe('TripSeats.vue zero available seats label', () => {
    it('shows "lugares libres" label when no seats are available', () => {
        expect(viewSource).toMatch(
            /v-if="trip\.seats_available === 0"[\s\S]*?\$t\('Lugares'\)[\s\S]*?\$t\('libres'\)/
        );
    });
});
