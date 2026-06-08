import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createLiveLocationMarkerUpdater } from './liveLocationMapHelpers.js';
import { bindLiveLocationMapZoomPersistence } from './liveLocationMap.js';

const mapSource = fs.readFileSync(
    path.resolve(__dirname, 'liveLocationMap.js'),
    'utf8'
);

describe('liveLocationMap', () => {
    it('imports Leaflet styles for map rendering', () => {
        expect(mapSource).toContain("import 'leaflet/dist/leaflet.css'");
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

    it('bindLiveLocationMapZoomPersistence saves zoom on zoomend', () => {
        const storage = {
            getItem: vi.fn(),
            setItem: vi.fn()
        };
        const handlers = {};
        const map = {
            on: vi.fn((event, handler) => {
                handlers[event] = handler;
            }),
            getZoom: vi.fn(() => 16)
        };

        bindLiveLocationMapZoomPersistence(map, storage);
        handlers.zoomend();

        expect(storage.setItem).toHaveBeenCalledWith('liveLocationMapZoom', '16');
    });

    it('createLiveLocationMap uses persisted zoom helpers', () => {
        expect(mapSource).toContain('getLiveLocationMapZoom');
        expect(mapSource).toContain('bindLiveLocationMapZoomPersistence');
    });
});
