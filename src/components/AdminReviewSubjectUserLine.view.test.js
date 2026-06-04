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

    it('includes public profile link in parentheses when userId is present', () => {
        expect(source).toContain("name: 'profile'");
        expect(source).toContain('params: { id: userId }');
        expect(source).toContain("{{ $t('verPerfilPublico') }}");
    });
});
