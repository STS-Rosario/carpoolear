import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'OngoingTripCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('OngoingTripCard.vue', () => {
    it('shows the ongoing trip heading and uses TripCardShell', () => {
        expect(viewSource).toContain('viajeEnProgreso');
        expect(viewSource).toContain('TripCardShell');
        expect(viewSource).toContain('getTripLocationLabels');
    });

    it('shows driver info, schedule and actions via shell', () => {
        expect(viewSource).toContain('TripCardShell');
        expect(viewSource).toContain('compartirUbicacionTiempoReal');
        expect(viewSource).toContain('compartiendoUbicacionTiempoReal');
        expect(viewSource).toContain('isSharingLiveLocation');
        expect(viewSource).toContain('loadLiveShareStatus');
        expect(viewSource).toContain("name: 'trip_live_share'");
        expect(viewSource).toContain('shouldShowLiveLocationShare');
        expect(viewSource).toContain('showShareLocationLink');
        expect(viewSource).toContain('#actions-extra');
    });

    it('routes profile and detail clicks through the shell', () => {
        expect(viewSource).toContain('@profile-click="onProfileClick"');
        expect(viewSource).toContain('@detail-click="onDetailClick"');
        expect(viewSource).toContain("name: 'profile'");
        expect(viewSource).toContain("name: 'detail_trip'");
    });

    it('builds driverTripsLabel from user.trips_count via perfilViajesParticipados', () => {
        expect(viewSource).toMatch(
            /driverTripsLabel\(\)\s*\{[\s\S]*trips_count\s*==\s*null[\s\S]*perfilViajesParticipados[\s\S]*normalizeTripsCount/
        );
        expect(viewSource).toContain(':trips-count-label="driverTripsLabel"');
    });
});
