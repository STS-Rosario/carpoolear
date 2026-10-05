import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'YourTrips.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('YourTrips donation checkout', () => {
    it('starts tracked platform checkout instead of hardcoded Mercado Pago links', () => {
        expect(viewSource).toContain('startDonationCheckout');
        expect(viewSource).not.toContain('mpago.la');
        expect(viewSource).toContain("source: 'your_trips'");
    });
});
