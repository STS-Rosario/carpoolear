import { describe, it, expect } from 'vitest';
import { keys } from './index.js';

describe('cache keys', () => {
    it('includes impersonation session and admin token backup keys', () => {
        expect(keys.IMPERSONATION_SESSION_KEY).toBe('IMPERSONATION_SESSION');
        expect(keys.ADMIN_TOKEN_BACKUP_KEY).toBe('ADMIN_TOKEN_BACKUP');
    });
});
