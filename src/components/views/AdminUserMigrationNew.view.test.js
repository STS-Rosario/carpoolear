import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserMigrationNew.vue');
const source = fs.readFileSync(viewPath, 'utf8');

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

    it('renders the user email and a friendly join date on each preview card', () => {
        expect(source).toContain("$t('email')");
        expect(source).toContain("$t('usuarioDesde')");
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
        expect(source).toContain("$t('migracionCampoEmail')");
        expect(source).toContain("$t('migracionCampoContrasena')");
        expect(source).toContain("$t('migracionCampoDni')");
        expect(source).toContain("$t('migracionCampoTelefono')");
        expect(source).toContain("$t('migracionCampoFechaCreacion')");
    });

    it('defaults field sources to old account for email dni and created_at and new account for password and phone', () => {
        expect(source).toContain('DEFAULT_FIELD_SOURCES');
        expect(source).toMatch(/email:\s*'removed'/);
        expect(source).toMatch(/password:\s*'kept'/);
        expect(source).toMatch(/nro_doc:\s*'removed'/);
        expect(source).toMatch(/mobile_phone:\s*'kept'/);
        expect(source).toMatch(/created_at:\s*'removed'/);
    });

    it('highlights the selected field source cell in the comparison table', () => {
        expect(source).toContain('admin-user-migration-new__field-cell--selected');
        expect(source).toContain('isFieldSourceSelected');
    });
});
