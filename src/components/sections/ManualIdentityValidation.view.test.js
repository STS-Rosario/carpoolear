import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ManualIdentityValidation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ManualIdentityValidation CTA AppButtons', () => {
    it('uses primary Mercado Pago pay and documentation submit AppButtons', () => {
        expect(viewSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?createPreferenceAndRedirect[\s\S]*?manualValidationPagarMercadoPago/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?type="submit"[\s\S]*?enviarDocumentacion/
        );
        expect(viewSource).not.toMatch(
            /class="btn btn-danger[\s\S]*?manualValidationPagarMercadoPago/
        );
        expect(viewSource).not.toMatch(
            /class="btn btn-danger[\s\S]*?enviarDocumentacion/
        );
    });

    it('uses secondary QR pay and tertiary QR close AppButtons', () => {
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?createQrOrderAndShow[\s\S]*?pagarConQR/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="tertiary"[\s\S]*?closeQrPanel[\s\S]*?\$t\('cerrar'\)/
        );
        expect(viewSource).not.toContain('manual-validation-btn-outline');
    });

    it('uses secondary AppButtons for volver navigation links', () => {
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?\$t\('volver'\)/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?verEstadoValidacion/
        );
        expect(viewSource).not.toMatch(
            /class="btn btn-default[\s\S]*?\$t\('volver'\)/
        );
    });

    it('drops legacy white-text overrides for bootstrap primary and danger buttons', () => {
        expect(viewSource).not.toMatch(
            /\.manual-identity-validation-component\s+\.btn-primary[\s\S]*color:\s*#fff/
        );
        expect(viewSource).not.toMatch(
            /\.manual-identity-validation-component\s+\.btn-danger[\s\S]*color:\s*#fff/
        );
    });
});
