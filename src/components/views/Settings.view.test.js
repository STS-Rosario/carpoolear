import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'Settings.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Settings navigation', () => {
    it('includes Autos section in settings menu', () => {
        expect(viewSource).toContain("name: 'profile_cars'");
        expect(viewSource).toContain("$t('autos')");
        expect(viewSource).toContain("tabActive === 'cars'");
    });
});
