import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const routesPath = path.join(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('profile cars route', () => {
    it('registers profile cars settings route', () => {
        expect(routesSource).toContain("path: 'cars'");
        expect(routesSource).toContain("name: 'profile_cars'");
        expect(routesSource).toContain("tab: 'cars'");
    });
});
