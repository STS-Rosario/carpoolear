import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesSource = fs.readFileSync(path.resolve(__dirname, 'routes.js'), 'utf8');

function routeBlock(name) {
    const match = routesSource.match(
        new RegExp(`\\{\\s*path: '[^']*',\\s*name: '${name}',[\\s\\S]*?\\n    \\},?\\n`)
    );

    return match ? match[0] : null;
}

describe('Club Carpoolear welcome route', () => {
    it('registers /club-carpoolear/welcome with auth', () => {
        const block = routeBlock('club-carpoolear-welcome');
        expect(block).not.toBeNull();
        expect(block).toContain("path: '/club-carpoolear/welcome'");
        expect(block).toContain('beforeEnter: auth');
        expect(block).toContain('ClubCarpoolearWelcome');
    });
});
