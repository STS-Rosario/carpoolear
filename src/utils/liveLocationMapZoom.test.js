import { describe, expect, it, vi } from 'vitest';
import {
    LIVE_LOCATION_MAP_DEFAULT_ZOOM,
    LIVE_LOCATION_MAP_ZOOM_KEY,
    getLiveLocationMapZoom,
    saveLiveLocationMapZoom
} from './liveLocationMapZoom.js';

describe('liveLocationMapZoom', () => {
    it('returns default zoom when nothing is stored', () => {
        const storage = { getItem: vi.fn(() => null) };

        expect(getLiveLocationMapZoom(storage)).toBe(LIVE_LOCATION_MAP_DEFAULT_ZOOM);
    });

    it('returns stored zoom when valid', () => {
        const storage = { getItem: vi.fn(() => '16') };

        expect(getLiveLocationMapZoom(storage)).toBe(16);
    });

    it('ignores invalid stored zoom values', () => {
        const storage = { getItem: vi.fn(() => 'not-a-number') };

        expect(getLiveLocationMapZoom(storage)).toBe(LIVE_LOCATION_MAP_DEFAULT_ZOOM);
    });

    it('persists zoom changes', () => {
        const storage = {
            getItem: vi.fn(),
            setItem: vi.fn()
        };

        saveLiveLocationMapZoom(17, storage);

        expect(storage.setItem).toHaveBeenCalledWith(
            LIVE_LOCATION_MAP_ZOOM_KEY,
            '17'
        );
    });
});
