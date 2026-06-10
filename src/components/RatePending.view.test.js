import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'RatePending.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('RatePending.vue neutral ratings', () => {
    it('offers positive, neutral, and negative rating buttons', () => {
        expect(viewSource).toContain('rate-positive');
        expect(viewSource).toContain('rate-neutral');
        expect(viewSource).toContain('rate-negative');
        expect(viewSource).toContain('setRate(1)');
        expect(viewSource).toContain('setRate(2)');
        expect(viewSource).toContain('setRate(0)');
    });

    it('uses shared vote validation for mandatory neutral comments', () => {
        expect(viewSource).toContain("from '../utils/tripRating'");
        expect(viewSource).toContain('canSubmitRatingVote');
    });

    it('styles neutral icon as rotated greyscale thumbs-up', () => {
        expect(viewSource).toContain('fa-thumbs-o-up');
        expect(viewSource).toContain('rate-neutral-icon');
        expect(viewSource).toContain('NEUTRAL_RATING_ICON_STYLE');
    });
});
