import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPath = path.join(__dirname, 'CatalogCombobox.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('CatalogCombobox dropdown contrast', () => {
    it('closes the dropdown when clicking or blurring outside', () => {
        expect(source).toContain('createCatalogComboboxOutsideDismiss');
        expect(source).toContain('@blur="onInputBlur"');
        expect(source).not.toContain('v-clickoutside');
    });
});
