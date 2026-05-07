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
        expect(source).toMatch(/dayjs\([^)]+\)\.format\('LL'\)/);
    });
});
