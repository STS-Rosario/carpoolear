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
        expect(appSource).toContain('getRemainingSplashMs');
        expect(appSource).toMatch(
            /setTimeout\s*\([\s\S]*showCustomSplash\s*=\s*false[\s\S]*getRemainingSplashMs/
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
    });
});

describe('index.html bootstrap splash', () => {
    it('shows splash immediately on cold page load before Vue mounts', () => {
        expect(indexSource).toContain('id="bootstrap-splash"');
        expect(indexSource).toContain('splash-android-1280x1920.png');
        expect(indexSource).toContain('bootstrap-splash-screen');
    });

    it('includes a bootstrap version label for the splash overlay', () => {
        expect(indexSource).toContain('id="bootstrap-splash-version"');
        expect(indexSource).toContain('bootstrap-splash-version');
    });
});

describe('main.js bootstrap splash', () => {
    it('initializes bootstrap splash before system-ready', () => {
        expect(mainSource).toContain('initBootstrapSplash');
        expect(mainSource.indexOf('initBootstrapSplash')).toBeLessThan(
            mainSource.indexOf("bus.on('system-ready'")
        );
    });
});
