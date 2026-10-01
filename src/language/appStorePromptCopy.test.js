import { describe, expect, it } from 'vitest';
import messages from './i18n';

const TITLE_ES = 'Descargá la app de Carpoolear';
const TEXT_ES =
    'Recibí notificaciones de mensajes y viajes al instante y tené Carpoolear siempre a mano. Es gratis.';

describe('app store prompt copy', () => {
    it.each(['arg', 'chl'])('uses the agreed Spanish copy in %s', (locale) => {
        expect(messages[locale].descargaLaApp).toBe(TITLE_ES);
        expect(messages[locale].descargaLaAppTexto).toBe(TEXT_ES);
        expect(messages[locale].ahoraNo).toBe('Ahora no');
        expect(messages[locale].noMostrarDeNuevo).toBe('No mostrar de nuevo');
        expect(messages[locale].disponibleEnGooglePlay).toBe('Disponible en Google Play');
        expect(messages[locale].descargarEnAppStore).toBe('Descargar en App Store');
    });

    it('uses the English copy in en', () => {
        expect(messages.en.descargaLaApp).toBe('Download the Carpoolear app');
        expect(messages.en.descargaLaAppTexto).toBe(
            'Get message and trip notifications instantly and keep Carpoolear always at hand. It\'s free.'
        );
        expect(messages.en.ahoraNo).toBe('Not now');
        expect(messages.en.disponibleEnGooglePlay).toBe('Get it on Google Play');
        expect(messages.en.descargarEnAppStore).toBe('Download on the App Store');
    });

    it('drops the old PWA install copy', () => {
        for (const locale of ['arg', 'chl', 'en']) {
            for (const key of [
                'instalar',
                'instalarApp',
                'instalarWebAppPWA',
                'instalarAppEnIos',
                'instalarAppEnIosInstrucciones'
            ]) {
                expect(messages[locale][key], `${locale}.${key}`).toBeUndefined();
            }
        }
    });
});
