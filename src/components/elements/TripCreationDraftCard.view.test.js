import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationDraftCard.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCreationDraftCard.vue', () => {
    it('re-reads draft state when the card is refreshed', () => {
        expect(componentSource).toContain('draftVisible');
        expect(componentSource).toContain('refresh()');
        expect(componentSource).toContain('hasTripCreationDraft(this.user.id)');
        expect(componentSource).toContain('activated()');
    });
});
