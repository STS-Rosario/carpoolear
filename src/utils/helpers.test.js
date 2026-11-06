import { describe, expect, it } from 'vitest';
import { checkError, getErrors } from '../../utils/helpers.js';

describe('checkError', () => {
    it('matches when errors.error is a single string (Laravel-style)', () => {
        const error = {
            status: 422,
            data: {
                errors: {
                    error: 'user_has_another_similar_trip'
                },
                message: 'Could not create new request.'
            }
        };
        expect(checkError(error, 'user_has_another_similar_trip')).toBe(true);
        expect(checkError(error, 'message_required')).toBe(false);
    });

    it('matches when errors.error is an array of strings', () => {
        const error = {
            status: 422,
            data: {
                errors: {
                    error: ['user_has_reach_request_limit']
                }
            }
        };
        expect(checkError(error, 'user_has_reach_request_limit')).toBe(true);
    });

    it('returns false for non-422 responses', () => {
        expect(
            checkError(
                {
                    status: 400,
                    data: { errors: { error: 'user_has_another_similar_trip' } }
                },
                'user_has_another_similar_trip'
            )
        ).toBe(false);
    });
});

describe('getErrors', () => {
    it('returns a one-element array when errors.error is a string', () => {
        const error = {
            status: 422,
            data: {
                errors: { error: 'identity_validation_required' }
            }
        };
        expect(getErrors(error)).toEqual(['identity_validation_required']);
    });
});
