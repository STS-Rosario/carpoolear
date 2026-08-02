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

    it('uses a compact person-icon circle instead of profile photo avatars', () => {
        expect(src).toContain('trip_passenger_avatar');
        expect(src).toContain('fa-user');
        expect(src).not.toContain('v-imgSrc:profile');
        expect(src).not.toContain('trip_passenger_image');
        expect(src).not.toContain('trip_driver_img');
    });

    it('keeps owner-only remove/chat actions', () => {
        expect(src).toContain('removePassenger');
        expect(src).toMatch(/v-if="owner"/);
    });
});

describe('TripPassengers.vue desktop heading', () => {
    it('falls back to pasajerosSubidos and only forces the mobile section-title class on mobile', () => {
        expect(src).toContain("$t('pasajerosSubidos')");
        expect(src).toMatch(/isMobile/);
        expect(src).not.toMatch(
            /class="title-margined trip-detail__section-title"/
        );
    });
});
