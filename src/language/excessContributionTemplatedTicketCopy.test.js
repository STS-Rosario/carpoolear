import { describe, expect, it } from 'vitest';
import messages from './i18n';

const TEMPLATE = 'Just a test.\n\nthis is another paragraph\n\nEquipo Carpoolear';

describe('excess contribution templated ticket copy', () => {
    it.each(['arg', 'en'])('defines the templated ticket texts in %s', (locale) => {
        expect(messages[locale].excessContributionTemplatedTicketMessage).toBe(TEMPLATE);
        expect(messages[locale].excessContributionTemplatedTicketButton).toBeTruthy();
        expect(messages[locale].excessContributionTemplatedTicketConfirm).toContain('{name}');
        expect(messages[locale].excessContributionTemplatedTicketCreated).toBeTruthy();
        expect(messages[locale].excessContributionTemplatedTicketError).toBeTruthy();
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
