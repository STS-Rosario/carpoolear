import { describe, expect, it } from 'vitest';
import { shouldShowPendingManualSwitchLink } from './identityValidationPendingManualSwitch.js';

describe('shouldShowPendingManualSwitchLink', () => {
    it('returns true when manual is pending payment and mp is enabled', () => {
        expect(
            shouldShowPendingManualSwitchLink(
                { identity_validation_mercado_pago_enabled: true },
                { has_submission: true, paid: false }
            )
        ).toBe(true);
    });

    it('returns false when mp is disabled', () => {
        expect(
            shouldShowPendingManualSwitchLink(
                { identity_validation_mercado_pago_enabled: false },
                { has_submission: true, paid: false }
            )
        ).toBe(false);
    });

    it('returns false when manual request is not pending payment', () => {
        expect(
            shouldShowPendingManualSwitchLink(
                { identity_validation_mercado_pago_enabled: true },
                { has_submission: true, paid: true }
            )
        ).toBe(false);
    });
});
