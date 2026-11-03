import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesSource = fs.readFileSync(path.resolve(__dirname, 'routes.js'), 'utf8');

describe('identity validation routes profile gate', () => {
    it('guards identity_validation with profileComplete', () => {
        expect(routesSource).toMatch(
            /name:\s*'identity_validation'[\s\S]*?beforeEnter:\s*profileComplete/
        );
    });

    it('guards identity_validation_manual with profileComplete', () => {
        expect(routesSource).toMatch(
            /name:\s*'identity_validation_manual'[\s\S]*?beforeEnter:\s*profileComplete/
        );
    });

    it('uses requireProfileThenIdentityValidation on live share routes', () => {
        expect(routesSource).toContain('requireProfileThenIdentityValidation');
        expect(routesSource).not.toMatch(
            /requireIdentityValidation\(to, from, \(\) => \{\s*profileComplete/
        );
    });
});
