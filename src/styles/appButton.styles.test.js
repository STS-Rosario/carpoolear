import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const buttonCssPath = path.resolve(__dirname, 'components/app-button.css');
const buttonCss = fs.readFileSync(buttonCssPath, 'utf8');

describe('app button styles', () => {
    it('styles primary buttons from design tokens', () => {
        expect(buttonCss).toContain('.app-button--primary');
        expect(buttonCss).toMatch(
            /\.app-button--primary\s*\{[^}]*background:\s*var\(--ds-action\)/
        );
        expect(buttonCss).toMatch(
            /\.app-button--primary:hover:not\(:disabled\):not\(\[aria-disabled='true'\]\)\s*\{[^}]*background:\s*var\(--ds-action-hover\)/
        );
    });

    it('styles secondary buttons from design tokens', () => {
        expect(buttonCss).toContain('.app-button--secondary');
        expect(buttonCss).toMatch(
            /\.app-button--secondary\s*\{[^}]*border-color:\s*var\(--ds-action-border\)/
        );
        expect(buttonCss).toMatch(
            /\.app-button--secondary:hover:not\(:disabled\):not\(\[aria-disabled='true'\]\)\s*\{[^}]*background:\s*var\(--ds-action-bg\)/
        );
    });

    it('supports tertiary, danger, success, warning, and icon-only variants', () => {
        expect(buttonCss).toContain('.app-button--tertiary');
        expect(buttonCss).toContain('.app-button--danger');
        expect(buttonCss).toContain('.app-button--success');
        expect(buttonCss).toContain('.app-button--warning');
        expect(buttonCss).toContain('.app-button--icon-only');
        expect(buttonCss).toContain('.app-button__unread');
    });

    it('never underlines button text on hover or focus', () => {
        expect(buttonCss).toMatch(
            /a\.app-button:hover,\s*\n\s*a\.app-button:focus/
        );
        expect(buttonCss).toMatch(
            /a\.app-button:hover[\s\S]*text-decoration:\s*none/
        );
        expect(buttonCss).toMatch(
            /\.app-button:hover[\s\S]*text-decoration:\s*none/
        );
    });

    it('keeps icons inheriting button color with gap spacing from text', () => {
        expect(buttonCss).toMatch(
            /\.app-button\s*\{[^}]*gap:\s*var\(--ds-button-gap\)/s
        );
        expect(buttonCss).toMatch(
            /\.app-button\s+\.app-button__icon(?:\s*>\s*\.fa|\s+\.fa|\s*,[\s\S]*?\.fa)*\s*\{[^}]*color:\s*inherit/s
        );
        expect(buttonCss).toMatch(
            /\.app-button\s+\.app-button__icon(?:[\s\S]*?)\.fa[\s\S]*?\{[^}]*float:\s*none/s
        );
        expect(buttonCss).toMatch(
            /\.app-button\s+\.app-button__icon(?:[\s\S]*?)\.fa[\s\S]*?\{[^}]*width:\s*auto/s
        );
    });
});
