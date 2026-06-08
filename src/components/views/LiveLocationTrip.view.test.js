import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, '../components/views/LiveLocationTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('LiveLocationTrip.vue', () => {
    it('shows authenticated trip live map with polling', () => {
        expect(viewSource).toContain('live-location-map');
        expect(viewSource).toContain('fetchTripView');
        expect(viewSource).toContain('beginViewerPolling');
    });
});
