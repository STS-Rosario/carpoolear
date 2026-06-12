import { describe, it, expect } from 'vitest';
import {
    applyClearedIdentityValidationFields,
    buildAdminUserIdentityVerificationSection,
    canClearAdminUserIdentityVerification
} from './adminUserIdentityVerification';

const translate = (key) =>
    ({
        identidadValidada: 'Cuenta verificada',
        identidadNoValidada: 'No verificado',
        identity_validation_type: 'Método de verificación',
        identity_validated_at: 'Verificado el',
        identity_validation_rejected_at: 'Rechazado el',
        identity_validation_reject_reason: 'Motivo de rechazo',
        validate_by_date: 'Fecha límite de verificación',
        adminIdentityValidationMethodMercadoPago: 'Mercado Pago',
        adminIdentityValidationMethodManual: 'Manual'
    }[key] || key);

describe('buildAdminUserIdentityVerificationSection', () => {
    it('returns verified status with mercado pago method and related timestamps', () => {
        const section = buildAdminUserIdentityVerificationSection(
            {
                identity_validated: true,
                identity_validated_at: '2026-06-01 10:00:00',
                identity_validation_type: 'mercado_pago',
                identity_validation_rejected_at: null,
                identity_validation_reject_reason: null,
                validate_by_date: null
            },
            { translate }
        );

        expect(section.isVerified).toBe(true);
        expect(section.statusLabel).toBe('Cuenta verificada');
        expect(section.methodLabel).toBe('Mercado Pago');
        expect(section.detailRows).toEqual([
            {
                key: 'identity_validated_at',
                label: 'Verificado el',
                value: '2026-06-01 10:00:00'
            }
        ]);
    });

    it('returns not verified status with rejection details when validation failed', () => {
        const section = buildAdminUserIdentityVerificationSection(
            {
                identity_validated: false,
                identity_validated_at: null,
                identity_validation_type: null,
                identity_validation_rejected_at: '2026-06-02 11:30:00',
                identity_validation_reject_reason: 'name_mismatch',
                validate_by_date: '2026-07-01'
            },
            { translate }
        );

        expect(section.isVerified).toBe(false);
        expect(section.statusLabel).toBe('No verificado');
        expect(section.methodLabel).toBe('—');
        expect(section.detailRows).toEqual([
            {
                key: 'identity_validation_rejected_at',
                label: 'Rechazado el',
                value: '2026-06-02 11:30:00'
            },
            {
                key: 'identity_validation_reject_reason',
                label: 'Motivo de rechazo',
                value: 'name_mismatch'
            },
            {
                key: 'validate_by_date',
                label: 'Fecha límite de verificación',
                value: '2026-07-01'
            }
        ]);
    });
});

describe('applyClearedIdentityValidationFields', () => {
    it('clears all identity verification fields on the user object', () => {
        const user = {
            identity_validated: true,
            identity_validated_at: '2026-06-01 10:00:00',
            identity_validation_type: 'mercado_pago',
            identity_validation_rejected_at: '2026-06-02 11:00:00',
            identity_validation_reject_reason: 'name_mismatch'
        };

        applyClearedIdentityValidationFields(user);

        expect(user).toEqual({
            identity_validated: false,
            identity_validated_at: null,
            identity_validation_type: null,
            identity_validation_rejected_at: null,
            identity_validation_reject_reason: null
        });
    });
});

describe('canClearAdminUserIdentityVerification', () => {
    it('returns true when user has identity_validated_at', () => {
        expect(
            canClearAdminUserIdentityVerification({
                identity_validated: true,
                identity_validated_at: '2026-06-01 10:00:00'
            })
        ).toBe(true);
    });

    it('returns false when user has no verification timestamp', () => {
        expect(
            canClearAdminUserIdentityVerification({
                identity_validated: false,
                identity_validated_at: null
            })
        ).toBe(false);
    });
});
