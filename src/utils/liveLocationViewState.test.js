import { describe, expect, it } from 'vitest';
import {
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
});
