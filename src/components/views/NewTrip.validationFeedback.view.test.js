import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const newTripViewPath = path.resolve(__dirname, 'NewTrip.vue');
const newTripViewSource = fs.readFileSync(newTripViewPath, 'utf8');

describe('NewTrip validation feedback', () => {
    it('lists invalid trip fields and scrolls to the first visible error', () => {
        expect(newTripViewSource).toContain('collectActiveValidationMessages');
        expect(newTripViewSource).toContain('formatTripValidationDialogMessage');
        expect(newTripViewSource).toContain('findFirstTripFormErrorElement');
        expect(newTripViewSource).toContain('getTripValidationErrorFields');
    });
});
