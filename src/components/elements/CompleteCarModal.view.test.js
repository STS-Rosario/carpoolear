import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'CompleteCarModal.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('CompleteCarModal CTA AppButtons', () => {
    it('uses primary AppButton for Guardar with loading while saving', () => {
        expect(viewSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?:loading="saving"[\s\S]*?save[\s\S]*?guardar/
        );
        expect(viewSource).not.toContain('btn btn-primary');
    });
});
