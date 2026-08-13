import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
    APP_MOBILE_FOOTER_OFFSET_CSS_VAR,
    APP_MOBILE_FOOTER_OFFSET_VALUE
} from '../utils/appMobileFooterOffset.js';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
const appPath = path.resolve(__dirname, '../App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');

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
});
