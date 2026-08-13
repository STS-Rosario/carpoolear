import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ManualIdentityValidation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ManualIdentityValidation mobile layout', () => {
    it('does not duplicate the page title below the mobile header', () => {
        expect(viewSource).not.toContain('manual-validation-title visible-xs-block');
    });

    it('does not add extra top margin before the form content', () => {
        expect(viewSource).not.toMatch(/margin-top:\s*4rem/);
    });
});
