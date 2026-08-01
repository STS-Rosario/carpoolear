import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppTextarea.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');
const inputCssPath = path.resolve(
    __dirname,
    '../../styles/components/app-input.css'
);
const inputCss = fs.readFileSync(inputCssPath, 'utf8');

describe('AppTextarea', () => {
    it('mirrors AppInput structure with a textarea control', () => {
        expect(componentSource).toContain('app-input');
        expect(componentSource).toContain('app-input__label');
        expect(componentSource).toContain('app-input__control');
        expect(componentSource).toContain('<textarea');
        expect(componentSource).toContain('update:modelValue');
        expect(componentSource).toContain('app-input--error');
        expect(componentSource).toContain('app-input__hint--error');
    });
});

describe('AppTextarea styles', () => {
    it('styles textarea controls like inputs with multiline sizing', () => {
        expect(inputCss).toMatch(
            /textarea\.app-input__control\s*\{[^}]*min-height:/s
        );
        expect(inputCss).toMatch(
            /textarea\.app-input__control\s*\{[^}]*resize:\s*vertical/s
        );
        expect(inputCss).toMatch(
            /textarea\.app-input__control\s*\{[^}]*background:\s*var\(--ds-input-bg\)/s
        );
        expect(inputCss).toMatch(
            /textarea\.app-input__control\s*\{[^}]*border:\s*1px solid var\(--ds-input-border\)/s
        );
    });
});
