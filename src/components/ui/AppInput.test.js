import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppInput.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AppInput', () => {
    it('supports label, hint, error, disabled, and password props', () => {
        expect(source).toContain('label:');
        expect(source).toContain('hint:');
        expect(source).toContain('error:');
        expect(source).toContain('disabled:');
        expect(source).toContain('password:');
        expect(source).toContain('app-input__hint');
        expect(source).toContain('app-input--error');
    });

    it('forwards focus to the inner control for parent refs', () => {
        expect(source).toContain('focus()');
        expect(source).toContain('ref="inputEl"');
    });

    it('supports an actionRight slot like AppField', () => {
        expect(source).toContain('actionRight');
        expect(source).toContain('app-input__control-wrap--action-right');
        expect(source).toContain('app-input__action-right');
    });
});
