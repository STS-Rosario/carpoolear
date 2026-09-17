export const TICKET_SOURCE_WEB_FORM = 'web_form';

export const TICKET_SOURCE_FEEDBACK_TAB = 'feedback_tab';

const SOURCE_LABEL_KEYS = {
    [TICKET_SOURCE_WEB_FORM]: 'ticketOrigenFormulario',
    [TICKET_SOURCE_FEEDBACK_TAB]: 'ticketOrigenPestana'
};

export function ticketSourceLabelKey(source) {
    return SOURCE_LABEL_KEYS[source] || '';
}
