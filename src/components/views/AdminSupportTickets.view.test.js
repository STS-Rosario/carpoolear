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

    it('orders thead subject first then priority then dates and status with category last', () => {
        const theadStart = viewSource.indexOf('<thead>');
        const theadEnd = viewSource.indexOf('</thead>');
        const thead = viewSource.slice(theadStart, theadEnd);
        const sub = thead.indexOf("$t('asuntoTicket')");
        const pri = thead.indexOf("$t('prioridad')");
        const cre = thead.indexOf("$t('creado')");
        const upd = thead.indexOf("$t('actualizado')");
        const est = thead.indexOf("$t('estado')");
        const cat = thead.indexOf("$t('categoriaTicket')");
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

    it('shows ticket owner display name next to the subject for admin context', () => {
        expect(viewSource).toContain('ticketOwnerDisplayName(ticket)');
        expect(viewSource).toContain('support-tickets-table__owner');
    });

    it('links ticket owner display name to the public profile route when linkable', () => {
        expect(viewSource).toContain('canLinkTicketOwnerProfile(ticket)');
        expect(viewSource).toContain('ticketOwnerAppProfileRoute(ticket)');
        expect(viewSource).toContain("name: 'profile'");
    });

    it('uses compact narrow columns and a wide subject column class', () => {
        expect(viewSource).toContain('support-tickets-table--compact');
        expect(viewSource).toContain('support-tickets-table__subject');
        expect(viewSource).toContain('support-tickets-table__narrow');
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
        expect(viewSource).toContain('hasUnreadUserReplyIndicator');
        expect(viewSource).toContain('glyphicon glyphicon-comment');
    });

    it('links to reply templates editor next to create ticket', () => {
        expect(viewSource).toContain("{{ $t('editarPlantillasRespuestas') }}");
        expect(viewSource).toContain("name: 'admin-support-reply-templates'");
    });

    it('highlights stale updated timestamps that need admin attention', () => {
        expect(viewSource).toContain(':class="updatedAgeAttentionClass(ticket)"');
        expect(viewSource).toContain('getUpdatedAgeAttentionClass');
    });

    it('renders category, priority and needs-reply filters', () => {
        expect(viewSource).toContain('support-tickets-admin-filters');
        expect(viewSource).toContain('v-model="filterType"');
        expect(viewSource).toContain('v-model="filterPriority"');
        expect(viewSource).toContain('v-model="filterNeedsReply"');
        expect(viewSource).toContain("{{ $t('filtroTicketsTodasCategorias') }}");
        expect(viewSource).toContain("{{ $t('filtroTicketsRequiereRespuesta') }}");
    });

    it('loads admin list using route query filters', () => {
        expect(viewSource).toContain('parseAdminSupportTicketListFiltersFromRoute');
        expect(viewSource).toContain('fetchAdminList(this.listFilters)');
        expect(viewSource).toContain('syncFiltersToRoute');
    });
});
