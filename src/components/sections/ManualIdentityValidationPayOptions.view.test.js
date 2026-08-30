import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'ManualIdentityValidationPayOptions.vue');
const identityValidationPath = path.resolve(__dirname, 'IdentityValidation.vue');
const manualValidationPath = path.resolve(__dirname, 'ManualIdentityValidation.vue');

describe('ManualIdentityValidationPayOptions shared component', () => {
    it('defines manual payment instructions, buttons, and QR panel markup', () => {
        const source = fs.readFileSync(componentPath, 'utf8');

        expect(source).toContain("$t('manualValidationPayIntro1', { cost: costDisplay })");
        expect(source).toContain("$t('manualValidationPagarMercadoPago')");
        expect(source).toContain("$t('pagarConQR')");
        expect(source).toContain("$t('escaneáConAppMercadoPago')");
        expect(source).toContain("emit('pay-mp')");
        expect(source).toContain("emit('pay-qr')");
        expect(source).toContain("emit('close-qr')");
    });

    it('is used by identity validation and manual validation payment flows', () => {
        const identitySource = fs.readFileSync(identityValidationPath, 'utf8');
        const manualSource = fs.readFileSync(manualValidationPath, 'utf8');

        expect(identitySource).toContain('ManualIdentityValidationPayOptions');
        expect(manualSource).toContain('ManualIdentityValidationPayOptions');
    });

    it('shows QR payment how-to before selecting QR and after the QR panel is open', () => {
        const source = fs.readFileSync(componentPath, 'utf8');
        const helpComponentPath = path.resolve(
            __dirname,
            'ManualValidationQrPaymentHelp.vue'
        );

        expect(fs.existsSync(helpComponentPath)).toBe(true);
        const helpSource = fs.readFileSync(helpComponentPath, 'utf8');

        expect(helpSource).toContain("$t('comoPagarElQR')");
        expect(helpSource).toContain("$t('comoHacerPagoQRTitulo')");
        expect(helpSource).toContain("$t('comoHacerPagoQRCelular')");
        expect(helpSource).toContain("$t('comoHacerPagoQRComputadoraPrefix')");
        expect(helpSource).toContain("$t('comoHacerPagoQRComputadoraLink')");
        expect(helpSource).toContain("$t('comoHacerPagoQRComputadoraSuffix')");
        expect(helpSource).toContain('CARPOOLEAR_APP_URL');
        expect(helpSource).toContain('target="_blank"');
        expect(helpSource).toContain('rel="noopener noreferrer"');
        expect(helpSource).toContain('helpOpen');

        const beforeQrPanel = source.slice(0, source.indexOf('showQrPanel'));
        expect(beforeQrPanel).toContain('v-if="qrEnabled"');
        expect(beforeQrPanel).toContain('ManualValidationQrPaymentHelp');

        const qrPanel = source.slice(source.indexOf('showQrPanel'));
        expect(qrPanel).toContain('ManualValidationQrPaymentHelp');
    });
});
