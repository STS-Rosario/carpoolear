import { describe, expect, it } from 'vitest';
import {
    shouldShowSwitchToMercadoPago,
    SWITCH_TO_MERCADO_PAGO_ROUTE
} from './identityValidationModeSwitch.js';

describe('shouldShowSwitchToMercadoPago', () => {
    it('returns true when mercado pago validation is enabled', () => {
        expect(
            shouldShowSwitchToMercadoPago({
                identity_validation_mercado_pago_enabled: true
            })
        ).toBe(true);
    });

    it('returns false when mercado pago validation is disabled', () => {
        expect(
            shouldShowSwitchToMercadoPago({
                identity_validation_mercado_pago_enabled: false
            })
        ).toBe(false);
    });

    it('returns false when config is missing', () => {
        expect(shouldShowSwitchToMercadoPago(null)).toBe(false);
    });

    it('exposes identity validation route for the switch link', () => {
        expect(SWITCH_TO_MERCADO_PAGO_ROUTE).toEqual({
            name: 'identity_validation'
        });
    });
});
