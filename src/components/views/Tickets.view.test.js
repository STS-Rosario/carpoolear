import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Tickets.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Tickets list view', () => {
    it('shows soporte page title', () => {
        expect(viewSource).toContain("{{ $t('soporte') }}");
    });

    it('shows empty-state message when user has no support tickets', () => {
        expect(viewSource).toContain("$t('noHayTicketsUsuarioMesaAyuda')");
    });

    it('includes create support ticket button linking to new ticket page', () => {
        expect(viewSource).toContain("$t('crearNuevoTicketMesaAyuda')");
        expect(viewSource).toContain("name: 'ticket-new'");
    });

    it('orders thead subject first then priority then dates and status with category last', () => {
        const sub = viewSource.indexOf("$t('asuntoTicket')");
        const pri = viewSource.indexOf("$t('prioridad')");
        const cre = viewSource.indexOf("$t('creado')");
        const upd = viewSource.indexOf("$t('actualizado')");
        const est = viewSource.indexOf("$t('estado')");
        const cat = viewSource.indexOf("$t('categoriaTicket')");
        expect(sub).toBeGreaterThan(-1);
        expect(sub).toBeLessThan(pri);
        expect(pri).toBeLessThan(cre);
        expect(cre).toBeLessThan(upd);
        expect(upd).toBeLessThan(est);
        expect(est).toBeLessThan(cat);
    });

    it('shows subject link before priority and category cell last in row', () => {
        const subjectCell = viewSource.indexOf('#{{ ticket.id }}');
        const priCell = viewSource.indexOf('priorityLabel(ticket.priority)');
        const catCell = viewSource.indexOf('ticketCategoryLabel(ticket.type)');
        expect(subjectCell).toBeGreaterThan(-1);
        expect(subjectCell).toBeLessThan(priCell);
        expect(priCell).toBeLessThan(catCell);
    });

    it('uses compact narrow columns and a wide subject column class', () => {
        expect(viewSource).toContain('support-tickets-table--compact');
        expect(viewSource).toContain('support-tickets-table__subject');
        expect(viewSource).toContain('support-tickets-table__narrow');
    });

    it('renders tickets in table rows with title, created date, updated date and status', () => {
        expect(viewSource).toContain('<table');
        expect(viewSource).toContain('<tbody');
        expect(viewSource).toContain('<tr v-for="ticket in safeTickets"');
        expect(viewSource).toContain('ticket.subject');
        expect(viewSource).toContain('ticket.created_at');
        expect(viewSource).toContain('ticket.updated_at');
        expect(viewSource).toContain('ticket.status');
    });

    it('color-codes ticket status values', () => {
        expect(viewSource).toContain(':class="statusClass(ticket.status)"');
        expect(viewSource).toContain('statusClass(status)');
        expect(viewSource).toContain('statusLabel(status)');
    });

    it('shows relative created/updated dates with full timestamp tooltip', () => {
        expect(viewSource).toContain('relativeDate(ticket.created_at)');
        expect(viewSource).toContain('relativeDate(ticket.updated_at)');
        expect(viewSource).toContain(':title="fullDate(ticket.created_at)"');
        expect(viewSource).toContain(':title="fullDate(ticket.updated_at)"');
    });

    it('does not render ticket creation form fields in list view', () => {
        expect(viewSource).not.toContain('v-model="form.subject"');
        expect(viewSource).not.toContain('v-model="form.type"');
        expect(viewSource).not.toContain('ref="createEditor"');
    });
});
