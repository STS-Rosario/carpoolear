import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserMigrationNew.vue');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const source = fs.readFileSync(viewPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');
const supportTicketNoticeKey = 'migracionUsuarioAMantenerAvisoTicketSoporte';
const supportTicketNoticeCopy =
    'Si el usuario envió ticket de soporte, la cuenta a mantener debe ser la que envió el ticket';
const supportTicketNoticeEnglishCopy =
    'If the user submitted a support ticket, the account to keep must be the one that submitted the ticket';

describe('AdminUserMigrationNew view', () => {
    it('uses two UserSearchAutocomplete and confirm before createUserMigration', () => {
        expect(source).toContain('UserSearchAutocomplete');
        expect(source).toContain('createUserMigration');
        expect(source).toContain('window.confirm');
        expect(source).toContain("$t('confirmacionMigracionUsuarios')");
        expect(source).toContain('vasAMigrarLosDatosDeEsteUsuario');
        expect(source).toContain('yLosVasAJuntarConLosDeEsteUsuario');
        expect(source).toContain("name: 'admin-users-user'");
    });

    it('falls back to a question-mark placeholder when user has no image', () => {
        expect(source).toContain('hasUserImage');
        expect(source).toContain('user-migration-card__avatar--placeholder');
        expect(source).toContain('?');
    });

    it('caps avatar size to 100x100px', () => {
        expect(source).toMatch(/\.user-migration-card__avatar\s*\{[^}]*width:\s*100px/);
        expect(source).toMatch(/\.user-migration-card__avatar\s*\{[^}]*height:\s*100px/);
    });

    it('renders the user email and a friendly join date in the field comparison table', () => {
        expect(source).toContain('field.labelKey');
        expect(source).toContain('formatJoinDate');
        expect(source).toContain("import dayjs from '../../dayjs'");
        expect(source).toContain('dayjs(');
        expect(source).toContain(".format('LL')");
    });

    it('persists selected users in route query to restore state after navigation', () => {
        expect(source).toContain('syncRouteQuery');
        expect(source).toContain('this.$router.replace');
        expect(source).toContain('this.$route.query');
        expect(source).toContain('query.removeUserId');
        expect(source).toContain('query.keepUserId');
    });

    it('renders the irreversible-delete warning above the Migrar button', () => {
        expect(source).toContain("$t('advertenciaMigracionUsuarios')");
        expect(source).toContain('admin-user-migration-new__warning');
        const warningIndex = source.indexOf("$t('advertenciaMigracionUsuarios')");
        const submitButtonIndex = source.indexOf('admin-user-migration-new__submit');
        expect(warningIndex).toBeGreaterThan(-1);
        expect(submitButtonIndex).toBeGreaterThan(-1);
        expect(warningIndex).toBeLessThan(submitButtonIndex);
    });

    it('renders a field comparison table with per-field source pickers', () => {
        expect(source).toContain('admin-user-migration-new__field-table');
        expect(source).toContain('fieldSources');
        expect(source).toContain('migrationFields');
        expect(source).toContain('selectFieldSource');
        expect(source).toContain('field_sources');
        expect(source).toContain("from '../../utils/userMigrationFields.js'");
    });

    it('defaults field sources to old account for email dni and created_at and new account for password and phone', () => {
        expect(source).toContain("from '../../utils/userMigrationFields.js'");
        expect(source).toContain('createDefaultFieldSources');
    });

    it('highlights the selected field source cell in the comparison table', () => {
        expect(source).toContain('admin-user-migration-new__field-cell--selected');
        expect(source).toContain('isFieldSourceSelected');
    });

    it('shows the support ticket notice next to Usuario a mantener', () => {
        const keepLabelIndex = source.indexOf("$t('usuarioAMantener')");
        const noticeIndex = source.indexOf('supportTicketNoticeText');

        expect(keepLabelIndex).toBeGreaterThan(-1);
        expect(noticeIndex).toBeGreaterThan(keepLabelIndex);
        expect(source).toContain('admin-user-migration-new__support-ticket-notice');
    });

    it('shows the support ticket notice below the keep user preview heading', () => {
        const keepHeadingIndex = source.indexOf('yLosVasAJuntarConLosDeEsteUsuario');
        const keepRoleNoticeIndex = source.indexOf("card.role === 'keep'");

        expect(keepHeadingIndex).toBeGreaterThan(-1);
        expect(keepRoleNoticeIndex).toBeGreaterThan(-1);
        expect(source).toContain('supportTicketNoticeText');
    });

    it('styles the support ticket notice as red bold text', () => {
        expect(source).toMatch(
            /\.admin-user-migration-new__support-ticket-notice\s*\{[^}]*color:\s*[^;]+/
        );
        expect(source).toMatch(
            /\.admin-user-migration-new__support-ticket-notice\s*\{[^}]*font-weight:\s*(700|bold)/
        );
        expect(source).toMatch(/label \.admin-user-migration-new__support-ticket-notice\s*\{/);
        expect(source).toMatch(/p\.admin-user-migration-new__support-ticket-notice\s*\{/);
    });

    it('keeps the support ticket notice copy in i18n', () => {
        expect(i18nSource).toContain(supportTicketNoticeKey);
        expect(i18nSource).toContain(supportTicketNoticeCopy);
        expect(i18nSource).toContain(supportTicketNoticeEnglishCopy);
        expect(source).toContain("this.$t('migracionUsuarioAMantenerAvisoTicketSoporte')");
    });
});
