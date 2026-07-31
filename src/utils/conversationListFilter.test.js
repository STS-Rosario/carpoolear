import { describe, expect, it } from 'vitest';
import {
    countConversationsByKind,
    filterConversationsByKind
} from './conversationListFilter';

describe('conversationListFilter', () => {
    const conversations = [
        { id: 1, type: 0, title: 'Ada' },
        { id: 2, type: 1, title: 'Group A' },
        { id: 3, type: 0, title: 'Bob' },
        { id: 4, type: 1, title: 'Group B' }
    ];

    it('returns all conversations for kind all', () => {
        expect(filterConversationsByKind(conversations, 'all')).toHaveLength(4);
    });

    it('returns only group chats for kind group', () => {
        expect(filterConversationsByKind(conversations, 'group').map((c) => c.id)).toEqual([
            2,
            4
        ]);
    });

    it('returns only individual chats for kind individual', () => {
        expect(
            filterConversationsByKind(conversations, 'individual').map((c) => c.id)
        ).toEqual([1, 3]);
    });

    it('counts conversations by kind', () => {
        expect(countConversationsByKind(conversations)).toEqual({
            all: 4,
            group: 2,
            individual: 2
        });
    });
});
