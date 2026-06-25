import { describe, expect, it, vi } from 'vitest';
import { preparePrefilledTicketEditorCursor } from './ticketMessagePrefill.js';

describe('preparePrefilledTicketEditorCursor', () => {
    it('prepends blank lines and leaves the cursor at the top', () => {
        const invoke = vi.fn();
        const editorRef = { invoke };

        preparePrefilledTicketEditorCursor(editorRef);

        expect(invoke).toHaveBeenNthCalledWith(1, 'moveCursorToStart', true);
        expect(invoke).toHaveBeenNthCalledWith(2, 'insertText', '\n\n');
        expect(invoke).toHaveBeenNthCalledWith(3, 'moveCursorToStart', true);
        expect(invoke).not.toHaveBeenCalledWith('setMarkdown', expect.anything());
    });

    it('does nothing when the editor ref is missing', () => {
        expect(preparePrefilledTicketEditorCursor(null)).toBe(false);
    });
});
