import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UserRatingsCounts.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UserRatingsCounts.vue', () => {
    it('renders positive, neutral, and negative rating counts', () => {
        expect(viewSource).toContain('fa-thumbs-up');
        expect(viewSource).toContain('fa-thumbs-down');
        expect(viewSource).toContain('ratings.positive');
        expect(viewSource).toContain('ratings.neutral');
        expect(viewSource).toContain('ratings.negative');
        expect(viewSource).toContain('user-ratings-counts');
        expect(viewSource).toContain('user-ratings-counts__icon-slot');
        expect(viewSource).toContain('user-ratings-counts__icon-slot--neutral');
        expect(viewSource).toContain('rate-neutral-icon');
        expect(viewSource).toMatch(/\.rate-neutral-icon\s*\{[\s\S]*transform:\s*rotate\(-90deg\)/);
    });

    it('uses profile-matching green and red icon colors with spaced icon-number pairs', () => {
        expect(viewSource).toContain('user-ratings-counts__icon--positive');
        expect(viewSource).toContain('user-ratings-counts__icon--negative');
        expect(viewSource).toContain('color: #59b200');
        expect(viewSource).toContain('color: red');
        expect(viewSource).toContain('user-ratings-counts__pair--positive');
        expect(viewSource).toContain('user-ratings-counts__pair--negative');
        expect(viewSource).toMatch(
            /\.user-ratings-counts__pair--positive[\s\S]*gap:\s*0\.55em/
        );
        expect(viewSource).toMatch(
            /\.rate-neutral-icon\s*\{[\s\S]*translateY\(0\.12em\)/
        );
    });

    it('does not render when ratings prop is null', () => {
        expect(viewSource).toMatch(/v-if="visible"/);
        expect(viewSource).toMatch(/ratings\s*!=\s*null/);
    });
});
