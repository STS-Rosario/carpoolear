import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripButtons.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripButtons.vue group chat', () => {
    it('keeps private message button and adds group chat button with unread badge', () => {
        expect(viewSource).toContain("$emit('toMessages')");
        expect(viewSource).toContain("$emit('toGroupChat')");
        expect(viewSource).toContain("$t('enviarMensaje')");
        expect(viewSource).toContain("$t('groupChatButton')");
        expect(viewSource).toContain('group_chat_unread_count');
        expect(viewSource).toContain('showGroupChatButton');
        expect(viewSource).toContain('group_chat_conversation_id');
    });
});

describe('TripButtons.vue seat request limit', () => {
    it('disables message and request actions and shows passenger limit message', () => {
        expect(viewSource).toContain('shouldShowPassengerSeatRequestLimitMessage');
        expect(viewSource).toContain('seatRequestLimitReached');
        expect(viewSource).toContain("$t('tripSeatRequestLimitPassengerMessage'");
        expect(viewSource).toContain('seat_request_limit');
        expect(viewSource).toMatch(
            /:disabled="[^"]*seatRequestLimitReached/
        );
    });
});
