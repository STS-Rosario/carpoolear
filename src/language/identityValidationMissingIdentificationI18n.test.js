import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_COPY =
    'Mercado Pago no nos provee la información de tu documento por lo que no podemos verificar tu identidad';

describe('resultMissingIdentification i18n', () => {
    it.each(['arg', 'chl'])(
        '%s locale explains Mercado Pago did not provide document data',
        (locale) => {
            expect(messages[locale].resultMissingIdentification).toBe(
                SPANISH_COPY
            );
        }
    );

    it('en locale explains Mercado Pago did not provide document data', () => {
        expect(messages.en.resultMissingIdentification).toBe(
            'Mercado Pago does not provide your document information, so we cannot verify your identity.'
        );
    });
});
