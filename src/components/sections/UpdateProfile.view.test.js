import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UpdateProfile.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UpdateProfile missing field routing', () => {
    it('exposes the patente input as a scroll target', () => {
        expect(viewSource).toContain('for="input-patente"');
        expect(viewSource).toContain('id="input-patente"');
        expect(viewSource).toContain('ref="patenteInput"');
    });

    it('scrolls to patente when route query requests the missing patente field', () => {
        expect(viewSource).toContain("this.$route.query.missing !== 'patente'");
        expect(viewSource).toContain('this.$refs.patenteInput');
        expect(viewSource).toContain(
            'this.$scrollToElement(this.$refs.patenteInput, -270)'
        );
    });

    it('highlights the patente field when route query requests it', () => {
        expect(viewSource).toContain('missing-field-highlight');
        expect(viewSource).toContain('shouldHighlightPatente');
        expect(viewSource).toContain("this.$route.query.missing === 'patente'");
    });
});
