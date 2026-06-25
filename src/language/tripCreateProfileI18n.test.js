import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('completaPerfilParaCrearViaje i18n', () => {
    it.each(['arg', 'chl'])('%s locale defines trip create profile message', (locale) => {
        expect(messages[locale].completaPerfilParaCrearViaje).toBeTruthy();
    });

    it('en locale defines trip create profile message', () => {
        expect(messages.en.completaPerfilParaCrearViaje).toBe(
            'You need to complete and save your profile before posting a trip.'
        );
    });
});
