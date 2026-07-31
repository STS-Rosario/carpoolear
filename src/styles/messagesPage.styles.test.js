import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const mainCssPath = path.resolve(__dirname, 'main.css');
const cssPath = path.resolve(__dirname, 'components/messages-page.css');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');

describe('messages-page.css', () => {
    it('is imported from main.css', () => {
        expect(mainCss).toContain("components/messages-page.css");
    });

    it('defines outgoing/incoming bubble and selected row tokens', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toContain('--messages-outgoing-bg');
        expect(css).toContain('--messages-incoming-bg');
        expect(css).toContain('--messages-selected-bg');
        expect(css).toContain('.message-wrapper-me .message');
        expect(css).toContain('.conversation_header.active');
        expect(css).toContain('.message-composer-editor-wrap');
    });
});
