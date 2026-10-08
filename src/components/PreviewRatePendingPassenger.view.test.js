import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(
    __dirname,
    'PreviewRatePendingPassenger.vue'
);
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('PreviewRatePendingPassenger.vue', () => {
    it('renders RatePending with the passenger preview fixture and auto-expands comments', () => {
        expect(viewSource).toContain('RatePending');
        expect(viewSource).toContain('RATE_PENDING_PASSENGER_PREVIEW_RATE');
        expect(viewSource).toContain('setRate(1)');
    });
});
