import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SUPPORT_FEEDBACK_TAB_LABELS = {
    arg: {
        pestanaFeedback: 'Feedback',
        feedbackTabTitulo: 'Enviar feedback',
        feedbackTabSubtitulo: 'Contanos qué pasó o qué se podría mejorar.',
        feedbackTabAsunto: 'Asunto',
        feedbackTabAsuntoPlaceholder: 'Resumen breve',
        feedbackTabEnviar: 'Enviar',
        feedbackTabExito: 'Ticket creado. Gracias por escribirnos.',
        feedbackTabError: 'No se pudo enviar el ticket. Intente de nuevo',
        verTicket: 'Ver ticket',
        ticketOrigen: 'Origen',
        ticketOrigenFormulario: 'Formulario de mesa de ayuda',
        ticketOrigenPestana: 'Pestaña de ayuda'
    },
    chl: {
        pestanaFeedback: 'Feedback',
        feedbackTabTitulo: 'Enviar feedback',
        feedbackTabSubtitulo: 'Contanos qué pasó o qué se podría mejorar.',
        feedbackTabAsunto: 'Asunto',
        feedbackTabAsuntoPlaceholder: 'Resumen breve',
        feedbackTabEnviar: 'Enviar',
        feedbackTabExito: 'Ticket creado. Gracias por escribirnos.',
        feedbackTabError: 'No se pudo enviar el ticket. Intente de nuevo',
        verTicket: 'Ver ticket',
        ticketOrigen: 'Origen',
        ticketOrigenFormulario: 'Formulario de mesa de ayuda',
        ticketOrigenPestana: 'Pestaña de ayuda'
    },
    en: {
        pestanaFeedback: 'Feedback',
        feedbackTabTitulo: 'Send feedback',
        feedbackTabSubtitulo: 'Tell us what happened or what we could improve.',
        feedbackTabAsunto: 'Subject',
        feedbackTabAsuntoPlaceholder: 'Short summary',
        feedbackTabEnviar: 'Send',
        feedbackTabExito: 'Ticket created. Thanks for writing in.',
        feedbackTabError: 'Could not send the ticket. Please try again',
        verTicket: 'View ticket',
        ticketOrigen: 'Origin',
        ticketOrigenFormulario: 'Help desk form',
        ticketOrigenPestana: 'Help tab'
    }
};

describe('support feedback tab labels (i18n)', () => {
    it.each(Object.entries(SUPPORT_FEEDBACK_TAB_LABELS))(
        '%s locale defines help-tab ticket copy',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
