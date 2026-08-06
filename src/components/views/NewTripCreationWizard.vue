<template>
    <div class="new-trip-wizard">
        <TripCreationStepper
            :current-step="currentStep"
            :max-visited-step="maxVisitedStep"
            :is-passenger="isPassenger"
            :seat-price-enabled="navigationOptions.seatPriceEnabled"
            :incomplete-steps="incompleteSteps"
            @select="onStepSelect"
        />

        <div
            class="new-trip-wizard__step"
            :data-testid="`trip-creation-wizard-step-${currentStep}`"
        >
            <!-- Step 1: Role -->
            <template v-if="currentStep === STEP.ROLE && !isEditTripFlow">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepRoleQuestion') }}
                </h3>
                <p class="new-trip-wizard__subtitle">
                    {{ $t('tripCreationStepRoleSubtitle') }}
                </p>
                <div
                    v-if="hasAvailableTemplates"
                    class="new-trip-wizard__template-action"
                >
                    <button
                        type="button"
                        class="btn btn-default new-trip-wizard__template-button"
                        data-testid="trip-creation-use-template"
                        @click="openTemplateModal"
                    >
                        <i
                            class="fa fa-bookmark new-trip-wizard__template-button-icon"
                            aria-hidden="true"
                        ></i>
                        {{ $t('tripCreationUseTemplate') }}
                    </button>
                </div>
                <p
                    v-if="hasAvailableTemplates"
                    class="new-trip-wizard__template-or"
                    aria-hidden="true"
                >
                    {{ $t('tripCreationOr') }}
                </p>
                <div class="new-trip-wizard__role-cards">
                    <button
                        type="button"
                        class="new-trip-wizard__role-card"
                        :class="{ 'new-trip-wizard__role-card--active': !isPassenger }"
                        data-testid="trip-creation-role-driver"
                        @click="setPassengerMode(0)"
                    >
                        <span
                            class="fa fa-car new-trip-wizard__role-card-icon"
                            aria-hidden="true"
                        ></span>
                        <span class="new-trip-wizard__role-card-title">
                            {{ $t('tripCreationRoleDriverTitle') }}
                        </span>
                    </button>
                    <button
                        type="button"
                        class="new-trip-wizard__role-card"
                        :class="{ 'new-trip-wizard__role-card--active': isPassenger }"
                        data-testid="trip-creation-role-passenger"
                        @click="setPassengerMode(1)"
                    >
                        <img
                            class="new-trip-wizard__role-card-image"
                            alt=""
                            :src="isPassenger ? pasajeroLogoBlanco : pasajeroLogoGris"
                        />
                        <span class="new-trip-wizard__role-card-title">
                            {{ $t('tripCreationRolePassengerTitle') }}
                        </span>
                    </button>
                </div>
            </template>

            <!-- Step 2: Origin -->
            <template v-if="currentStep === STEP.ORIGIN">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepOriginQuestion') }}
                </h3>
                <div class="trip_allow-foreign new-trip-wizard__allow-foreign">
                    <input
                        type="checkbox"
                        v-model="form.allowForeignPoints"
                        id="wizard-allow-foreign"
                    />
                    <label for="wizard-allow-foreign">
                        {{ $t('origenOdestino') }} {{ form.config.country_name }}
                    </label>
                </div>
                <div class="trip_point location-autocomplete origin" :class="{ 'trip-error': form.points[0].error.state }">
                    <AppField icon-left="fa fa-map-marker">
                        <autocomplete
                            :placeholder="form.$t('origen')"
                            name="wizard-origin"
                            :model-value="form.points[0].name"
                            v-on:place_changed="(data) => form.getPlace(0, data)"
                            :classes="'new-trip-wizard__autocomplete-input'"
                            :country="form.allowForeignPoints ? null : 'AR'"
                        ></autocomplete>
                    </AppField>
                    <span class="error" v-if="form.points[0].error.state">{{ form.points[0].error.message }}</span>
                    <span class="error" v-if="stepErrors.origin">{{ $t(stepErrors.origin) }}</span>
                </div>
                <TripPointDetailFields
                    :points="form.points"
                    fields="partida"
                    :punto-partida="form.trip.punto_partida"
                    :punto-llegada="form.trip.punto_llegada"
                    :punto-partida-error="form.puntoPartidaError"
                    :punto-llegada-error="form.puntoLlegadaError"
                    id-prefix="wizard-origin"
                    @update:puntoPartida="form.trip.punto_partida = $event"
                    @update:puntoLlegada="form.trip.punto_llegada = $event"
                />
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
                    class="trip_point location-autocomplete destiny"
                    :class="{ 'trip-error': lastPoint.error.state }"
                >
                    <AppField icon-left="fa fa-map-marker">
                        <autocomplete
                            :placeholder="form.$t('destino')"
                            name="wizard-destination"
                            :model-value="lastPoint.name"
                            v-on:place_changed="(data) => form.getPlace(form.points.length - 1, data)"
                            :classes="'new-trip-wizard__autocomplete-input'"
                            :country="form.allowForeignPoints ? null : 'AR'"
                        ></autocomplete>
                    </AppField>
                    <span class="error" v-if="lastPoint.error.state">{{ lastPoint.error.message }}</span>
                    <span class="error" v-if="stepErrors.destination">{{ $t(stepErrors.destination) }}</span>
                </div>
                <div class="new-trip-wizard__wants-stops">
                    <input
                        type="checkbox"
                        id="wizard-wants-intermediate-stops"
                        v-model="form.wantsIntermediateStops"
                    />
                    <label for="wizard-wants-intermediate-stops">
                        {{ $t('tripCreationWantsIntermediateStops') }}
                    </label>
                </div>
                <TripPointDetailFields
                    :points="form.points"
                    fields="llegada"
                    :punto-partida="form.trip.punto_partida"
                    :punto-llegada="form.trip.punto_llegada"
                    :punto-partida-error="form.puntoPartidaError"
                    :punto-llegada-error="form.puntoLlegadaError"
                    id-prefix="wizard-destination"
                    @update:puntoPartida="form.trip.punto_partida = $event"
                    @update:puntoLlegada="form.trip.punto_llegada = $event"
                />
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

            <!-- Step 4: Intermediate stops -->
            <template v-if="currentStep === STEP.STOPS">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepStopsQuestion') }}
                </h3>
                <div
                    v-for="(point, index) in intermediatePoints"
                    :key="point.id || index"
                    class="trip_point location-autocomplete new-trip-wizard__stop"
                    :class="{ 'trip-error': point.error.state }"
                >
                    <AppField icon-left="fa fa-map-marker">
                        <autocomplete
                            :placeholder="form.$t('ingresePuntoIntermedio')"
                            :name="`wizard-stop-${index}`"
                            :model-value="point.name"
                            v-on:place_changed="(data) => form.getPlace(intermediateIndex(index), data)"
                            :classes="'new-trip-wizard__autocomplete-input'"
                            :country="form.allowForeignPoints ? null : 'AR'"
                        ></autocomplete>
                    </AppField>
                    <button
                        type="button"
                        class="btn btn-link new-trip-wizard__remove-stop"
                        @click="form.resetPoints(point, intermediateIndex(index))"
                    >
                        {{ $t('eliminar') }}
                    </button>
                    <span class="error" v-if="point.error.state">{{ point.error.message }}</span>
                </div>
                <button
                    type="button"
                    class="btn btn-link new-trip-wizard__add-stop"
                    data-testid="trip-creation-add-stop"
                    @click="form.addPoint(true)"
                >
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    {{ $t('tripCreationAddStop') }}
                </button>
                <span class="error" v-if="stepErrors.stops">{{ $t(stepErrors.stops) }}</span>
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

            <!-- Step 5: Schedule -->
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
                    <AppField class="new-trip-wizard__date-field">
                        <DatePicker
                            :model-value="form.dateAnswer"
                            :minDate="form.minDate"
                            :class="{ 'has-error': form.dateError.state }"
                            v-on:date_changed="form.changeDate"
                        ></DatePicker>
                    </AppField>
                    <div class="new-trip-wizard__time-field">
                        <AppInput
                            ref="wizardTimeInput"
                            type="time"
                            v-model="form.time"
                            mask="##:##"
                            icon-left="fa fa-clock-o"
                            class="new-trip-wizard__time-input"
                        >
                            <template #actionRight>
                                <button
                                    type="button"
                                    class="new-trip-wizard__time-caret"
                                    :aria-label="$t('hora')"
                                    @click="openWizardTimePicker"
                                >
                                    <i
                                        class="fa fa-chevron-down"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </template>
                        </AppInput>
                    </div>
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
                    :seat-layout-capacity="form.seatLayoutCapacity"
                    :car-selection-error="form.carSelectionError"
                    @update:selected-car-id="form.selectedCarId = $event"
                    @update:seat-layout-capacity="form.applySeatLayoutCapacity"
                    @cars-updated="form.preselectDriverCar"
                    @edit-cars="form.openTripCarsModal"
                />
                <span class="error" v-if="stepErrors.car">{{ $t(stepErrors.car) }}</span>
                <span class="error" v-if="stepErrors.seatLayout">{{
                    $t(stepErrors.seatLayout)
                }}</span>
            </template>

            <!-- Step 5: Seats -->
            <template v-if="currentStep === STEP.SEATS">
                <h3 class="new-trip-wizard__question">
                    {{ $t('tripCreationStepSeatsQuestion') }}
                </h3>
                <TripSeatMapPanel
                    v-if="!isPassenger && form.seatLayoutCapacity"
                    :seat-layout-capacity="form.seatLayoutCapacity"
                    :passenger-seat-availability="form.passengerSeatAvailability"
                    @update:passenger-seat-availability="
                        form.onPassengerSeatAvailabilityUpdate($event)
                    "
                />
                <div class="trip_seats-available" v-else>
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
                            :aria-label="$t('disminuirCantidadAsientos')"
                            :disabled="form.trip.total_seats <= 1"
                            @click="adjustSeats(-1)"
                        >
                            <svg-item :size="28" :icon="'remove'"></svg-item>
                        </button>
                        <span class="total_seats">{{ form.trip.total_seats }}</span>
                        <button
                            type="button"
                            class="btn btn-link"
                            :aria-label="$t('aumentarCantidadAsientos')"
                            :disabled="form.trip.total_seats >= 4"
                            @click="adjustSeats(1)"
                        >
                            <svg-item :size="28" :icon="'add'"></svg-item>
                        </button>
                    </div>
                    <span class="error" v-if="form.seatsError.state">{{ form.seatsError.message }}</span>
                </div>
            </template>

            <!-- Step: Contribution -->
            <template
                v-if="
                    currentStep === STEP.CONTRIBUTION &&
                    !isPassenger &&
                    form.config.module_seat_price_enabled
                "
            >
                <TripContributionStepPanel
                    :price="form.price"
                    :recommended-seat-price-cents="
                        form.recommended_seat_price_cents
                    "
                    :suggested-description="
                        form.contribucionRecomendadaCardDescripcionText
                    "
                    :price-error="
                        form.priceError.state ? form.priceError.message : ''
                    "
                    @update:price="onContributionPriceUpdate"
                />
            </template>

            <!-- Step: Preferences and details -->
            <template v-if="currentStep === STEP.DESCRIPTION">
                <TripPreferencesStepPanel
                    :allow-kids="form.trip.allow_kids"
                    :allow-smoking="form.trip.allow_smoking"
                    :allow-animals="form.trip.allow_animals"
                    :autoaccept-friends="form.trip.autoaccept_friends_requests"
                    :description="form.trip.description"
                    :description-error="
                        form.commentError.state
                            ? form.commentError.message
                            : stepErrors.description
                                ? $t(stepErrors.description)
                                : ''
                    "
                    :show-friends="!isPassenger"
                    :kids-icon="form.tripStaticImg('icon-baby.svg')"
                    :smoking-icon="form.tripStaticImg('icon-smoke.svg')"
                    :pets-icon="form.tripStaticImg('icon-pet.svg')"
                    @update:allowKids="form.trip.allow_kids = $event"
                    @update:allowSmoking="form.trip.allow_smoking = $event"
                    @update:allowAnimals="form.trip.allow_animals = $event"
                    @update:autoacceptFriends="
                        form.trip.autoaccept_friends_requests = $event
                    "
                    @update:description="form.trip.description = $event"
                />
            </template>

            <!-- Step: Review -->
            <template v-if="currentStep === STEP.LAST_DETAILS">
                <TripReviewStepPanel
                    :points="form.points"
                    :punto-partida="form.trip.punto_partida"
                    :punto-llegada="form.trip.punto_llegada"
                    :date-label="reviewDateLabel"
                    :time-label="reviewTimeLabel"
                    :show-vehicle="!isPassenger"
                    :vehicle-label="reviewVehicleLabel"
                    :seats-count="form.trip.total_seats"
                    :show-contribution="
                        !isPassenger && navigationOptions.seatPriceEnabled
                    "
                    :price="form.price"
                    :allow-kids="form.trip.allow_kids"
                    :allow-smoking="form.trip.allow_smoking"
                    :allow-animals="form.trip.allow_animals"
                    :show-no-lucrar="!isPassenger"
                    :no-lucrar="form.no_lucrar"
                    :no-lucrar-error="
                        form.lucrarError.state
                            ? form.lucrarError.message
                            : stepErrors.lastDetails
                                ? $t(stepErrors.lastDetails)
                                : ''
                    "
                    @edit="setCurrentStep"
                    @update:noLucrar="form.no_lucrar = $event"
                />
            </template>
        </div>

        <modal
            v-if="showTemplateModal"
            :hide-footer="true"
            @close="closeTemplateModal"
        >
            <template #header>
                <h3>{{ $t('tripCreationChooseTemplateTitle') }}</h3>
            </template>
            <template #body>
                <div class="new-trip-wizard__template-modal text-left color-black">
                    <AppField
                        :label="$t('tripCreationTemplateNameLabel')"
                        label-for="trip-creation-template-select"
                    >
                        <select
                            id="trip-creation-template-select"
                            v-model="selectedTemplateName"
                            class="new-trip-wizard__template-select"
                            data-testid="trip-creation-template-select"
                            @change="onTemplateSelectChange"
                        >
                            <option disabled value="">
                                {{ $t('tripCreationChooseTemplatePlaceholder') }}
                            </option>
                            <option
                                v-for="template in availableTemplates"
                                :key="template.name"
                                :value="template.name"
                            >
                                {{ template.name }}
                            </option>
                        </select>
                    </AppField>
                </div>
            </template>
        </modal>

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
            <AppButton
                v-if="currentStep < STEP.LAST_DETAILS"
                variant="primary"
                size="lg"
                class="new-trip-wizard__next"
                data-testid="trip-creation-next"
                :disabled="isNextDisabled"
                @click="goNext"
            >
                {{ $t('siguiente') }}
            </AppButton>
            <AppButton
                v-else
                variant="primary"
                size="lg"
                class="new-trip-wizard__submit"
                data-testid="trip-creation-submit"
                :disabled="isSubmitDisabled"
                :loading="form.saving"
                @click="onSubmit"
            >
                {{ submitLabel }}
                <template #loading>{{ savingLabel }}</template>
            </AppButton>
        </div>
    </div>
