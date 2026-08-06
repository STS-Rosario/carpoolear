import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from './i18n';

const wizardPath = path.resolve(
    __dirname,
    '../components/views/NewTripCreationWizard.vue'
);
const wizardSource = fs.readFileSync(wizardPath, 'utf8');

describe('trip creation role card labels', () => {
    it('uses Conduzco and Voy de acompañante titles', () => {
        expect(messages.arg.tripCreationRoleDriverTitle).toBe('Conduzco');
        expect(messages.arg.tripCreationRolePassengerTitle).toBe(
            'Voy de acompañante'
        );
        expect(messages.chl.tripCreationRoleDriverTitle).toBe('Conduzco');
        expect(messages.chl.tripCreationRolePassengerTitle).toBe(
            'Voy de acompañante'
        );
        expect(messages.en.tripCreationRoleDriverTitle).toBe('I drive');
        expect(messages.en.tripCreationRolePassengerTitle).toBe(
            'I ride as a passenger'
        );
    });

    it('does not render role card explainer descriptions', () => {
        expect(wizardSource).not.toContain('tripCreationRoleDriverDescription');
        expect(wizardSource).not.toContain(
            'tripCreationRolePassengerDescription'
        );
        expect(wizardSource).not.toContain('new-trip-wizard__role-card-text');
    });
});
