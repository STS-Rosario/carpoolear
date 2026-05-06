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
});
