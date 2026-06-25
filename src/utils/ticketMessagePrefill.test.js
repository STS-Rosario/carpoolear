import { describe, expect, it, vi } from 'vitest';
import {
    PREFILLED_TICKET_BLANK_LINE_MARKDOWN,
    buildPrefilledTicketEditorMarkdown,
    focusPrefilledTicketEditorAtStart
} from './ticketMessagePrefill.js';

describe('buildPrefilledTicketEditorMarkdown', () => {
    it('adds two blank paragraphs before the trip block', () => {
        const markdown = buildPrefilledTicketEditorMarkdown(
            '--- datos del viaje ---\n\nViaje ID: 1'
        );

        expect(markdown).toBe(
            `${PREFILLED_TICKET_BLANK_LINE_MARKDOWN}\n\n${PREFILLED_TICKET_BLANK_LINE_MARKDOWN}\n\n--- datos del viaje ---\n\nViaje ID: 1`
        );
    });

    it('returns an empty string when the trip block is missing', () => {
        expect(buildPrefilledTicketEditorMarkdown('')).toBe('');
    });
});

describe('focusPrefilledTicketEditorAtStart', () => {
    it('moves the cursor to the document start', () => {
        const invoke = vi.fn();
        focusPrefilledTicketEditorAtStart({ invoke });
        expect(invoke).toHaveBeenCalledWith('moveCursorToStart', true);
    });
});
