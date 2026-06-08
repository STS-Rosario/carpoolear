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
            /v-if="trip\.seats_available == 1"[\s\S]*?v-else[\s\S]*?\$t\('Lugares'\)[\s\S]*?\$t\('libres'\)/
        );
    });
});

describe('TripSeats.vue accepted passenger co-travelers', () => {
    it('shows co-passenger first names below available seats for accepted passengers', () => {
        expect(viewSource).toContain('isAcceptedPassengerOnTrip');
        expect(viewSource).toContain('getAcceptedCoPassengerFirstNames');
        expect(viewSource).toContain('formatSpanishNameList');
        expect(viewSource).toContain("$t('viajasCon'");
        expect(viewSource).toContain('trip-seats__co-passengers');
    });

    it('places rear comfort note above seats for accepted passengers', () => {
        expect(viewSource).toMatch(
            /trip-seats__rear-comfort-note--above[\s\S]*?trip-seats__availability/s
        );
    });

    it('does not add profile links or images for co-passengers', () => {
        const coPassengerBlock = viewSource.match(
            /trip-seats__co-passengers[\s\S]*?<\/span>/
        )?.[0];

        expect(coPassengerBlock).toBeTruthy();
        expect(coPassengerBlock).not.toMatch(/router-link|toUserProfile|v-imgSrc/);
    });
});
