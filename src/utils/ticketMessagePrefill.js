/**
 * @param {{ invoke: (method: string, ...args: unknown[]) => unknown } | null | undefined} editorRef
 * @param {string} tripBlockMarkdown
 * @returns {boolean}
 */
export function applyTripBlockPrefillToEditor(editorRef, tripBlockMarkdown) {
    const tripBlock = tripBlockMarkdown == null ? '' : String(tripBlockMarkdown);
    if (!tripBlock || !editorRef || typeof editorRef.invoke !== 'function') {
        return false;
    }

    editorRef.invoke('setMarkdown', tripBlock, true);
    editorRef.invoke('moveCursorToStart', true);
    editorRef.invoke('insertText', '\n\n');
    editorRef.invoke('moveCursorToStart', true);
    return true;
}
