import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserDetail.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminUserDetail view', () => {
    it('includes a support ticket button prefilled with user detail context', () => {
        expect(source).toContain("name: 'admin-support-ticket-new'");
        expect(source).toContain(':to="supportTicketRoute(user)"');
        expect(source).toContain('supportTicketRoute(user)');
        expect(source).toContain('query: {');
        expect(source).toContain('userId: user.id');
        expect(source).toContain('userName: user.name');
        expect(source).toContain("type: 'account_verification'");
        expect(source).toContain("subject: this.$t('ticketTypeAccountVerification')");
        expect(source).toContain("$t('crearTicketSoporte')");
    });

    it('links to the user public profile with verPerfilPublico translation', () => {
        expect(source).toContain("$t('verPerfilPublico')");
        expect(source).toContain("name: 'profile'");
        expect(source).toContain('params: { id: user.id }');
    });

    it('links to admin user trips ratings and recommendations pages', () => {
        expect(source).toContain("name: 'admin-users-trips'");
        expect(source).toContain("name: 'admin-users-ratings'");
        expect(source).toContain("name: 'admin-users-recommendations'");
        expect(source).toContain("$t('adminUsuariosVerViajes')");
        expect(source).toContain("$t('adminUsuariosVerCalificaciones')");
        expect(source).toContain("$t('adminUsuariosVerReferencias')");
    });
});
