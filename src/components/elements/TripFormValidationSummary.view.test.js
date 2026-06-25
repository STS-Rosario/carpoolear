import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, '../elements/TripFormValidationSummary.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripFormValidationSummary', () => {
    it('renders a visible list of validation messages at the end of the form', () => {
        expect(componentSource).toContain('trip-form-validation-summary');
        expect(componentSource).toContain('v-for="(message, index) in messages"');
        expect(componentSource).toContain('v-if="shouldShow"');
        expect(componentSource).toContain('shouldShowTripFormValidationSummary');
    });
});
