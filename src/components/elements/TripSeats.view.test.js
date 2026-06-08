import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripSeats.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripSeats.vue rear seat comfort preference', () => {
    it('shows rear seat comfort copy for every viewer when the trip enables it', () => {
        expect(viewSource).toContain("$t('atrasViajanSolo2Personas')");
        expect(viewSource).toContain('shouldShowRearComfortNote');
        expect(viewSource).toMatch(
            /v-if="showRearComfortNote"[\s\S]*?trip-seats__rear-comfort-note--above[\s\S]*?trip-seats__availability/s
        );
        expect(viewSource).not.toMatch(
            /v-else class="trip-seats__availability"[\s\S]*?trip_seats-available_label[\s\S]*?trip-seats__rear-comfort-note(?!--above)/s
        );
    });

    it('uses a larger font size for rear comfort copy in trip detail', () => {
        expect(viewSource).toMatch(
            /\.trip-seats__rear-comfort-note\s*\{[\s\S]*?font-size:\s*1\.15em/
        );
    });
});

describe('TripSeats.vue zero available seats label', () => {
    it('shows "lugares libres" label when no seats are available', () => {
        expect(viewSource).toMatch(
            /v-if="trip\.seats_available == 1"[\s\S]*?v-else[\s\S]*?\$t\('Lugares'\)[\s\S]*?\$t\('libres'\)/
        );
    });

    it('adds vertical margin around the available seats block', () => {
        expect(viewSource).toMatch(
            /\.trip-seats__availability\s*\{[\s\S]*?margin:\s*0\.75rem 0/
        );
    });
});

describe('TripSeats.vue accepted passenger co-travelers', () => {
    it('shows co-passenger first names below available seats for accepted passengers', () => {
        expect(viewSource).toContain('isAcceptedPassengerOnTrip');
        expect(viewSource).toContain('buildCoPassengerNamesText');
        expect(viewSource).toContain("$t('viajasCon'");
        expect(viewSource).toContain('trip-seats__co-passengers');
    });

    it('places rear comfort note above seats for accepted passengers', () => {
        expect(viewSource).toMatch(
            /trip-seats__rear-comfort-note--above[\s\S]*?trip-seats__availability/s
        );
    });

    it('styles co-passenger copy with top margin and a larger font', () => {
        expect(viewSource).toMatch(
            /\.trip-seats__co-passengers\s*\{[\s\S]*?margin-top:\s*0\.75rem[\s\S]*?font-size:\s*1\.15em/
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
