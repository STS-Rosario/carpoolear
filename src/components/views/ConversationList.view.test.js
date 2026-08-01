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

describe('ConversationList.vue mobile chat ratings header', () => {
    it('uses a taller mobile chat column when the header shows participant ratings', () => {
        expect(viewSource).toContain(
            'conversation-list-page--mobile-chat--tall-header'
        );
        expect(viewSource).toContain('headerRatings');
        expect(viewSource).toMatch(
            /conversation-list-page--mobile-chat--tall-header[\s\S]*64px/s
        );
    });
});

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

    it('wraps list and chat in a messages-page__shell', () => {
        expect(viewSource).toContain('messages-page__shell');
    });
});
