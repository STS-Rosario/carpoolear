import { describe, expect, it } from 'vitest';
import dayjs from '../dayjs';
import {
    ALL_WIZARD_STEPS,
    canNavigateToStep,
    getNextStep,
    getPreviousStep,
    getTripCreationStepLabelKey,
    getRoleSwitchState,
    getVisibleSteps,
    isCarStep,
    isStepDisabledForPassenger,
    resolveVisibleStep,
    STEP,
    validateStep
} from './tripCreationSteps.js';

describe('tripCreationSteps step labels', () => {
    it('maps each wizard step to a short i18n label key', () => {
        expect(getTripCreationStepLabelKey(STEP.ROLE)).toBe(
            'tripCreationStepLabelRole'
        );
        expect(getTripCreationStepLabelKey(STEP.STOPS)).toBe(
            'tripCreationStepLabelStops'
        );
        expect(getTripCreationStepLabelKey(STEP.ORIGIN)).toBe(
            'tripCreationStepLabelOrigin'
        );
        expect(getTripCreationStepLabelKey(STEP.DESTINATION)).toBe(
            'tripCreationStepLabelDestination'
        );
        expect(getTripCreationStepLabelKey(STEP.SCHEDULE)).toBe(
            'tripCreationStepLabelSchedule'
        );
        expect(getTripCreationStepLabelKey(STEP.CAR)).toBe(
            'tripCreationStepLabelCar'
        );
        expect(getTripCreationStepLabelKey(STEP.SEATS)).toBe(
            'tripCreationStepLabelSeats'
        );
        expect(getTripCreationStepLabelKey(STEP.CONTRIBUTION)).toBe(
            'tripCreationStepLabelContribution'
        );
        expect(getTripCreationStepLabelKey(STEP.DESCRIPTION)).toBe(
            'tripCreationStepLabelDescription'
        );
        expect(getTripCreationStepLabelKey(STEP.LAST_DETAILS)).toBe(
            'tripCreationStepLabelLastDetails'
        );
    });

    it('labels the description step as details for passengers', () => {
        expect(getTripCreationStepLabelKey(STEP.DESCRIPTION, true)).toBe(
            'tripCreationStepLabelDescriptionPassenger'
        );
        expect(getTripCreationStepLabelKey(STEP.SCHEDULE, true)).toBe(
            'tripCreationStepLabelSchedule'
        );
    });
});

