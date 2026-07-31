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
