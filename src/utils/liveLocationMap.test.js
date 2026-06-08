import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createLiveLocationMarkerUpdater } from './liveLocationMapHelpers.js';
import { bindLiveLocationMapZoomPersistence } from './liveLocationMapZoom.js';

const mapSource = fs.readFileSync(
    path.resolve(__dirname, 'liveLocationMap.js'),
    'utf8'
);
const mapStyleSource = fs.readFileSync(
    path.resolve(__dirname, 'liveLocationMap.css'),
    'utf8'
);

describe('liveLocationMap', () => {
    it('imports Leaflet styles for map rendering', () => {
        expect(mapSource).toContain("import 'leaflet/dist/leaflet.css'");
        expect(mapSource).toContain('./liveLocationMap.css');
    });

    it('keeps live location map below header dropdown stacking', () => {
        expect(mapStyleSource).toContain('isolation: isolate');
        expect(mapStyleSource).toContain('z-index: 0');
    });

    it('createLiveLocationMarkerUpdater updates marker position', () => {
        const setLatLng = vi.fn();
        const panTo = vi.fn();
        const marker = { setLatLng };
        const map = { panTo };

        const updater = createLiveLocationMarkerUpdater(map, () => marker);
        updater(-34.6, -58.38);

        expect(setLatLng).toHaveBeenCalledWith([-34.6, -58.38]);
        expect(panTo).toHaveBeenCalledWith([-34.6, -58.38]);
    });

    it('createLiveLocationMap uses persisted zoom helpers', () => {
        expect(mapSource).toContain('getLiveLocationMapZoom');
        expect(mapSource).toContain('bindLiveLocationMapZoomPersistence');
    });
});
