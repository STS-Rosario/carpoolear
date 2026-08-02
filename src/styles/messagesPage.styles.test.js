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

    it('styles selected conversation with 3px accent left border, square corners, and dark title', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.conversation_header\.active[\s\S]*border-left:\s*3px\s+solid/
        );
        expect(css).toMatch(
            /\.conversation_header\.active[\s\S]*border-radius:\s*0/
        );
        expect(css).toMatch(
            /\.conversation_header\.active[\s\S]*color:\s*#222/
        );
        expect(css).toContain('.conversation_header.active .conversation-title');
        expect(css).toContain('.conversation_header.active .media-heading');
    });

    it('uses a single square desktop shell with side borders for list and chat', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toContain('.messages-page__shell');
        expect(css).toMatch(
            /\.messages-page__shell\s*\{[^}]*border-left:\s*1px\s+solid/s
        );
        expect(css).toMatch(
            /\.messages-page__shell\s*\{[^}]*border-right:\s*1px\s+solid/s
        );
        expect(css).toMatch(
            /\.messages-page__shell\s*\{[^}]*border-radius:\s*0/s
        );
        expect(css).toMatch(
            /\.messages-page__shell\s*\{[^}]*border-top:\s*none/s
        );
        expect(css).toMatch(
            /\.messages-page__shell\s*\{[^}]*border-bottom:\s*none/s
        );
        expect(css).not.toMatch(
            /\.messages-page \.conversation_list[\s\S]*border-radius:\s*0\.75rem/
        );
        expect(css).not.toMatch(
            /\.messages-page \.conversation-container\s*\{[^}]*border:/s
        );
    });

    it('keeps chat header and messages on the same white panel background', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.conversation-messages\s*\{[^}]*background:\s*#fff/s
        );
        expect(css).toMatch(
            /\.conversation_user_header\s*\{[^}]*background:\s*#fff/s
        );
    });

    it('styles send as primary action with square corners', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.message-composer-send[\s\S]*background:\s*var\(--ds-action\)/
        );
        expect(css).toMatch(
            /\.message-composer-send[\s\S]*border-radius:\s*0\.5rem/
        );
        expect(css).not.toMatch(
            /\.message-composer-send[\s\S]*border-radius:\s*50%/
        );
    });

    it('keeps the message composer square and pinned to the bottom of the chat column', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.message-composer\s*\{[^}]*border-radius:\s*0/s
        );
        expect(css).toContain(
            '.messages-page .conversation_chat .message-composer'
        );
        expect(css).toMatch(
            /\.conversation_chat \.message-composer[\s\S]*flex:\s*0 0 auto/
        );
    });

    it('removes top chrome gap, right-pane top border, and composer separator', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.conversation-component\.container\s*\{[^}]*padding-top:\s*0/s
        );
        expect(css).toMatch(
            /\.messages-page__shell\s*>\s*\[class\*='col-'\]\s*\{[^}]*padding-left:\s*0/s
        );
        expect(css).toMatch(
            /\.conversation_user_header[\s\S]*border-top:\s*none/
        );
        expect(css).toMatch(
            /\.message-composer[\s\S]*border-top:\s*none/
        );
    });

    it('overlays the send button on the markdown editor without a bordered chrome wrap', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.message-composer-editor-wrap\s*\{[^}]*position:\s*relative/s
        );
        expect(css).toMatch(
            /\.message-composer-editor-wrap\s*\{[^}]*border:\s*none/s
        );
        expect(css).toMatch(
            /\.message-composer-send[\s\S]*position:\s*absolute/
        );
        expect(css).toMatch(
            /\.message-composer-send[\s\S]*bottom:/
        );
        expect(css).toMatch(
            /\.message-composer-send[\s\S]*right:/
        );
        expect(css).toMatch(
            /\.message-composer-send[\s\S]*z-index:\s*50/
        );
    });

    it('uses larger body text in the message composer markdown editor', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.message-composer-editor \.toastui-editor-contents\s*\{[^}]*font-size:\s*16px/s
        );
    });
});
