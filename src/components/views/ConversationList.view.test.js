import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ConversationList.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

function getMobileChatConversationComponentBlock() {
    const match = viewSource.match(
        /\.conversation-list-page--mobile-chat \.conversation-component\.container\s*\{[^}]+\}/s
    );
    return match ? match[0] : '';
}

describe('ConversationList.vue mobile chat layout', () => {
    it('removes horizontal container padding on mobile chat so conversation uses full width', () => {
        const block = getMobileChatConversationComponentBlock();

        expect(block).toMatch(/padding-left:\s*0/);
        expect(block).toMatch(/padding-right:\s*0/);
        expect(block).toMatch(/width:\s*100%/);
        expect(block).toMatch(/max-width:\s*100%/);
    });
});
