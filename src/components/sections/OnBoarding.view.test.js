import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'OnBoarding.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('OnBoarding', () => {
    it('does not keep the dead single-card branch without click handlers', () => {
        expect(viewSource).not.toContain('<template v-else>');
        expect(viewSource).toContain('v-if="cardsLength > 0"');
    });
});
