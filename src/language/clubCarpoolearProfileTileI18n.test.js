import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_TITLE = 'Integrante del Club Carpoolear';
const SPANISH_SUB =
    'Esta persona ayuda a mantener a Carpoolear andando :) {link}';
const SPANISH_WHAT = '¿Qué es esto?';

describe('Club Carpoolear profile tile i18n', () => {
    it.each(['arg', 'chl'])(
        '%s locale labels public Club Carpoolear members',
        (locale) => {
            expect(messages[locale].miembroClubCarpoolearTitulo).toBe(
                SPANISH_TITLE
            );
            expect(messages[locale].miembroClubCarpoolearSub).toBe(SPANISH_SUB);
            expect(messages[locale].miembroClubCarpoolearQueEsEsto).toBe(
                SPANISH_WHAT
            );
        }
    );

    it('en locale labels public Club Carpoolear members', () => {
        expect(messages.en.miembroClubCarpoolearTitulo).toBe(
            'Club Carpoolear member'
        );
        expect(messages.en.miembroClubCarpoolearSub).toBe(
            'This person helps keep Carpoolear going :) {link}'
        );
        expect(messages.en.miembroClubCarpoolearQueEsEsto).toBe(
            'What is this?'
        );
    });
});
