import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'AdminCarColors.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminCarColors view', () => {
    it('supports admin hex picker and swatch preview', () => {
        expect(viewSource).toContain('type="color"');
        expect(viewSource).toContain("$t('colorHexPlaceholder')");
        expect(viewSource).toContain('admin-car-color-swatch');
        expect(viewSource).toContain(':style="{ backgroundColor: row.hex }"');
    });
});
