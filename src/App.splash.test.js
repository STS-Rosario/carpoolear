import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const appPath = path.join(__dirname, 'App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');
describe('App custom splash', () => {
    it('skips the custom splash overlay on admin routes', () => {
        expect(appSource).toContain('v-if="customSplashVisible"');
        expect(appSource).toContain("from './utils/customSplash'");
        expect(appSource).toMatch(
            /customSplashVisible\s*\(\)\s*\{[\s\S]*isCustomSplashVisible\s*\([\s\S]*this\.\$route[\s\S]*this\.showCustomSplash/
        );
    });

    it('keeps splash enabled by default for the public app', () => {
        expect(appSource).toMatch(/showCustomSplash:\s*true/);
        expect(appSource).toContain('CUSTOM_SPLASH_DISMISS_MS');
        expect(appSource).toMatch(
            /setTimeout\s*\([\s\S]*showCustomSplash\s*=\s*false[\s\S]*CUSTOM_SPLASH_DISMISS_MS/
        );
    });

    it('only dismisses splash early for admin URLs', () => {
        expect(appSource).toMatch(/if\s*\(\s*isAdminAppUrl\(this\.\$route\)\s*\)/);
        expect(appSource).toMatch(
            /['"]\$route['"]\s*\([\s\S]*isAdminAppUrl\(to\)[\s\S]*showCustomSplash\s*=\s*false/
        );
        expect(appSource).not.toContain('isAdminUser');
    });

    it('uses custom splash visibility for modal suppression', () => {
        expect(appSource).toContain('return this.customSplashVisible || this.onBoardingVisibility');
    });

    it('shows version and build number on the vue splash overlay', () => {
        expect(appSource).toContain('formatSplashVersionText');
        expect(appSource).toContain('resolveSplashVersion');
        expect(appSource).toContain('SPLASH_WEB_BUILD_NUMBER');
    });
});
