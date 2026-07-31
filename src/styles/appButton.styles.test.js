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
});
