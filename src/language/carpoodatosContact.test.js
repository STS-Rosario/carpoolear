import { describe, expect, it } from 'vitest';
import messages from './i18n';

const LOCALES = ['arg', 'chl', 'en'];

describe('carpoodatos contact copy', () => {
    it.each(LOCALES)(
        '%s locale reuses mesa de ayuda contact keys instead of email copy',
        (locale) => {
            expect(messages[locale]).not.toHaveProperty(
                'carpoodatosContactoEmail'
            );
            expect(messages[locale]).not.toHaveProperty(
                'carpoodatosContactoRedes'
            );
            expect(messages[locale].mesaAyudaContactoLead).toBeTruthy();
            expect(messages[locale].mesaAyuda).toBeTruthy();
            expect(messages[locale].mesaAyudaContactoTail).toBeTruthy();
        }
    );
});
