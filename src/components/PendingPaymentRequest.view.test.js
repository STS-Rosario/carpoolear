import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'PendingPaymentRequest.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('PendingPaymentRequest.vue destination city', () => {
    it('does not read trip.points without a helper', () => {
        expect(viewSource).not.toMatch(
            /trip\.points\[trip\.points\.length/
        );
        expect(viewSource).toContain('getTripDestinationCity');
        expect(viewSource).toContain("from '../utils/ongoingTrip'");
    });
});
