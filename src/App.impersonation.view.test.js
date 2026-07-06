import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve(__dirname, 'App.vue');
const source = fs.readFileSync(appPath, 'utf8');

describe('App.vue impersonation banner', () => {
    it('renders ImpersonationBanner when impersonating', () => {
        expect(source).toContain('ImpersonationBanner');
        expect(source).toContain('isImpersonating');
    });
});
