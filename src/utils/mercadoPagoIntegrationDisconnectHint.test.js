import { describe, expect, it } from 'vitest';
import {
    MERCADO_PAGO_MY_APPS_URL,
    shouldShowMercadoPagoIntegrationDisconnectHint
} from './mercadoPagoIntegrationDisconnectHint';

describe('shouldShowMercadoPagoIntegrationDisconnectHint', () => {
    it('returns true after MP oauth success callback', () => {
        expect(
            shouldShowMercadoPagoIntegrationDisconnectHint({
                resultMessage: 'success',
                user: { identity_validation_type: null }
            })
        ).toBe(true);
    });

    it('returns true when user was verified via Mercado Pago', () => {
        expect(
            shouldShowMercadoPagoIntegrationDisconnectHint({
                resultMessage: null,
                user: { identity_validation_type: 'mercado_pago' }
            })
        ).toBe(true);
    });

    it('returns false for manual verification success', () => {
        expect(
            shouldShowMercadoPagoIntegrationDisconnectHint({
                resultMessage: null,
                user: { identity_validation_type: 'manual' }
            })
        ).toBe(false);
    });
});

describe('MERCADO_PAGO_MY_APPS_URL', () => {
    it('points to Mercado Pago my-apps account page', () => {
        expect(MERCADO_PAGO_MY_APPS_URL).toBe(
            'https://www.mercadopago.com.ar/accounts/my-apps'
        );
    });
});
