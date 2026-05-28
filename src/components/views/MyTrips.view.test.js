import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'MyTrips.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('MyTrips.vue donation modal', () => {
    it('uses shared donation picker and Mercado Pago helpers', () => {
        expect(viewSource).toContain('DonationAmountPicker');
        expect(viewSource).toContain('getDonationOnceUrl');
        expect(viewSource).toContain('getDonationMonthlyUrl');
        expect(viewSource).not.toContain('value="2000"');
        expect(viewSource).not.toContain('value="5000"');
        expect(viewSource).not.toContain('value="10000"');
    });
});
