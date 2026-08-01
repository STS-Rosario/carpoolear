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

describe('TripButtons.vue message/request hierarchy', () => {
    it('marks solicitar asiento secondary when both CTAs can show', () => {
        expect(viewSource).toContain('btn-primary');
        expect(viewSource).toMatch(
            /class="btn(?:\s+trip-detail__cta-secondary)?"[\s\S]*?solicitarAsiento|solicitarAsiento[\s\S]*?class="btn"/
        );
        expect(viewSource).toContain('trip-detail__cta-secondary');
    });

    it('only marks solicitar/reservar secondary when the message CTA is also visible', () => {
        expect(viewSource).not.toMatch(/class="btn\s+trip-detail__cta-secondary"/);

        const buttonStart = viewSource.indexOf('onMakeRequest');
        const blockStart = viewSource.lastIndexOf('<button', buttonStart);
        const blockEnd = viewSource.indexOf('</button>', buttonStart);
        const requestButtonMarkup = viewSource.slice(blockStart, blockEnd);

        expect(requestButtonMarkup).toContain(':class');
        expect(requestButtonMarkup).toContain('trip-detail__cta-secondary');
        expect(requestButtonMarkup).toContain('showMessageButton');
        expect(viewSource).toMatch(/v-if="showMessageButton"/);
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
