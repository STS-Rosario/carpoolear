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

    it('uses AppField select and AppButton for the edit modal', () => {
        expect(viewSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(viewSource).toContain(
            "import AppField from '../ui/AppField.vue'"
        );
        expect(viewSource).toContain('AppField');
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?submitUpdate/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('btn btn-primary');
    });
});
