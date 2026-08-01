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
        expect(wizardSource).toContain('draftSavingEnabled');
        expect(wizardSource).toContain('beforeUnmount()');
        expect(wizardSource).toContain('cancelDraftSave');
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

    it('styles the no-lucrar validation message prominently below the checkbox', () => {
        expect(wizardSource).toContain('new-trip-wizard__lucrar-error');
        expect(wizardSource).toContain('stepErrors.lastDetails');
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__lucrar-error\s*\{[^}]*color:\s*#ff0000/
        );
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__lucrar-error\s*\{[^}]*font-size:\s*1rem/
        );
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__lucrar-error\s*\{[^}]*margin-top:\s*1\.25rem/
        );
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
        expect(templateUtilSource).toContain('resolveTemplateScheduleTime');
        expect(templateUtilSource).toContain('getDefaultTripCreationTime');
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

    it('closes the template modal before applying selected template data', () => {
        expect(wizardSource).toMatch(
            /onSelectTemplate\(templateName, templateData\)\s*\{[\s\S]*?closeTemplateModal\(\);[\s\S]*?applyTripCreationTemplateToForm\(this\.form, templateData,[\s\S]*?\)/
        );
    });

    it('uses the default trip creation schedule time when applying templates', () => {
        expect(wizardSource).toContain('useDefaultScheduleTime: true');
        expect(templateUtilSource).toContain('getDefaultTripCreationTime');
        expect(templateUtilSource).toContain('useDefaultScheduleTime');
        expect(templateUtilSource).toMatch(
            /applyTripCreationTemplateToForm\([\s\S]*getDefaultTripCreationTime\(/
        );
    });

    it('offers saved templates on step 1 when the user has any', () => {
        expect(wizardSource).toContain('refreshAvailableTemplates');
        expect(wizardSource).toContain('activated()');
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

    it('detects edit flow from route id before trip data finishes loading', () => {
        expect(wizardSource).toContain('isEditTripFlow');
        expect(wizardSource).toMatch(
            /isEditTripFlow\(\)\s*\{[\s\S]*form\.id[\s\S]*form\.updatingTrip/
        );
        expect(wizardSource).toMatch(
            /mounted\(\)[\s\S]*isEditTripFlow[\s\S]*STEP\.ORIGIN/
        );
        expect(wizardSource).toMatch(
            /stepQueryContext\(\)[\s\S]*isEdit:\s*this\.isEditTripFlow/
        );
        expect(wizardSource).toContain('currentStep === STEP.ROLE && !isEditTripFlow');
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
        expect(newTripSource).toContain('TRIP_INFO_STATUS.LOADING');
        expect(newTripSource).toContain('TRIP_INFO_STATUS.READY');
        expect(newTripSource).toMatch(
            /calcRoute\(type\)[\s\S]*tripInfoStatus = TRIP_INFO_STATUS\.LOADING/s
        );
    });
});

describe('NewTripCreationWizard.vue redesign styling', () => {
    it('does not render the duplicate blue wizard title (page heading covers it)', () => {
        expect(wizardSource).not.toContain('new-trip-wizard__title');
        expect(wizardSource).not.toContain('wizardTitle');
        expect(wizardSource).not.toContain("$t('crearViajeTitulo')");
        expect(wizardSource).not.toContain("$t('tripCreationTitleDriver')");
        expect(wizardSource).not.toContain("$t('tripCreationTitlePassenger')");
    });

    it('uses AppButton primary for Siguiente and Crear viaje / Actualizar', () => {
        expect(wizardSource).toContain('AppButton');
        expect(wizardSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?data-testid="trip-creation-next"/
        );
        expect(wizardSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?data-testid="trip-creation-submit"/
        );
        expect(wizardSource).not.toMatch(
            /btn btn-primary btn-lg new-trip-wizard__next/
        );
        expect(wizardSource).not.toMatch(
            /btn btn-primary btn-lg new-trip-wizard__submit/
        );
    });

    it('applies design-system input styles to form controls and textareas', () => {
        expect(wizardSource).toMatch(
            /\.new-trip-wizard[\s\S]*?\.form-control[\s\S]*?border:\s*1px\s+solid\s+var\(--ds-input-border/
        );
        expect(wizardSource).toMatch(
            /\.new-trip-wizard[\s\S]*?\.form-control[\s\S]*?color:\s*var\(--ds-input-text/
        );
    });

    it('keeps foreign-origin checkbox label in regular text color, not blue', () => {
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__allow-foreign[\s\S]*?label[\s\S]*?color:\s*var\(--ds-(?:text-primary|input-label)/
        );
    });

    it('styles active role cards with design-system blue, not brand red', () => {
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__role-card--active\s*\{[^}]*border-color:\s*var\(--ds-action/
        );
        expect(wizardSource).toMatch(
            /\.new-trip-wizard__role-card-icon\s*\{[^}]*color:\s*var\(--ds-action/
        );
        expect(wizardSource).not.toMatch(
            /\.new-trip-wizard__role-card--active\s*\{[^}]*border-color:\s*var\(--primary-color/
        );
    });

    it('avoids double borders on date and fixes time icon padding', () => {
        expect(wizardSource).toMatch(
            /\.date-picker\s+\.picker\.form-control[\s\S]*?\.dp__input[\s\S]*?border:\s*0/
        );
        expect(wizardSource).toMatch(
            /\.date-picker--cross\)?\s*\{[^}]*transform:\s*translateY\(-50%\)/
        );
        expect(wizardSource).toMatch(
            /\.form-control-time[\s\S]*?padding-left:\s*(?:2\.5rem|2\.75rem|3rem)/
        );
        expect(wizardSource).toMatch(
            /form-control-time::-webkit-calendar-picker-indicator[\s\S]*?(?:display:\s*none|opacity:\s*0)/
        );
    });

    it('keeps a calendar icon on the date input in the schedule step', () => {
        expect(wizardSource).toMatch(
            /\.carpoolear-vue-dp\s+\.dp__input[\s\S]*?background-image:\s*url\(["']?data:image\/svg\+xml/
        );
        expect(wizardSource).not.toMatch(
            /\.carpoolear-vue-dp\s+\.dp__input[\s\S]{0,400}?background-image:\s*none\s*!important/
        );
    });

    it('opens the native time picker from a down-caret control', () => {
        expect(wizardSource).toContain('fa-chevron-down');
        expect(wizardSource).toContain('new-trip-wizard__time-caret');
        expect(wizardSource).toContain('openWizardTimePicker');
        expect(wizardSource).toContain('showPicker');
        expect(wizardSource).toContain('ref="wizardTimeInput"');
    });

    it('shows punto partida only on origin and punto llegada only on destination', () => {
        const originBlock = wizardSource.match(
            /currentStep === STEP\.ORIGIN[\s\S]*?(?=currentStep === STEP\.DESTINATION)/
        )?.[0];
        const destinationBlock = wizardSource.match(
            /currentStep === STEP\.DESTINATION[\s\S]*?(?=currentStep === STEP\.STOPS|<!-- Step)/
        )?.[0];

        expect(originBlock).toBeTruthy();
        expect(destinationBlock).toBeTruthy();
        expect(originBlock).toContain('fields="partida"');
        expect(originBlock).not.toContain('fields="llegada"');
        expect(destinationBlock).toContain('fields="llegada"');
        expect(destinationBlock).not.toContain('fields="partida"');
    });

    it('keeps left padding on map autocomplete so pin icons do not overlap text', () => {
        expect(wizardSource).toMatch(
            /\.form-control-map-autocomplete[\s\S]*?padding-left:\s*(?:2\.5rem|2\.75rem|3rem)/
        );
        expect(wizardSource).toContain('location-autocomplete origin');
        expect(wizardSource).toContain('location-autocomplete destiny');
    });

    it('requires punto partida and llegada before leaving origin and destination steps', () => {
        expect(wizardSource).toContain('puntoPartida: this.form.trip.punto_partida');
        expect(wizardSource).toContain('puntoLlegada: this.form.trip.punto_llegada');
        expect(wizardSource).toContain('syncPuntoDetailErrors');
        expect(wizardSource).toMatch(
            /validateCurrentStep\(\)[\s\S]*syncPuntoDetailErrors/
        );
        expect(wizardSource).toContain('puntoPartidaError');
        expect(wizardSource).toContain('puntoLlegadaError');
    });

    it('on submit failure navigates to the car step when car selection is missing', () => {
        expect(wizardSource).toMatch(
            /async onSubmit\(\)[\s\S]*await this\.form\.save\(\)/
        );
        expect(wizardSource).toContain('handleSaveFailure');
        expect(wizardSource).toMatch(
            /handleSaveFailure\(\)[\s\S]*carSelectionError[\s\S]*STEP\.CAR/
        );
    });
});