</template>

<script>
import { last } from 'lodash';
import TripCreationStepper from '../elements/TripCreationStepper.vue';
import TripCreationRoutePanel from '../elements/TripCreationRoutePanel.vue';
import TripCarStepPanel from '../elements/TripCarStepPanel.vue';
import TripSeatMapPanel from '../elements/TripSeatMapPanel.vue';
import TripContributionStepPanel from '../elements/TripContributionStepPanel.vue';
import TripPreferencesStepPanel from '../elements/TripPreferencesStepPanel.vue';
import TripReviewStepPanel from '../elements/TripReviewStepPanel.vue';
import TripPointDetailFields from '../elements/TripPointDetailFields';
import DatePicker from '../DatePicker';
import autocomplete from '../Autocomplete';
import WeeklySchedule from '../elements/WeeklySchedule';
import SvgItem from '../SvgItem';
import modal from '../Modal';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import dayjs from '../../dayjs';
import { formatCarDropdownLabel } from '../../utils/carFields.js';
import {
    activeCarsWithPlate,
    resolveTripCarId
} from '../../utils/userCars.js';
import {
    STEP,
    getNextStep,
    getPreviousStep,
    validateStep
} from '../../utils/tripCreationSteps.js';
import {
    getIntermediatePoints,
    removeEmptyIntermediatePoints
} from '../../utils/tripCreationPoints.js';
import {
    loadTripCreationDraft,
    saveTripCreationDraft
} from '../../utils/tripCreationDraft.js';
import {
    applyTripCreationTemplateToForm,
    getWizardNavigationAfterTemplateApply,
    listTripCreationTemplates,
    loadTripCreationTemplate
} from '../../utils/tripCreationTemplate.js';
import {
    formatStepQueryValue,
    resolveStepFromQuery
} from '../../utils/tripCreationStepQuery.js';
import { shouldDisableTripCreationNext } from '../../utils/tripCreationTripInfo.js';
import { getTripCreationWizardMountState } from '../../utils/tripCreationWizardMount.js';
import { contributionUnitsFromCents } from '../../utils/tripContributionDisplay.js';

