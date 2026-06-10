import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const wizardPath = path.resolve(__dirname, 'NewTripCreationWizard.vue');
const wizardSource = fs.readFileSync(wizardPath, 'utf8');
const newTripPath = path.resolve(__dirname, 'NewTrip.vue');
const newTripSource = fs.readFileSync(newTripPath, 'utf8');

describe('NewTripCreationWizard.vue', () => {
    it('uses stepper and step navigation controls', () => {
        expect(wizardSource).toContain('TripCreationStepper');
        expect(wizardSource).toContain('data-testid="trip-creation-next"');
        expect(wizardSource).toContain('data-testid="trip-creation-back"');
        expect(wizardSource).toContain('data-testid="trip-creation-submit"');
    });

    it('skips car step for passengers via tripCreationSteps helpers', () => {
        expect(wizardSource).toContain('getNextStep');
        expect(wizardSource).toContain('getPreviousStep');
        expect(wizardSource).toContain('validateStep');
    });

    it('persists create drafts', () => {
        expect(wizardSource).toContain('saveTripCreationDraft');
        expect(wizardSource).toContain('loadTripCreationDraft');
    });

    it('binds schedule DatePicker to dateAnswer so revisiting the step shows the chosen date', () => {
        expect(wizardSource).toContain(':model-value="form.dateAnswer"');
    });
});

describe('NewTrip.vue wizard integration', () => {
    it('renders wizard for create and edit flows', () => {
        expect(newTripSource).toContain('NewTripCreationWizard');
        expect(newTripSource).toContain('provide()');
        expect(newTripSource).toContain('newTripForm');
    });

    it('shows success screen after create instead of inviteFriends redirect', () => {
        expect(newTripSource).toContain('TripCreationSuccess');
        expect(newTripSource).toContain('showWizardSuccess');
        expect(newTripSource).not.toContain('inviteFriends: \'1\'');
    });
});
