import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const { rasterLayer, vectorLayer, tileLayerAddTo, maplibreAddTo, maplibreGL, tileLayer } =
    vi.hoisted(() => {
        const rasterLayer = { kind: 'raster' };
        const vectorLayer = { kind: 'vector' };
        const tileLayerAddTo = vi.fn(() => rasterLayer);
        const maplibreAddTo = vi.fn(() => vectorLayer);
        const maplibreGL = vi.fn(() => ({ addTo: maplibreAddTo }));
        const tileLayer = vi.fn(() => ({ addTo: tileLayerAddTo }));
        return {
            rasterLayer,
            vectorLayer,
            tileLayerAddTo,
            maplibreAddTo,
            maplibreGL,
            tileLayer
        };
    });

vi.mock('leaflet', () => ({
    default: {
        tileLayer,
        maplibreGL
    }
}));

vi.mock('@maplibre/maplibre-gl-leaflet', () => ({}));
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));
vi.mock('./mapStyleSpanishLabels.js', () => ({
    patchLibertyStyleForSpanishLabels: (style) => style
}));

import {
    loadPatchedMapStyle,
    resetPatchedMapStyleCache,
    addVectorTileLayer,
    DEFAULT_RASTER_TILE_URL
} from './mapTiles.js';
import L from 'leaflet';

describe('mapTiles', () => {
    beforeEach(() => {
        resetPatchedMapStyleCache();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('clears patched style cache on fetch failure and retries on second call', async () => {
        const styleJson = { layers: [] };
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ ok: false, status: 503 })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(styleJson)
            });
        vi.stubGlobal('fetch', fetchMock);

        await expect(loadPatchedMapStyle()).rejects.toThrow(/Map style fetch failed/);
        const style = await loadPatchedMapStyle();

        expect(style).toEqual(styleJson);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('addVectorTileLayer falls back to raster when vector layer creation fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ layers: [] })
        }));
        maplibreGL.mockImplementationOnce(() => {
            throw new Error('maplibre init failed');
        });

        const map = {};
        const layer = await addVectorTileLayer(map);

        expect(layer).toBe(rasterLayer);
        expect(L.tileLayer).toHaveBeenCalledWith(
            DEFAULT_RASTER_TILE_URL,
            expect.objectContaining({ attribution: expect.any(String) })
        );
        expect(tileLayerAddTo).toHaveBeenCalledWith(map);
    });
});
