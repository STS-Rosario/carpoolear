import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('QR payment how-to copy', () => {
    it.each(['arg', 'chl'])('%s locale has QR payment how-to copy', (locale) => {
        expect(messages[locale].comoPagarElQR).toBe('¿Cómo pagar el QR?');
        expect(messages[locale].comoHacerPagoQRTitulo).toBe(
            '¿Cómo hacer el pago con QR?'
        );
        expect(messages[locale].comoHacerPagoQRCelular).toContain(
            'captura de pantalla al QR'
        );
        expect(messages[locale].comoHacerPagoQRComputadoraPrefix).toContain(
            'Desde una computadora'
        );
        expect(messages[locale].comoHacerPagoQRComputadoraLink).toBe(
            'www.carpoolear.com.ar/app'
        );
        expect(messages[locale].comoHacerPagoQRComputadoraSuffix).toContain(
            'billetera virtual'
        );
    });

    it('en locale has QR payment how-to copy', () => {
        expect(messages.en.comoPagarElQR).toBe('How to pay with QR?');
        expect(messages.en.comoHacerPagoQRTitulo).toBe('How to pay with QR');
        expect(messages.en.comoHacerPagoQRCelular).toContain('screenshot');
        expect(messages.en.comoHacerPagoQRComputadoraPrefix).toContain(
            'From a computer'
        );
        expect(messages.en.comoHacerPagoQRComputadoraLink).toBe(
            'www.carpoolear.com.ar/app'
        );
        expect(messages.en.comoHacerPagoQRComputadoraSuffix).toContain(
            'digital wallet'
        );
    });
});
