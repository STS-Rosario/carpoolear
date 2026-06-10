import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ConversationParticipants.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ConversationParticipants.vue', () => {
    it('shows collapsible participants with profile links and ratings', () => {
        expect(viewSource).toContain("$t('groupChatViewParticipants')");
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain("name: 'profile'");
    });
});
