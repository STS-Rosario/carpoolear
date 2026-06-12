import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'MyTrips.vue');
const source = fs.readFileSync(viewPath, 'utf8');

function getTripComponentTags() {
    return source.match(/<Trip[\s\S]*?(?:\/>|<\/Trip>)/g) || [];
}

describe('MyTrips seat requests section', () => {
    it('shows solicitudes de asiento instead of proximos viajes como pasajero', () => {
        expect(source).toContain("$t('solicitudesDeAsiento')");
        expect(source).toContain('SeatRequestTrip');
        expect(source).not.toContain("$t('viajesEstoySubido')");
        expect(source).not.toContain('passengerTrips');
    });
});

describe('MyTrips trip card navigation', () => {
    it('disables trip info modal on every trip card so clicks go to detail page', () => {
        const tripTags = getTripComponentTags();

        expect(tripTags.length).toBe(3);

        tripTags.forEach((tag) => {
            expect(tag).toContain(':clickModal="false"');
        });
    });

    it('does not use admin-only trip modal pattern from profile or admin views', () => {
        expect(source).not.toContain(':clickModal="true"');
        expect(source).not.toContain(':clickModal="user.is_admin"');
    });
});

describe('MyTrips pending rates carpoodatos modal', () => {
    it('does not show the carpoodatos hint modal for pending ratings', () => {
        expect(source).not.toContain('showModalPendingRates');
        expect(source).not.toContain('carpoodatosImportanteCalificar');
        expect(source).not.toContain('carpoodatosTiempoCalificar');
        expect(source).not.toContain('carpoodatosNoBorrar');
        expect(source).not.toContain('carpoodatosDeciLoQuePensas');
    });
});

describe('MyTrips donation after positive rating', () => {
    it('does not render the donation request modal', () => {
        expect(source).not.toContain('showModalRequestDonation');
        expect(source).not.toContain('v-if="showModalRequestDonation"');
    });

    it('redirects to the full-page donation prompt after a positive rating', () => {
        expect(source).toContain('shouldPromptDonationAfterRating');
        expect(source).toMatch(/name:\s*'donate-after-rating'/);
        expect(source).toMatch(/params:\s*\{\s*tripId/);
    });
});
