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

describe('ConversationList.vue desktop chat height', () => {
    it('sizes the chat column from measured header offset so top banners do not clip the composer', () => {
        expect(viewSource).not.toMatch(
            /\.without-footer\.conversation-component\.container\s*\{[^}]*height:\s*calc\(100vh - 5\.6rem\)/s
        );
    });
});

describe('ConversationList.vue mobile chat ratings header', () => {
    it('keeps the tall-header class when ratings are shown (offset measured from header)', () => {
        expect(viewSource).toContain(
            'conversation-list-page--mobile-chat--tall-header'
        );
        expect(viewSource).toContain('headerRatings');
    });
});

describe('ConversationList.vue mobile chat layout', () => {
    it('sizes mobile chat from measured header offset so the verification banner does not force page scroll', () => {
        const mobileStyles = getMobileStylesBlock();
        expect(mobileStyles).not.toMatch(
            /\.conversation-list-page--mobile-chat\s*\{[^}]*height:\s*calc\(100dvh\s*-\s*52px/s
        );
        expect(mobileStyles).not.toMatch(
            /\.conversation-list-page--mobile-chat--tall-header\s*\{[^}]*64px/s
        );
    });
});

describe('ConversationList.vue messages redesign', () => {
    it('shows Mensajes title and FilterChips for Todos Grupales Individuales', () => {
        expect(viewSource).toContain('FilterChips');
        expect(viewSource).toContain('messagesFilter');
        expect(viewSource).toContain('filteredConversations');
        expect(viewSource).toContain("$t('mensajes')");
        expect(viewSource).toContain("$t('filtroMensajesTodos')");
        expect(viewSource).toContain("$t('filtroMensajesGrupales')");
        expect(viewSource).toContain("$t('filtroMensajesIndividuales')");
        expect(viewSource).toContain('filterConversationsByKind');
        expect(viewSource).toContain('messages-page');
    });

    it('marks group rows and unread with redesign hooks', () => {
        expect(viewSource).toContain('conversation_header--group');
        expect(viewSource).toContain('conversation_header__unread-dot');
        expect(viewSource).toContain('isTripGroupConversation');
    });

    it('shows the round marker on the right for the selected conversation', () => {
        expect(viewSource).toContain('conversation_header__unread-dot');
        expect(viewSource).toContain('isSelectedConversation');
        expect(viewSource).toMatch(
            /conversation\.unread\s*\|\|\s*isSelectedConversation\s*\(\s*conversation\s*\)/
        );
    });

    it('vertically centers the unread marker in the row meta', () => {
        const cssPath = path.resolve(
            __dirname,
            '../../styles/components/messages-page.css'
        );
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toContain('conversation_header__unread-dot');
        expect(css).toMatch(
            /\.conversation_header__unread-dot\s*\{[^}]*top:\s*50%/s
        );
        expect(css).toMatch(
            /\.conversation_header__unread-dot\s*\{[^}]*transform:\s*translateY\(-50%\)/s
        );
    });

    it('wraps list and chat in a messages-page__shell', () => {
        expect(viewSource).toContain('messages-page__shell');
    });
});
