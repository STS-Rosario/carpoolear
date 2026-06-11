import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const appPath = path.join(__dirname, 'App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');

describe('App custom splash', () => {
    it('skips the custom splash overlay for admin users', () => {
        expect(appSource).toContain('v-if="customSplashVisible"');
        expect(appSource).toMatch(
            /customSplashVisible\s*\(\)\s*\{[\s\S]*this\.user[\s\S]*is_admin[\s\S]*return false/
        );
    });

    it('uses custom splash visibility for modal suppression', () => {
        expect(appSource).toContain('return this.customSplashVisible || this.onBoardingVisibility');
    });
});
