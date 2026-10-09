import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routerSource = fs.readFileSync(path.resolve(__dirname, 'index.js'), 'utf8');

describe('router banned user restriction', () => {
    it('redirects banned users away from routes outside mesa de ayuda', () => {
        expect(routerSource).toContain('bannedUserRedirectLocation');
        expect(routerSource).toContain('authStore.user');
        expect(routerSource).toMatch(
            /const bannedRedirect = bannedUserRedirectLocation\([\s\S]*authStore\.user/
        );
        expect(routerSource).toContain('next(bannedRedirect)');
    });
});
