import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UsersDeleteList.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UsersDeleteList view', () => {
    it('links delete request user to the admin user profile route', () => {
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).not.toContain("name: 'profile'");
    });
});
