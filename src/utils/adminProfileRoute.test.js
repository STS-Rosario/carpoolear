import { describe, expect, it } from 'vitest';
import { getAdminUserProfileRoute } from './adminProfileRoute.js';

describe('getAdminUserProfileRoute', () => {
    it('builds admin user detail route from user id', () => {
        expect(getAdminUserProfileRoute(42)).toEqual({
            name: 'admin-users-user',
            params: { userId: 42 }
        });
    });
});
