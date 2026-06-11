import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const wizardPath = path.resolve(__dirname, 'NewTripCreationWizard.vue');
const wizardSource = fs.readFileSync(wizardPath, 'utf8');
const templateUtilPath = path.resolve(__dirname, '../../utils/tripCreationTemplate.js');
const templateUtilSource = fs.readFileSync(templateUtilPath, 'utf8');
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

    it('opens TripCarsModal from the car step editar autos action', () => {
        expect(wizardSource).toContain('@edit-cars="form.openTripCarsModal"');
    });

    it('uses icon padding on seat contribution input and spaced rear-comfort label', () => {
        expect(wizardSource).toContain(
            'form-control form-control-with-icon form-control-price'
        );
        expect(wizardSource).toContain('trip-comfort-preference__label');
    });

    it('uses a taller resizable description textarea', () => {
        expect(wizardSource).toContain('new-trip-wizard__description');
        expect(wizardSource).toContain('resize: vertical');
    });

    it('restores last-details lucrar card and preference card styling', () => {
        expect(wizardSource).toContain('trip_terms--lucrar-card__copy');
        expect(wizardSource).toContain('viajeColaborativoLead');
        expect(wizardSource).toContain('trip-pref-card__badge');
        expect(wizardSource).toContain('col-xs-8 trip-pref-cards__cell');
        expect(wizardSource).toContain('new-trip-wizard__last-section--preferences');
        expect(wizardSource).not.toContain('new-trip-wizard__last-section--return');
        expect(wizardSource).not.toContain('cargarViajeRegreso');
    });

    it('adds bottom margin below foreign-country option on origin step', () => {
        expect(wizardSource).toContain('new-trip-wizard__allow-foreign');
        expect(wizardSource).toContain('.new-trip-wizard__allow-foreign');
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__allow-foreign\s*\{[^}]*margin-bottom:\s*1rem/
        );
    });

    it('restores cleared schedule fields from return-trip draft without keeping outbound values', () => {
        expect(wizardSource).toContain('applyTripCreationTemplateToForm(this.form, draft)');
        expect(templateUtilSource).toContain("'dateAnswer' in templateData");
        expect(templateUtilSource).toContain("'date' in templateData");
        expect(templateUtilSource).toContain("'time' in templateData");
    });

    it('shows role selection only on step 1 without persistent top toggle', () => {
        expect(wizardSource).toContain('currentStep === STEP.ROLE');
        expect(wizardSource).toContain('tripCreationStepRoleQuestion');
        expect(wizardSource).toContain('tripCreationRoleDriverTitle');
        expect(wizardSource).toContain('tripCreationRolePassengerTitle');
        expect(wizardSource).not.toMatch(
            /new-trip-wizard__type[\s\S]*v-if="!form\.updatingTrip"/
        );
    });

    it('offers saved templates on step 1 when the user has any', () => {
        expect(wizardSource).toContain('data-testid="trip-creation-use-template"');
        expect(wizardSource).toContain("$t('tripCreationUseTemplate')");
        expect(wizardSource).toContain("$t('tripCreationChooseTemplateTitle')");
        expect(wizardSource).toContain("$t('tripCreationChooseTemplatePlaceholder')");
        expect(wizardSource).toContain("$t('tripCreationOr')");
        expect(wizardSource).toContain('new-trip-wizard__template-or');
        expect(wizardSource).toContain('fa-bookmark');
        expect(wizardSource).toContain('listTripCreationTemplates');
        expect(wizardSource).toContain('loadTripCreationTemplate');
        expect(wizardSource).toContain('applyTripCreationTemplateToForm');
        expect(wizardSource).toContain('getWizardNavigationAfterTemplateApply');
        expect(wizardSource).toContain('data-testid="trip-creation-template-select"');
        expect(wizardSource).toContain('onTemplateSelectChange');
        expect(wizardSource).toContain('new-trip-wizard__template-modal');
        expect(wizardSource).toContain('color-black');
        expect(wizardSource).not.toContain('new-trip-wizard__template-list');
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__template-action\s*\{[^}]*justify-content:\s*center/
        );
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__template-button\s*\{[^}]*width:\s*auto/
        );
        expect(wizardSource).toMatch(
            /v-if="[^"]*hasAvailableTemplates[^"]*"[\s\S]*new-trip-wizard__template-or[\s\S]*new-trip-wizard__role-cards/
        );
    });

    it('offers intermediate stops checkbox on destination and a dedicated stops step', () => {
        expect(wizardSource).toContain('wantsIntermediateStops');
        expect(wizardSource).toContain('tripCreationWantsIntermediateStops');
        expect(wizardSource).toContain('currentStep === STEP.STOPS');
        expect(wizardSource).toContain('tripCreationStepStopsQuestion');
        expect(wizardSource).toContain('form.addPoint');
        expect(wizardSource).toContain('wantsIntermediateStops');
    });

    it('passes intermediate-stop preference into step navigation', () => {
        expect(wizardSource).toContain('navigationOptions');
        expect(wizardSource).toContain('wantsIntermediateStops');
        expect(wizardSource).toContain('removeEmptyIntermediatePoints');
    });

    it('syncs wizard steps to the step query param for deep links', () => {
        expect(wizardSource).toContain('tripCreationStepQuery');
        expect(wizardSource).toContain('syncStepToRoute');
        expect(wizardSource).toContain('applyStepFromRouteQuery');
        expect(wizardSource).toMatch(/trip-creation-wizard-step-\$\{currentStep\}/);
    });

    it('adds horizontal padding on mobile', () => {
        expect(wizardSource).toMatch(
            /@media \(max-width: 767px\)[\s\S]*\.new-trip-wizard[\s\S]*padding-left:\s*1rem/
        );
    });

    it('disables next on destination until trip-info succeeds', () => {
        expect(wizardSource).toContain('shouldDisableTripCreationNext');
        expect(wizardSource).toContain('form.tripInfoStatus');
        expect(wizardSource).toMatch(
            /data-testid="trip-creation-next"[\s\S]*:disabled="isNextDisabled"/
        );
        expect(wizardSource).toMatch(
            /goNext\(\)[\s\S]*shouldDisableTripCreationNext\([\s\S]*form\.tripInfoStatus/
        );
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

    it('starts return trip creation from success with inverted draft', () => {
        expect(newTripSource).toContain(
            '@start-return-trip="startReturnTripCreation"'
        );
        expect(newTripSource).toContain('buildReturnTripCreationDraftFromSnapshot');
        expect(newTripSource).toContain('parentTripId');
    });

    it('filters empty intermediate points before saving trip data', () => {
        expect(newTripSource).toContain('filterTripPointsForSave');
        expect(newTripSource).toContain('removeEmptyIntermediatePoints');
        expect(newTripSource).toContain('wantsIntermediateStops');
    });

    it('tracks trip-info status while calculating route info', () => {
        expect(newTripSource).toContain('tripInfoStatus');
        expect(newTripSource).toContain("TRIP_INFO_STATUS.LOADING");
        expect(newTripSource).toContain("TRIP_INFO_STATUS.READY");
        expect(newTripSource).toMatch(
            /calcRoute\(type\)[\s\S]*tripInfoStatus = TRIP_INFO_STATUS\.LOADING/s
        );
    });
});
