import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const wizardSource = fs.readFileSync(
    path.resolve(__dirname, 'NewTripCreationWizard.vue'),
    'utf8'
);

describe('NewTripCreationWizard contribution excess modal spacing', () => {
    it('zeros the full modal-body margin so Modal default 20px cannot stack on padding', () => {
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__contribution-excess-modal :deep\(\.modal-container \.modal-body\) \{[\s\S]*?margin:\s*0;/
        );
    });

    it('removes the shared modal container gap between title and body', () => {
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__contribution-excess-modal\.modal-mask :deep\(\.modal-wrapper \.modal-container\) \{[\s\S]*?gap:\s*0;/
        );
    });
});
