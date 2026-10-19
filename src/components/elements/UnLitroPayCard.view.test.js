import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'UnLitroPayCard.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('UnLitroPayCard.vue', () => {
    it('disables QR when sellado QR payments are off and enables it when they are on', () => {
        expect(componentSource).toContain('qrEnabled');
        expect(componentSource).toContain('un-litro-pay-method--disabled');
        expect(componentSource).toContain(':disabled="!qrEnabled"');
        expect(componentSource).toContain('value="qr"');
        expect(componentSource).toContain("$t('unLitroPayQr')");
        expect(componentSource).not.toContain('RapiPago');
        expect(componentSource).not.toContain('unLitroPayRapipago');
    });

    it('shows the QR code and Validación manual how-to inside the QR option after Pagar', () => {
        expect(componentSource).toContain('showQrPanel');
        expect(componentSource).toContain('qrImageUrl');
        expect(componentSource).toContain('ManualValidationQrPaymentHelp');
        expect(componentSource).toContain(
            'computer-suffix-key="comoHacerPagoQRComputadoraSuffixUnLitro"'
        );
        expect(componentSource).toContain("$t('escaneáConAppMercadoPago')");
        expect(componentSource).toContain("$t('qrExpiraEn')");
        expect(componentSource).toContain('createSelladoQrOrder');
        expect(componentSource).toContain('selladoPaidQueryRoute');
        expect(componentSource).toContain('$router.replace');
        expect(componentSource).toContain("selectedMethod === 'qr'");
    });

    it('pays Mercado Pago from the selected method and offers Pagar después', () => {
        expect(componentSource).toContain('value="mercado_pago"');
        expect(componentSource).toContain('selladoCheckoutUrl');
        expect(componentSource).toContain('openExternalUrl');
        expect(componentSource).toContain("$t('unLitroPayLater')");
        expect(componentSource).toContain('data-testid="un-litro-pay-now"');
        expect(componentSource).toContain('data-testid="un-litro-pay-qr"');
        expect(componentSource).toContain('un-litro-pay-card__actions');
        expect(componentSource).toContain('un-litro-pay-card__amount-copy');
    });
});
