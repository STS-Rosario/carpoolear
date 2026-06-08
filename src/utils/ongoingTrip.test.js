import { describe, expect, it } from 'vitest';
import dayjs from '../dayjs';
import {
    estimatedTimeToMinutes,
    getTripLocationLabels,
    isWithinOngoingTripWindow,
    canStartSharing,
    isLiveLocationParticipant,
    shouldShowLiveLocationShare
} from './ongoingTrip.js';

describe('ongoingTrip estimatedTimeToMinutes', () => {
    it('parses HH:mm estimated time into minutes', () => {
        expect(estimatedTimeToMinutes('04:02')).toBe(242);
        expect(estimatedTimeToMinutes('01:30')).toBe(90);
    });

    it('returns zero when estimated time is missing', () => {
        expect(estimatedTimeToMinutes(null)).toBe(0);
        expect(estimatedTimeToMinutes('')).toBe(0);
    });
});

describe('ongoingTrip isWithinOngoingTripWindow', () => {
    const start = dayjs('2026-06-02 16:00:00');

    it('is true one hour before departure', () => {
        const now = start.subtract(30, 'minute');
        expect(isWithinOngoingTripWindow(now, start, '01:00')).toBe(true);
    });

    it('is true during the trip', () => {
        const now = start.add(20, 'minute');
        expect(isWithinOngoingTripWindow(now, start, '01:00')).toBe(true);
    });

    it('is true up to thirty minutes after estimated arrival', () => {
        const now = start.add(80, 'minute');
        expect(isWithinOngoingTripWindow(now, start, '00:50')).toBe(true);
    });

    it('is false more than one hour before departure', () => {
        const now = start.subtract(61, 'minute');
        expect(isWithinOngoingTripWindow(now, start, '01:00')).toBe(false);
    });

    it('is false more than thirty minutes after estimated arrival', () => {
        const now = start.add(81, 'minute');
        expect(isWithinOngoingTripWindow(now, start, '00:50')).toBe(false);
    });
});

describe('ongoingTrip canStartSharing', () => {
    const start = dayjs('2026-06-02 16:00:00');

    it('is true from one hour before departure', () => {
        expect(canStartSharing(start.subtract(60, 'minute'), start)).toBe(true);
    });

    it('is false more than one hour before departure', () => {
        expect(canStartSharing(start.subtract(61, 'minute'), start)).toBe(false);
    });
});

describe('isLiveLocationParticipant', () => {
    const userId = 42;

    it('returns true for trip driver using trip.user.id', () => {
        const trip = { user: { id: userId }, passenger: [] };
        expect(isLiveLocationParticipant(trip, userId)).toBe(true);
    });

    it('returns true for accepted passenger in passenger list', () => {
        const trip = {
            user: { id: 1 },
            passenger: [{ id: userId }]
        };
        expect(isLiveLocationParticipant(trip, userId)).toBe(true);
    });

    it('returns false when user is not driver or accepted passenger', () => {
        const trip = {
            user: { id: 1 },
            passenger: [{ id: 99 }]
        };
        expect(isLiveLocationParticipant(trip, userId)).toBe(false);
    });
});

describe('shouldShowLiveLocationShare', () => {
    const start = dayjs('2026-06-02 16:00:00');
    const driverTrip = {
        trip_date: start.format('YYYY-MM-DD HH:mm:ss'),
        user: { id: 7 },
        passenger: []
    };

    it('returns true for driver within sharing window', () => {
        expect(
            shouldShowLiveLocationShare(driverTrip, 7, start.subtract(30, 'minute'))
        ).toBe(true);
    });

    it('returns false for driver before sharing window', () => {
        expect(
            shouldShowLiveLocationShare(driverTrip, 7, start.subtract(90, 'minute'))
        ).toBe(false);
    });

    it('returns false for non-participant even within window', () => {
        expect(
            shouldShowLiveLocationShare(driverTrip, 99, start.subtract(30, 'minute'))
        ).toBe(false);
    });
});

describe('getTripLocationLabels', () => {
    it('extracts city and region from trip points', () => {
        const trip = {
            points: [
                {
                    address: 'Rosario, Santa Fe, Argentina',
                    json_address: { ciudad: 'Rosario', provincia: 'Santa Fe' }
                },
                {
                    address: 'Buenos Aires, CABA, Argentina',
                    json_address: { ciudad: 'Buenos Aires', provincia: 'CABA' }
                }
            ],
            from_town: 'Rosario, Santa Fe, Argentina',
            to_town: 'Buenos Aires, CABA, Argentina'
        };

        expect(getTripLocationLabels(trip)).toEqual({
            fromCity: 'Rosario',
            fromRegion: 'Santa Fe',
            toCity: 'Buenos Aires',
            toRegion: 'CABA'
        });
    });

    it('falls back to parsing from_town and to_town', () => {
        const trip = {
            from_town: 'Rosario, Santa Fe, Argentina',
            to_town: 'Buenos Aires, CABA, Argentina'
        };

        expect(getTripLocationLabels(trip)).toEqual({
            fromCity: 'Rosario',
            fromRegion: 'Santa Fe',
            toCity: 'Buenos Aires',
            toRegion: 'CABA'
        });
    });
});
