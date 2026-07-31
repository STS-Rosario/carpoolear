import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('login route header', () => {
    it('shows the desktop header logo on the login page', () => {
        expect(routesSource).toMatch(
            /name:\s*'login'[\s\S]*logo:\s*\{[\s\S]*show:\s*true/
        );
    });
});

describe('register route header', () => {
    it('shows the desktop header logo and auth buttons on the register page', () => {
        const registerRoute = routesSource.match(
            /path:\s*'\/register'[\s\S]*?},\s*\{/
        )?.[0];

        expect(registerRoute).toBeTruthy();
        expect(registerRoute).toMatch(/name:\s*'register'/);
        expect(registerRoute).toMatch(/logo:\s*\{[\s\S]*show:\s*true/);
        expect(registerRoute).toMatch(/buttons:\s*\[\s*\]/);
        expect(registerRoute).not.toContain("buttons: ['back']");
    });
});

describe('reset password route headers', () => {
    it('shows the desktop header logo and auth buttons on reset password pages', () => {
        const resetRoute = routesSource.match(
            /path:\s*'\/reset-password'[\s\S]*?},\s*\{/
        )?.[0];
        const resetConfirmRoute = routesSource.match(
            /path:\s*'\/reset-password\/:token'[\s\S]*?},\s*\{/
        )?.[0];

        expect(resetRoute).toMatch(/logo:\s*\{[\s\S]*show:\s*true/);
        expect(resetRoute).toMatch(/buttons:\s*\[\s*\]/);
        expect(resetRoute).not.toContain("buttons: ['back']");

        expect(resetConfirmRoute).toMatch(/logo:\s*\{[\s\S]*show:\s*true/);
        expect(resetConfirmRoute).toMatch(/buttons:\s*\[\s*\]/);
        expect(resetConfirmRoute).not.toContain("buttons: ['back']");
    });
});
