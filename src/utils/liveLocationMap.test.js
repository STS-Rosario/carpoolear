import { describe, expect, it, vi } from 'vitest';
import { createLiveLocationMarkerUpdater } from './liveLocationMap.js';

describe('liveLocationMap', () => {
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
});
