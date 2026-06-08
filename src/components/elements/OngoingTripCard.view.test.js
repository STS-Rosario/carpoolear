import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'OngoingTripCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('OngoingTripCard.vue', () => {
    it('shows the ongoing trip heading and card layout', () => {
        expect(viewSource).toContain('viajeEnProgreso');
        expect(viewSource).toContain('ongoing-trip-card');
        expect(viewSource).toContain('getTripLocationLabels');
    });

    it('shows driver info, schedule and actions', () => {
        expect(viewSource).toContain('UserNameWithBadge');
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('compartirUbicacionTiempoReal');
        expect(viewSource).toContain('verDetalle');
        expect(viewSource).toContain("name: 'trip_live_share'");
        expect(viewSource).toContain('canStartSharing');
        expect(viewSource).toContain('showShareLocationLink');
    });
});
