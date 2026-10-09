import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'Admin.js'), 'utf8');

describe('AdminApi - contract verification (source code patterns)', () => {
    it('targets user-migrations endpoints', () => {
        expect(apiSource).toContain('/api/admin/user-migrations');
        expect(apiSource).toContain('getUserMigrations');
        expect(apiSource).toContain('createUserMigration');
    });

    it('patches admin rating and reference endpoints', () => {
        expect(apiSource).toContain('updateRating');
        expect(apiSource).toContain("'/api/admin/ratings/' + ratingId");
        expect(apiSource).toContain('adminUpdateReference');
        expect(apiSource).toContain("'/api/admin/references/' + referenceId");
        expect(apiSource).toContain('getUserRatings');
        expect(apiSource).toContain("'/api/admin/users/' + userId + '/ratings'");
    });

    it('posts private admin note to manual identity validation endpoint', () => {
        expect(apiSource).toContain('updateManualIdentityValidationPrivateNote');
        expect(apiSource).toContain("'/api/admin/manual-identity-validations/' + manualIdentityValidationId + '/private-note'");
        expect(apiSource).toContain('private_admin_note');
    });

    it('posts review_status and paid to manual identity validation state endpoint', () => {
        expect(apiSource).toContain('updateManualIdentityValidationState');
        expect(apiSource).toContain("'/api/admin/manual-identity-validations/' + manualIdentityValidationId + '/state'");
        expect(apiSource).toContain('review_status');
        expect(apiSource).toContain('paid');
    });

    it('exposes admin action-logs list', () => {
        expect(apiSource).toContain('getActionLogs');
        expect(apiSource).toContain('/api/admin/action-logs');
    });
});
