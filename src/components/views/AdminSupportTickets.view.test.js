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
});
