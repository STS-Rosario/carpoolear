import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const tokensPath = path.resolve(__dirname, 'design-tokens.css');
const inputCssPath = path.resolve(__dirname, 'components/app-input.css');
const tokensCss = fs.readFileSync(tokensPath, 'utf8');
const inputCss = fs.readFileSync(inputCssPath, 'utf8');

describe('input design tokens', () => {
    it('defines input palette and geometry tokens', () => {
        expect(tokensCss).toContain('--ds-input-bg:');
        expect(tokensCss).toContain('--ds-input-border:');
        expect(tokensCss).toContain('--ds-input-label:');
        expect(tokensCss).toContain('--ds-input-hint:');
        expect(tokensCss).toContain('--ds-input-focus-ring:');
        expect(tokensCss).toContain('--ds-input-error-border:');
        expect(tokensCss).toContain('--ds-input-disabled-bg:');
        expect(tokensCss).toContain('--ds-radius-input:');
    });
});

describe('app input styles', () => {
    it('styles regular, focus, error, and disabled states from tokens', () => {
        expect(inputCss).toContain('.app-input__control:focus-visible');
        expect(inputCss).toMatch(
            /\.app-input__control:focus-visible\s*\{[^}]*box-shadow:\s*var\(--ds-input-focus-ring\)/
        );
        expect(inputCss).toContain('.app-input--error .app-input__control');
        expect(inputCss).toMatch(
            /\.app-input--error \.app-input__control\s*\{[^}]*border-color:\s*var\(--ds-input-error-border\)/
        );
        expect(inputCss).toMatch(
            /\.app-input__control:disabled\s*\{[^}]*background:\s*var\(--ds-input-disabled-bg\)/
        );
        expect(inputCss).toContain('.app-input__hint--error');
    });

    it('overrides legacy user-form input styles inside auth forms', () => {
        expect(inputCss).toContain('.user-form--inputs .app-input__label');
        expect(inputCss).toContain('.user-form--inputs .app-input__control');
    });
});
