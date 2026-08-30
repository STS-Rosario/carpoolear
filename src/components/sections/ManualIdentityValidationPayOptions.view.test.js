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

    it('shows copy and share payment link actions when Mercado Pago payment is selected', () => {
        const source = fs.readFileSync(componentPath, 'utf8');
        const identitySource = fs.readFileSync(identityValidationPath, 'utf8');
        const manualSource = fs.readFileSync(manualValidationPath, 'utf8');

        expect(source).toContain('showMpPanel');
        expect(source).toContain('mpPaymentUrl');
        expect(source).toContain("$t('copiarLinkDePago')");
        expect(source).toContain("$t('enviarLinkDePago')");
        expect(source).toContain("$t('manualValidationPagarMercadoPago')");
        expect(source).toContain('copyTextToClipboard');
        expect(source).toContain('shareContent');
        expect(source).toContain('copyMpLink');
        expect(source).toContain('shareMpLink');
        expect(source).toContain('openMpCheckout');
        expect(source).toContain("emit('close-mp')");

        expect(identitySource).toContain(':show-mp-panel="showMpPanel"');
        expect(identitySource).toContain(':mp-payment-url="mpPaymentUrl"');
        expect(manualSource).toContain(':show-mp-panel="showMpPanel"');
        expect(manualSource).toContain(':mp-payment-url="mpPaymentUrl"');

        const identityPayMethod = identitySource.slice(
            identitySource.indexOf('payManualValidation() {'),
            identitySource.indexOf('createManualValidationQrOrderAndShow() {')
        );
        expect(identityPayMethod).toContain('this.showMpPanel = true');
        expect(identityPayMethod).toContain('this.mpPaymentUrl');
        expect(identityPayMethod).not.toContain('window.location.href = initPoint');

        const manualPayMethod = manualSource.slice(
            manualSource.indexOf('createPreferenceAndRedirect() {'),
            manualSource.indexOf('createQrOrderAndShow() {')
        );
        expect(manualPayMethod).toContain('this.showMpPanel = true');
        expect(manualPayMethod).toContain('this.mpPaymentUrl');
        expect(manualPayMethod).not.toContain('window.location.href = initPoint');
    });

    it('polls for payment after creating a Mercado Pago checkout link', () => {
        const identitySource = fs.readFileSync(identityValidationPath, 'utf8');
        const manualSource = fs.readFileSync(manualValidationPath, 'utf8');

        const identityPayMethod = identitySource.slice(
            identitySource.indexOf('payManualValidation() {'),
            identitySource.indexOf('createManualValidationQrOrderAndShow() {')
        );
        expect(identityPayMethod).toContain('this.startManualValidationQrPolling()');

        const identityCloseMp = identitySource.slice(
            identitySource.indexOf('closeManualValidationMpPanel() {'),
            identitySource.indexOf('startManualValidationQrPolling() {')
        );
        expect(identityCloseMp).toContain('this.stopManualValidationQrPolling()');

        const manualPayMethod = manualSource.slice(
            manualSource.indexOf('createPreferenceAndRedirect() {'),
            manualSource.indexOf('createQrOrderAndShow() {')
        );
        expect(manualPayMethod).toContain('this.startPollingStatus()');

        const manualCloseMp = manualSource.slice(
            manualSource.indexOf('closeMpPanel() {'),
            manualSource.indexOf('startPollingStatus() {')
        );
        expect(manualCloseMp).toContain('this.stopPollingStatus()');
    });
});
