import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'LiveLocationTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('LiveLocationTrip.vue', () => {
    it('shows authenticated trip live map with polling', () => {
        expect(viewSource).toContain('live-location-map');
        expect(viewSource).toContain('fetchTripView');
        expect(viewSource).toContain('beginViewerPolling');
        expect(viewSource).toContain('loadingData');
        expect(viewSource).not.toMatch(/:data="loaded"/);
        expect(viewSource).toContain('$nextTick');
        expect(viewSource).toContain('syncMapAfterRender');
        expect(viewSource).toContain('LiveLocationLastUpdated');
        expect(viewSource).toContain('tripView.recorded_at');
        expect(viewSource).toContain('liveLocationSharingStopped');
        expect(viewSource).toContain('isWaitingForLiveLocation');
        expect(viewSource).toContain('getTripLiveLocationViewMode');
        expect(viewSource).toContain("viewMode === 'stopped'");
    });
});
