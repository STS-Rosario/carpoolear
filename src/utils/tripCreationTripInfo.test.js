import { describe, expect, it } from 'vitest';
import {
    shouldDisableTripCreationNext,
    TRIP_INFO_STATUS
} from './tripCreationTripInfo.js';
import { STEP } from './tripCreationSteps.js';

describe('tripCreationTripInfo', () => {
    it('uses stable trip info status values', () => {
        expect(TRIP_INFO_STATUS).toEqual({
            IDLE: 'idle',
            LOADING: 'loading',
            READY: 'ready',
            ERROR: 'error'
        });
    });

    it('disables next on destination until trip-info is ready', () => {
        expect(
            shouldDisableTripCreationNext({
                currentStep: STEP.DESTINATION,
                tripInfoStatus: TRIP_INFO_STATUS.IDLE
            })
        ).toBe(true);
        expect(
            shouldDisableTripCreationNext({
                currentStep: STEP.DESTINATION,
                tripInfoStatus: TRIP_INFO_STATUS.LOADING
            })
        ).toBe(true);
        expect(
            shouldDisableTripCreationNext({
                currentStep: STEP.DESTINATION,
                tripInfoStatus: TRIP_INFO_STATUS.ERROR
            })
        ).toBe(true);
        expect(
            shouldDisableTripCreationNext({
                currentStep: STEP.DESTINATION,
                tripInfoStatus: TRIP_INFO_STATUS.READY
            })
        ).toBe(false);
    });

    it('does not disable next on other steps', () => {
        expect(
            shouldDisableTripCreationNext({
                currentStep: STEP.ORIGIN,
                tripInfoStatus: TRIP_INFO_STATUS.IDLE
            })
        ).toBe(false);
    });
});
