import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH =
    'Este ticket está asignado a {name}, ¿seguro que querés sacarle la asignación y asignártelo a vos mismo?';

const ENGLISH =
    'This ticket is assigned to {name}. Are you sure you want to remove their assignment and assign it to yourself?';

describe('admin support ticket reassign confirm copy', () => {
    it.each(['arg', 'chl'])('uses agreed Spanish confirm in %s', (locale) => {
        expect(messages[locale].confirmarReasignarmeTicket).toBe(SPANISH);
    });

    it('uses English confirm in en', () => {
        expect(messages.en.confirmarReasignarmeTicket).toBe(ENGLISH);
    });
});
