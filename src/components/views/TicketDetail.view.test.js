import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TicketDetail.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TicketDetail user view', () => {
    it('shows ticket detail page title', () => {
        expect(viewSource).toContain('{{ $t(\'ticketDeSoporte\') }}');
    });

    it('shows link to return to support tickets list', () => {
        expect(viewSource).toContain("{{ $t('volverListaTicketsSoporte') }}");
        expect(viewSource).toContain("name: 'tickets'");
    });

    it('shows translated, color-coded status near the ticket title', () => {
        expect(viewSource).toContain('panel-heading');
        expect(viewSource).toContain('statusClass(');
        expect(viewSource).toContain('statusLabel(');
    });

    it('hides priority metadata from user ticket detail', () => {
        expect(viewSource).not.toContain("{{ $t('prioridad') }}");
        expect(viewSource).not.toContain('priorityLabel(');
        expect(viewSource).not.toContain('priorityClass(');
    });

    it('does not show unread counter helper text', () => {
        expect(viewSource).not.toContain("{{ $t('sinLeer') }}");
    });

    it('shows user name instead of generic user label for non-admin replies', () => {
        expect(viewSource).toContain('replyAuthorLabel(reply)');
    });

    it('registers Toast UI editor so the reply composer mounts', () => {
        expect(viewSource).toContain('components:');
        expect(viewSource).toContain('editor: ToastUiEditor');
    });

    it('labels admin replies as Carpoolear team', () => {
        expect(viewSource).toContain("this.$t('equipoCarpoolear')");
    });

    it('does not expose which admin replied on the user-facing ticket detail', () => {
        expect(viewSource).not.toContain('equipoCarpoolearAutorAdmin');
        expect(viewSource).not.toContain('adminReplyAuthorLabel');
    });

    it('shows translated image attachment title', () => {
        expect(viewSource).toContain("{{ $t('adjuntarImagenes') }}");
    });

    it('shows title above the reply composer', () => {
        expect(viewSource).toContain("{{ $t('responderAlTicketDeSoporte') }}");
        expect(viewSource).toContain('reply-to-ticket-title');
    });

    it('shows relative message date with tooltip containing full timestamp', () => {
        expect(viewSource).toContain('relativeDate(reply.created_at)');
        expect(viewSource).toContain(':title="fullDate(reply.created_at)"');
    });

    it('keeps sender and timestamp in the same row with date aligned right', () => {
        expect(viewSource).toContain('reply-meta-row');
        expect(viewSource).toContain('reply-meta-date');
    });

    it('disables reply submit while sending and shows Enviando label', () => {
        expect(viewSource).toContain('replySubmitting');
        expect(viewSource).toContain(':disabled="replySubmitting"');
        expect(viewSource).toContain("$t('enviando')");
        expect(viewSource).toContain("$t('responder')");
    });

    it('blocks duplicate reply bodies against existing thread messages', () => {
        expect(viewSource).toContain('supportTicketReplyDuplicate');
        expect(viewSource).toContain('ticketRespuestaDuplicada');
        expect(viewSource).toContain('isDuplicateReplyApiError');
    });

    it('re-creates editor and clears attachments after sending a reply via key increment', () => {
        expect(viewSource).toContain(':key="replyEditorKey"');
        expect(viewSource).toContain('replyEditorKey: 0');
        expect(viewSource).toContain('this.replyEditorKey += 1');
        expect(viewSource).toContain('this.attachments = []');
        expect(viewSource).toContain('attachmentInput');
    });

    it('shows success and error snackbars when the user closes a ticket', () => {
        expect(viewSource).toContain('ticketCerrado');
        expect(viewSource).toContain('errorCerrandoTicket');
        expect(viewSource).toContain("dialogs.message(this.$t('ticketCerrado')");
        expect(viewSource).toContain("dialogs.message(this.$t('errorCerrandoTicket')");
    });
});
