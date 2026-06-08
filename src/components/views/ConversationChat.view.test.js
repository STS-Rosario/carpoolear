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
});
