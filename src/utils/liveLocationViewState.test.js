import { describe, expect, it } from 'vitest';
import {
    getTripLiveLocationViewMode,
    isLiveShareStopped,
    isWaitingForLiveLocation
} from './liveLocationViewState.js';

describe('liveLocationViewState', () => {
    it('detects stopped sharing', () => {
        expect(isLiveShareStopped({ is_active: false })).toBe(true);
        expect(isLiveShareStopped({ is_active: true, lat: null, lng: null })).toBe(
            false
        );
    });

    it('waits for location only while sharing is active without coordinates', () => {
        expect(isWaitingForLiveLocation({ is_active: true, lat: null, lng: null })).toBe(
            true
        );
        expect(isWaitingForLiveLocation({ is_active: false, lat: null, lng: null })).toBe(
            false
        );
        expect(
            isWaitingForLiveLocation({ is_active: true, lat: -34.6, lng: -58.38 })
        ).toBe(false);
    });

    it('returns stopped mode for inactive trip live view data', () => {
        expect(
            getTripLiveLocationViewMode(
                { is_active: false, lat: null, lng: null },
                true
            )
        ).toBe('stopped');
    });

    it('does not treat stopped sharing as waiting', () => {
        const stoppedView = { is_active: false, lat: null, lng: null };

        expect(getTripLiveLocationViewMode(stoppedView, true)).toBe('stopped');
        expect(isWaitingForLiveLocation(stoppedView)).toBe(false);
    });
});
