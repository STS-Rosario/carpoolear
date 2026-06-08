import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { buildLiveShareUrl, getUpdateIntervalMs } from './tripLiveShareUtils.js';

describe('tripLiveShareUtils', () => {
    beforeEach(() => {
        vi.stubGlobal('window', {
            location: { origin: 'https://carpoolear.com.ar' }
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('builds public live share url from token', () => {
        expect(buildLiveShareUrl('abc123')).toBe(
            'https://carpoolear.com.ar/live/abc123'
        );
    });

    it('uses configured update interval for sharer', () => {
        expect(getUpdateIntervalMs('sharer')).toBe(45000);
    });

    it('uses configured poll interval for viewer', () => {
        expect(getUpdateIntervalMs('viewer')).toBe(60000);
    });
});
