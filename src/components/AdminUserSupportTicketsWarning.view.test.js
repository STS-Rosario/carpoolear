import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, '../components/AdminUserSupportTicketsWarning.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AdminUserSupportTicketsWarning component', () => {
    it('shows warning with ticket count and link to filtered admin tickets list', () => {
        expect(source).toContain('shouldShowAdminUserSupportTicketsWarning');
        expect(source).toContain('adminUserSupportTicketsRoute');
        expect(source).toContain('adminUsuarioTieneTicketsSoporte');
        expect(source).toContain('adminUsuarioVerTicketsSoporte');
        expect(source).toContain('alert alert-warning');
        expect(source).toContain(':to="supportTicketsRoute"');
    });

    it('requires userId and supportTicketsCount props', () => {
        expect(source).toContain('userId');
        expect(source).toContain('supportTicketsCount');
    });
});
