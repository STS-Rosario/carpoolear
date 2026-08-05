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
        expect(formatStepQueryValue(STEP.LAST_DETAILS)).toBe('9');
    });

    it('parses valid step numbers from the query', () => {
        expect(parseStepFromQuery('1')).toBe(STEP.ROLE);
        expect(parseStepFromQuery('9')).toBe(STEP.LAST_DETAILS);
        expect(parseStepFromQuery('0')).toBeNull();
        expect(parseStepFromQuery('10')).toBeNull();
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

    it('resolves passenger car step to seats', () => {
        expect(
            resolveStepFromQuery('6', {
                isPassenger: true,
                isEdit: false
            })
        ).toBe(STEP.SEATS);
    });
});
