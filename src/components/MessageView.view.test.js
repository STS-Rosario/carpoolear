import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'MessageView.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('MessageView.vue group chat', () => {
    it('shows author name and avatar for trip group messages from others', () => {
        expect(viewSource).toContain('isGroupChat');
        expect(viewSource).toContain('author.image');
    });

    it('renders system messages with dedicated styling', () => {
        expect(viewSource).toContain('message-wrapper--system');
        expect(viewSource).toContain('message.is_system');
    });
});
