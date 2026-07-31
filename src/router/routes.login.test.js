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
