// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import i18n from '../../i18n';
import { STEP } from '../../utils/tripCreationSteps.js';
import NewTripCreationWizard from './NewTripCreationWizard.vue';

// The route panel imports the app entry (main.js), which boots the whole app
// and hits the API; the map is irrelevant for these step-navigation tests.
vi.mock('../elements/TripCreationRoutePanel.vue', () => ({
    default: { name: 'TripCreationRoutePanel', render: () => null }
}));

const EXCESSIVE_DESCRIPTION = 'La contribución es de $24000 por persona';
const TITLE = 'Posible exceso de contribución';

function createError() {
    return { state: false, message: '' };
}

function createForm(overrides = {}) {
    return reactive({
        id: null,
        updatingTrip: null,
        user: null,
        saving: false,
        config: {
            module_seat_price_enabled: true,
            module_max_price_enabled: true,
            weekly_schedule: false,
            country_name: 'Argentina'
        },
        trip: {
            is_passenger: 0,
            description: '',
            total_seats: 2,
            punto_partida: 'Plaza',
            punto_llegada: 'Terminal',
            allow_kids: false,
            allow_smoking: false,
            allow_animals: false,
            autoaccept_friends_requests: true
        },
        points: [
            { name: 'Rosario', json: { id: 1 }, error: createError() },
            { name: 'Córdoba', json: { id: 2 }, error: createError() }
        ],
        price: '15000',
        no_lucrar: false,
        cars: [],
        passengers: 0,
        wantsIntermediateStops: false,
        tripInfoStatus: 'ready',
        // Maximum allowed contribution from trip-info: $100000 trip, $20000 per seat.
        maximum_seat_price_cents: 2000000,
        maximum_trip_price_cents: 10000000,
        recommended_seat_price_cents: 0,
        contributionPricingBreakdown: null,
        contribucionRecomendadaCardDescripcionText: '',
        tripFormValidationSummaryBindings: {},
        priceError: createError(),
        commentError: createError(),
        lucrarError: createError(),
        puntoPartidaError: createError(),
        puntoLlegadaError: createError(),
        dateError: createError(),
        timeError: createError(),
        seatsError: createError(),
        carSelectionError: createError(),
        tripStaticImg: () => '',
        onOutboundPriceFieldInput: () => {},
        $t: (key) => key,
        ...overrides
    });
}

const mounted = [];

async function mountWizard(form = createForm()) {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/trips/create', name: 'new-trip', component: { render: () => null } }
        ]
    });
    router.push('/trips/create');
    await router.isReady();

    const wrapper = mount(NewTripCreationWizard, {
        attachTo: document.body,
        props: { draftSavingEnabled: false },
        global: {
            plugins: [router, i18n],
            provide: { newTripForm: form },
            directives: { clickoutside: {} },
            stubs: {
                TripCreationStepper: true,
                TripCreationRoutePanel: true,
                TripCarStepPanel: true,
                TripSeatMapPanel: true,
                TripContributionStepPanel: true,
                TripPreferencesStepPanel: true,
                TripReviewStepPanel: true,
                TripFormValidationSummary: true,
                TripPointDetailFields: true,
                DatePicker: true,
                autocomplete: true,
                WeeklySchedule: true,
                SvgItem: true,
                AppField: true
            }
        }
    });
    mounted.push(wrapper);
    await flushPromises();

    return { wrapper, form };
}

async function goToStep(wrapper, step) {
    wrapper.vm.setCurrentStep(step);
    await flushPromises();
}

async function clickNext(wrapper) {
    await wrapper.find('[data-testid="trip-creation-next"]').trigger('click');
    await flushPromises();
}

function excessModal() {
    return document.querySelector('[data-testid="trip-contribution-excess-modal"]');
}

