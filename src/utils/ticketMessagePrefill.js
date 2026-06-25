export const PREFILLED_TICKET_TOP_SPACES = '  ';

export function buildPrefilledTicketEditorMarkdown(tripBlockMarkdown) {
    const tripBlock = tripBlockMarkdown == null ? '' : String(tripBlockMarkdown).trim();
    if (!tripBlock) {
        return '';
    }

    return `${PREFILLED_TICKET_TOP_SPACES}\n\n${tripBlock}`;
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
