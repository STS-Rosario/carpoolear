import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminDashboard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminDashboard view', () => {
    it('loads dashboard data via AdminApi.getDashboard', () => {
        expect(viewSource).toContain('AdminApi');
        expect(viewSource).toContain('getDashboard');
    });

    it('renders cards for pending manual verifications and support tickets', () => {
        expect(viewSource).toContain('adminDashboardManualVerifications');
        expect(viewSource).toContain('adminDashboardSupportTickets');
    });

    it('links manual verification rows to review and list pages', () => {
        expect(viewSource).toContain("name: 'admin-manual-identity-validation-review'");
        expect(viewSource).toContain("name: 'admin-manual-identity-validations'");
        expect(viewSource).toContain('adminDashboardVerMas');
    });

    it('links support ticket rows to detail and filtered list pages', () => {
        expect(viewSource).toContain("name: 'admin-support-ticket-detail'");
        expect(viewSource).toContain("name: 'admin-support-tickets'");
        expect(viewSource).toContain('needs_reply');
    });
});
