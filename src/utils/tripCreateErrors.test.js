import { describe, expect, it, vi } from 'vitest';
import {
    INCOMPLETE_PROFILE_UPDATE_ROUTE,
    isProfileRequiredTripError,
    redirectToIncompleteProfileForTripCreate
} from './tripCreateErrors.js';

describe('tripCreateErrors', () => {
    it('detects profile_required validation from trip create API', () => {
        expect(
            isProfileRequiredTripError({
                status: 422,
                data: {
                    errors: {
                        profile_required: ['The user profile must be complete.']
                    }
                }
            })
        ).toBe(true);
    });

    it('ignores unrelated trip create errors', () => {
        expect(
            isProfileRequiredTripError({
                status: 422,
                data: {
                    errors: {
                        car_id: ['The driver must have a car with a plate.']
                    }
                }
            })
        ).toBe(false);
        expect(isProfileRequiredTripError(null)).toBe(false);
    });

    it('redirects to profile update with incompleteProfile query', () => {
        const router = { replace: vi.fn() };
        expect(redirectToIncompleteProfileForTripCreate(router)).toBe(true);
        expect(router.replace).toHaveBeenCalledWith(INCOMPLETE_PROFILE_UPDATE_ROUTE);
        expect(INCOMPLETE_PROFILE_UPDATE_ROUTE).toEqual({
            name: 'profile_update',
            query: { incompleteProfile: 'true' }
        });
    });
});
