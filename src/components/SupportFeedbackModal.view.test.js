import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'SupportFeedbackModal.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('SupportFeedbackModal view', () => {
    it('uses the shared modal with ticket form fields', () => {
        expect(source).toContain('<modal');
        expect(source).toContain("$t('feedbackTabTitulo')");
        expect(source).toContain("$t('feedbackTabSubtitulo')");
        expect(source).toContain("$t('categoriaTicket')");
        expect(source).toContain("$t('feedbackTabAsunto')");
        expect(source).toContain("$t('feedbackTabAsuntoPlaceholder')");
        expect(source).toContain("$t('feedbackTabEnviar')");
        expect(source).not.toContain("$t('asuntoTicket')");
        expect(source).not.toContain("$t('asuntoTicketPlaceholder')");
        expect(source).not.toContain("$t('crearTicket')");
        expect(source).toContain("$t('mensajeTicket')");
        expect(source).toContain("$t('adjuntosTicket')");
        expect(source).toContain('AppTextarea');
        expect(source).not.toContain('ToastUiEditor');
        expect(source).not.toContain('initial-edit-type="wysiwyg"');
    });

    it('defaults to the feedback category and user ticket types', () => {
        expect(source).toContain('DEFAULT_FEEDBACK_TAB_TICKET_TYPE');
        expect(source).toContain('USER_TICKET_TYPE_OPTIONS');
        expect(source).toContain('USER_TICKET_TYPE_VALUES');
        expect(source).toContain('isSupportFeedbackFormValid');
    });

    it('creates a ticket from the tab with support info and feedback_tab source', () => {
        expect(source).toContain("from '../stores/tickets'");
        expect(source).toContain('createTicket');
        expect(source).toContain('TICKET_SOURCE_FEEDBACK_TAB');
        expect(source).toContain('appendSupportInfoToMessage');
        expect(source).toContain('fetchSupportInfoSnapshot');
        expect(source).toContain('handleGenericApiError');
        expect(source).toMatch(/source:\s*TICKET_SOURCE_FEEDBACK_TAB/);
    });

    it('limits image attachments to three files', () => {
        expect(source).toContain('applyImageUploadSelection');
        expect(source).toContain('compressImageFilesForUpload');
        expect(source).toContain("$t('maximo3Imagenes')");
    });

    it('shows success copy and a link to the created ticket', () => {
        expect(source).toContain("$t('feedbackTabExito')");
        expect(source).toContain("$t('verTicket')");
        expect(source).toContain("name: 'ticket-detail'");
    });
});
