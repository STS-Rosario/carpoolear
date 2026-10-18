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

    it('only links the avatar/name to the profile for owners or accepted passengers', () => {
        expect(src).toContain('canViewPassengerProfiles');
        expect(src).toContain('isAcceptedPassengerOnTrip');
        expect(src).toMatch(
            /v-if="canViewPassengerProfiles"[\s\S]*?toUserProfile\(p\)[\s\S]*?trip_passenger_avatar"/
        );
        expect(src).toMatch(
            /v-if="canViewPassengerProfiles"[\s\S]*?toUserProfile\(p\)[\s\S]*?trip_passenger_name"/
        );
    });

    it('still renders the passenger name without a link when profiles are not viewable', () => {
        expect(src).toMatch(
            /v-else[\s\S]*?trip_passenger_avatar--static/
        );
        expect(src).toMatch(
            /v-else[\s\S]*?trip_passenger_name--static[\s\S]*?p\.first_name/
        );
    });

    it('defines canViewPassengerProfiles as owner or accepted passenger', () => {
        expect(src).toMatch(
            /canViewPassengerProfiles\(\)\s*{\s*return\s*\(\s*this\.owner\s*\|\|\s*isAcceptedPassengerOnTrip\(/
        );
    });
});

describe('TripPassengers.vue desktop heading', () => {
    it('falls back to pasajerosSubidos and only forces the mobile section-title class on mobile', () => {
        expect(src).toContain("$t('pasajerosSubidos')");
        expect(src).toMatch(/isMobile/);
    });
});
