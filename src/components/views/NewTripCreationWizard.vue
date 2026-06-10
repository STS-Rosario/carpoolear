<template>
    <div class="new-trip-wizard">
        <h2 class="new-trip-wizard__title">{{ wizardTitle }}</h2>

        <fieldset
            class="trip-type-selection--light new-trip-wizard__type"
            v-if="!form.updatingTrip"
        >
            <button
                type="button"
                class="btn btn-option"
                :class="{ active: !isPassenger }"
                @click="setPassengerMode(0)"
            >
                {{ $t('buscoConductor') }}
            </button>
            <button
                type="button"
                class="btn btn-option"
                :class="{ active: isPassenger }"
                @click="setPassengerMode(1)"
            >
                {{ $t('buscoPasajero') }}
            </button>
        </fieldset>

        <TripCreationStepper
            :current-step="currentStep"
            :max-visited-step="maxVisitedStep"
            :is-passenger="isPassenger"
            :incomplete-steps="incompleteSteps"
            @select="onStepSelect"
        />

        <div class="new-trip-wizard__step">
            <!-- Step 1: Origin -->
            <template v-if="currentStep === STEP.ORIGIN">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepOriginQuestion') }}
                </h3>
                <div class="trip_allow-foreign">
                    <input
                        type="checkbox"
                        v-model="form.allowForeignPoints"
                        id="wizard-allow-foreign"
                    />
                    <label for="wizard-allow-foreign">
                        {{ $t('origenOdestino') }} {{ form.config.country_name }}
                    </label>
                </div>
                <div class="trip_point location-autocomplete" :class="{ 'trip-error': form.points[0].error.state }">
                    <autocomplete
                        :placeholder="form.$t('origen')"
                        name="wizard-origin"
                        :model-value="form.points[0].name"
                        v-on:place_changed="(data) => form.getPlace(0, data)"
                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                        :country="form.allowForeignPoints ? null : 'AR'"
                    ></autocomplete>
                    <span class="error" v-if="form.points[0].error.state">{{ form.points[0].error.message }}</span>
                    <span class="error" v-if="stepErrors.origin">{{ $t(stepErrors.origin) }}</span>
                </div>
                <TripCreationRoutePanel
                    :points="form.points"
                    :distance-string="form.distanceString"
                    :estimated-time-string="form.estimatedTimeString"
                    :co2-string="form.CO2String"
                    :center="form.center"
                    :zoom="form.zoom"
                    :url="form.url"
                    :attribution="form.attribution"
                />
            </template>

            <!-- Step 2: Destination -->
            <template v-if="currentStep === STEP.DESTINATION">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepDestinationQuestion') }}
                </h3>
                <div
                    class="trip_point location-autocomplete"
                    :class="{ 'trip-error': lastPoint.error.state }"
                >
                    <autocomplete
                        :placeholder="form.$t('destino')"
                        name="wizard-destination"
                        :model-value="lastPoint.name"
                        v-on:place_changed="(data) => form.getPlace(form.points.length - 1, data)"
                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                        :country="form.allowForeignPoints ? null : 'AR'"
                    ></autocomplete>
                    <span class="error" v-if="lastPoint.error.state">{{ lastPoint.error.message }}</span>
                    <span class="error" v-if="stepErrors.destination">{{ $t(stepErrors.destination) }}</span>
                </div>
                <TripCreationRoutePanel
                    :points="form.points"
                    :distance-string="form.distanceString"
                    :estimated-time-string="form.estimatedTimeString"
                    :co2-string="form.CO2String"
                    :center="form.center"
                    :zoom="form.zoom"
                    :url="form.url"
                    :attribution="form.attribution"
                />
            </template>

            <!-- Step 3: Schedule -->
            <template v-if="currentStep === STEP.SCHEDULE">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepScheduleQuestion') }}
                </h3>
                <div class="trip_schedule-toggle" v-if="form.config.weekly_schedule">
                    <button
                        type="button"
                        class="btn btn-option schedule-tab"
                        :class="{ active: !form.useWeeklySchedule }"
                        @click="form.useWeeklySchedule = false"
                    >
                        {{ $t('unaVez') }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-option schedule-tab"
                        :class="{ active: form.useWeeklySchedule }"
                        @click="form.useWeeklySchedule = true"
                    >
                        {{ $t('programaSemanal') }}
                    </button>
                </div>
                <div v-if="!form.useWeeklySchedule" class="trip_datetime">
                    <DatePicker
                        :model-value="form.dateAnswer"
                        :minDate="form.minDate"
                        :class="{ 'has-error': form.dateError.state }"
                        v-on:date_changed="form.changeDate"
                    ></DatePicker>
                    <input
                        type="time"
                        v-maska="'##:##'"
                        v-model="form.time"
                        class="form-control form-control-with-icon form-control-time"
                        :class="{ 'has-error': form.timeError.state }"
                    />
                </div>
                <WeeklySchedule
                    v-else-if="form.config.weekly_schedule"
                    v-model:weeklySchedule="form.weeklySchedule"
                    v-model:weeklyScheduleTime="form.weeklyScheduleTime"
                    :readonly="false"
                    :theme="form.tripCardTheme"
                    :hasError="form.timeError.state"
                />
                <span class="error" v-if="form.dateError.state">{{ form.dateError.message }}</span>
                <span class="error" v-if="form.timeError.state">{{ form.timeError.message }}</span>
                <span class="error" v-if="stepErrors.schedule">{{ $t(stepErrors.schedule) }}</span>
            </template>

            <!-- Step 4: Car -->
            <template v-if="currentStep === STEP.CAR && !isPassenger">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepCarQuestion') }}
                </h3>
                <TripCarStepPanel
                    :selected-car-id="form.selectedCarId"
                    :car-selection-error="form.carSelectionError"
                    @update:selected-car-id="form.selectedCarId = $event"
                    @cars-updated="form.preselectDriverCar"
                />
                <span class="error" v-if="stepErrors.car">{{ $t(stepErrors.car) }}</span>
            </template>

            <!-- Step 5: Seats -->
            <template v-if="currentStep === STEP.SEATS">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepSeatsQuestion') }}
                </h3>
                <div class="trip_seats-available">
                    <label class="label-for-group">
                        {{
                            isPassenger
                                ? $t('cuposNecesarios')
                                : $t('lugaresDisponibles')
                        }}
                    </label>
                    <div class="seats-widget">
                        <button
                            type="button"
                            class="btn btn-link"
                            :disabled="form.trip.total_seats <= 1"
                            @click="adjustSeats(-1)"
                        >
                            <svg-item :size="28" :icon="'remove'"></svg-item>
                        </button>
                        <span class="total_seats">{{ form.trip.total_seats }}</span>
                        <button
                            type="button"
                            class="btn btn-link"
                            :disabled="form.trip.total_seats >= 4"
                            @click="adjustSeats(1)"
                        >
                            <svg-item :size="28" :icon="'add'"></svg-item>
                        </button>
                    </div>
                    <div v-if="!isPassenger" class="trip_seats-total-people">
                        <label class="label-soft">{{ $t('tripCreationTotalPeopleLabel') }}</label>
                        <div class="seats-widget">
                            <button
                                type="button"
                                class="btn btn-link"
                                :disabled="totalPeople <= 2"
                                @click="adjustTotalPeople(-1)"
                            >
                                <svg-item :size="28" :icon="'remove'"></svg-item>
                            </button>
                            <span class="total_seats">{{ totalPeople }}</span>
                            <button
                                type="button"
                                class="btn btn-link"
                                :disabled="totalPeople >= 5"
                                @click="adjustTotalPeople(1)"
                            >
                                <svg-item :size="28" :icon="'add'"></svg-item>
                            </button>
                        </div>
                    </div>
                    <div v-if="!isPassenger" class="trip-comfort-preference">
                        <label for="wizard-comfort-rear" class="label-soft">
                            <input
                                type="checkbox"
                                id="wizard-comfort-rear"
                                :checked="form.trip.rear_max_two_passengers"
                                @change="form.onOutboundRearMaxTwoChange($event)"
                            />
                            {{ $t('atrasViajanSolo2Personas') }}
                        </label>
                    </div>
                    <div
                        class="trip_price"
                        v-if="!isPassenger && form.config.module_seat_price_enabled"
                    >
                        <label class="label-for-group">{{ $t('precioAsiento') }}</label>
                        <input
                            type="number"
                            v-model="form.price"
                            class="form-control form-control-price"
                            min="0"
                            :class="{ 'has-error': form.priceError.state }"
                            @input="form.onOutboundPriceFieldInput"
                        />
                        <span class="error" v-if="form.priceError.state">{{ form.priceError.message }}</span>
                    </div>
                    <span class="error" v-if="form.seatsError.state">{{ form.seatsError.message }}</span>
                </div>
            </template>

            <!-- Step 6: Description -->
            <template v-if="currentStep === STEP.DESCRIPTION">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepDescriptionQuestion') }}
                </h3>
                <textarea
                    maxlength="2000"
                    v-model="form.trip.description"
                    class="form-control"
                    :placeholder="$t('placeholderComentarioPasajeros')"
                ></textarea>
                <div v-if="!isPassenger" class="checkbox-trip-autoaccept-friends">
                    <input
                        type="checkbox"
                        v-model="form.trip.autoaccept_friends_requests"
                        id="wizard-autoaccept"
                    />
                    <label for="wizard-autoaccept">
                        {{ $t('aceptarPedidosAmigosAutomaticamente') }}
                    </label>
                </div>
                <span class="error" v-if="form.commentError.state">{{ form.commentError.message }}</span>
                <span class="error" v-if="stepErrors.description">{{ $t(stepErrors.description) }}</span>
            </template>

            <!-- Step 7: Last details -->
            <template v-if="currentStep === STEP.LAST_DETAILS">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepLastDetailsTitle') }}
                </h3>
                <div v-if="!isPassenger" class="trip_terms trip_terms--lucrar-card">
                    <input
                        type="checkbox"
                        id="wizard-no-lucrar"
                        v-model="form.no_lucrar"
                        class="checkbox-button"
                    />
                    <label for="wizard-no-lucrar" class="checkbox-click-target">
                        <span class="checkbox-box"></span>
                        <strong>{{ $t('meComprometo') }}</strong>
                    </label>
                    <span class="error" v-if="form.lucrarError.state">{{ form.lucrarError.message }}</span>
                </div>
                <legend class="label-for-group">{{ $t('preferenciasViaje') }}</legend>
                <div class="preferences row trip-pref-cards">
                    <div class="col-xs-4 trip-pref-cards__cell">
                        <div class="trip-pref-card">
                            <input type="checkbox" id="wizard-pref-smoking" v-model="form.trip.allow_smoking" class="trip-pref-card__input sr-only" />
                            <label for="wizard-pref-smoking" class="trip-pref-card__label">
                                <span class="trip-pref-card__surface">
                                    <img :src="form.tripStaticImg('icon-smoke.svg')" alt="" class="trip-pref-card__icon" />
                                </span>
                                <span class="trip-pref-card__caption">{{ $t('preferenciaPermitidoFumar') }}</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-xs-4 trip-pref-cards__cell">
                        <div class="trip-pref-card">
                            <input type="checkbox" id="wizard-pref-animals" v-model="form.trip.allow_animals" class="trip-pref-card__input sr-only" />
                            <label for="wizard-pref-animals" class="trip-pref-card__label">
                                <span class="trip-pref-card__surface">
                                    <img :src="form.tripStaticImg('icon-pet.svg')" alt="" class="trip-pref-card__icon" />
                                </span>
                                <span class="trip-pref-card__caption">{{ $t('preferenciaPermitidoAnimales') }}</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-xs-4 trip-pref-cards__cell">
                        <div class="trip-pref-card">
                            <input type="checkbox" id="wizard-pref-kids" v-model="form.trip.allow_kids" class="trip-pref-card__input sr-only" />
                            <label for="wizard-pref-kids" class="trip-pref-card__label">
                                <span class="trip-pref-card__surface">
                                    <img :src="form.tripStaticImg('icon-baby.svg')" alt="" class="trip-pref-card__icon" />
                                </span>
                                <span class="trip-pref-card__caption">{{ $t('preferenciaPermitidoNinos') }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div
                    v-if="!form.updatingTrip && !isPassenger"
                    class="checkbox-trip-return"
                >
                    <input type="checkbox" v-model="form.showReturnTrip" id="wizard-return" />
                    <label for="wizard-return">{{ $t('cargarViajeRegreso') }}</label>
                </div>
                <span class="error" v-if="stepErrors.lastDetails">{{ $t(stepErrors.lastDetails) }}</span>
            </template>
        </div>

        <div class="new-trip-wizard__nav">
            <button
                v-if="previousStep"
                type="button"
                class="new-trip-wizard__back"
                data-testid="trip-creation-back"
                @click="goBack"
            >
                {{ $t('volver') }}
            </button>
            <button
                v-if="currentStep < STEP.LAST_DETAILS"
                type="button"
                class="btn btn-primary btn-lg new-trip-wizard__next"
                data-testid="trip-creation-next"
                @click="goNext"
            >
                {{ $t('siguiente') }}
            </button>
            <button
                v-else
                type="button"
                class="btn btn-primary btn-lg new-trip-wizard__submit"
                data-testid="trip-creation-submit"
                :disabled="form.saving"
                @click="onSubmit"
            >
                <spinner v-if="form.saving" class="blue"></spinner>
                <span v-else>{{ submitLabel }}</span>
            </button>
        </div>
    </div>
</template>

<script>
import { last } from 'lodash';
import TripCreationStepper from '../elements/TripCreationStepper.vue';
import TripCreationRoutePanel from '../elements/TripCreationRoutePanel.vue';
import TripCarStepPanel from '../elements/TripCarStepPanel.vue';
import DatePicker from '../DatePicker';
import autocomplete from '../Autocomplete';
import WeeklySchedule from '../elements/WeeklySchedule';
import SvgItem from '../SvgItem';
import spinner from '../Spinner.vue';
import {
    STEP,
    getNextStep,
    getPreviousStep,
    validateStep
} from '../../utils/tripCreationSteps.js';
import {
    loadTripCreationDraft,
    saveTripCreationDraft
} from '../../utils/tripCreationDraft.js';

export default {
    name: 'new-trip-creation-wizard',

    components: {
        TripCreationStepper,
        TripCreationRoutePanel,
        TripCarStepPanel,
        DatePicker,
        autocomplete,
        WeeklySchedule,
        SvgItem,
        spinner
    },

    inject: ['newTripForm'],

    data() {
        return {
            STEP,
            currentStep: STEP.ORIGIN,
            maxVisitedStep: STEP.ORIGIN,
            incompleteSteps: [],
            stepErrors: {},
            draftTimer: null
        };
    },

    computed: {
        form() {
            return this.newTripForm;
        },
        isPassenger() {
            return Number(this.form.trip.is_passenger) === 1;
        },
        lastPoint() {
            return last(this.form.points) || { name: '', error: { state: false, message: '' } };
        },
        previousStep() {
            return getPreviousStep(this.currentStep, this.isPassenger);
        },
        wizardTitle() {
            if (this.form.updatingTrip) {
                return this.$t('editarViaje');
            }
            return this.isPassenger
                ? this.$t('tripCreationTitlePassenger')
                : this.$t('tripCreationTitleDriver');
        },
        submitLabel() {
            return this.form.updatingTrip ? this.$t('actualizar') : this.$t('crearViaje');
        },
        totalPeople() {
            return Number(this.form.trip.total_seats) + 1;
        }
    },

    watch: {
        currentStep() {
            this.scheduleDraftSave();
        },
        'form.trip': {
            deep: true,
            handler() {
                this.scheduleDraftSave();
            }
        },
        'form.points': {
            deep: true,
            handler() {
                this.scheduleDraftSave();
            }
        }
    },

    mounted() {
        if (this.form.updatingTrip) {
            this.maxVisitedStep = STEP.LAST_DETAILS;
            return;
        }

        const shouldResume =
            this.$route.query.resumeDraft === '1' ||
            loadTripCreationDraft(this.form.user?.id);
        if (shouldResume && this.form.user?.id) {
            this.restoreDraft();
        }
    },

    methods: {
        scheduleDraftSave() {
            if (this.form.updatingTrip) {
                return;
            }
            clearTimeout(this.draftTimer);
            this.draftTimer = setTimeout(() => this.persistDraft(), 400);
        },
        persistDraft() {
            if (this.form.updatingTrip || !this.form.user?.id) {
                return;
            }
            saveTripCreationDraft(this.form.user.id, this.buildDraftSnapshot());
        },
        buildDraftSnapshot() {
            return {
                currentStep: this.currentStep,
                maxVisitedStep: this.maxVisitedStep,
                trip: { ...this.form.trip },
                points: this.form.points.map((p) => ({
                    name: p.name,
                    place: p.place,
                    json: p.json,
                    location: p.location,
                    id: p.id
                })),
                date: this.form.date,
                dateAnswer: this.form.dateAnswer,
                time: this.form.time,
                price: this.form.price,
                no_lucrar: this.form.no_lucrar,
                selectedCarId: this.form.selectedCarId,
                allowForeignPoints: this.form.allowForeignPoints,
                showReturnTrip: this.form.showReturnTrip,
                useWeeklySchedule: this.form.useWeeklySchedule,
                weeklySchedule: this.form.weeklySchedule,
                weeklyScheduleTime: this.form.weeklyScheduleTime,
                updatedAt: new Date().toISOString()
            };
        },
        restoreDraft() {
            const draft = loadTripCreationDraft(this.form.user.id);
            if (!draft) {
                return;
            }
            if (draft.trip) {
                Object.assign(this.form.trip, draft.trip);
            }
            if (draft.points) {
                this.form.points = draft.points.map((p) => ({
                    ...p,
                    error: { state: false, message: '' }
                }));
            }
            this.form.dateAnswer =
                draft.dateAnswer || draft.date || this.form.dateAnswer;
            this.form.date = draft.date || this.form.dateAnswer || this.form.date;
            this.form.time = draft.time || this.form.time;
            this.form.price = draft.price || this.form.price;
            this.form.no_lucrar = draft.no_lucrar || false;
            this.form.selectedCarId = draft.selectedCarId;
            this.form.allowForeignPoints = draft.allowForeignPoints || false;
            this.form.showReturnTrip = draft.showReturnTrip || false;
            this.form.useWeeklySchedule = draft.useWeeklySchedule || false;
            this.form.weeklySchedule = draft.weeklySchedule || 0;
            this.form.weeklyScheduleTime = draft.weeklyScheduleTime || this.form.weeklyScheduleTime;
            this.currentStep = draft.currentStep || STEP.ORIGIN;
            this.maxVisitedStep = draft.maxVisitedStep || this.currentStep;
        },
        buildValidationContext() {
            return {
                points: this.form.points,
                useWeeklySchedule: this.form.useWeeklySchedule,
                weeklySchedule: this.form.weeklySchedule,
                weeklyScheduleTime: this.form.weeklyScheduleTime,
                dateAnswer: this.form.dateAnswer,
                time: this.form.time,
                isPassenger: this.isPassenger,
                cars: this.form.cars,
                selectedCarId: this.form.selectedCarId,
                totalSeats: this.form.trip.total_seats,
                passengers: this.form.passengers,
                description: this.form.trip.description,
                noLucrar: this.form.no_lucrar
            };
        },
        validateCurrentStep() {
            const result = validateStep(this.currentStep, this.buildValidationContext());
            this.stepErrors = result.errors || {};
            this.updateIncompleteSteps(this.currentStep, result.valid);
            return result.valid;
        },
        updateIncompleteSteps(step, valid) {
            const set = new Set(this.incompleteSteps);
            if (!valid && this.maxVisitedStep >= step) {
                set.add(step);
            } else {
                set.delete(step);
            }
            this.incompleteSteps = [...set];
        },
        revalidateVisitedSteps() {
            const steps = [];
            for (let s = STEP.ORIGIN; s <= this.maxVisitedStep; s++) {
                if (this.isPassenger && s === STEP.CAR) {
                    continue;
                }
                const result = validateStep(s, this.buildValidationContext());
                if (!result.valid) {
                    steps.push(s);
                }
            }
            this.incompleteSteps = steps;
        },
        onStepSelect(step) {
            this.currentStep = step;
        },
        goNext() {
            if (!this.validateCurrentStep()) {
                return;
            }
            const next = getNextStep(this.currentStep, this.isPassenger);
            if (next) {
                this.currentStep = next;
                this.maxVisitedStep = Math.max(this.maxVisitedStep, next);
            }
        },
        goBack() {
            const prev = getPreviousStep(this.currentStep, this.isPassenger);
            if (prev) {
                this.currentStep = prev;
            }
        },
        adjustSeats(delta) {
            const next = Number(this.form.trip.total_seats) + delta;
            if (next >= 1 && next <= 4) {
                this.form.trip.total_seats = next;
            }
        },
        adjustTotalPeople(delta) {
            const next = this.totalPeople + delta;
            if (next >= 2 && next <= 5) {
                this.form.trip.total_seats = next - 1;
            }
        },
        onSubmit() {
            if (!this.validateCurrentStep()) {
                return;
            }
            this.form.save();
        },
        setPassengerMode(value) {
            if (Number(this.form.trip.is_passenger) === value) {
                return;
            }
            this.form.trip.is_passenger = value;
            if (this.isPassenger && this.currentStep === STEP.CAR) {
                this.currentStep = STEP.SCHEDULE;
            }
            this.revalidateVisitedSteps();
            this.scheduleDraftSave();
        }
    }
};
</script>

<style scoped>
.new-trip-wizard__title {
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.new-trip-wizard__type {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border: none;
    padding: 0;
}

.new-trip-wizard__type .btn-option {
    flex: 1;
}

.new-trip-wizard__question {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.new-trip-wizard__nav {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.new-trip-wizard__back {
    margin: 0;
    padding: 0.6rem 1rem;
    background: none;
    border: none;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.5;
}

.new-trip-wizard__next,
.new-trip-wizard__submit {
    min-width: 200px;
    margin: 0;
}

.trip_seats-total-people {
    margin-top: 1rem;
}
</style>
