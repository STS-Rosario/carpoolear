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

describe('trip-independent donation page route', () => {
    it('registers /donate with the donation page component', () => {
        const block = routeBlock('donate');
        expect(block).not.toBeNull();
        expect(block).toContain("path: '/donate'");
        expect(block).toContain('component: DonationAfterRating');
    });

    it('requires login but no trip, identity validation or complete profile', () => {
        const block = routeBlock('donate');
        expect(block).toContain('beforeEnter: auth,');
        expect(block).not.toContain(':tripId');
        expect(block).not.toContain('requireIdentityValidation');
        expect(block).not.toContain('profileComplete');
    });

    it('keeps the normal app header with a back button', () => {
        const block = routeBlock('donate');
        expect(block).toContain("titleKey: 'donar'");
        expect(block).toContain("buttons: ['back']");
    });
});
