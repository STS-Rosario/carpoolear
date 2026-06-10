import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPath = path.join(__dirname, 'CatalogCombobox.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('CatalogCombobox dropdown contrast', () => {
    it('uses dark text on white dropdown options', () => {
        expect(source).toMatch(/\.catalog-combobox__list\s*\{[\s\S]*?color:\s*#333/s);
        expect(source).toMatch(
            /\.catalog-combobox__option\s*\{[\s\S]*?color:\s*#333/s
        );
        expect(source).toMatch(
            /\.catalog-combobox__option\.is-highlighted[\s\S]*?color:\s*#333/s
        );
    });

    it('keeps typed input text dark while placeholders stay muted', () => {
        expect(source).toMatch(/\.catalog-combobox__input\s*\{[\s\S]*?color:\s*#333/s);
        expect(source).toContain('.catalog-combobox__input::placeholder');
    });
});
