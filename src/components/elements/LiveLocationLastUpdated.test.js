import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'LiveLocationLastUpdated.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('LiveLocationLastUpdated.vue', () => {
    it('shows formatted last update when recordedAt is provided', () => {
        expect(componentSource).toContain('formatLiveLocationUpdatedAt');
        expect(componentSource).toContain('liveLocationLastUpdated');
        expect(componentSource).toContain('recordedAt');
    });
});
