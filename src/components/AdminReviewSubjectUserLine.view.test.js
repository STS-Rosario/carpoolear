import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AdminReviewSubjectUserLine.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AdminReviewSubjectUserLine component', () => {
    it('renders label with trailing space and admin profile link for user name', () => {
        expect(source).toContain('labelKey');
        expect(source).toContain(':</strong>&nbsp;');
        expect(source).toContain('getAdminUserProfileRoute(userId)');
        expect(source).toContain('userName');
    });

    it('does not link to the public profile route', () => {
        expect(source).not.toContain("name: 'profile'");
        expect(source).not.toContain("{{ $t('verPerfilPublico') }}");
    });
});
