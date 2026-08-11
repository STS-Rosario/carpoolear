import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const formPath = path.resolve(__dirname, 'CarForm.vue');
const formSource = fs.readFileSync(formPath, 'utf8');

describe('CarForm DS inputs', () => {
    it('supports disabling the patente field for complete-car modal', () => {
        expect(formSource).toContain('patenteDisabled');
        expect(formSource).toMatch(
            /<AppInput[\s\S]*?patente[\s\S]*?:disabled="patenteDisabled"/
        );
    });
});
