import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserMigrationsList.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminUserMigrationsList view', () => {
    it('loads migrations via AdminApi and links to new migration', () => {
        expect(source).toContain('getUserMigrations');
        expect(source).toContain("name: 'admin-user-migration-new'");
        expect(source).toContain("$t('migracionId')");
        expect(source).toContain("$t('usuarioMantenido')");
    });
});
