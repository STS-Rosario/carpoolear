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

    it('shows the validation summary after all field checks complete', () => {
        expect(newTripViewSource).toContain('showTripValidationSummary');
        expect(newTripViewSource).not.toMatch(
            /else if \(globalError\) \{\s*dialogs\.message\(this\.\$t\('algunosDatosNoValidos'\)/
        );
    });

    it('renders an in-form validation summary before submit actions', () => {
        expect(newTripViewSource).toContain('TripFormValidationSummary');
        expect(newTripViewSource).toContain('formValidationAttempted');
        expect(newTripViewSource).toContain('activeFormValidationMessages');
        expect(newTripViewSource).toContain('tripFormValidationSummaryBindings');
    });

    it('clears description and no-lucrar errors when those fields change', () => {
        expect(newTripViewSource).toContain("'trip.description': function ()");
        expect(newTripViewSource).toContain('this.commentError.state = false');
        expect(newTripViewSource).toContain('no_lucrar()');
        expect(newTripViewSource).toContain('this.lucrarError.state = false');
    });
});
