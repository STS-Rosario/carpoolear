import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve(__dirname, 'components/friends-page.css');
const mainCssPath = path.resolve(__dirname, 'main.css');
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
const mainCss = fs.readFileSync(mainCssPath, 'utf8');

describe('friends-page.css Amigos/Solicitudes tabs', () => {
    it('is imported from main.css', () => {
        expect(mainCss).toContain("components/friends-page.css");
    });

    it('uses full-width light grey baseline and wider dark blue active underline like Perfil', () => {
        expect(css).toMatch(
            /\.friends-page\s+\.tabset\s*>\s*\.nav-tabs\s*\{[^}]*border-bottom:\s*1px\s+solid\s+#(?:d0d0d0|ccc|aaa)/s
        );
        expect(css).toMatch(
            /\.friends-page\s+\.tabset\s*>\s*\.nav-tabs\s*>\s*li\s*>\s*a\.active\s*\{[^}]*border-bottom:\s*4px\s+solid/s
        );
        expect(css).toMatch(
            /\.friends-page\s+\.tabset\s*>\s*\.nav-tabs::after\s*\{[^}]*display:\s*none/s
        );
        expect(css).toMatch(
            /\.friends-page\s+\.tabset\s+\.nav\s*>\s*li\s*>\s*a\.active::after\s*\{[^}]*display:\s*none/s
        );
    });

    it('overrides settings-component red active tab underline with dark blue on desktop and mobile', () => {
        expect(css).toMatch(
            /\.settings-component\s+\.friends-page\s+\.tabset\s*>\s*\.nav-tabs\s*>\s*li\s*>\s*a\.active\s*\{[^}]*border-bottom:\s*4px\s+solid\s+var\(--friends-tab-active/s
        );
        expect(css).not.toMatch(/@media[^{]+\{[^}]*\.friends-page\s+\.tabset/s);
    });

    it('renders Amigos and Solicitudes tab labels in bold', () => {
        expect(css).toMatch(
            /\.friends-page\s+\.tabset\s*>\s*\.nav-tabs\s*>\s*li\s*>\s*a\s*\{[^}]*font-weight:\s*(?:var\(--ds-font-weight-bold,\s*700\)|700|bold)/s
        );
        expect(css).toMatch(
            /\.friends-page\s+\.tabset\s*>\s*\.nav-tabs\s*>\s*li\s*>\s*a\.active\s*\{[^}]*font-weight:\s*(?:var\(--ds-font-weight-bold,\s*700\)|700|bold)/s
        );
    });
});
