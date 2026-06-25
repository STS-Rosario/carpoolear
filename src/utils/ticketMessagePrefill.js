/**
 * After initial-value renders the trip block, prepend blank lines for user input.
 * @param {{ invoke: (method: string, ...args: unknown[]) => unknown } | null | undefined} editorRef
 * @returns {boolean}
 */
export function preparePrefilledTicketEditorCursor(editorRef) {
    if (!editorRef || typeof editorRef.invoke !== 'function') {
        return false;
    }

    editorRef.invoke('moveCursorToStart', true);
    editorRef.invoke('insertText', '\n\n');
    editorRef.invoke('moveCursorToStart', true);
    return true;
}
