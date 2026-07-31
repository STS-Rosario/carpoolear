import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const tokensPath = path.resolve(__dirname, 'design-tokens.css');
const tokensCss = fs.readFileSync(tokensPath, 'utf8');

describe('design tokens', () => {
    it('defines action palette tokens from the design system', () => {
        expect(tokensCss).toContain('--ds-action:');
        expect(tokensCss).toContain('--ds-action-hover:');
        expect(tokensCss).toContain('--ds-action-on:');
        expect(tokensCss).toContain('--ds-action-bg:');
        expect(tokensCss).toContain('--ds-action-text:');
        expect(tokensCss).toContain('--ds-action-border:');
        expect(tokensCss).toContain('--ds-link:');
    });

    it('defines semantic state and text palette tokens', () => {
        expect(tokensCss).toContain('--ds-brand:');
        expect(tokensCss).toContain('--ds-success-solid:');
        expect(tokensCss).toContain('--ds-warning-solid:');
        expect(tokensCss).toContain('--ds-error-solid:');
        expect(tokensCss).toContain('--ds-destructive:');
        expect(tokensCss).toContain('--ds-text-primary: #22211F');
        expect(tokensCss).toContain('--ds-text-secondary:');
        expect(tokensCss).toContain('--ds-text-muted:');
        expect(tokensCss).toContain('--main-font-color: var(--ds-text-primary)');
    });

    it('defines shared button geometry and typography tokens', () => {
        expect(tokensCss).toContain('--ds-radius-button:');
        expect(tokensCss).toContain('--ds-button-font-weight:');
        expect(tokensCss).toContain('--ds-font-weight-normal: 400');
        expect(tokensCss).toContain('--ds-font-weight-bold: 700');
        expect(tokensCss).toContain('--ds-link-font-weight: 400');
        expect(tokensCss).toContain('--ds-font-size-base:');
        expect(tokensCss).toContain('--ds-font-family:');
        expect(tokensCss).toContain('--ds-button-gap:');
        expect(tokensCss).toContain('--ds-focus-ring:');
        expect(tokensCss).toContain('--ds-button-disabled-bg:');
    });
});
