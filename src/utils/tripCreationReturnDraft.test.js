import { describe, expect, it } from 'vitest';
import { STEP } from './tripCreationSteps.js';
import {
    buildReturnTripCreationDraftFromSnapshot,
    invertTripPointsForReturn
} from './tripCreationReturnDraft.js';

describe('tripCreationReturnDraft', () => {
    const outboundSnapshot = {
        trip: {
            is_passenger: 0,
            total_seats: 3,
            description: 'Viaje de prueba',
            allow_kids: true,
            allow_smoking: false,
            allow_animals: true,
            rear_max_two_passengers: true,
            autoaccept_friends_requests: true
        },
        points: [
            {
                id: 0,
                name: 'Rosario',
                place: 'Rosario',
                json: { country: 'AR', name: 'Rosario' },
                location: { lat: -32.9, lng: -60.6 }
            },
            {
                id: 1,
                name: 'Buenos Aires',
                place: 'Buenos Aires',
                json: { country: 'AR', name: 'Buenos Aires' },
                location: { lat: -34.6, lng: -58.4 }
            }
        ],
        date: '2026-06-15',
        dateAnswer: '2026-06-15',
        time: '14:00',
        price: '5000',
        no_lucrar: true,
        selectedCarId: 9,
        allowForeignPoints: false,
        weeklyScheduleTime: '12:00'
    };

    it('inverts origin and destination points for a return trip', () => {
        expect(invertTripPointsForReturn(outboundSnapshot.points)).toEqual([
            {
                id: 1,
                name: 'Buenos Aires',
                place: 'Buenos Aires',
                json: { country: 'AR', name: 'Buenos Aires' },
                location: { lat: -34.6, lng: -58.4 }
            },
            {
                id: 0,
                name: 'Rosario',
                place: 'Rosario',
                json: { country: 'AR', name: 'Rosario' },
                location: { lat: -32.9, lng: -60.6 }
            }
        ]);
    });

    it('builds a return draft with inverted route and cleared schedule', () => {
        const draft = buildReturnTripCreationDraftFromSnapshot(
            outboundSnapshot,
            101
        );

        expect(draft.parentTripId).toBe(101);
        expect(draft.currentStep).toBe(STEP.ORIGIN);
        expect(draft.maxVisitedStep).toBe(STEP.LAST_DETAILS);
        expect(draft.points[0].name).toBe('Buenos Aires');
        expect(draft.points[1].name).toBe('Rosario');
        expect(draft.date).toBe('');
        expect(draft.dateAnswer).toBe('');
        expect(draft.time).toBe('');
        expect(draft.useWeeklySchedule).toBe(false);
        expect(draft.trip.description).toBe('Viaje de prueba');
        expect(draft.trip.total_seats).toBe(3);
        expect(draft.price).toBe('5000');
        expect(draft.no_lucrar).toBe(true);
        expect(draft.selectedCarId).toBe(9);
    });
});
