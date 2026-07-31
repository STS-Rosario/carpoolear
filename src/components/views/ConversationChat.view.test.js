import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ConversationChat.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ConversationChat.vue user ratings', () => {
    it('shows other participant ratings to the right of the user name on desktop', () => {
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('conversation_user_header_title_row');
        expect(viewSource).toContain('otherUserRatings');
        expect(viewSource).toMatch(
            /conversation_user_header_title_row[\s\S]*UserRatingsCounts/s
        );
    });

    it('resolves other participant ratings from conversation users via shared helper', () => {
        expect(viewSource).toContain('getOtherParticipantRatings');
        expect(viewSource).toContain('setHeaderRatings');
    });

    it('supports trip group chat header with participants and mute toggle', () => {
        expect(viewSource).toContain('ConversationParticipants');
        expect(viewSource).toContain('groupChatMuteNotifications');
        expect(viewSource).toContain(':isGroupChat="isGroupChat"');
    });

    it('renders group chat participants from conversation users instead of private driver header', () => {
        expect(viewSource).toMatch(
            /isGroupChat[\s\S]*ConversationParticipants[\s\S]*conversation\.users/s
        );
        expect(viewSource).toMatch(
            /v-if="isGroupChat"[\s\S]*groupChatTitle/s
        );
    });

    it('keeps Toast UI markdown composer for sending messages', () => {
        expect(viewSource).toContain('ToastUiEditor');
        expect(viewSource).toContain('messageEditor');
        expect(viewSource).toContain("invoke('getMarkdown')");
        expect(viewSource).toContain("['bold', 'italic', 'strike']");
        expect(viewSource).toContain('message-composer-editor');
    });

    it('uses a primary send control with a message icon', () => {
        expect(viewSource).toContain('fa-paper-plane');
        expect(viewSource).not.toContain('fa-play');
        expect(viewSource).toContain('message-composer-send');
    });

    it('renders day separators between message groups', () => {
        expect(viewSource).toContain('buildMessagesWithDaySeparators');
        expect(viewSource).toContain('messagesWithDaySeparators');
        expect(viewSource).toContain('message-day-separator');
    });

    it('links group chat header to the trip when trip id is present', () => {
        expect(viewSource).toContain('verDetalleViaje');
        expect(viewSource).toMatch(
            /isGroupChat[\s\S]*verDetalleViaje[\s\S]*trip/s
        );
    });
});
