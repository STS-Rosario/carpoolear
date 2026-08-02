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

    it('renders trip block via initial value and prepares cursor on load', () => {
        expect(source).toContain('prefillMessage');
        expect(source).toContain('editorInitialValue');
        expect(source).toContain('buildPrefilledTicketEditorMarkdown');
        expect(source).toMatch(/:initial-value="editorInitialValue"/);
        expect(source).toContain(':key="createEditorKey"');
        expect(source).toContain('mountCreateEditor');
        expect(source).toContain('@load="onCreateEditorLoad"');
        expect(source).toContain('focusPrefilledTicketEditorAtStart');
    });
});

describe('TicketNew page card', () => {
    it('uses account settings layout without a layout page title so the in-card heading is used', () => {
        expect(source).toContain('AccountSettingsLayout');
        expect(source).not.toContain('page-title-key="soporte"');
    });

    it('wraps content in a white card with Mesa de ayuda as page title', () => {
        expect(source).toContain('ticket-new-page__card');
        expect(source).toContain('ticket-new-page__heading');
        expect(source).toMatch(
            /ticket-new-page__card[\s\S]*ticket-new-page__heading[\s\S]*\$t\('soporte'\)/
        );
        expect(source).toMatch(
            /\.ticket-new-page__card\s*\{[^}]*background:\s*(?:#fff|var\(--profile-card-bg)/s
        );
        expect(source).toMatch(
            /\.ticket-new-page__card\s*\{[^}]*border-radius:\s*0\.75rem/s
        );
        expect(source).not.toContain('panel panel-default');
        expect(source).not.toContain('panel-heading');
    });

    it('uses AppField, AppInput and primary AppButton for the create form', () => {
        expect(source).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(source).toContain("import AppField from '../ui/AppField.vue'");
        expect(source).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(source).toMatch(
            /<AppInput[\s\S]*?v-model="form\.subject"[\s\S]*?asuntoTicket/
        );
        expect(source).toMatch(
            /<AppField[\s\S]*?categoriaTicket[\s\S]*?<select[\s\S]*?v-model="form\.type"/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?createTicket[\s\S]*?crearTicket[\s\S]*?<\/AppButton>/
        );
        expect(source).not.toContain('btn btn-primary');
        expect(source).not.toContain('form-control');
        expect(source).not.toContain('control-label');
    });
});
