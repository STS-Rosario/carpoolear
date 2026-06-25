/** Invisible paragraph content so Toast UI keeps empty lines in WYSIWYG mode. */
export const PREFILLED_TICKET_BLANK_LINE_MARKDOWN = '\u200B';

export function buildPrefilledTicketEditorMarkdown(tripBlockMarkdown) {
    const tripBlock = tripBlockMarkdown == null ? '' : String(tripBlockMarkdown).trim();
    if (!tripBlock) {
        return '';
    }

    return [
        PREFILLED_TICKET_BLANK_LINE_MARKDOWN,
        PREFILLED_TICKET_BLANK_LINE_MARKDOWN,
        tripBlock
    ].join('\n\n');
}

/**
 * @param {{ invoke: (method: string, ...args: unknown[]) => unknown } | null | undefined} editorRef
 * @returns {boolean}
 */
export function focusPrefilledTicketEditorAtStart(editorRef) {
    if (!editorRef || typeof editorRef.invoke !== 'function') {
        return false;
    }

    editorRef.invoke('moveCursorToStart', true);
    return true;
}
