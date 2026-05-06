import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Tickets.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Tickets list view', () => {
    it('includes create support ticket button linking to new ticket page', () => {
        expect(viewSource).toContain('Crear nuevo ticket de soporte');
        expect(viewSource).toContain("name: 'ticket-new'");
    });

    it('does not render ticket creation form fields in list view', () => {
        expect(viewSource).not.toContain("v-model=\"form.subject\"");
        expect(viewSource).not.toContain("v-model=\"form.type\"");
        expect(viewSource).not.toContain('ref="createEditor"');
    });
});
