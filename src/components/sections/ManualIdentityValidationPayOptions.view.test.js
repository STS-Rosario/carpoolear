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
});
