import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'HeaderApp.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('HeaderApp changelog navigation', () => {
    it('offers últimos cambios after mesa de ayuda in profile dropdowns', () => {
        expect(viewSource).toContain('ultimosCambios');
        expect(viewSource).toContain('openChangelog');
        expect(viewSource).toContain('showChangelogNav');
        expect(viewSource).toMatch(
            /\$t\('soporte'\)[\s\S]*showChangelogNav[\s\S]*\$t\('ultimosCambios'\)/
        );
    });
});

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
