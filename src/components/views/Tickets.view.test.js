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
        expect(viewSource).toContain('No tenés tickets de soporte');
    });

    it('includes create support ticket button linking to new ticket page', () => {
        expect(viewSource).toContain('Crear nuevo ticket de soporte');
        expect(viewSource).toContain("name: 'ticket-new'");
    });

    it('renders ticket rows with title, created date, updated date and status', () => {
        expect(viewSource).toContain('ticket.subject');
        expect(viewSource).toContain('ticket.created_at');
        expect(viewSource).toContain('ticket.updated_at');
        expect(viewSource).toContain('ticket.status');
    });

    it('color-codes ticket status values', () => {
        expect(viewSource).toContain(':class="statusClass(ticket.status)"');
        expect(viewSource).toContain('statusClass(status)');
    });

    it('does not render ticket creation form fields in list view', () => {
        expect(viewSource).not.toContain("v-model=\"form.subject\"");
        expect(viewSource).not.toContain("v-model=\"form.type\"");
        expect(viewSource).not.toContain('ref="createEditor"');
    });
});
