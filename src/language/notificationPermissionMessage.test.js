import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('notificacionesNoAceptastePermisos i18n', () => {
    const expectedSpanish =
        'Parece que no aceptaste los permisos para que te podamos enviar notificaciones (en nuevos mensajes, etc.) en este dispositivo , presioná el botón si querés hacerlo:';

    it.each(['arg', 'chl'])(
        '%s locale has the updated Spanish permission message mentioning this device',
        (locale) => {
            expect(messages[locale].notificacionesNoAceptastePermisos).toBe(
                expectedSpanish
            );
        }
    );

    it('en locale still defines a notification permission message', () => {
        expect(messages.en.notificacionesNoAceptastePermisos).toBeTruthy();
    });
});
