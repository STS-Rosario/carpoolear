import { describe, expect, it } from 'vitest';
import messages from './i18n';

const TEMPLATE_PARAMS = ['{tripLink}', '{maxAmount}', '{bannedUntil}', '{termsLink}'];
const SIGN_OFF = { arg: 'Equipo Carpoolear', en: 'The Carpoolear Team' };

describe('excess contribution templated ticket copy', () => {
    it.each(['arg', 'en'])('defines the templated ticket texts in %s', (locale) => {
        const template = messages[locale].excessContributionTemplatedTicketMessage;
        TEMPLATE_PARAMS.forEach((param) => expect(template).toContain(param));
        expect(template.split('\n\n')).toHaveLength(5);
        expect(template.endsWith(`\n\n${SIGN_OFF[locale]}`)).toBe(true);
        expect(messages[locale].excessContributionTemplatedTicketButton).toBeTruthy();
        expect(messages[locale].excessContributionTemplatedTicketConfirm).toContain('{name}');
        expect(messages[locale].excessContributionTemplatedTicketCreated).toBeTruthy();
        expect(messages[locale].excessContributionTemplatedTicketError).toBeTruthy();
        expect(messages[locale].excessContributionTicketAlreadyExists).toBeTruthy();
        expect(messages[locale].excessContributionTicketView).toBeTruthy();
    });

    it('uses the agreed button and snackbar texts', () => {
        expect(messages.arg.excessContributionTemplatedTicketButton).toBe(
            'Crear ticket con plantilla'
        );
        expect(messages.en.excessContributionTemplatedTicketButton).toBe(
            'Create templated ticket'
        );
        expect(messages.arg.excessContributionTemplatedTicketCreated).toBe(
            'Ticket de mesa de ayuda creado'
        );
        expect(messages.en.excessContributionTemplatedTicketCreated).toBe(
            'Help desk ticket created'
        );
    });
});
