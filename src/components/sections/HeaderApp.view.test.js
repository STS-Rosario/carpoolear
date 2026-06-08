import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'HeaderApp.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('HeaderApp.vue chat user ratings', () => {
    it('renders ratings below the subtitle in the mobile action bar', () => {
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('headerRatings');
        expect(viewSource).toContain('header--with-ratings');
        expect(viewSource).toMatch(
            /header--subtitle[\s\S]*UserRatingsCounts/s
        );
    });
});
