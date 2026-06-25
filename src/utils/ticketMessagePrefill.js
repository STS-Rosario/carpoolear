export const PREFILLED_TICKET_BLANK_LINES_HTML = '<p><br></p><p><br></p>';

/**
 * Prepend empty paragraphs above trip context already rendered in WYSIWYG mode.
 * @param {{ invoke: (method: string, ...args: unknown[]) => unknown } | null | undefined} editorRef
 * @returns {boolean}
 */
export function prependBlankLinesToPrefilledTicketEditor(editorRef) {
    if (!editorRef || typeof editorRef.invoke !== 'function') {
        return false;
    }

    const currentHtml = editorRef.invoke('getHTML');
    if (currentHtml == null || !String(currentHtml).trim()) {
        return false;
    }

    editorRef.invoke(
        'setHTML',
        `${PREFILLED_TICKET_BLANK_LINES_HTML}${currentHtml}`,
        false
    );
    editorRef.invoke('moveCursorToStart', true);
    return true;
}
