import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UserRatingsCounts.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UserRatingsCounts.vue', () => {
    it('renders thumbs-up and thumbs-down icons with positive and negative counts', () => {
        expect(viewSource).toContain('fa-thumbs-up');
        expect(viewSource).toContain('fa-thumbs-down');
        expect(viewSource).toContain('ratings.positive');
        expect(viewSource).toContain('ratings.negative');
        expect(viewSource).toContain('user-ratings-counts');
    });

    it('does not render when ratings prop is null', () => {
        expect(viewSource).toMatch(/v-if="visible"/);
        expect(viewSource).toMatch(/ratings\s*!=\s*null/);
    });
});
