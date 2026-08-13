import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
    APP_MOBILE_FOOTER_OFFSET_CSS_VAR,
    APP_MOBILE_FOOTER_OFFSET_VALUE,
    MOBILE_FOOTER_BAR_CONTENT_HEIGHT_PX
} from '../utils/appMobileFooterOffset.js';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
const appPath = path.resolve(__dirname, '../App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');
const footerMobileCss = fs.readFileSync(
    path.resolve(__dirname, 'components/footer-mobile.css'),
    'utf8'
);
const footerSource = fs.readFileSync(
    path.resolve(__dirname, '../components/sections/FooterApp.vue'),
    'utf8'
);

describe('app mobile footer offset styles', () => {
    it('defines the shared footer offset token in base.css', () => {
        expect(baseCss).toContain(APP_MOBILE_FOOTER_OFFSET_CSS_VAR);
        expect(baseCss).toContain(APP_MOBILE_FOOTER_OFFSET_VALUE);
    });

    it('applies footer offset padding on mobile view containers', () => {
        expect(baseCss).toMatch(
            new RegExp(
                `\\.view-container--mobile-footer\\s*\\{[^}]*padding-bottom:\\s*var\\(${APP_MOBILE_FOOTER_OFFSET_CSS_VAR}`
            )
        );
    });

    it('toggles the mobile footer spacing class from App.vue', () => {
        expect(appSource).toContain('view-container--mobile-footer');
        expect(appSource).toContain('mobileFooterSpacing');
        expect(appSource).toContain('footerShow');
        expect(appSource).toContain('isMobile');
    });

    it('keeps tab labels above the indicator with safe area on the footer only', () => {
        expect(footerMobileCss).toMatch(
            /\.mobile-footer-bar\.visible-xs\s*\{[^}]*display:\s*flex\s*!important;/s
        );
        expect(baseCss).toMatch(
            /\.mobile-footer-bar\s*\{[^}]*align-items:\s*flex-end;/s
        );
        expect(baseCss).not.toMatch(
            /\.mobile-footer-bar\s*\{[^}]*padding-bottom:\s*env\(safe-area-inset-bottom\)/s
        );
        expect(baseCss).toMatch(
            /\.mobile-footer-bar__item\s*\{[^}]*justify-content:\s*flex-end;/s
        );
        expect(baseCss).toMatch(
            /\.mobile-footer-bar__item\s*\{[^}]*padding-bottom:\s*10px;/s
        );
        expect(baseCss).not.toMatch(
            /\.mobile-footer-bar__item\s*\{[^}]*padding-bottom:\s*env\(safe-area-inset-bottom\)/s
        );
        expect(baseCss).toMatch(
            /\.mobile-footer-bar__indicator\s*\{[^}]*bottom:\s*0;/s
        );
        expect(APP_MOBILE_FOOTER_OFFSET_VALUE).toBe(
            `calc(${MOBILE_FOOTER_BAR_CONTENT_HEIGHT_PX}px + env(safe-area-inset-bottom, 0px))`
        );
        expect(footerSource).toContain('mobile-footer-bar__indicator');
    });

    it('clears body bottom safe-area padding when the tab bar is visible', () => {
        expect(baseCss).toMatch(
            /body\.has-mobile-tab-bar\s*\{[^}]*padding-bottom:\s*0;/
        );
        expect(appSource).toContain('has-mobile-tab-bar');
        expect(appSource).toContain('syncMobileTabBarBodyClass');
    });
});
