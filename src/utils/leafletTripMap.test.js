// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import L from 'leaflet';
import {
    fitLeafletMapToLatLngs,
    fitLeafletMapToOsrmRoutes
} from './leafletTripMap.js';

describe('leafletTripMap', () => {
    it('fitLeafletMapToOsrmRoutes fits bounds of all route coordinates', () => {
        const map = { fitBounds: vi.fn() };
        const routes = [
            {
                coordinates: [
                    L.latLng(-32.95, -60.65),
                    L.latLng(-38.0, -57.55)
                ]
            },
            {
                coordinates: [
                    L.latLng(-32.95, -60.65),
                    L.latLng(-36.5, -56.0),
                    L.latLng(-38.0, -57.55)
                ]
            }
        ];

        fitLeafletMapToOsrmRoutes(map, routes);

        expect(map.fitBounds).toHaveBeenCalledTimes(1);
        const [bounds, options] = map.fitBounds.mock.calls[0];
        expect(bounds.isValid()).toBe(true);
        expect(bounds.getSouth()).toBeCloseTo(-38.0, 1);
        expect(bounds.getNorth()).toBeCloseTo(-32.95, 1);
        expect(options.maxZoom).toBe(12);
        expect(options.padding).toEqual([24, 24]);
    });

    it('fitLeafletMapToLatLngs uses waypoint bounds with maxZoom cap', () => {
        const map = { fitBounds: vi.fn() };
        fitLeafletMapToLatLngs(map, [
            L.latLng(-32.95, -60.65),
            L.latLng(-38.0, -57.55)
        ]);

        expect(map.fitBounds).toHaveBeenCalledTimes(1);
        expect(map.fitBounds.mock.calls[0][1].maxZoom).toBe(12);
    });
});
