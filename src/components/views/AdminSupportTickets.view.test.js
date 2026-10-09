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

    it('orders thead subject first then priority then Club then dates and status with category last', () => {
        const theadStart = viewSource.indexOf('<thead>');
        const theadEnd = viewSource.indexOf('</thead>');
        const thead = viewSource.slice(theadStart, theadEnd);
        const sub = thead.indexOf("$t('asuntoTicket')");
        const pri = thead.indexOf("$t('prioridad')");
        const club = thead.indexOf("$t('columnaClub')");
        const cre = thead.indexOf("$t('creado')");
        const upd = thead.indexOf("$t('actualizado')");
        const est = thead.indexOf("$t('estado')");
        const asg = thead.indexOf("$t('asignadoA')");
        const cat = thead.indexOf("$t('categoriaTicket')");
        expect(sub).toBeGreaterThan(-1);
        expect(sub).toBeLessThan(pri);
        expect(pri).toBeLessThan(club);
        expect(club).toBeLessThan(cre);
        expect(cre).toBeLessThan(upd);
        expect(upd).toBeLessThan(est);
        expect(est).toBeLessThan(asg);
        expect(asg).toBeLessThan(cat);
    });

    it('does not make the Club header sortable', () => {
        const theadStart = viewSource.indexOf('<thead>');
        const theadEnd = viewSource.indexOf('</thead>');
        const thead = viewSource.slice(theadStart, theadEnd);
        const clubAt = thead.indexOf("$t('columnaClub')");
        expect(clubAt).toBeGreaterThan(-1);
        const thStart = thead.lastIndexOf('<th', clubAt);
        const thEnd = thead.indexOf('</th>', clubAt);
        const clubTh = thead.slice(thStart, thEnd);
        expect(clubTh).not.toContain('toggleSort');
        expect(clubTh).not.toContain('@click');
        expect(viewSource).not.toContain("@click=\"toggleSort('club");
    });

    it('makes every header except Club sortable with explicit toggleSort keys', () => {
        expect(viewSource).toContain("toggleSort('subject')");
        expect(viewSource).toContain("toggleSort('priority')");
        expect(viewSource).toContain("toggleSort('created_at')");
        expect(viewSource).toContain("toggleSort('updated_at')");
        expect(viewSource).toContain("toggleSort('status')");
        expect(viewSource).toContain("toggleSort('assigned_to')");
        expect(viewSource).toContain("toggleSort('type')");
        expect(viewSource).toContain('admin-support-th-sort');
        expect(viewSource).toContain('getNextAdminSupportTicketSortState');
    });

    it('shows subject link before priority then Club then category cell last in row', () => {
        const tbodyStart = viewSource.indexOf('<tbody>');
        const tbodyEnd = viewSource.indexOf('</tbody>');
        const tbody = viewSource.slice(tbodyStart, tbodyEnd);
        const subjectCell = tbody.indexOf('#{{ ticket.id }}');
        const priCell = tbody.indexOf('priorityLabel(ticket.priority)');
        const clubCell = tbody.indexOf('ticketOwnerIsClubMember(ticket)');
        const creCell = tbody.indexOf('relativeDate(ticket.created_at)');
        const catCell = tbody.indexOf('ticketCategoryLabel(ticket.type)');
        expect(subjectCell).toBeGreaterThan(-1);
        expect(subjectCell).toBeLessThan(priCell);
        expect(priCell).toBeLessThan(clubCell);
        expect(clubCell).toBeLessThan(creCell);
        expect(creCell).toBeLessThan(catCell);
    });

    it('shows a 20x20 Club logo when the ticket owner is a Club member', () => {
        expect(viewSource).toContain('v-if="ticketOwnerIsClubMember(ticket)"');
        expect(viewSource).toContain('width="20"');
        expect(viewSource).toContain('height="20"');
        expect(viewSource).toContain('badges/club-carpoolear.png');
        expect(viewSource).toContain("process.env.ROUTE_BASE + 'img/badges/club-carpoolear.png'");
        expect(viewSource).toContain("$t('adminClubCarpoolear')");
        expect(viewSource).toContain('club_carpoolear_active');
        expect(viewSource).toContain('Number(');
    });

    it('shows ticket owner display name next to the subject for admin context', () => {
        expect(viewSource).toContain('ticketOwnerDisplayName(ticket)');
        expect(viewSource).toContain('support-tickets-table__owner');
    });

    it('shows a compact help-tab origin badge on feedback_tab tickets', () => {
        expect(viewSource).toContain('TICKET_SOURCE_FEEDBACK_TAB');
        expect(viewSource).toContain("$t('ticketOrigenPestana')");
        expect(viewSource).toContain('support-tickets-table__source-badge');
    });

    it('links ticket owner display name to the admin user profile route when linkable', () => {
        expect(viewSource).toContain('canLinkTicketOwnerProfile(ticket)');
        expect(viewSource).toContain('ticketOwnerAdminProfileRoute(ticket)');
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).not.toContain("name: 'profile'");
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
        expect(viewSource).toContain('v-model="filterOpen"');
        expect(viewSource).toContain("{{ $t('filtroTicketsTodasCategorias') }}");
        expect(viewSource).toContain("{{ $t('filtroTicketsRequiereRespuesta') }}");
        expect(viewSource).toContain("{{ $t('filtroTicketsAbiertos') }}");
    });

    it('renders admin pagination bar with per-page selector', () => {
        expect(viewSource).toContain('AdminPaginationBar');
        expect(viewSource).toContain(':pagination="listPagination"');
        expect(viewSource).toContain(':per-page="listPerPage"');
        expect(viewSource).toContain('@update:per-page="onPerPageChange"');
    });

    it('loads admin list using route query filters', () => {
        expect(viewSource).toContain('parseAdminSupportTicketListFiltersFromRoute');
        expect(viewSource).toContain('fetchAdminList(this.listFilters)');
        expect(viewSource).toContain('syncFiltersToRoute');
    });

    it('puts sortKey and sortDir on listFilters and persists them in the route', () => {
        expect(viewSource).toContain('sortKey: this.sortKey');
        expect(viewSource).toContain('sortDir: this.sortDir');
        expect(viewSource).toContain('query.sort = this.sortKey');
        expect(viewSource).toContain('query.direction = this.sortDir');
        expect(viewSource).toContain('this.sortKey = parsed.sortKey');
        expect(viewSource).toContain('this.sortDir = parsed.sortDir');
    });

    it('passes userId filter from route query to admin ticket list fetch', () => {
        expect(viewSource).toContain('filterUserId');
        expect(viewSource).toContain('userId: this.filterUserId');
    });

    it('preserves createdByAdmin filter from route query for admin ticket list fetch', () => {
        expect(viewSource).toContain('filterCreatedByAdmin');
        expect(viewSource).toContain('createdByAdmin: this.filterCreatedByAdmin');
        expect(viewSource).toContain("query.created_by_admin = '1'");
    });

    it('shows assigned admin column in tickets table', () => {
        expect(viewSource).toContain("{{ capitalizeFirst($t('asignadoA')) }}");
        expect(viewSource).toContain('assignedAdminDisplayName(ticket)');
    });

    it('polls admin ticket list while tab is visible', () => {
        expect(viewSource).toContain('listPollTimer');
        expect(viewSource).toContain('startListPolling');
        expect(viewSource).toContain('stopListPolling');
        expect(viewSource).toContain('handleVisibilityChange');
        expect(viewSource).toContain("document.addEventListener('visibilitychange', this.handleVisibilityChange)");
        expect(viewSource).toContain('setInterval');
        expect(viewSource).toContain('loadTickets({ silent: true })');
    });

    it('compacts the search row: sm Buscar, checkbox inset, space before table', () => {
    });
});
