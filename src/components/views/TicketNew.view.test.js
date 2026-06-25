import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TicketNew.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('TicketNew view', () => {
    it('uses shared ticket type options with account recovery default', () => {
        expect(source).toContain("from '../../utils/supportTicketTypeOptions'");
        expect(source).toContain('DEFAULT_USER_TICKET_TYPE');
        expect(source).toContain('USER_TICKET_TYPE_OPTIONS');
        expect(source).toContain('USER_TICKET_TYPE_VALUES');
    });

    it('appends support info to ticket messages', () => {
        expect(source).toContain("from '../../utils/supportInfo'");
        expect(source).toContain('appendSupportInfoToMessage');
        expect(source).toContain('fetchSupportInfoSnapshot');
    });

    it('blocks ticket creation when the user message is empty', () => {
        expect(source).toContain('isEmptyUserTicketMessage');
        expect(source).toMatch(/if\s*\(\s*isEmptyUserTicketMessage\(markdown\)\s*\)/);
        expect(source).toContain("this.$t('errorTicketMensajeRequerido')");
    });

    it('shows a detailed placeholder in the ticket message editor', () => {
        expect(source).toContain('editorOptionsWithPlaceholder');
        expect(source).toContain("this.$t('mensajeTicketPlaceholder')");
    });

    it('prefills ticket message from route query on mount', () => {
        expect(source).toContain('applyPrefillFromQuery');
        expect(source).toContain('this.$route.query.message');
        expect(source).toContain('this.$nextTick');
        expect(source).toContain("invoke('setMarkdown'");
    });
});
