import { describe, expect, it, vi } from 'vitest';
import {
    formatTripGroupChatTitle,
    isTripGroupConversation
} from './tripGroupChatTitle';

describe('tripGroupChatTitle', () => {
    it('formats trip date and hour through i18n key', () => {
        const t = vi.fn((key, params) => `${key}:${params.date}:${params.hour}`);
        const title = formatTripGroupChatTitle(t, '2026-06-10 14:30:00');

        expect(t).toHaveBeenCalledWith('groupChatTripTitle', {
            date: '10/06/2026',
            hour: '14:30'
        });
        expect(title).toBe('groupChatTripTitle:10/06/2026:14:30');
    });

    it('detects trip group conversations by type', () => {
        expect(isTripGroupConversation({ type: 1 })).toBe(true);
        expect(isTripGroupConversation({ type: 0 })).toBe(false);
    });
});
