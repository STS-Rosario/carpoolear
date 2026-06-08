import { describe, expect, it } from 'vitest';
import { formatLiveLocationTripDateTime } from './liveLocationFormat.js';
import {
    getPassengerPublicLiveLocationIntroParams,
    isPassengerPublicLiveShare
} from './liveLocationPublicIntro.js';

describe('liveLocationPublicIntro', () => {
    const passengerPublicView = {
        is_passenger_share: true,
        sharer: { id: 2, name: 'Ana Pasajera' },
        driver: { id: 1, name: 'Juan Conductor' },
        destination: 'Rosario',
        trip_date: '2026-06-08T16:00:00-03:00'
    };

    it('detects passenger public live shares', () => {
        expect(isPassengerPublicLiveShare(passengerPublicView)).toBe(true);
        expect(
            isPassengerPublicLiveShare({
                is_passenger_share: false,
                sharer: { id: 1, name: 'Juan Conductor' },
                driver: { id: 1, name: 'Juan Conductor' }
            })
        ).toBe(false);
    });

    it('builds intro params for passenger public live shares', () => {
        expect(getPassengerPublicLiveLocationIntroParams(passengerPublicView)).toEqual({
            sharerName: 'Ana Pasajera',
            driverName: 'Juan Conductor',
            destination: 'Rosario',
            tripDateTime: formatLiveLocationTripDateTime('2026-06-08T16:00:00-03:00')
        });
    });
});
