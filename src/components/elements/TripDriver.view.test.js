import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripDriver.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('TripDriver profile and image when auth or driver is missing', () => {
    it('resolves profile id and image through helpers instead of reading user.id unguarded', () => {
        expect(source).toContain('getTripDriverProfileId');
        expect(source).toContain('getTripDriverImage');
        expect(source).not.toMatch(
            /return this\.trip\.user\.id === this\.user\.id/
        );
        expect(source).not.toMatch(
            /return this\.user\.id === this\.trip\.user\.id/
        );
    });
});

describe('TripDriver profile navigation', () => {
    it('uses router-link with a shared visible-link class instead of click handlers', () => {
        expect(source).toContain('trip-driver-profile-link');
        expect(source).toContain('<router-link');
        expect(source).toContain(':to="driverProfileRoute"');
        expect(source).not.toMatch(/@click="goToProfile/);
        expect(source).not.toMatch(/v-on:click="goToProfile/);
    });

    it('links the driver profile image in the light theme card heading', () => {
        expect(source).toMatch(
            /<router-link[\s\S]*?trip_driver_img_container[\s\S]*?trip_driver_img/
        );
    });

    it('links the driver name in the light theme card heading', () => {
        expect(source).toMatch(
            /trip_driver_details[\s\S]*?<router-link[\s\S]*?trip_driver_name/
        );
    });

    it('links the driver profile image and name in the sidebar driver-profile layout', () => {
        expect(source).toMatch(
            /driver-profile[\s\S]*?<router-link[\s\S]*?trip_driver_img/
        );
        expect(source).toMatch(
            /driver-data[\s\S]*?<router-link[\s\S]*?trip\.user\.name/
        );
    });
});

describe('TripDriver trip-detail redesign header', () => {
    it('shows the redesign driver band whenever trip.user exists (mobile and desktop)', () => {
        expect(source).toContain('trip-driver__mobile');
        expect(source).toMatch(
            /v-if="trip\s*&&\s*trip\.user"|v-if="trip && trip\.user"/
        );
        expect(source).not.toMatch(
            /v-if="isMobile\s*&&\s*trip\s*&&\s*trip\.user"/
        );
        expect(source).toContain('getSeatsPillLabel');
        expect(source).toContain('trip-driver__seats');
        expect(source).toMatch(
            /v-if="!trip\.is_passenger\s*&&\s*isMobile"|v-if="isMobile\s*&&\s*!trip\.is_passenger"/
        );
        expect(source).toContain('getMembershipDuration');
        expect(source).toContain('respondeMensajesPorcentaje');
        expect(source).toContain('tiempoPromedioRespuesta');
        expect(source).not.toContain('licensePlate');
        expect(source).toContain('showDriverCarDetails');
        expect(source).toContain('TripCarDetails');
        expect(source).toContain('trip-driver__car');
        expect(source).toMatch(/user\.is_admin|is_admin/);
        expect(source).toMatch(/trip\?\.car\?\.patente|trip\.car/);
    });

    it('shows TripCarDetails on the right for passengers and admins instead of inline patente', () => {
        expect(source).toMatch(
            /trip-driver__mobile-info[\s\S]*TripCarDetails[\s\S]*trip-driver__car|TripCarDetails[\s\S]*class="trip-driver__car"/
        );
        expect(source).toMatch(
            /v-if="showDriverCarDetails"[\s\S]*TripCarDetails|TripCarDetails[\s\S]*v-if="showDriverCarDetails"/
        );
        expect(source).not.toMatch(
            /\$t\('patente'\)\s*\}\}: \{\{\s*licensePlate/
        );
    });

    it('shows the Usuario verificado pill next to the driver name', () => {
        expect(source).toContain('trip-driver__mobile-name-row');
        expect(source).toContain('trip-driver__mobile-name-cluster');
        expect(source).toContain('isDriverVerified');
        expect(source).toContain('trip-driver__verified');
        expect(source).toContain("$t('usuarioVerificado')");
        expect(source).toMatch(
            /trip-driver__mobile-name-cluster[\s\S]*trip-driver__mobile-name[\s\S]*trip-driver__verified/
        );
        expect(source).toContain('fa-check-circle');
    });

    it('sizes the desktop avatar to stretch with the adjacent content height', () => {
        expect(source).toMatch(
            /@media[^{]*min-width:\s*768px[^{]*\{[\s\S]*?\.trip-driver__mobile-top\s*\{[^}]*display:\s*grid/
        );
        expect(source).toMatch(
            /@media[^{]*min-width:\s*768px[^{]*\{[\s\S]*?\.trip_driver_img_container\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/
        );
        expect(source).toMatch(
            /@media[^{]*min-width:\s*768px[^{]*\{[\s\S]*?\.trip_driver_img\s*\{[^}]*position:\s*absolute/
        );
        expect(source).toMatch(
            /@media[^{]*min-width:\s*768px[^{]*\{[\s\S]*?\.trip_driver_img\s*\{[^}]*max-height:\s*none/
        );
    });
});
