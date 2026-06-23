import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'RateItem.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('RateItem.vue neutral ratings', () => {
    it('displays positive, neutral, and negative rating labels and icons', () => {
        expect(viewSource).toContain('isPositiveRating');
        expect(viewSource).toContain('isNeutralRating');
        expect(viewSource).toContain('isNegativeRating');
        expect(viewSource).toContain('rateItemNeutral');
        expect(viewSource).toContain('rate-neutral-icon');
        expect(viewSource).toMatch(
            /\.rate-item-value\s+\.rate-neutral-icon\s*\{[\s\S]*margin-left:\s*0\.6em/
        );
    });
});

describe('RateItem.vue profile links', () => {
    it('links rating and reference author names to their profile', () => {
        expect(viewSource).toContain('authorProfileRoute');
        expect(viewSource).toContain('rate-item-author-link');
        expect(viewSource).toContain("name: 'profile'");
        expect(viewSource).toContain('userProfile: this.rate.from');
    });
});
