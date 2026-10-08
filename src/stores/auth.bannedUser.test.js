import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve(__dirname, 'auth.js'), 'utf8');

describe('auth.onLoggin banned users', () => {
    it('sends banned users to mesa de ayuda instead of trips', () => {
        const onLogginMatch = source.match(
            /async onLoggin\(token\) \{[\s\S]*?\n\s{8}\},/
        );
        expect(onLogginMatch).not.toBeNull();
        const onLoggin = onLogginMatch[0];

        expect(onLoggin).toContain('isUserBanned');
        expect(onLoggin).toContain("name: 'tickets'");
        expect(onLoggin).toMatch(/if \(isUserBanned\(this\.user\)\)/);
        expect(onLoggin).toContain('tripsStore.tripsSearch');
        expect(onLoggin.indexOf('isUserBanned')).toBeLessThan(
            onLoggin.indexOf('tripsStore.tripsSearch')
        );
    });
});