describe('NewTripCreationWizard contribution excess modal', () => {
    afterEach(() => {
        while (mounted.length) {
            mounted.pop().unmount();
        }
        document.body.innerHTML = '';
    });

    it('shows the modal when leaving the description step with an amount above the maximum allowed contribution', async () => {
        const { wrapper, form } = await mountWizard();
        await goToStep(wrapper, STEP.DESCRIPTION);
        form.trip.description = EXCESSIVE_DESCRIPTION;

        await clickNext(wrapper);

        expect(excessModal()).not.toBeNull();
        expect(document.body.textContent).toContain(TITLE);
        expect(document.body.textContent).toContain(
            'Detectamos un posible exceso de contribución.'
        );
        expect(wrapper.vm.currentStep).toBe(STEP.DESCRIPTION);
    });

    it('renders the body as three translated paragraphs', async () => {
        const { wrapper, form } = await mountWizard();
        await goToStep(wrapper, STEP.DESCRIPTION);
        form.trip.description = EXCESSIVE_DESCRIPTION;
        await clickNext(wrapper);

        const paragraphs = [...excessModal().querySelectorAll('p')].map((p) =>
            p.textContent.trim()
        );
        expect(paragraphs).toEqual([
            'Detectamos un posible exceso de contribución. Te comentamos que está prohibido pedir una contribución mayor a la máxima estipulada, y de ser así, resultará en una suspensión de la cuenta.',
            'Si no es así, te pedimos disculpas, es un checkeo automático que puede fallar.',
            'Muchas gracias por hacer Carpoolear más justo.'
        ]);
    });

    it('offers a single Entendido button, no footer, and closes on click', async () => {
        const { wrapper, form } = await mountWizard();
        await goToStep(wrapper, STEP.DESCRIPTION);
        form.trip.description = EXCESSIVE_DESCRIPTION;
        await clickNext(wrapper);

        const modalContainer = excessModal().closest('.modal-container');
        expect(modalContainer.querySelector('.modal-footer')).toBeNull();
        const buttons = [...modalContainer.querySelectorAll('.modal-body button')];
        expect(buttons.map((button) => button.textContent.trim())).toEqual(['Entendido']);

        buttons[0].click();
        await flushPromises();

        expect(excessModal()).toBeNull();
    });

    it('shows the modal when leaving the contribution step with a description already filled', async () => {
        const { wrapper, form } = await mountWizard();
        form.trip.description = EXCESSIVE_DESCRIPTION;
        await goToStep(wrapper, STEP.CONTRIBUTION);

        await clickNext(wrapper);

        expect(excessModal()).not.toBeNull();
        expect(wrapper.vm.currentStep).toBe(STEP.CONTRIBUTION);
    });

    it('does not show the modal again in the same wizard session', async () => {
        const { wrapper, form } = await mountWizard();
        await goToStep(wrapper, STEP.DESCRIPTION);
        form.trip.description = EXCESSIVE_DESCRIPTION;
        await clickNext(wrapper);
        document
            .querySelector('[data-testid="trip-contribution-excess-confirm"]')
            .click();
        await flushPromises();

        await clickNext(wrapper);
        expect(wrapper.vm.currentStep).toBe(STEP.LAST_DETAILS);

        await wrapper.find('[data-testid="trip-creation-back"]').trigger('click');
        await flushPromises();
        await clickNext(wrapper);
        await goToStep(wrapper, STEP.CONTRIBUTION);
        await clickNext(wrapper);

        expect(excessModal()).toBeNull();
        expect(wrapper.vm.currentStep).toBe(STEP.DESCRIPTION);
    });

    it('shows the modal again for a new trip creation', async () => {
        const first = await mountWizard();
        await goToStep(first.wrapper, STEP.DESCRIPTION);
        first.form.trip.description = EXCESSIVE_DESCRIPTION;
        await clickNext(first.wrapper);
        document
            .querySelector('[data-testid="trip-contribution-excess-confirm"]')
            .click();
        await flushPromises();
        first.wrapper.unmount();
        mounted.length = 0;

        const second = await mountWizard();
        await goToStep(second.wrapper, STEP.DESCRIPTION);
        second.form.trip.description = EXCESSIVE_DESCRIPTION;
        await clickNext(second.wrapper);

        expect(excessModal()).not.toBeNull();
    });

    it('does not show the modal when the description asks more than the chosen price but within the maximum', async () => {
        const { wrapper, form } = await mountWizard();
        await goToStep(wrapper, STEP.DESCRIPTION);
        form.trip.description = 'Contribución $18000, salgo puntual';

        await clickNext(wrapper);

        expect(excessModal()).toBeNull();
        expect(wrapper.vm.currentStep).toBe(STEP.LAST_DETAILS);
    });

    it('does not show the modal when there is no maximum allowed contribution', async () => {
        const form = createForm();
        form.config.module_max_price_enabled = false;
        const { wrapper } = await mountWizard(form);
        await goToStep(wrapper, STEP.DESCRIPTION);
        form.trip.description = EXCESSIVE_DESCRIPTION;

        await clickNext(wrapper);

        expect(excessModal()).toBeNull();
        expect(wrapper.vm.currentStep).toBe(STEP.LAST_DETAILS);
    });

    it('does not show the modal when editing an existing trip', async () => {
        const { wrapper, form } = await mountWizard(createForm({ id: 7 }));
        await goToStep(wrapper, STEP.DESCRIPTION);
        form.trip.description = EXCESSIVE_DESCRIPTION;

        await clickNext(wrapper);

        expect(excessModal()).toBeNull();
        expect(wrapper.vm.currentStep).toBe(STEP.LAST_DETAILS);
    });
});
