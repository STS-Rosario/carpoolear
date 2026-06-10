import { describe, expect, it } from 'vitest';
import dayjs from '../dayjs';
import {
    ALL_WIZARD_STEPS,
    canNavigateToStep,
    getNextStep,
    getPreviousStep,
    getTripCreationStepLabelKey,
    getVisibleSteps,
    isCarStep,
    isStepDisabledForPassenger,
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
        expect(getTripCreationStepLabelKey(STEP.DESCRIPTION)).toBe(
            'tripCreationStepLabelDescription'
        );
        expect(getTripCreationStepLabelKey(STEP.LAST_DETAILS)).toBe(
            'tripCreationStepLabelLastDetails'
        );
    });
});

describe('tripCreationSteps navigation', () => {
    it('lists nine steps for drivers and skips car step for passengers', () => {
        expect(ALL_WIZARD_STEPS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(getVisibleSteps(false)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(getVisibleSteps(true)).toEqual([1, 2, 3, 4, 5, 7, 8, 9]);
    });

    it('marks step 6 as disabled for passengers', () => {
        expect(isStepDisabledForPassenger(6, true)).toBe(true);
        expect(isStepDisabledForPassenger(6, false)).toBe(false);
        expect(isCarStep(6)).toBe(true);
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
        ).toBe(STEP.SEATS);
        expect(
            getPreviousStep(STEP.SEATS, true, { wantsIntermediateStops: false })
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
        expect(validateStep(STEP.ORIGIN, { points: basePoints() }).valid).toBe(true);
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
        expect(validateStep(STEP.DESTINATION, { points: sameCity }).valid).toBe(false);
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
                selectedCarId: 1
            }).valid
        ).toBe(true);

        expect(
            validateStep(STEP.CAR, {
                isPassenger: false,
                cars: [
                    { id: 1, patente: 'ABC123' },
                    { id: 2, patente: 'XYZ789' }
                ],
                selectedCarId: null
            }).valid
        ).toBe(false);
    });

    it('validates description step', () => {
        expect(
            validateStep(STEP.DESCRIPTION, { description: 'Viaje a la costa' }).valid
        ).toBe(true);
        expect(validateStep(STEP.DESCRIPTION, { description: '' }).valid).toBe(false);
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
});
