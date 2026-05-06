import { describe, expect, it } from 'vitest';
import {
    getAdminUserProfileRoute,
    ADMIN_USER_PROFILE_ROUTE_NAME
} from './adminProfileRoute.js';

describe('getAdminUserProfileRoute', () => {
    it('builds admin user detail route from user id', () => {
        expect(getAdminUserProfileRoute(42)).toEqual({
            name: ADMIN_USER_PROFILE_ROUTE_NAME,
            params: { userId: 42 }
        });
    });
});
