import { describe, expect, it } from 'vitest';
import { getApiErrorMessage, isOfflineApiError } from './apiErrors.js';

describe('api error helpers', () => {
    it('detects normalized offline API errors', () => {
        expect(
            isOfflineApiError({
                data: { message: 'network_offline' },
                status: 0,
                offline: true
            })
        ).toBe(true);
    });

    it('does not treat validation responses as offline errors', () => {
        expect(
            isOfflineApiError({
                data: { errors: { email: ['The email has already been taken.'] } },
                status: 422
            })
        ).toBe(false);
    });
});

describe('getApiErrorMessage', () => {
    const fallback = 'No se pudo grabar los datos. Intente de nuevo';

    it('returns the first validation error message when present', () => {
        expect(
            getApiErrorMessage(
                {
                    errors: {
                        facebook_profile_url: [
                            'El enlace debe ser un perfil de Facebook válido (por ejemplo facebook.com/tu-perfil).'
                        ]
                    },
                    message: 'Could not update user.'
                },
                fallback
            )
        ).toBe(
            'El enlace debe ser un perfil de Facebook válido (por ejemplo facebook.com/tu-perfil).'
        );
    });

    it('uses fallback for generic backend messages without field errors', () => {
        expect(
            getApiErrorMessage({ message: 'Could not update user.' }, fallback)
        ).toBe(fallback);
    });

    it('returns fallback when api error is missing', () => {
        expect(getApiErrorMessage(null, fallback)).toBe(fallback);
    });

    it('translates known impersonation forbidden error codes', () => {
        expect(
            getApiErrorMessage(
                { data: { message: 'impersonation_action_forbidden' }, status: 403 },
                fallback,
                (key) => (key === 'impersonationActionForbidden' ? 'Acción no permitida durante suplantación.' : key)
            )
        ).toBe('Acción no permitida durante suplantación.');
    });

    it('translates migration banned user error with user name and id', () => {
        expect(
            getApiErrorMessage(
                {
                    data: {
                        message: 'migration_banned_user',
                        user_name: 'Cuenta Suspendida',
                        user_id: 42
                    },
                    status: 422
                },
                fallback,
                (key, params) =>
                    key === 'errorMigracionUsuarioSuspendido'
                        ? `La cuenta de ${params.name} (ID: ${params.id}) se encuentra suspendida por lo que no se puede realizar la migración`
                        : key
            )
        ).toBe(
            'La cuenta de Cuenta Suspendida (ID: 42) se encuentra suspendida por lo que no se puede realizar la migración'
        );
    });

    it('returns raw message from nested data when no translator is provided', () => {
        expect(
            getApiErrorMessage(
                { data: { message: 'impersonation_action_forbidden' }, status: 403 },
                fallback
            )
        ).toBe('impersonation_action_forbidden');
    });
});
