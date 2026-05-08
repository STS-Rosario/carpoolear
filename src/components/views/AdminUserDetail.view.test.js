import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserDetail.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminUserDetail view', () => {
    it('includes a support ticket button prefilled with user detail context', () => {
        expect(source).toContain("name: 'admin-support-ticket-new'");
        expect(source).toContain('query: {');
        expect(source).toContain('userId: user.id');
        expect(source).toContain('userName: user.name');
        expect(source).toContain("type: 'account_verification'");
        expect(source).toContain("subject: $t('ticketTypeAccountVerification')");
        expect(source).toContain("$t('crearTicketSoporte')");
    });
});
