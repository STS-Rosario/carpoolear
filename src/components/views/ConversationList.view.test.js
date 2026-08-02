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
        expect(viewSource).toMatch(
            /\.without-footer\.conversation-component\.container\s*\{[^}]*height:\s*calc\(100vh - var\(--app-header-offset,\s*5\.6rem\)\)/s
        );
        expect(viewSource).toMatch(
            /\.conversation-component\.container\s*\{[^}]*height:\s*calc\(100vh - var\(--app-header-offset,\s*5\.6rem\)\s*-\s*3\.75rem\)/s
        );
        expect(viewSource).not.toMatch(
            /\.without-footer\.conversation-component\.container\s*\{[^}]*height:\s*calc\(100vh - 5\.6rem\)/s
        );
    });
});

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

    it('vertically centers the unread marker in the row meta', () => {
        const cssPath = path.resolve(
            __dirname,
            '../../styles/components/messages-page.css'
        );
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.conversation_header__unread-dot\s*\{[^}]*top:\s*50%/s
        );
        expect(css).toMatch(
            /\.conversation_header__unread-dot\s*\{[^}]*transform:\s*translateY\(-50%\)/s
        );
        expect(css).toMatch(
            /\.messages-page__row-meta\s*\{[^}]*position:\s*relative/s
        );
    });

    it('wraps list and chat in a messages-page__shell', () => {
        expect(viewSource).toContain('messages-page__shell');
    });

    it('uses primary AppButton for load more conversations', () => {
        expect(viewSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?block[\s\S]*?nextPage[\s\S]*?masResultados/
        );
        expect(viewSource).not.toContain('btn btn-primary btn-block');
    });

    it('uses AppInput for conversation search', () => {
        expect(viewSource).toContain(
            "import AppInput from '../ui/AppInput.vue'"
        );
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="textSearch"[\s\S]*?escribeUnNombreYPresionaBuscar/
        );
        expect(viewSource).toContain('debouncedSearch');
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?@click="onSearchUser"/
        );
        expect(viewSource).not.toMatch(
            /messages-page__search[\s\S]*?class="form-control"/
        );
    });
});
