import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('router notification count integration', () => {
    it('does not refresh notification count during navigation', () => {
        const routerSource = fs.readFileSync(
            path.resolve(__dirname, 'index.js'),
            'utf8'
        );

        expect(routerSource).not.toContain('refreshNotificationsCountOnRouteChange');
        expect(routerSource).not.toContain('useNotificationsStore');
    });

    it('returns navigation promises from push and replace wrappers', () => {
        const routerSource = fs.readFileSync(
            path.resolve(__dirname, 'index.js'),
            'utf8'
        );

        expect(routerSource).toMatch(
            /router\.push = function[\s\S]*return router\._push\(data, fnSuccess, fnFailure\);/
        );
        expect(routerSource).toMatch(
            /router\.replace = function[\s\S]*return router\._push\(data\);/
        );
    });

    it('redirects Club members who have not seen the welcome screen', () => {
        const routerSource = fs.readFileSync(
            path.resolve(__dirname, 'index.js'),
            'utf8'
        );

        expect(routerSource).toContain('shouldRedirectToClubCarpoolearWelcome');
        expect(routerSource).toContain("name: 'club-carpoolear-welcome'");
    });
});
