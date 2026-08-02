import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'OnBoarding.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('OnBoarding CTA AppButtons', () => {
    it('uses AppButton primary/secondary for card navigation and start', () => {
        expect(viewSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?anterior/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?complete[\s\S]*?comenzar/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?siguiente/
        );
        expect(viewSource).not.toContain('btn btn-primary');
        expect(viewSource).not.toContain('btn btn-success');
        expect(viewSource).not.toContain('btn btn-secondary');
    });

    it('does not keep the dead single-card branch without click handlers', () => {
        expect(viewSource).not.toContain('<template v-else>');
        expect(viewSource).toContain('v-if="cardsLength > 0"');
    });
});
