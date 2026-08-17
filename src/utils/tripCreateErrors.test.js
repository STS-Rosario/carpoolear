import { describe, expect, it, vi } from 'vitest';
import {
    INCOMPLETE_PROFILE_UPDATE_ROUTE,
    isProfileRequiredTripError,
    redirectToIncompleteProfileForTripCreate,
    resolveTripCreateError,
    handleTripCreateApiError
} from './tripCreateErrors.js';
import { checkError } from '../../utils/helpers.js';

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

describe('resolveTripCreateError', () => {
    const t = (key) => key;

    it('maps identity validation errors to a redirect and specific message', () => {
        const error = {
            status: 422,
            data: { errors: { error: ['identity_validation_required'] } }
        };

        expect(resolveTripCreateError(error)).toEqual({
            messageKey: 'debesValidarIdentidadParaAccion',
            redirectTo: { name: 'identity_validation' }
        });
        expect(checkError(error, 'identity_validation_required')).toBe(true);
    });

    it('maps driver verification errors to tienesQueSerConductor', () => {
        expect(
            resolveTripCreateError({
                status: 422,
                data: {
                    errors: {
                        driver_is_verified: ['The driver must be verified.']
                    }
                }
            })
        ).toEqual({ messageKey: 'tienesQueSerConductor' });
    });

    it('maps routing service failures to routingServiceTemporaryError', () => {
        expect(
            resolveTripCreateError({
                status: 422,
                data: { errors: { error: ['routing_service_unavailable'] } }
            })
        ).toEqual({ messageKey: 'routingServiceTemporaryError' });
    });

    it('maps incomplete profile errors to profile update redirect', () => {
        expect(
            resolveTripCreateError({
                status: 422,
                data: {
                    errors: {
                        profile_required: ['The user profile must be complete.']
                    }
                }
            })
        ).toEqual({
            messageKey: 'completaPerfilParaCrearViaje',
            redirectTo: INCOMPLETE_PROFILE_UPDATE_ROUTE
        });
    });

    it('maps missing car plate errors to olvidastePatente', () => {
        expect(
            resolveTripCreateError({
                status: 422,
                data: {
                    errors: {
                        car_id: ['The driver must have a car with a plate.']
                    }
                }
            })
        ).toEqual({ messageKey: 'olvidastePatente' });
    });

    it('maps incomplete car errors to tripCreateCarIncomplete', () => {
        expect(
            resolveTripCreateError({
                status: 422,
                data: {
                    errors: {
                        car_incomplete: ['The driver car must have brand and model.']
                    }
                }
            })
        ).toEqual({ messageKey: 'tripCreateCarIncomplete' });
    });

    it('maps banned account errors to tripCreateBanned', () => {
        expect(
            resolveTripCreateError({
                status: 422,
                data: {
                    errors: {
                        banned: ['Your account has been banned due to excessive trip creation.']
                    }
                }
            })
        ).toEqual({ messageKey: 'tripCreateBanned' });
    });

    it('maps offline errors to offlineStatusBarMessage', () => {
        expect(
            resolveTripCreateError({
                status: 0,
                offline: true,
                data: { message: 'network_offline' }
            })
        ).toEqual({ messageKey: 'offlineStatusBarMessage' });
    });

    it('uses the first validation field message when available', () => {
        expect(
            resolveTripCreateError({
                status: 422,
                data: {
                    errors: {
                        trip_date: ['The trip date must be a date after now.']
                    }
                }
            })
        ).toEqual({
            message:
                'The trip date must be a date after now.'
        });
    });

    it('falls back to problemaAlCargarElViaje for unknown errors', () => {
        expect(
            resolveTripCreateError({
                status: 500,
                data: { message: 'Server Error' }
            })
        ).toEqual({ messageKey: 'problemaAlCargarElViaje' });
    });
});

describe('handleTripCreateApiError', () => {
    it('shows toast, redirects, and reports the error', async () => {
        const router = { push: vi.fn(), replace: vi.fn() };
        const dialogs = { message: vi.fn() };
        const reportError = vi.fn().mockResolvedValue(undefined);
        const isDebugEnabled = vi.fn().mockResolvedValue(true);

        await handleTripCreateApiError(
            {
                status: 422,
                data: {
                    errors: {
                        profile_required: ['The user profile must be complete.']
                    }
                }
            },
            {
                t: (key) => key,
                router,
                dialogs,
                reportError,
                isDebugEnabled
            }
        );

        expect(router.replace).toHaveBeenCalledWith(INCOMPLETE_PROFILE_UPDATE_ROUTE);
        expect(dialogs.message).toHaveBeenCalledWith('completaPerfilParaCrearViaje', {
            estado: 'error'
        });
        expect(reportError).toHaveBeenCalled();
        expect(isDebugEnabled).toHaveBeenCalled();
    });
});
