import { describe, expect, it, vi } from 'vitest';
import {
    PREFILLED_TICKET_BLANK_LINES_HTML,
    prependBlankLinesToPrefilledTicketEditor
} from './ticketMessagePrefill.js';

describe('prependBlankLinesToPrefilledTicketEditor', () => {
    it('prepends empty paragraphs and leaves the cursor at the top', () => {
        const invoke = vi.fn((method) => {
            if (method === 'getHTML') {
                return '<p>--- datos del viaje ---</p><p>Viaje ID: 1</p>';
            }
            return null;
        });
        const editorRef = { invoke };

        prependBlankLinesToPrefilledTicketEditor(editorRef);

        expect(invoke).toHaveBeenCalledWith(
            'setHTML',
            `${PREFILLED_TICKET_BLANK_LINES_HTML}<p>--- datos del viaje ---</p><p>Viaje ID: 1</p>`,
            false
        );
        expect(invoke).toHaveBeenCalledWith('moveCursorToStart', true);
    });

    it('does nothing when the editor has no html yet', () => {
        const invoke = vi.fn((method) => {
            if (method === 'getHTML') {
                return '';
            }
            return null;
        });

        expect(prependBlankLinesToPrefilledTicketEditor({ invoke })).toBe(false);
        expect(invoke).not.toHaveBeenCalledWith('setHTML', expect.anything(), expect.anything());
    });

    it('does nothing when the editor ref is missing', () => {
        expect(prependBlankLinesToPrefilledTicketEditor(null)).toBe(false);
    });
});
