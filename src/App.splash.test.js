import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const appPath = path.join(__dirname, 'App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');
const indexPath = path.join(__dirname, '..', 'index.html');
const indexSource = fs.readFileSync(indexPath, 'utf8');
const mainPath = path.join(__dirname, 'main.js');
const mainSource = fs.readFileSync(mainPath, 'utf8');

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
        expect(appSource).toContain('class="custom-splash-screen"');
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
        expect(appSource).toContain('class="splash-version"');
        expect(appSource).toContain('formatSplashVersionText');
        expect(appSource).toContain('resolveSplashVersion');
        expect(appSource).toContain('SPLASH_WEB_BUILD_NUMBER');
    });

    it('uses a single vue splash overlay without bootstrap handoff', () => {
        expect(appSource).not.toContain('hideBootstrapSplash');
        expect(appSource).not.toContain('getRemainingSplashMs');
        expect(appSource).not.toContain('__customSplashStartedAt');
    });
});

describe('index.html splash', () => {
    it('does not render a duplicate bootstrap splash before Vue mounts', () => {
        expect(indexSource).not.toContain('id="bootstrap-splash"');
        expect(indexSource).not.toContain('bootstrap-splash-screen');
        expect(indexSource).not.toContain('bootstrap-splash-image');
    });
});

describe('main.js splash', () => {
    it('does not initialize a bootstrap splash before system-ready', () => {
        expect(mainSource).not.toContain('initBootstrapSplash');
    });
});
