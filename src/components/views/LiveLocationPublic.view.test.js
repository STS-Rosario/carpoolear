import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'LiveLocationPublic.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('LiveLocationPublic.vue', () => {
    it('shows map, driver profile link, and ratings', () => {
        expect(viewSource).toContain('live-location-map');
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('fetchPublicView');
        expect(viewSource).toContain('beginViewerPolling');
        expect(viewSource).toContain('loadingData');
        expect(viewSource).not.toMatch(/:data="loaded"/);
    });
});
