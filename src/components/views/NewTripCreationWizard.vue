<template>
    <div class="new-trip-wizard">
        <h2 class="new-trip-wizard__title">{{ wizardTitle }}</h2>

        <TripCreationStepper
            :current-step="currentStep"
            :max-visited-step="maxVisitedStep"
            :is-passenger="isPassenger"
            :incomplete-steps="incompleteSteps"
            @select="onStepSelect"
        />

        <div
            class="new-trip-wizard__step"
            :data-testid="`trip-creation-wizard-step-${currentStep}`"
        >
            <!-- Step 1: Role -->
            <template v-if="currentStep === STEP.ROLE && !form.updatingTrip">
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
                        <span class="new-trip-wizard__role-card-text">
                            {{ $t('tripCreationRoleDriverDescription') }}
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
                        <span class="new-trip-wizard__role-card-text">
                            {{ $t('tripCreationRolePassengerDescription') }}
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
                    <autocomplete
                        :placeholder="form.$t('ingresePuntoIntermedio')"
                        :name="`wizard-stop-${index}`"
                        :model-value="point.name"
                        v-on:place_changed="(data) => form.getPlace(intermediateIndex(index), data)"
                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                        :country="form.allowForeignPoints ? null : 'AR'"
                    ></autocomplete>
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
                    @edit-cars="form.openTripCarsModal"
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
                        <label
                            for="wizard-comfort-rear"
                            class="label-soft trip-comfort-preference__label"
                        >
                            <input
                                type="checkbox"
                                id="wizard-comfort-rear"
                                :checked="form.trip.rear_max_two_passengers"
                                @change="form.onOutboundRearMaxTwoChange($event)"
                            />
                            <span>{{ $t('atrasViajanSolo2Personas') }}</span>
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
                            class="form-control form-control-with-icon form-control-price"
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
                    class="form-control new-trip-wizard__description"
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
                <div
                    v-if="!isPassenger"
                    class="new-trip-wizard__last-section new-trip-wizard__last-section--lucrar"
                >
                    <div class="trip_terms trip_terms--lucrar-card">
                        <input
                            type="checkbox"
                            id="wizard-no-lucrar"
                            v-model="form.no_lucrar"
                            class="checkbox-button trip_terms--lucrar-card__input"
                        />
                        <label
                            for="wizard-no-lucrar"
                            class="trip_terms_label checkbox-click-target trip_terms--lucrar-card__label"
                            :class="{ 'has-error': form.lucrarError.state }"
                        >
                            <span
                                class="checkbox-box trip_terms--lucrar-card__box"
                            ></span>
                            <div class="trip_terms--lucrar-card__copy">
                                <div class="trip_terms--lucrar-card__title-row">
                                    <strong class="trip_terms--lucrar-card__title">{{
                                        $t('meComprometo')
                                    }}</strong>
                                    <span
                                        class="tooltip-bottom trip_terms--lucrar-card__tooltip"
                                        role="button"
                                        tabindex="0"
                                        :data-tooltip="$t('meComprometoLucroTooltip')"
                                    >
                                        <img
                                            :src="form.tripStaticImg('icon-info.svg')"
                                            alt=""
                                            class="trip-form-info-icon"
                                        />
                                    </span>
                                </div>
                                <p class="trip_terms--lucrar-card__lead">
                                    {{ $t('viajeColaborativoLead') }}
                                </p>
                                <p class="trip_terms--lucrar-card__text">
                                    {{ $t('contribucionMaxima') }}
                                </p>
                            </div>
                        </label>
                    </div>
                    <span class="error" v-if="form.lucrarError.state">
                        {{ form.lucrarError.message }}
                    </span>
                </div>
                <div class="new-trip-wizard__last-section new-trip-wizard__last-section--preferences">
                    <legend class="label-for-group">
                        {{ $t('preferenciasViaje') }}
                    </legend>
                    <div class="preferences row trip-pref-cards">
                        <div class="col-xs-8 trip-pref-cards__cell">
                            <div class="trip-pref-card">
                                <input
                                    type="checkbox"
                                    id="wizard-pref-smoking"
                                    v-model="form.trip.allow_smoking"
                                    class="trip-pref-card__input sr-only"
                                />
                                <label
                                    for="wizard-pref-smoking"
                                    class="trip-pref-card__label"
                                >
                                    <span class="trip-pref-card__surface">
                                        <span
                                            class="trip-pref-card__badge"
                                            aria-hidden="true"
                                        >
                                            <i
                                                class="fa fa-check"
                                                aria-hidden="true"
                                            ></i>
                                        </span>
                                        <img
                                            :src="form.tripStaticImg('icon-smoke.svg')"
                                            alt=""
                                            class="trip-pref-card__icon"
                                        />
                                    </span>
                                    <span
                                        class="trip-pref-card__caption label-soft"
                                    >
                                        {{ $t('preferenciaPermitidoFumar') }}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div class="col-xs-8 trip-pref-cards__cell">
                            <div class="trip-pref-card">
                                <input
                                    type="checkbox"
                                    id="wizard-pref-animals"
                                    v-model="form.trip.allow_animals"
                                    class="trip-pref-card__input sr-only"
                                />
                                <label
                                    for="wizard-pref-animals"
                                    class="trip-pref-card__label"
                                >
                                    <span class="trip-pref-card__surface">
                                        <span
                                            class="trip-pref-card__badge"
                                            aria-hidden="true"
                                        >
                                            <i
                                                class="fa fa-check"
                                                aria-hidden="true"
                                            ></i>
                                        </span>
                                        <img
                                            :src="form.tripStaticImg('icon-pet.svg')"
                                            alt=""
                                            class="trip-pref-card__icon"
                                        />
                                    </span>
                                    <span
                                        class="trip-pref-card__caption label-soft"
                                    >
                                        {{ $t('preferenciaPermitidoAnimales') }}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div class="col-xs-8 trip-pref-cards__cell">
                            <div class="trip-pref-card">
                                <input
                                    type="checkbox"
                                    id="wizard-pref-kids"
                                    v-model="form.trip.allow_kids"
                                    class="trip-pref-card__input sr-only"
                                />
                                <label
                                    for="wizard-pref-kids"
                                    class="trip-pref-card__label"
                                >
                                    <span class="trip-pref-card__surface">
                                        <span
                                            class="trip-pref-card__badge"
                                            aria-hidden="true"
                                        >
                                            <i
                                                class="fa fa-check"
                                                aria-hidden="true"
                                            ></i>
                                        </span>
                                        <img
                                            :src="form.tripStaticImg('icon-baby.svg')"
                                            alt=""
                                            class="trip-pref-card__icon"
                                        />
                                    </span>
                                    <span
                                        class="trip-pref-card__caption label-soft"
                                    >
                                        {{ $t('preferenciaPermitidoNinos') }}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <span class="error" v-if="stepErrors.lastDetails">{{ $t(stepErrors.lastDetails) }}</span>
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
                    <div class="form-group">
                        <label for="trip-creation-template-select">
                            {{ $t('tripCreationTemplateNameLabel') }}
                        </label>
                        <select
                            id="trip-creation-template-select"
                            v-model="selectedTemplateName"
                            class="form-control"
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
                    </div>
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
import modal from '../Modal';
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
    hasTripCreationTemplates,
    listTripCreationTemplates,
    loadTripCreationTemplate
} from '../../utils/tripCreationTemplate.js';
import {
    formatStepQueryValue,
    resolveStepFromQuery
} from '../../utils/tripCreationStepQuery.js';

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
        spinner,
        modal
    },

    inject: ['newTripForm'],

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
            selectedTemplateName: ''
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
            return getPreviousStep(
                this.currentStep,
                this.isPassenger,
                this.navigationOptions
            );
        },
        navigationOptions() {
            return {
                wantsIntermediateStops: this.form.wantsIntermediateStops
            };
        },
        intermediatePoints() {
            return getIntermediatePoints(this.form.points);
        },
        wizardTitle() {
            if (this.form.updatingTrip) {
                return this.$t('editarViaje');
            }
            if (this.currentStep === STEP.ROLE) {
                return this.$t('crearViajeTitulo');
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
        if (this.form.updatingTrip) {
            this.currentStep = STEP.ORIGIN;
            this.maxVisitedStep = STEP.LAST_DETAILS;
        } else {
            const shouldResume =
                this.$route.query.resumeDraft === '1' ||
                loadTripCreationDraft(this.form.user?.id);
            if (shouldResume && this.form.user?.id) {
                this.restoreDraft();
            }
        }

        if (this.$route.query.step != null && this.$route.query.step !== '') {
            this.applyStepFromRouteQuery();
        } else {
            this.syncStepToRoute(this.currentStep);
        }

        this.refreshAvailableTemplates();
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
            if (!this.form.user?.id || !hasTripCreationTemplates(this.form.user.id)) {
                this.availableTemplates = [];
                return;
            }

            this.availableTemplates = listTripCreationTemplates(this.form.user.id);
        },
        openTemplateModal() {
            this.refreshAvailableTemplates();
            if (!this.hasAvailableTemplates) {
                return;
            }

            this.showTemplateModal = true;
            this.selectedTemplateName = '';
        },
        closeTemplateModal() {
            this.showTemplateModal = false;
            this.selectedTemplateName = '';
        },
        onTemplateSelectChange() {
            if (!this.selectedTemplateName) {
                return;
            }

            this.onSelectTemplate(this.selectedTemplateName);
        },
        onSelectTemplate(templateName) {
            const template = loadTripCreationTemplate(this.form.user.id, templateName);
            if (!template) {
                return;
            }

            applyTripCreationTemplateToForm(this.form, template);
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
            this.closeTemplateModal();
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
            for (let s = STEP.ROLE; s <= this.maxVisitedStep; s++) {
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
                isEdit: Boolean(this.form.updatingTrip)
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
            if (syncUrl && !this.syncingStepFromRoute) {
                this.syncStepToRoute(step);
            }
        },
        syncStepToRoute(step) {
            const nextStep = formatStepQueryValue(step);
            if (this.$route.query.step === nextStep) {
                return;
            }

            this.$router
                .replace({
                    query: {
                        ...this.$route.query,
                        step: nextStep
                    }
                })
                .catch(() => {});
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
                this.setCurrentStep(STEP.SCHEDULE);
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

@media (max-width: 767px) {
    .new-trip-wizard {
        padding-left: 1rem;
        padding-right: 1rem;
    }
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
    border-color: var(--primary-color, #d72521);
    background: rgba(215, 37, 33, 0.06);
}

.new-trip-wizard__role-card-icon {
    font-size: 2rem;
    color: var(--primary-color, #d72521);
}

.new-trip-wizard__role-card-image {
    width: 2rem;
    height: 2rem;
}

.new-trip-wizard__role-card-title {
    font-weight: 700;
    font-size: 1rem;
}

.new-trip-wizard__role-card-text {
    font-size: 0.8125rem;
    color: #666;
    line-height: 1.35;
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

.new-trip-wizard__description {
    min-height: 10rem;
    height: auto;
    resize: vertical;
}

.new-trip-wizard__last-section--preferences {
    margin-top: 1.75rem;
}
</style>

<style>
/* Last-details blocks mirror NewTrip.vue (scoped there); wizard needs global rules. */
.new-trip-wizard__last-section--lucrar .trip_terms--lucrar-card {
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
    max-width: 100%;
    background: var(--form-background, #fff);
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    box-sizing: border-box;
}

.new-trip-wizard__last-section--lucrar
    .trip_terms--lucrar-card__label.trip_terms_label,
.new-trip-wizard__last-section--lucrar
    .trip_terms--lucrar-card__label.checkbox-click-target {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    margin: 0;
    padding: 14px 16px;
    box-sizing: border-box;
    color: #111;
    line-height: 1.4;
    vertical-align: unset;
}

.new-trip-wizard__last-section--lucrar
    .trip_terms--lucrar-card__label.trip_terms_label.has-error {
    color: #111;
}

.new-trip-wizard__last-section--lucrar
    .trip_terms--lucrar-card__box.checkbox-box {
    position: relative;
    top: 2px;
    left: 0;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-width: 2px;
    border-radius: 5px;
    border-color: #aeb6bd;
}

.new-trip-wizard__last-section--lucrar
    .trip_terms--lucrar-card__box.checkbox-box:after {
    width: 11px;
    height: 7px;
    left: 3px;
    top: 5px;
    border: 2px solid #444;
    border-top: none;
    border-right: none;
}

.new-trip-wizard__last-section--lucrar .trip_terms--lucrar-card__copy {
    flex: 1;
    min-width: 0;
}

.new-trip-wizard__last-section--lucrar .trip_terms--lucrar-card__title-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 0.35rem;
}

.new-trip-wizard__last-section--lucrar .trip_terms--lucrar-card__tooltip {
    flex-shrink: 0;
    margin-top: 0.15em;
}

.new-trip-wizard__last-section--lucrar .trip_terms--lucrar-card__title {
    flex: 1 1 0;
    min-width: 0;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.35;
    color: #111;
}

.new-trip-wizard__last-section--lucrar .trip_terms--lucrar-card__lead {
    margin: 0.65rem 0 0 0;
    font-weight: 700;
    font-size: 0.9375rem;
    color: #111;
    line-height: 1.35;
}

.new-trip-wizard__last-section--lucrar .trip_terms--lucrar-card__text {
    margin: 0.4rem 0 0 0;
    font-weight: 400;
    font-size: 0.8125rem;
    color: #111;
    line-height: 1.45;
}

.new-trip-wizard__last-section--lucrar
    .trip_terms--lucrar-card__label.has-error
    .trip_terms--lucrar-card__title {
    color: var(--main-error, #d72521);
}

.new-trip-wizard__last-section .trip-form-info-icon {
    width: 1.1em;
    height: 1.1em;
    vertical-align: middle;
    display: inline-block;
}

.new-trip-wizard__last-section--preferences .trip-pref-cards__cell {
    text-align: center;
    margin-bottom: 0.35rem;
}

.new-trip-wizard__last-section--preferences .trip-pref-card {
    display: inline-block;
    max-width: 100%;
}

.new-trip-wizard__last-section--preferences .trip-pref-card__label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin: 0;
    font-weight: normal;
}

.new-trip-wizard__last-section--preferences .trip-pref-card__surface {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.15rem;
    height: 3.15rem;
    box-sizing: border-box;
    border: 1px solid #cfd4d8;
    border-radius: 4px;
    background: #fffef8;
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease;
}

.new-trip-wizard__last-section--preferences
    .trip-pref-card__input:checked
    + .trip-pref-card__label
    .trip-pref-card__surface {
    border-color: var(--primary-color, #0070b8);
    background: #fffef8;
}

.new-trip-wizard__last-section--preferences .trip-pref-card__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 1.125rem;
    height: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid #aeb6bd;
    background: #fff;
    color: #fff;
    font-size: 0.65rem;
    line-height: 1;
    pointer-events: none;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease,
        box-shadow 0.15s ease;
}

.new-trip-wizard__last-section--preferences
    .trip-pref-card__badge
    .fa-check {
    opacity: 0;
    transform: scale(0.75);
    transition:
        opacity 0.12s ease,
        transform 0.12s ease;
}

.new-trip-wizard__last-section--preferences
    .trip-pref-card__input:checked
    + .trip-pref-card__label
    .trip-pref-card__badge {
    border-color: var(--primary-color, #0070b8);
    background: var(--primary-color, #0070b8);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.new-trip-wizard__last-section--preferences
    .trip-pref-card__input:checked
    + .trip-pref-card__label
    .trip-pref-card__badge
    .fa-check {
    opacity: 1;
    transform: scale(1.12);
}

.new-trip-wizard__last-section--preferences .trip-pref-card__icon {
    display: block;
    object-fit: contain;
    width: 1.4rem;
    height: 1.4rem;
}

.new-trip-wizard__last-section--preferences .trip-pref-card__caption {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.8rem;
    text-align: center;
    color: var(--main-font-color, #555);
    max-width: 7.5rem;
    line-height: 1.25;
}

.new-trip-wizard__last-section--preferences
    .trip-pref-card__input:focus-visible
    + .trip-pref-card__label
    .trip-pref-card__surface {
    outline: 2px solid var(--primary-color, #0070b8);
    outline-offset: 2px;
}

</style>
