import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'Admin.js'), 'utf8');

describe('AdminApi user migrations', () => {
    it('targets user-migrations endpoints', () => {
        expect(apiSource).toContain('/api/admin/user-migrations');
        expect(apiSource).toContain('getUserMigrations');
        expect(apiSource).toContain('createUserMigration');
    });
});
