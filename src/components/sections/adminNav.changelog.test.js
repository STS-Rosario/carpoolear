import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const navPath = path.join(__dirname, 'adminNav.vue');
const navSource = fs.readFileSync(navPath, 'utf8');

describe('adminNav changelog link', () => {
    it('links to the changelog admin page', () => {
        expect(navSource).toContain("name: 'admin-changelogs'");
        expect(navSource).toContain('adminNavChangelog');
    });

    it('uses AppButton for the mobile nav toggle', () => {
        expect(navSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(navSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?admin-nav-mobile-toggle[\s\S]*?toggleMobile/
        );
        expect(navSource).not.toContain('btn btn-default');
    });
});