export default {
    name: 'new-trip-creation-wizard',

    components: {
        TripCreationStepper,
        TripCreationRoutePanel,
        TripCarStepPanel,
        TripSeatMapPanel,
        TripContributionStepPanel,
        TripPreferencesStepPanel,
        TripReviewStepPanel,
        TripPointDetailFields,
        DatePicker,
        autocomplete,
        WeeklySchedule,
        SvgItem,
        modal,
        AppButton,
        AppField,
        AppInput
    },

    inject: ['newTripForm'],

    props: {
        draftSavingEnabled: {
            type: Boolean,
            default: true
        }
    },

    data() {
        const routeBase = process.env.ROUTE_BASE || '/';
        const normalizedBase = routeBase.endsWith('/') ? routeBase : `${routeBase}/`;

        return {
            STEP,
            currentStep: STEP.ROLE,
            maxVisitedStep: STEP.ROLE,
            incompleteSteps: [],
            stepErrors: {},
            draftTimer: null,
            pasajeroLogoBlanco: `${normalizedBase}img/icono-pasajero-blanco.png`,
            pasajeroLogoGris: `${normalizedBase}img/icono-pasajero-gris.png`,
            syncingStepFromRoute: false,
            showTemplateModal: false,
            availableTemplates: [],
            selectedTemplateName: '',
            allowDraftPersist: true
        };
    },

    computed: {
        form() {
            return this.newTripForm;
        },
        isPassenger() {
            return Number(this.form.trip.is_passenger) === 1;
        },
        isEditTripFlow() {
            return Boolean(this.form.id || this.form.updatingTrip);
        },
        lastPoint() {
            return last(this.form.points) || { name: '', error: { state: false, message: '' } };
        },
        previousStep() {
            return getPreviousStep(
                this.currentStep,
                this.isPassenger,
                this.navigationOptions
            );
        },
        navigationOptions() {
            return {
                wantsIntermediateStops: this.form.wantsIntermediateStops,
                seatPriceEnabled: Boolean(
                    this.form.config && this.form.config.module_seat_price_enabled
                )
            };
        },
        intermediatePoints() {
            return getIntermediatePoints(this.form.points);
        },
        submitLabel() {
            if (this.form.saving) {
                return this.savingLabel;
            }
            if (this.isEditTripFlow) {
                return this.$t('actualizar');
            }
            return this.$t('tripCreationPublish');
        },
        savingLabel() {
            return this.isEditTripFlow ? this.$t('guardando') : this.$t('creando');
        },
        totalPeople() {
            return Number(this.form.trip.total_seats) + 1;
        },
        isSubmitDisabled() {
            if (this.form.saving) {
                return true;
            }
            if (!this.isPassenger && !this.form.no_lucrar) {
                return true;
            }
            return false;
        },
        reviewDateLabel() {
            if (this.form.useWeeklySchedule) {
                return '';
            }
            if (!this.form.dateAnswer || !dayjs(this.form.dateAnswer).isValid()) {
                return '';
            }
            return dayjs(this.form.dateAnswer).format('ddd, D MMM');
        },
        reviewTimeLabel() {
            const time = this.form.useWeeklySchedule
                ? this.form.weeklyScheduleTime
                : this.form.time;
            if (!time) {
                return '';
            }
            return `${time} hs`;
        },
        reviewVehicleLabel() {
            const carId = resolveTripCarId(
                this.form.cars,
                this.form.selectedCarId
            );
            const car = activeCarsWithPlate(this.form.cars).find(
                (item) => String(item.id) === String(carId)
            );
            return formatCarDropdownLabel(car);
        },
        isNextDisabled() {
            return shouldDisableTripCreationNext({
                currentStep: this.currentStep,
                tripInfoStatus: this.form.tripInfoStatus
            });
        },
        hasAvailableTemplates() {
            return this.availableTemplates.length > 0;
        }
    },

    watch: {
        '$route.query.step'(value) {
            if (this.syncingStepFromRoute) {
                return;
            }

            const step = resolveStepFromQuery(value, this.stepQueryContext());
            if (step == null || step === this.currentStep) {
                return;
            }

            if (!this.isEditTripFlow && step > this.maxVisitedStep) {
                this.syncStepToRoute(this.currentStep);
                return;
            }

            this.syncingStepFromRoute = true;
            this.setCurrentStep(step, { syncUrl: false });
            this.syncingStepFromRoute = false;
        },
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
        this.initializeWizardNavigation();
        this.refreshAvailableTemplates();
    },

    activated() {
        this.refreshAvailableTemplates();
    },

    beforeUnmount() {
        this.cancelDraftSave();
    },

    methods: {
        initializeWizardNavigation() {
            const draft =
                !this.isEditTripFlow && this.form.user?.id
                    ? loadTripCreationDraft(this.form.user.id)
                    : null;
            const mount = getTripCreationWizardMountState({
                isEdit: this.isEditTripFlow,
                draft,
                resumeDraft: this.$route.query.resumeDraft === '1'
            });

            this.allowDraftPersist = mount.allowDraftPersist;

            if (mount.shouldRestoreDraft) {
                this.restoreDraft();
                this.revalidateVisitedSteps();
            } else if (!this.isEditTripFlow) {
                this.currentStep = mount.currentStep;
                this.maxVisitedStep = mount.maxVisitedStep;
                this.incompleteSteps = [];
            } else {
                this.currentStep = mount.currentStep;
                this.maxVisitedStep = mount.maxVisitedStep;
            }

            if (
                !mount.ignoreRouteStep &&
                this.$route.query.step != null &&
                this.$route.query.step !== ''
            ) {
                this.applyStepFromRouteQuery();
            } else {
                this.syncStepToRoute(this.currentStep);
            }
        },
        openWizardTimePicker() {
            const component = this.$refs.wizardTimeInput;
            const input = component?.$refs?.inputEl ?? component;
            if (!input) {
                return;
            }
            if (typeof input.showPicker === 'function') {
                input.showPicker();
                return;
            }
            input.focus();
            input.click();
        },
        cancelDraftSave() {
            if (this.draftTimer) {
                clearTimeout(this.draftTimer);
                this.draftTimer = null;
            }
        },
        scheduleDraftSave() {
            if (
                !this.draftSavingEnabled ||
                !this.allowDraftPersist ||
                this.isEditTripFlow ||
                this.form.saving
            ) {
                return;
            }
            this.cancelDraftSave();
            this.draftTimer = setTimeout(() => this.persistDraft(), 400);
        },
        persistDraft() {
            if (
                !this.draftSavingEnabled ||
                !this.allowDraftPersist ||
                this.isEditTripFlow ||
                !this.form.user?.id ||
                this.form.saving
            ) {
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
                seatLayoutCapacity: this.form.seatLayoutCapacity,
                passengerSeatAvailability: Array.isArray(
                    this.form.passengerSeatAvailability
                )
                    ? this.form.passengerSeatAvailability.slice()
                    : [],
                allowForeignPoints: this.form.allowForeignPoints,
                wantsIntermediateStops: this.form.wantsIntermediateStops,
                parentTripId: this.form.parentTripId,
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

            applyTripCreationTemplateToForm(this.form, draft);
            this.form.parentTripId = draft.parentTripId || null;
            this.currentStep = draft.currentStep || STEP.ROLE;
            this.maxVisitedStep = draft.maxVisitedStep || this.currentStep;
            if (
                this.form.points[0]?.json &&
                last(this.form.points)?.json
            ) {
                this.form.calcRoute();
            }
        },
        refreshAvailableTemplates() {
            if (!this.form.user?.id) {
                this.availableTemplates = [];
                return Promise.resolve();
            }

            return listTripCreationTemplates(this.form.user.id)
                .then((templates) => {
                    this.availableTemplates = templates;
                })
                .catch(() => {
                    this.availableTemplates = [];
                });
        },
        openTemplateModal() {
            this.refreshAvailableTemplates().then(() => {
                if (!this.hasAvailableTemplates) {
                    return;
                }

                this.selectedTemplateName = '';
                this.showTemplateModal = true;
            });
        },
        closeTemplateModal() {
            this.showTemplateModal = false;
            this.selectedTemplateName = '';
        },
        onTemplateSelectChange() {
            const templateName = this.selectedTemplateName;
            if (!templateName) {
                return;
            }

            const selected = this.availableTemplates.find(
                (template) => template.name === templateName
            );

            if (selected) {
                this.onSelectTemplate(selected.name, selected.data);
                return;
            }

            loadTripCreationTemplate(this.form.user.id, templateName)
                .then((template) => {
                    if (!template) {
                        return;
                    }

                    this.onSelectTemplate(templateName, template);
                });
        },
        onSelectTemplate(templateName, templateData) {
            if (!templateData) {
                return;
            }

            this.closeTemplateModal();

            applyTripCreationTemplateToForm(this.form, templateData, {
                useDefaultScheduleTime: true
            });
            const navigation = getWizardNavigationAfterTemplateApply();
            this.setCurrentStep(navigation.currentStep);
            this.maxVisitedStep = navigation.maxVisitedStep;

            if (
                this.form.points[0]?.json &&
                last(this.form.points)?.json
            ) {
                this.form.calcRoute();
            }

            this.revalidateVisitedSteps();
        },
        buildValidationContext() {
            return {
                points: this.form.points,
                puntoPartida: this.form.trip.punto_partida,
                puntoLlegada: this.form.trip.punto_llegada,
                useWeeklySchedule: this.form.useWeeklySchedule,
                weeklySchedule: this.form.weeklySchedule,
                weeklyScheduleTime: this.form.weeklyScheduleTime,
                dateAnswer: this.form.dateAnswer,
                time: this.form.time,
                isPassenger: this.isPassenger,
                cars: this.form.cars,
                selectedCarId: this.form.selectedCarId,
                seatLayoutCapacity: this.form.seatLayoutCapacity,
                totalSeats: this.form.trip.total_seats,
                passengers: this.form.passengers,
                description: this.form.trip.description,
                noLucrar: this.form.no_lucrar,
                seatPriceEnabled: Boolean(
                    this.form.config && this.form.config.module_seat_price_enabled
                ),
                maxPriceEnabled: Boolean(
                    this.form.config && this.form.config.module_max_price_enabled
                ),
                price: this.form.price,
                maximumSeatPriceCents: this.form.maximum_seat_price_cents,
                maximumTripPriceCents: this.form.maximum_trip_price_cents
            };
        },
        syncPuntoDetailErrors(errors = {}) {
            if (errors.puntoPartida) {
                this.form.puntoPartidaError.state = true;
                this.form.puntoPartidaError.message = this.$t(errors.puntoPartida);
            } else if (this.currentStep === STEP.ORIGIN) {
                this.form.puntoPartidaError.state = false;
            }

            if (errors.puntoLlegada) {
                this.form.puntoLlegadaError.state = true;
                this.form.puntoLlegadaError.message = this.$t(errors.puntoLlegada);
            } else if (this.currentStep === STEP.DESTINATION) {
                this.form.puntoLlegadaError.state = false;
            }
        },
        syncSeatPriceErrors(errors = {}) {
            if (this.currentStep !== STEP.CONTRIBUTION) {
                return;
            }

            if (errors.price === 'precioMaximoExcedido') {
                this.form.priceError.state = true;
                this.form.priceError.message =
                    this.form.getMaxContributionExceededMessage(
                        this.form.maximum_seat_price_cents
                    );
                return;
            }

            if (errors.price) {
                this.form.priceError.state = true;
                this.form.priceError.message = this.$t(errors.price);
                return;
            }

            this.form.priceError.state = false;
        },
        validateCurrentStep() {
            const result = validateStep(this.currentStep, this.buildValidationContext());
            this.stepErrors = result.errors || {};
            this.syncPuntoDetailErrors(this.stepErrors);
            this.syncSeatPriceErrors(this.stepErrors);
            this.syncDescriptionErrors(this.stepErrors);
            this.updateIncompleteSteps(this.currentStep, result.valid);
            return result.valid;
        },
        syncDescriptionErrors(errors = {}) {
            if (this.currentStep !== STEP.DESCRIPTION) {
                return;
            }
            if (errors.description) {
                this.form.commentError.state = true;
                this.form.commentError.message = this.$t(errors.description);
                return;
            }
            this.form.commentError.state = false;
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
            for (let s = STEP.ROLE; s <= this.maxVisitedStep; s++) {
                if (this.isPassenger && (s === STEP.CAR || s === STEP.CONTRIBUTION)) {
                    continue;
                }
                if (
                    s === STEP.CONTRIBUTION &&
                    !this.navigationOptions.seatPriceEnabled
                ) {
                    continue;
                }
                const result = validateStep(s, this.buildValidationContext());
                if (!result.valid) {
                    steps.push(s);
                }
            }
            this.incompleteSteps = steps;
        },
        intermediateIndex(localIndex) {
            return localIndex + 1;
        },
        syncIntermediatePoints() {
            this.form.points = removeEmptyIntermediatePoints(this.form.points);
            if (
                this.form.points[0]?.json &&
                last(this.form.points)?.json
            ) {
                this.form.calcRoute();
            }
        },
        stepQueryContext() {
            return {
                isPassenger: this.isPassenger,
                isEdit: this.isEditTripFlow,
                seatPriceEnabled: this.navigationOptions.seatPriceEnabled
            };
        },
        applyStepFromRouteQuery() {
            const step = resolveStepFromQuery(
                this.$route.query.step,
                this.stepQueryContext()
            );
            if (step == null) {
                return;
            }

            this.syncingStepFromRoute = true;
            this.setCurrentStep(step, { syncUrl: false });
            this.syncingStepFromRoute = false;
        },
        setCurrentStep(step, { syncUrl = true } = {}) {
            this.currentStep = step;
            this.maxVisitedStep = Math.max(this.maxVisitedStep, step);
            if (step === STEP.CONTRIBUTION) {
                this.ensureContributionPrefill();
            }
            if (syncUrl && !this.syncingStepFromRoute) {
                this.syncStepToRoute(step);
            }
        },
        ensureContributionPrefill() {
            if (this.form.price !== '' && this.form.price != null) {
                return;
            }
            const units = contributionUnitsFromCents(
                this.form.recommended_seat_price_cents
            );
            if (units === '') {
                return;
            }
            this.form.price = units;
            if (typeof this.form.onOutboundPriceFieldInput === 'function') {
                this.form.onOutboundPriceFieldInput();
            }
        },
        onContributionPriceUpdate(value) {
            this.form.price = value;
            if (typeof this.form.onOutboundPriceFieldInput === 'function') {
                this.form.onOutboundPriceFieldInput();
            }
        },
        syncStepToRoute(step) {
            const nextStep = formatStepQueryValue(step);
            if (this.$route.query.step === nextStep) {
                return;
            }

            const navigation = this.$router.replace({
                query: {
                    ...this.$route.query,
                    step: nextStep
                }
            });
            if (navigation && typeof navigation.catch === 'function') {
                navigation.catch(() => {});
            }
        },
        onStepSelect(step) {
            if (
                this.currentStep === STEP.STOPS &&
                step !== STEP.STOPS
            ) {
                this.syncIntermediatePoints();
            }
            this.setCurrentStep(step);
        },
        goNext() {
            if (!this.validateCurrentStep()) {
                return;
            }
            if (
                shouldDisableTripCreationNext({
                    currentStep: this.currentStep,
                    tripInfoStatus: this.form.tripInfoStatus
                })
            ) {
                return;
            }
            if (
                this.currentStep === STEP.DESTINATION &&
                !this.form.wantsIntermediateStops
            ) {
                this.syncIntermediatePoints();
            }
            const next = getNextStep(
                this.currentStep,
                this.isPassenger,
                this.navigationOptions
            );
            if (next) {
                if (
                    next === STEP.STOPS &&
                    this.intermediatePoints.length === 0
                ) {
                    this.form.addPoint(true);
                }
                if (next !== STEP.STOPS && this.currentStep === STEP.STOPS) {
                    this.syncIntermediatePoints();
                }
                this.setCurrentStep(next);
            }
        },
        goBack() {
            if (this.currentStep === STEP.STOPS) {
                this.syncIntermediatePoints();
            }
            const prev = getPreviousStep(
                this.currentStep,
                this.isPassenger,
                this.navigationOptions
            );
            if (prev) {
                this.setCurrentStep(prev);
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
        async onSubmit() {
            if (!this.validateCurrentStep()) {
                return;
            }
            await this.form.save();
            if (this.form.saving || this.form.showWizardSuccess) {
                return;
            }
            this.handleSaveFailure();
        },
        handleSaveFailure() {
            if (this.form.carSelectionError?.state) {
                this.setCurrentStep(STEP.CAR);
                return;
            }
            if (this.form.showCompleteCarModal || this.form.showTripCarsModal) {
                return;
            }
            this.revalidateVisitedSteps();
            const firstIncomplete = this.incompleteSteps[0];
            if (firstIncomplete) {
                this.setCurrentStep(firstIncomplete);
            }
        },
        setPassengerMode(value) {
            if (Number(this.form.trip.is_passenger) === value) {
                return;
            }
            this.form.trip.is_passenger = value;
            if (this.isPassenger && this.currentStep === STEP.CAR) {
                this.setCurrentStep(STEP.SCHEDULE);
            }
            this.revalidateVisitedSteps();
            this.scheduleDraftSave();
        }
    }
};
</script>

<style scoped>
@media (max-width: 767px) {
    .new-trip-wizard {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

.new-trip-wizard :deep(.form-control),
.new-trip-wizard :deep(textarea.form-control),
.new-trip-wizard :deep(select.form-control) {
    display: block;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    border: 1px solid var(--ds-input-border);
    border-radius: var(--ds-radius-input, 8px);
    background-color: var(--ds-input-bg);
    color: var(--ds-input-text);
    font-family: inherit;
    font-size: var(--ds-input-font-size);
    line-height: 1.3;
    padding: var(--ds-input-padding-y) var(--ds-input-padding-x);
    box-shadow: none;
}

.new-trip-wizard :deep(.form-control.form-control-with-icon) {
    padding-left: 2.75rem;
}

.new-trip-wizard :deep(.form-control:focus),
.new-trip-wizard :deep(textarea.form-control:focus),
.new-trip-wizard :deep(select.form-control:focus) {
    outline: none;
    border-color: var(--ds-input-focus-border);
    box-shadow: var(--ds-input-focus-ring);
}

.new-trip-wizard :deep(.form-control::placeholder),
.new-trip-wizard :deep(textarea.form-control::placeholder) {
    color: var(--ds-input-placeholder);
}

.new-trip-wizard :deep(.control-label),
.new-trip-wizard :deep(label) {
    color: var(--ds-input-label);
}

.new-trip-wizard :deep(span.error) {
    display: block;
    color: var(--main-error, #d72521);
    font-size: 0.875rem;
    font-weight: bold;
}

.new-trip-wizard__allow-foreign label {
    color: var(--ds-text-primary, #22211f) !important;
}

.new-trip-wizard :deep(.trip_terms_label),
.new-trip-wizard :deep(.trip_terms label),
.new-trip-wizard :deep(.trip_allow-foreign label) {
    color: var(--ds-text-primary, #22211f) !important;
}

.new-trip-wizard :deep(.date-picker),
.new-trip-wizard :deep(.carpoolear-vue-dp) {
    width: 100%;
    --dp-font-family: var(--ds-font-family, inherit);
    --dp-font-size: var(--ds-input-font-size);
    --dp-text-color: var(--ds-input-text);
    --dp-input-padding: var(--ds-input-padding-y) 2.25rem
        var(--ds-input-padding-y) 2.5rem;
    --dp-input-icon-padding: 0;
}

.new-trip-wizard :deep(.date-picker .date-picker__surface) {
    position: relative;
    border: 1px solid var(--ds-input-border);
    border-radius: var(--ds-radius-input, 8px);
    background-color: var(--ds-input-bg);
    background-image: none;
    color: var(--ds-input-text);
    padding: 0;
    box-shadow: none;
    min-height: 0;
}

.new-trip-wizard :deep(.date-picker .date-picker__surface:focus-within) {
    outline: none;
    border-color: var(--ds-input-focus-border);
    box-shadow: var(--ds-input-focus-ring);
}

.new-trip-wizard :deep(.carpoolear-vue-dp .dp__input) {
    border: 0;
    border-radius: var(--ds-radius-input, 8px);
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20448%20512%27%20fill%3D%27%23555555%27%3E%3Cpath%20d%3D%27M152%2064H296V24C296%2010.7%20306.7%200%20320%200C333.3%200%20344%2010.7%20344%2024V64H384C419.3%2064%20448%2092.7%20448%20128V448C448%20483.3%20419.3%20512%20384%20512H64C28.7%20512%200%20483.3%200%20448V128C0%2092.7%2028.7%2064%2064%2064H104V24C104%2010.7%20114.7%200%20128%200C141.3%200%20152%2010.7%20152%2024V64zM48%20448C48%20456.8%2055.2%20464%2064%20464H384C392.8%20464%20400%20456.8%20400%20448V192H48V448z%27/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 0.75rem center;
    background-size: 1.1rem 1.1rem;
    color: var(--ds-input-text);
    font-size: var(--ds-input-font-size);
    line-height: 1.3;
    padding: var(--ds-input-padding-y) 2.25rem var(--ds-input-padding-y)
        2.5rem;
    box-shadow: none;
    min-height: 0;
}

.new-trip-wizard :deep(.carpoolear-vue-dp .dp__input:focus) {
    outline: none;
    border: 0;
    box-shadow: none;
}

.new-trip-wizard :deep(.date-picker--cross) {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    transform: translateY(-50%);
    z-index: 2;
    color: var(--ds-text-muted, #737373);
    line-height: 1;
}

.new-trip-wizard :deep(.date-picker--cross i) {
    color: inherit;
    cursor: pointer;
}

.new-trip-wizard .trip_datetime .new-trip-wizard__time-field {
    position: relative;
}

.new-trip-wizard .trip_datetime .new-trip-wizard__time-input :deep(
    input[type='time']::-webkit-calendar-picker-indicator
) {
    opacity: 0;
    display: none;
}

.new-trip-wizard .trip_datetime .new-trip-wizard__time-caret {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--ds-text-muted, #737373);
    cursor: pointer;
    line-height: 1;
}

.new-trip-wizard .trip_datetime .new-trip-wizard__time-caret:focus-visible {
    outline: 2px solid var(--ds-input-focus-border, #66afe9);
    outline-offset: 2px;
    border-radius: 2px;
}

.new-trip-wizard__subtitle {
    margin-bottom: 1.25rem;
    color: #555;
}

.new-trip-wizard__template-action {
    display: flex;
    justify-content: center;
    margin-bottom: 0;
}

.new-trip-wizard__template-button {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    width: auto;
}

.new-trip-wizard__template-button-icon {
    line-height: 1;
}

.new-trip-wizard__template-or {
    margin: 1rem 0;
    text-align: center;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;
    color: #555;
}

.new-trip-wizard__template-modal label {
    color: #333;
}

.new-trip-wizard__role-cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.new-trip-wizard__role-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: #fff;
    text-align: center;
    cursor: pointer;
}

.new-trip-wizard__role-card--active {
    border-color: var(--ds-action, #1e5f9e);
    background: var(--ds-action-bg, rgba(30, 95, 158, 0.06));
}

.new-trip-wizard__role-card-icon {
    font-size: 2rem;
    color: var(--ds-action, #1e5f9e);
}

.new-trip-wizard__role-card-image {
    width: 2rem;
    height: 2rem;
}

.new-trip-wizard__role-card-title {
    font-weight: 700;
    font-size: 1rem;
}

.new-trip-wizard__wants-stops {
    margin: 1rem 0;
}

.new-trip-wizard__stop {
    margin-bottom: 0.75rem;
}

.new-trip-wizard__remove-stop {
    margin-top: 0.25rem;
    padding: 0;
}

.new-trip-wizard__add-stop {
    margin-bottom: 1rem;
}

.new-trip-wizard__question {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.new-trip-wizard__allow-foreign {
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

.trip-comfort-preference {
    margin: 0.5rem 0;
}

.trip-comfort-preference__label {
    display: inline-flex;
    align-items: center;
    gap: 0.65em;
    margin: 0;
    font-weight: normal;
}

.trip-comfort-preference__label input[type='checkbox'] {
    margin: 0;
    flex-shrink: 0;
}

.new-trip-wizard__template-select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.new-trip-wizard__template-select:focus {
    outline: none;
}

</style>
