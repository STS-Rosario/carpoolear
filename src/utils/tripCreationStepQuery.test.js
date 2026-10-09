import { describe, expect, it } from 'vitest';
import { STEP } from './tripCreationSteps.js';
import {
    TRIP_CREATION_STEP_QUERY_PARAM,
    formatStepQueryValue,
    parseStepFromQuery,
    resolveStepFromQuery
} from './tripCreationStepQuery.js';

describe('tripCreationStepQuery', () => {
    it('uses step as the query param name', () => {
        expect(TRIP_CREATION_STEP_QUERY_PARAM).toBe('step');
    });

    it('formats wizard step numbers for the URL', () => {
        expect(formatStepQueryValue(STEP.ROLE)).toBe('1');
        expect(formatStepQueryValue(STEP.LAST_DETAILS)).toBe('10');
    });

    it('parses valid step numbers from the query', () => {
        expect(parseStepFromQuery('1')).toBe(STEP.ROLE);
        expect(parseStepFromQuery('10')).toBe(STEP.LAST_DETAILS);
        expect(parseStepFromQuery('0')).toBeNull();
        expect(parseStepFromQuery('11')).toBeNull();
        expect(parseStepFromQuery('origin')).toBeNull();
    });

    it('resolves edit flow to origin when role is requested', () => {
        expect(
            resolveStepFromQuery('1', {
                isPassenger: false,
                isEdit: true
            })
        ).toBe(STEP.ORIGIN);
    });

    it('resolves a disabled passenger step to the next step they can see', () => {
        // Car, seats, contribution and description are all skipped for
        // passengers, so a deep link into any of them lands on the next
        // step that is actually visible for a passenger (last details).
        expect(
            resolveStepFromQuery('6', {
                isPassenger: true,
                isEdit: false
            })
        ).toBe(STEP.LAST_DETAILS);
        expect(
            resolveStepFromQuery('7', {
                isPassenger: true,
                isEdit: false
            })
        ).toBe(STEP.LAST_DETAILS);
        expect(
            resolveStepFromQuery('8', {
                isPassenger: true,
                isEdit: false
            })
        ).toBe(STEP.LAST_DETAILS);
        expect(
            resolveStepFromQuery('9', {
                isPassenger: true,
                isEdit: false
            })
        ).toBe(STEP.LAST_DETAILS);
    });

    it('resolves contribution to description when skipped for drivers', () => {
        expect(
            resolveStepFromQuery('8', {
                isPassenger: false,
                isEdit: false,
                seatPriceEnabled: false
            })
        ).toBe(STEP.DESCRIPTION);
    });
});
