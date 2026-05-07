import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportTickets.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportTickets view', () => {
    it('renders tickets in a table with priority column', () => {
        expect(viewSource).toContain('<table');
        expect(viewSource).toContain('<tbody');
        expect(viewSource).toContain('<tr v-for="ticket in safeTickets"');
        expect(viewSource).toContain("{{ capitalizeFirst($t('prioridad')) }}");
        expect(viewSource).toContain('priorityLabel(ticket.priority)');
    });

    it('orders thead columns category then priority then subject before dates and status', () => {
        const cat = viewSource.indexOf("$t('categoriaTicket')");
        const pri = viewSource.indexOf("$t('prioridad')");
        const sub = viewSource.indexOf("$t('asuntoTicket')");
        const cre = viewSource.indexOf("$t('creado')");
        const upd = viewSource.indexOf("$t('actualizado')");
        const est = viewSource.indexOf("$t('estado')");
        expect(cat).toBeGreaterThan(-1);
        expect(cat).toBeLessThan(pri);
        expect(pri).toBeLessThan(sub);
        expect(sub).toBeLessThan(cre);
        expect(cre).toBeLessThan(upd);
        expect(upd).toBeLessThan(est);
    });

    it('shows translated ticket category from type before priority and subject cells', () => {
        const catCell = viewSource.indexOf('ticketCategoryLabel(ticket.type)');
        const priCell = viewSource.indexOf('priorityLabel(ticket.priority)');
        const subjectCell = viewSource.indexOf('#{{ ticket.id }}');
        expect(catCell).toBeGreaterThan(-1);
        expect(catCell).toBeLessThan(priCell);
        expect(priCell).toBeLessThan(subjectCell);
    });

    it('shows relative timestamps with full date tooltip', () => {
        expect(viewSource).toContain('relativeDate(ticket.created_at)');
        expect(viewSource).toContain('relativeDate(ticket.updated_at)');
        expect(viewSource).toContain(':title="fullDate(ticket.created_at)"');
        expect(viewSource).toContain(':title="fullDate(ticket.updated_at)"');
    });

    it('translates and color-codes status labels', () => {
        expect(viewSource).toContain('statusLabel(ticket.status)');
        expect(viewSource).toContain(':class="statusClass(ticket.status)"');
    });

    it('shows icon marker when user was last to reply', () => {
        expect(viewSource).toContain('hasUserLastReply(ticket)');
        expect(viewSource).toContain('glyphicon glyphicon-comment');
    });

    it('links to reply templates editor next to create ticket', () => {
        expect(viewSource).toContain("{{ $t('editarPlantillasRespuestas') }}");
        expect(viewSource).toContain("name: 'admin-support-reply-templates'");
    });
});
