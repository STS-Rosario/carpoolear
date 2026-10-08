import { describe, expect, it } from 'vitest';
import messages from './i18n';

const COPY = {
    arg: 'Tu cuenta se encuentra desactivada por el equipo de Carpoolear. Revisá tus mensajes en Mesa de ayuda para ver la razón y comunicarte con el equipo de Carpoolear.',
    chl: 'Tu cuenta se encuentra desactivada por el equipo de Carpoolear. Revisá tus mensajes en Mesa de ayuda para ver la razón y comunicarte con el equipo de Carpoolear.',
    en: 'Your account has been deactivated by the Carpoolear team. Check your Mesa de ayuda messages to see the reason and contact the Carpoolear team.'
};

describe('banned account mesa de ayuda copy', () => {
    it.each(Object.entries(COPY))(
        'defines the deactivated-account banner in %s',
        (locale, expected) => {
            expect(messages[locale].cuentaDesactivadaMesaAyuda).toBe(expected);
        }
    );
});
