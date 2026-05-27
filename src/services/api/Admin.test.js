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

describe('AdminApi user ratings and references', () => {
    it('patches admin rating and reference endpoints', () => {
        expect(apiSource).toContain('updateRating');
        expect(apiSource).toContain("'/api/admin/ratings/' + ratingId");
        expect(apiSource).toContain('updateReference');
        expect(apiSource).toContain("'/api/admin/references/' + referenceId");
    });

    it('fetches received and given ratings for a user', () => {
        expect(apiSource).toContain('getUserRatings');
        expect(apiSource).toContain("'/api/admin/users/' + userId + '/ratings'");
    });
});

describe('AdminApi manual identity validations private note', () => {
    it('posts private admin note to manual identity validation endpoint', () => {
        expect(apiSource).toContain('updateManualIdentityValidationPrivateNote');
        expect(apiSource).toContain(
            "/api/admin/manual-identity-validations/' + id + '/private-note"
        );
        expect(apiSource).toContain('private_admin_note');
    });
});