describe('tripCreationSteps navigation', () => {
    it('lists ten steps for drivers and skips car/seats/contribution for passengers', () => {
        expect(ALL_WIZARD_STEPS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(getVisibleSteps(false)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(getVisibleSteps(true)).toEqual([1, 2, 3, 4, 5, 9, 10]);
    });

    it('marks car, seats and contribution as disabled for passengers', () => {
        expect(isStepDisabledForPassenger(STEP.CAR, true)).toBe(true);
        expect(isStepDisabledForPassenger(STEP.CAR, false)).toBe(false);
        expect(isStepDisabledForPassenger(STEP.SEATS, true)).toBe(true);
        expect(isStepDisabledForPassenger(STEP.SEATS, false)).toBe(false);
        expect(isStepDisabledForPassenger(STEP.CONTRIBUTION, true)).toBe(true);
        expect(isStepDisabledForPassenger(STEP.DESCRIPTION, true)).toBe(false);
        expect(isCarStep(6)).toBe(true);
    });

    it('skips contribution when seat price module is disabled', () => {
        expect(
            getNextStep(STEP.SEATS, false, {
                wantsIntermediateStops: false,
                seatPriceEnabled: false
            })
        ).toBe(STEP.DESCRIPTION);
        expect(
            getNextStep(STEP.SEATS, false, {
                wantsIntermediateStops: false,
                seatPriceEnabled: true
            })
        ).toBe(STEP.CONTRIBUTION);
        expect(
            getPreviousStep(STEP.DESCRIPTION, false, {
                wantsIntermediateStops: false,
                seatPriceEnabled: true
            })
        ).toBe(STEP.CONTRIBUTION);
    });

    it('skips stops when destination checkbox is unchecked', () => {
        expect(
            getNextStep(STEP.DESTINATION, false, {
                wantsIntermediateStops: false
            })
        ).toBe(STEP.SCHEDULE);
        expect(
            getPreviousStep(STEP.SCHEDULE, false, {
                wantsIntermediateStops: false
            })
        ).toBe(STEP.DESTINATION);
    });

    it('visits stops when destination checkbox is checked', () => {
        expect(
            getNextStep(STEP.DESTINATION, false, {
                wantsIntermediateStops: true
            })
        ).toBe(STEP.STOPS);
        expect(
            getPreviousStep(STEP.SCHEDULE, false, {
                wantsIntermediateStops: true
            })
        ).toBe(STEP.STOPS);
    });

    it('navigates next and previous across passenger-visible steps', () => {
        expect(
            getNextStep(STEP.SCHEDULE, true, { wantsIntermediateStops: false })
        ).toBe(STEP.DESCRIPTION);
        expect(
            getPreviousStep(STEP.DESCRIPTION, true, {
                wantsIntermediateStops: false
            })
        ).toBe(STEP.SCHEDULE);
        expect(
            getNextStep(STEP.SCHEDULE, false, { wantsIntermediateStops: false })
        ).toBe(STEP.CAR);
        expect(
            getPreviousStep(STEP.SEATS, false, { wantsIntermediateStops: false })
        ).toBe(STEP.CAR);
    });

    it('returns null at boundaries', () => {
        expect(
            getNextStep(STEP.LAST_DETAILS, false, { wantsIntermediateStops: false })
        ).toBeNull();
        expect(getPreviousStep(STEP.ROLE, false)).toBeNull();
    });

    it('allows stops navigation once destination was visited', () => {
        expect(canNavigateToStep(STEP.STOPS, STEP.DESTINATION, false)).toBe(
            true
        );
        expect(canNavigateToStep(STEP.STOPS, STEP.ORIGIN, false)).toBe(false);
        expect(canNavigateToStep(STEP.CAR, 5, true)).toBe(false);
        expect(canNavigateToStep(STEP.SEATS, 10, true)).toBe(false);
        expect(canNavigateToStep(STEP.DESCRIPTION, 10, true)).toBe(true);
        expect(canNavigateToStep(STEP.SEATS, 10, false)).toBe(true);
    });

    it('keeps steps the role can see when resolving a visible step', () => {
        expect(resolveVisibleStep(STEP.SEATS, false)).toBe(STEP.SEATS);
        expect(resolveVisibleStep(STEP.DESCRIPTION, true)).toBe(STEP.DESCRIPTION);
        expect(resolveVisibleStep(STEP.STOPS, true)).toBe(STEP.STOPS);
    });

    it('moves a step the role cannot see forward to the next visible one', () => {
        // e.g. a passenger draft saved on seats before that step was skipped
        expect(resolveVisibleStep(STEP.CAR, true)).toBe(STEP.DESCRIPTION);
        expect(resolveVisibleStep(STEP.SEATS, true)).toBe(STEP.DESCRIPTION);
        expect(resolveVisibleStep(STEP.CONTRIBUTION, true)).toBe(
            STEP.DESCRIPTION
        );
        expect(
            resolveVisibleStep(STEP.CONTRIBUTION, false, {
                seatPriceEnabled: false
            })
        ).toBe(STEP.DESCRIPTION);
        expect(
            resolveVisibleStep(STEP.CONTRIBUTION, true, {
                seatPriceEnabled: false
            })
        ).toBe(STEP.DESCRIPTION);
    });
});

describe('tripCreationSteps role switch', () => {
    it('sets one seat for passengers and remembers the driver seats', () => {
        expect(
            getRoleSwitchState({
                toPassenger: true,
                totalSeats: 3,
                driverTotalSeats: null,
                maxVisitedStep: STEP.ROLE
            })
        ).toEqual({
            totalSeats: 1,
            driverTotalSeats: 3,
            maxVisitedStep: STEP.ROLE
        });
    });

    it('restores the remembered driver seats when switching back', () => {
        expect(
            getRoleSwitchState({
                toPassenger: false,
                totalSeats: 1,
                driverTotalSeats: 3,
                maxVisitedStep: STEP.ROLE
            }).totalSeats
        ).toBe(3);
    });

    it('falls back to the driver default when no driver seats were picked', () => {
        // e.g. a passenger draft resumed and then switched to driver
        expect(
            getRoleSwitchState({
                toPassenger: false,
                totalSeats: 1,
                driverTotalSeats: null,
                maxVisitedStep: STEP.ROLE
            }).totalSeats
        ).toBe(2);
    });

    it('sends a passenger who reached review back through the driver-only steps', () => {
        const state = getRoleSwitchState({
            toPassenger: false,
            totalSeats: 1,
            driverTotalSeats: null,
            maxVisitedStep: STEP.LAST_DETAILS
        });
        expect(state.maxVisitedStep).toBe(STEP.SCHEDULE);
        expect(canNavigateToStep(STEP.LAST_DETAILS, state.maxVisitedStep, false)).toBe(
            false
        );
        expect(getNextStep(STEP.SCHEDULE, false)).toBe(STEP.CAR);
    });
});

describe('tripCreationSteps validateStep', () => {
    const basePoints = () => [
        { name: 'Rosario', json: { country: 'AR' }, error: { state: false } },
        { name: 'Buenos Aires', json: { country: 'AR' }, error: { state: false } }
    ];

    it('validates origin step', () => {
        const points = [{ name: '', json: null, error: { state: false } }, basePoints()[1]];
        expect(validateStep(STEP.ORIGIN, { points }).valid).toBe(false);
        expect(
            validateStep(STEP.ORIGIN, {
                points: basePoints(),
                puntoPartida: ''
            }).valid
        ).toBe(false);
        expect(
            validateStep(STEP.ORIGIN, {
                points: basePoints(),
                puntoPartida: 'Terminal'
            }).valid
        ).toBe(true);
    });

    it('validates destination step', () => {
        const points = [
            basePoints()[0],
            { name: '', json: null, error: { state: false } }
        ];
        expect(validateStep(STEP.DESTINATION, { points }).valid).toBe(false);

        const sameCity = [
            { name: 'Rosario', json: { country: 'AR' }, error: { state: false } },
            { name: 'Rosario', json: { country: 'AR' }, error: { state: false } }
        ];
        expect(
            validateStep(STEP.DESTINATION, {
                points: sameCity,
                puntoLlegada: 'Centro'
            }).valid
        ).toBe(false);

        expect(
            validateStep(STEP.DESTINATION, {
                points: basePoints(),
                puntoLlegada: ''
            }).valid
        ).toBe(false);
        expect(
            validateStep(STEP.DESTINATION, {
                points: basePoints(),
                puntoLlegada: 'Centro'
            }).valid
        ).toBe(true);
    });

    it('validates schedule step for one-time trips', () => {
        const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
        expect(
            validateStep(STEP.SCHEDULE, {
                useWeeklySchedule: false,
                dateAnswer: tomorrow,
                time: '15:00'
            }).valid
        ).toBe(true);

        expect(
            validateStep(STEP.SCHEDULE, {
                useWeeklySchedule: false,
                dateAnswer: '',
                time: '15:00'
            }).valid
        ).toBe(false);
    });

    it('validates car step for drivers only', () => {
        expect(
            validateStep(STEP.CAR, {
                isPassenger: true,
                cars: [],
                selectedCarId: null
            }).valid
        ).toBe(true);

        expect(
            validateStep(STEP.CAR, {
                isPassenger: false,
                cars: [{ id: 1, patente: 'ABC123' }],
                selectedCarId: 1,
                seatLayoutCapacity: 4
            }).valid
        ).toBe(true);

        expect(
            validateStep(STEP.CAR, {
                isPassenger: false,
                cars: [{ id: 1, patente: 'ABC123' }],
                selectedCarId: 1,
                seatLayoutCapacity: null
            }).valid
        ).toBe(false);

        expect(
            validateStep(STEP.CAR, {
                isPassenger: false,
                cars: [
                    { id: 1, patente: 'ABC123' },
                    { id: 2, patente: 'XYZ789' }
                ],
                selectedCarId: null,
                seatLayoutCapacity: 5
            }).valid
        ).toBe(false);
    });

    it('validates description step for drivers and passengers', () => {
        expect(
            validateStep(STEP.DESCRIPTION, { description: 'Viaje a la costa' }).valid
        ).toBe(true);
        expect(validateStep(STEP.DESCRIPTION, { description: '' }).valid).toBe(false);
        expect(
            validateStep(STEP.DESCRIPTION, {
                isPassenger: true,
                description: ''
            }).valid
        ).toBe(false);
    });

    it('skips seat count validation for passengers (they always request one seat)', () => {
        expect(
            validateStep(STEP.SEATS, {
                isPassenger: true,
                totalSeats: 0,
                passengers: 5
            }).valid
        ).toBe(true);
    });

    it('requires contribution per person on contribution step for drivers when enabled', () => {
        expect(
            validateStep(STEP.SEATS, {
                totalSeats: 3,
                passengers: 0,
                isPassenger: false,
                seatPriceEnabled: true,
                price: ''
            }).valid
        ).toBe(true);

        expect(
            validateStep(STEP.CONTRIBUTION, {
                isPassenger: false,
                seatPriceEnabled: true,
                price: ''
            })
        ).toEqual({
            valid: false,
            errors: { price: 'contribucionPorPersonaRequerida' }
        });

        expect(
            validateStep(STEP.CONTRIBUTION, {
                isPassenger: false,
                seatPriceEnabled: true,
                price: '1500'
            }).valid
        ).toBe(true);

        expect(
            validateStep(STEP.CONTRIBUTION, {
                isPassenger: true,
                seatPriceEnabled: true,
                price: ''
            }).valid
        ).toBe(true);
    });

    it('validates stops step with optional empty placeholders', () => {
        const withEmpty = [
            basePoints()[0],
            { name: '', json: null, error: { state: false } },
            basePoints()[1]
        ];
        expect(validateStep(STEP.STOPS, { points: withEmpty }).valid).toBe(true);

        const partial = [
            basePoints()[0],
            { name: 'Cordoba', json: null, error: { state: false } },
            basePoints()[1]
        ];
        expect(validateStep(STEP.STOPS, { points: partial }).valid).toBe(false);
    });

    it('validates last details for drivers', () => {
        expect(
            validateStep(STEP.LAST_DETAILS, {
                isPassenger: false,
                noLucrar: false
            }).valid
        ).toBe(false);
        expect(
            validateStep(STEP.LAST_DETAILS, {
                isPassenger: false,
                noLucrar: true
            }).valid
        ).toBe(true);
        expect(
            validateStep(STEP.LAST_DETAILS, {
                isPassenger: true,
                noLucrar: false
            }).valid
        ).toBe(true);
    });

    it('allows one foreign endpoint when the other is in the home country', () => {
        expect(
            validateStep(STEP.DESTINATION, {
                points: [
                    { json: { country: 'ARG' }, name: 'Santa Fe' },
                    { json: { country: 'URY' }, name: 'Punta del Este' }
                ],
                osmCountry: 'ARG',
                allowForeignPoints: true,
                puntoLlegada: 'Terminal'
            }).valid
        ).toBe(true);
    });

    it('rejects trips with both endpoints outside the home country', () => {
        const result = validateStep(STEP.DESTINATION, {
            points: [
                { json: { country: 'URY' }, name: 'Montevideo' },
                { json: { country: 'URY' }, name: 'Punta del Este' }
            ],
            osmCountry: 'ARG',
            allowForeignPoints: true,
            puntoLlegada: 'Terminal'
        });

        expect(result.valid).toBe(false);
        expect(result.errors.destination).toBe('origenDestinoArgentina');
    });
});
