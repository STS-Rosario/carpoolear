import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('manual validation Mercado Pago payment link copy', () => {
    it.each(['arg', 'chl'])(
        '%s locale has copy and share payment link labels',
        (locale) => {
            expect(messages[locale].copiarLinkDePago).toBe('Copiar link de pago');
            expect(messages[locale].enviarLinkDePago).toBe('Enviar link de pago');
            expect(messages[locale].linkDePagoCopiado).toBe('Link de pago copiado');
        }
    );

    it('en locale has copy and share payment link labels', () => {
        expect(messages.en.copiarLinkDePago).toBe('Copy payment link');
        expect(messages.en.enviarLinkDePago).toBe('Send payment link');
        expect(messages.en.linkDePagoCopiado).toBe('Payment link copied');
    });
});
