import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportTicketDetail.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportTicketDetail view', () => {
    it('shows a back link to admin tickets list', () => {
        expect(viewSource).toContain("{{ $t('volverListaTickets') }}");
        expect(viewSource).toContain("name: 'admin-support-tickets'");
    });

    it('shows translated, color-coded status and priority', () => {
        expect(viewSource).toContain('statusLabel(ticket.status)');
        expect(viewSource).toContain('priorityLabel(ticket.priority)');
        expect(viewSource).toContain(':class="statusClass(ticket.status)"');
        expect(viewSource).toContain(':class="priorityClass(ticket.priority)"');
        expect(viewSource).toContain('ticket-status-label');
        expect(viewSource).toContain('ticket-priority-label');
    });

    it('shows user name with app profile link and admin profile link label', () => {
        expect(viewSource).toContain('replyAuthorLabel(reply)');
        expect(viewSource).toContain("name: 'profile'");
        expect(viewSource).toContain("name: 'admin-users-user'");
        expect(viewSource).toContain("{{ $t('verPerfilEnAdmin') }}");
    });

    it('shows reply metadata row with relative date and full date tooltip', () => {
        expect(viewSource).toContain('reply-meta-row');
        expect(viewSource).toContain('reply-meta-date');
        expect(viewSource).toContain('relativeDate(reply.created_at)');
        expect(viewSource).toContain(':title="fullDate(reply.created_at)"');
    });

    it('shows admin reply title and spacing classes around editor and actions', () => {
        expect(viewSource).toContain("{{ $t('respuestaCarpoolear') }}");
        expect(viewSource).toContain('admin-reply-box');
        expect(viewSource).toContain('reply-actions');
        expect(viewSource).toContain('reply-action-btn');
        expect(viewSource).toContain('respuestaEnviada');
        expect(viewSource).toContain('.then(() => this.refresh())');
    });

    it('interpolates ticket user variables before sending admin reply', () => {
        expect(viewSource).toContain('interpolateSupportTemplateVariables');
        expect(viewSource).toContain('adminReply(this.id');
    });

    it('can append interpolated template markdown into the reply editor', () => {
        expect(viewSource).toContain('appendInterpolatedTemplateToReply');
        expect(viewSource).toContain("invoke('getMarkdown')");
        expect(viewSource).toContain('replyEditorInitialValue = current + sep + chunk');
        expect(viewSource).toContain('replyEditorKey += 1');
        expect(viewSource).toContain(':key="replyEditorKey"');
        expect(viewSource).toContain(':initial-value="replyEditorInitialValue"');
    });

    it('offers reply template modal with search and pick handler', () => {
        expect(viewSource).toContain("{{ $t('responderConPlantilla') }}");
        expect(viewSource).toContain("{{ $t('plantillasModalTitulo') }}");
        expect(viewSource).toContain(":placeholder=\"$t('buscarPlantillasPlaceholder')\"");
        expect(viewSource).toContain('filteredReplyTemplates');
        expect(viewSource).toContain('pickReplyTemplate');
        expect(viewSource).toContain('openReplyTemplateModal');
    });

    it('lets admins click template name to append body', () => {
        expect(viewSource).toContain('reply-template-modal-pick');
        expect(viewSource).toContain('@click="pickReplyTemplate(t)"');
    });
});
