import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ConversationList.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

function getMobileStylesBlock() {
    const match = viewSource.match(
        /@media only screen and \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/m
    );
    return match ? match[1] : '';
}

describe('ConversationList.vue mobile chat layout', () => {
    it('removes horizontal container padding on mobile chat so conversation uses full width', () => {
        const mobileStyles = getMobileStylesBlock();
        const block = mobileStyles.match(
            /\.conversation-list-page--mobile-chat \.conversation-component\.container\s*\{[^}]+\}/s
        );

        expect(block).not.toBeNull();
        expect(block[0]).toMatch(/padding-left:\s*0/);
        expect(block[0]).toMatch(/padding-right:\s*0/);
        expect(block[0]).toMatch(/width:\s*100%/);
        expect(block[0]).toMatch(/max-width:\s*100%/);
    });
});
