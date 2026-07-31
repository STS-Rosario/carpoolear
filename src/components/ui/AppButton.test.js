import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppButton.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AppButton', () => {
    it('supports variant, size, icon, unread, and loading props', () => {
        expect(source).toContain("variant: {");
        expect(source).toContain("'primary'");
        expect(source).toContain("'secondary'");
        expect(source).toContain("'tertiary'");
        expect(source).toContain('iconLeft');
        expect(source).toContain('iconRight');
        expect(source).toContain('iconOnly');
        expect(source).toContain('unread');
        expect(source).toContain('loading');
    });

    it('renders semantic button classes from variant and size', () => {
        expect(source).toContain('`app-button--${this.variant}`');
        expect(source).toContain('`app-button--${this.size}`');
        expect(source).toContain('app-button--tertiary-destructive');
        expect(source).toContain('app-button--icon-only');
    });
});
