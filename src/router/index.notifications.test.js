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
});
