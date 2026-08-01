import { describe, expect, it } from 'vitest';
import { TRIP_INFO_STATUS } from './tripCreationTripInfo.js';
import {
    applyTripCreationFormReset,
    createEmptyTripPoint,
    createInitialTripCreationTrip
} from './tripCreationFormReset.js';

describe('tripCreationFormReset', () => {
    it('creates empty origin and destination points', () => {
        expect(createEmptyTripPoint(0)).toEqual({
            name: '',
            place: null,
            json: null,
            location: null,
            error: { state: false, message: '' },
            id: 0
        });
    });

    it('clears wizard form fields while preserving unrelated component state', () => {
        const form = {
            points: [
                {
                    id: 0,
                    name: 'Rosario',
                    place: 'Rosario',
                    json: { lat: '-32.9' },
                    location: { lat: -32.9, lng: -60.6 },
                    error: { state: true, message: 'Error' }
                },
                {
                    id: 1,
                    name: 'Buenos Aires',
                    place: 'Buenos Aires',
                    json: { lat: '-34.6' },
                    location: { lat: -34.6, lng: -58.4 },
                    error: { state: false, message: '' }
                }
            ],
            date: '2026-06-15',
            dateAnswer: '2026-06-15',
            time: '14:00',
            price: '5000',
            no_lucrar: true,
            sameCity: true,
            trip: {
                is_passenger: 0,
                total_seats: 4,
                description: 'Viaje frecuente',
                allow_smoking: true
            },
            selectedCarId: 9,
            allowForeignPoints: true,
            wantsIntermediateStops: true,
            useWeeklySchedule: true,
            weeklySchedule: 2,
            weeklyScheduleTime: '08:00',
            weeklyScheduleReturnTime: '09:00',
            duration: 3600,
            route_needs_payment: true,
            tripInfoStatus: TRIP_INFO_STATUS.READY,
            parentTripId: 12,
            showWizardSuccess: true,
            createdTrip: { id: 99 },
            creationSnapshot: { trip: { total_seats: 4 } },
            lucrarError: { state: true, message: 'Missing' },
            unrelatedCounter: 3
        };

        applyTripCreationFormReset(form, {
            defaultTime: '10:00',
            defaultReturnTime: '11:00'
        });

        expect(form.points).toHaveLength(2);
        expect(form.points[0].name).toBe('');
        expect(form.points[1].name).toBe('');
        expect(form.date).toBe('');
        expect(form.dateAnswer).toBe('');
        expect(form.time).toBe('10:00');
        expect(form.price).toBe('');
        expect(form.no_lucrar).toBe(false);
        expect(form.trip.description).toBe('');
        expect(form.trip.total_seats).toBe(2);
        expect(form.trip.allow_smoking).toBe(false);
        expect(form.selectedCarId).toBeNull();
        expect(form.allowForeignPoints).toBe(false);
        expect(form.wantsIntermediateStops).toBe(false);
        expect(form.useWeeklySchedule).toBe(false);
        expect(form.weeklySchedule).toBe(0);
        expect(form.weeklyScheduleTime).toBe('10:00');
        expect(form.weeklyScheduleReturnTime).toBe('11:00');
        expect(form.duration).toBe(0);
        expect(form.route_needs_payment).toBe(false);
        expect(form.tripInfoStatus).toBe(TRIP_INFO_STATUS.IDLE);
        expect(form.parentTripId).toBeNull();
        expect(form.showWizardSuccess).toBe(false);
        expect(form.createdTrip).toBeNull();
        expect(form.creationSnapshot).toBeNull();
        expect(form.lucrarError).toEqual({ state: false, message: '' });
        expect(form.unrelatedCounter).toBe(3);
    });

    it('can keep success state when building a return-trip draft', () => {
        const form = {
            points: [{ id: 0, name: 'Rosario' }, { id: 1, name: 'Buenos Aires' }],
            trip: createInitialTripCreationTrip(),
            showWizardSuccess: true,
            createdTrip: { id: 5 },
            creationSnapshot: { trip: {} }
        };

        applyTripCreationFormReset(form, { clearSuccessState: false });

        expect(form.showWizardSuccess).toBe(true);
        expect(form.createdTrip).toEqual({ id: 5 });
        expect(form.creationSnapshot).toEqual({ trip: {} });
        expect(form.points[0].name).toBe('');
    });
});
