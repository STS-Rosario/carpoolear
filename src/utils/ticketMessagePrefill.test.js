import { describe, expect, it, vi } from 'vitest';
import { applyTripBlockPrefillToEditor } from './ticketMessagePrefill.js';

describe('applyTripBlockPrefillToEditor', () => {
    it('loads the trip block then leaves the cursor on blank lines at the top', () => {
        const invoke = vi.fn();
        const editorRef = { invoke };

        applyTripBlockPrefillToEditor(editorRef, '--- datos del viaje ---\n\nViaje ID: 1');

        expect(invoke).toHaveBeenNthCalledWith(
            1,
            'setMarkdown',
            '--- datos del viaje ---\n\nViaje ID: 1',
            true
        );
        expect(invoke).toHaveBeenNthCalledWith(2, 'moveCursorToStart', true);
        expect(invoke).toHaveBeenNthCalledWith(3, 'insertText', '\n\n');
        expect(invoke).toHaveBeenNthCalledWith(4, 'moveCursorToStart', true);
    });

    it('does nothing when the trip block is empty', () => {
        const invoke = vi.fn();
        applyTripBlockPrefillToEditor({ invoke }, '');
        expect(invoke).not.toHaveBeenCalled();
    });
});
