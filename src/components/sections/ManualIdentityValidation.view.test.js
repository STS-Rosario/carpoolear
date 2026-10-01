import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ManualIdentityValidation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ManualIdentityValidation payment failure', () => {
    it('shows a payment failure message when payment_result is not success', () => {
        expect(viewSource).toContain('isManualValidationPaymentFailed');
        expect(viewSource).toContain('pagoValidacionManualFallido');
        expect(viewSource).toContain('errorPagoValidacionManual');
    });
});

const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');

describe('ManualIdentityValidation payment failure i18n', () => {
    it('defines payment failure copy in all locales', () => {
        expect(i18nSource).toContain("errorPagoValidacionManual: 'El pago no se completó'");
        expect(i18nSource).toContain("errorPagoValidacionManual: 'Payment did not complete'");
        expect(i18nSource).toContain('pagoValidacionManualFallido:');
        expect(i18nSource).toContain('El pago de la verificación manual no se completó. Podés intentar de nuevo.');
        expect(i18nSource).toContain('The manual verification payment did not complete. You can try again.');
    });
});

describe('ManualIdentityValidation mobile layout', () => {
    it('does not duplicate the page title below the mobile header', () => {
        expect(viewSource).not.toContain('manual-validation-title visible-xs-block');
    });

    it('does not add extra top margin before the form content', () => {
        expect(viewSource).not.toMatch(/margin-top:\s*4rem/);
    });
});
