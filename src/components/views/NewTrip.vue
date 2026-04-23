<template>
    <div class="new-trip-component container new-trip-tooltips--left">
        <div class="alert alert-info alert-sellado-viaje" v-if="this.config.module_trip_creation_payment_enabled">
            <p>{{ $t('mensajeContandoSobreSelladoViaje') }}</p>
            <p>{{ $t('podesHacerViajesGratis', { freeTrips: free_trips_amount }) }}</p>
            <div v-if="trips_created_by_user_amount >= free_trips_amount">
                <p>{{ $t('yaCreasteViajes', { tripsCreated: trips_created_by_user_amount }) }}</p>
            </div>
            <div v-if="trips_created_by_user_amount < free_trips_amount">
                <p>{{ $t('teQuedaViajesGratis', { remaining: remainingFreeTrips }) }}</p>
            </div>
        </div>

        <div class="form form-trip">
            <div class="row">
                <div :class="columnClass[0]">
                    <h2
                        class="title--desktop"
                        v-if="tripCardTheme === 'light' && !isMobile"
                    >
                        {{ $t('crearViaje') }}
                    </h2>
                    <fieldset
                        class="trip-type-selection"
                        v-if="tripCardTheme !== 'light'"
                    >
                        <div class="radio-option">
                            <input
                                type="radio"
                                id="type-driver"
                                value="0"
                                v-model="trip.is_passenger"
                                :disabled="updatingTrip"
                            />
                            <label for="type-driver" class="control-label">
                                {{ $t('comoConductor') }}
                            </label>
                        </div>
                        <div class="radio-option">
                            <input
                                type="radio"
                                id="type-passenger"
                                value="1"
                                v-model="trip.is_passenger"
                                :disabled="updatingTrip"
                            />
                            <label for="type-passenger" class="control-label">
                                {{ $t('comoPasajero') }}
                            </label>
                        </div>
                    </fieldset>
                    <fieldset
                        class="trip-type-selection--light"
                        v-if="tripCardTheme === 'light'"
                    >
                        <div class="row">
                            <div class="col-xs-12 col-md-12 col-lg-12">
                                <button
                                    class="btn btn-option"
                                    @click="setIsPassenger(0)"
                                    :disabled="updatingTrip"
                                    :class="
                                        trip.is_passenger == 0 ? 'active' : ''
                                    "
                                    v-html="$t('buscoConductor')"
                                >
                                </button>
                            </div>
                            <div class="col-xs-12 col-md-12 col-lg-12">
                                <button
                                    class="btn btn-option"
                                    @click="setIsPassenger(1)"
                                    :disabled="updatingTrip"
                                    :class="
                                        trip.is_passenger == 1 ? 'active' : ''
                                    "
                                >
                                    {{ $t('buscoPasajero') }}
                                </button>
                            </div>
                        </div>
                    </fieldset>
                    <div
                        class="trip_allow-foreign"
                        v-if="!isMobile && tripCardTheme === 'light'"
                    >
                        <span>
                            <input
                                type="checkbox"
                                v-model="allowForeignPoints"
                                id="cbxAllowForeignPoints"
                                class="checkbox-button"
                            />
                            <label
                                for="cbxAllowForeignPoints"
                                class="checkbox-click-target"
                            >
                                <span class="checkbox-box"></span>
                                <span
                                    >{{ $t('origenOdestino') }}
                                    {{ config.country_name }}</span
                                >
                            </label>
                            <span
                                class="tooltip-bottom"
                                :data-tooltip="$t('habilitaOrigen')"
                            >
                                <img
                                    :src="tripStaticImg('icon-info.svg')"
                                    alt=""
                                    class="trip-form-info-icon"
                                />
                            </span>
                        </span>
                    </div>
                    <div
                        class="new-left trip_points trip_points--left"
                        v-if="!isMobile && tripCardTheme === 'light'"
                    >
                        <div
                            v-for="(m, index) in points"
                            class="trip_point location-autocomplete"
                            :class="{ 'trip-error': m.error.state }"
                            :key="m.id"
                        >
                            <span v-if="index == 0" class="sr-only">{{
                                $t('origen')
                            }}</span>
                            <span
                                v-if="index == points.length - 1"
                                class="sr-only"
                            >
                                {{ $t('destino') }}
                            </span>
                            <autocomplete
                                :placeholder="getPlaceholder(index)"
                                name="'input-' + index"
                                ref="'input-' + index"
                                :model-value="m.name"
                                v-on:place_changed="
                                    (data) => getPlace(index, data)
                                "
                                :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                                :country="allowForeignPoints ? null : 'AR'"
                                :class="{ 'has-error': m.error.state }"
                            ></autocomplete>
                            <div
                                @click="resetPoints(m, index)"
                                class="date-picker--cross"
                            >
                                <i aria-hidden="true" class="fa fa-times"></i>
                            </div>
                            <span class="error" v-if="m.error.state">
                                {{ m.error.message }}
                            </span>
                        </div>
                    </div>
                    <div
                        class="trip_terms trip_terms--lucrar-card"
                        v-if="trip.is_passenger == 0"
                    >
                        <input
                            type="checkbox"
                            id="no-lucrar"
                            v-model="no_lucrar"
                            class="checkbox-button trip_terms--lucrar-card__input"
                        />
                        <label
                            for="no-lucrar"
                            class="trip_terms_label checkbox-click-target trip_terms--lucrar-card__label"
                            :class="{ 'has-error': lucrarError.state }"
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
                                            :src="tripStaticImg('icon-info.svg')"
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
                    <!-- <pre style="background: #f5f5f5; padding: 10px; margin: 10px; border-radius: 4px; font-size: 12px;">
{{ JSON.stringify({
    ...this
}, null, 2) }}</pre> -->
                </div>
                <div :class="columnClass[1]">
                    <div class="row">
                        <div class="panel-trip-data">
                            <div
                                class="col-md-24"
                                v-show="isMobile && !tripCardTheme === 'light'"
                            >
                                <hr />
                            </div>
                            <div
                                class="trip_allow-foreign col-md-24"
                                v-if="isMobile || tripCardTheme !== 'light'"
                            >
                                <span>
                                    <input
                                        type="checkbox"
                                        v-model="allowForeignPoints"
                                        id="cbxAllowForeignPoints"
                                    />
                                    <label for="cbxAllowForeignPoints">
                                        {{ $t('origenOdestino') }}
                                        {{ config.country_name }}
                                    </label>
                                    <span
                                        class="tooltip-bottom"
                                        :data-tooltip="$t('habilitaOrigen')"
                                    >
                                        <img
                                            :src="tripStaticImg('icon-info.svg')"
                                            alt=""
                                            class="trip-form-info-icon"
                                        />
                                    </span>
                                </span>
                            </div>
                            <div
                                class="new-left trip_points col-sm-13 col-md-15"
                                v-if="isMobile || tripCardTheme !== 'light'"
                            >
                                <div
                                    v-for="(m, index) in points"
                                    class="trip_point location-autocomplete"
                                    :class="{ 'trip-error': m.error.state }"
                                    :key="m.id"
                                >
                                    <span v-if="index == 0" class="sr-only">
                                        {{ $t('origen') }}
                                    </span>
                                    <span
                                        v-if="index == points.length - 1"
                                        class="sr-only"
                                    >
                                        {{ $t('destino') }}
                                    </span>
                                    <autocomplete
                                        :placeholder="getPlaceholder(index)"
                                        name="'input-' + index"
                                        ref="'input-' + index"
                                        :model-value="m.name"
                                        v-on:place_changed="
                                            (data) => getPlace(index, data)
                                        "
                                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                                        :country="
                                            allowForeignPoints ? null : 'AR'
                                        "
                                        :class="{ 'has-error': m.error.state }"
                                    ></autocomplete>
                                    <div
                                        @click="resetPoints(m, index)"
                                        class="date-picker--cross"
                                    >
                                        <i
                                            aria-hidden="true"
                                            class="fa fa-times"
                                        ></i>
                                    </div>
                                    <span class="error" v-if="m.error.state">
                                        {{ m.error.message }}
                                    </span>
                                </div>
                            </div>
                            <div
                                v-if="tripCardTheme !== 'light' || isMobile"
                                class="col-sm-11 col-md-9"
                            >
                                <div class="trip_information">
                                    <ul class="no-bullet">
                                        <li class="list_item">
                                            <i
                                                class="fa fa-link"
                                                aria-hidden="true"
                                                v-if="tripCardTheme === 'light'"
                                            ></i>
                                            <div
                                                class="label-soft"
                                                v-if="tripCardTheme !== 'light'"
                                            >
                                                {{ $t('distanciaARecorrer') }}
                                            </div>
                                            <div>{{ distanceString }}</div>
                                        </li>
                                        <li class="list_item">
                                            <i
                                                class="fa fa-clock-o"
                                                aria-hidden="true"
                                                v-if="tripCardTheme === 'light'"
                                            ></i>
                                            <div
                                                class="label-soft"
                                                v-if="tripCardTheme !== 'light'"
                                            >
                                                {{ $t('tiempoEstimado') }}
                                            </div>
                                            <div>{{ estimatedTimeString }}</div>
                                        </li>
                                        <li class="list_item">
                                            <i
                                                class="fa fa-leaf"
                                                aria-hidden="true"
                                                v-if="tripCardTheme === 'light'"
                                            ></i>
                                            <div
                                                class="label-soft"
                                                v-if="tripCardTheme !== 'light'"
                                            >
                                                {{ $t('huellaCarbono') }} (
                                                <abbr :title="$t('kilogramosDioxidoCarbono')">
                                                    kg CO<sub>2</sub> eq.
                                                </abbr>
                                                )
                                            </div>
                                            <div>{{ CO2String }}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="new-left col-sm-13 col-md-15">
                            <div class="trip_schedule-toggle" v-if="config.weekly_schedule">
                                <div class="schedule-toggle-buttons">
                                    <button type="button" class="btn btn-option schedule-tab" @click="useWeeklySchedule = false" :class="!useWeeklySchedule ? 'active' : ''">
                                        {{ $t('unaVez') }}
                                    </button>
                                    <button type="button" class="btn btn-option schedule-tab" @click="useWeeklySchedule = true" :class="useWeeklySchedule ? 'active' : ''">
                                        {{ $t('programaSemanal') }}
                                    </button>
                                </div>
                            </div>
                            <div class="trip_datetime" v-if="!useWeeklySchedule">
                                <div class="trip_date">
                                    <label for="date" class="sr-only">{{
                                        $t('dia')
                                    }}</label>
                                    <DatePicker
                                        :model-value="date"
                                        :minDate="minDate"
                                        :class="{
                                            'has-error': dateError.state
                                        }"
                                        v-on:date_changed="changeDate"
                                    ></DatePicker>
                                    <span class="error" v-if="dateError.state">
                                        {{ dateError.message }}
                                    </span>
                                </div>
                                <div class="trip_time">
                                    <label for="time" class="sr-only">{{
                                        $t('hora')
                                    }}</label>
                                    <input
                                        type="time"
                                        v-maska="'##:##'"
                                        v-model="time"
                                        class="form-control form-control-with-icon form-control-time"
                                        id="time"
                                        :class="{
                                            'has-error': timeError.state
                                        }"
                                        placeholder="Hora (12:00)"
                                    />
                                    <span class="error" v-if="timeError.state">
                                        {{ timeError.message }}
                                    </span>
                                    <!--<input type="text" v-model="time" />-->
                                </div>
                            </div>
                            <div class="trip-weekly-schedule" v-if="useWeeklySchedule && config.weekly_schedule">
                                <WeeklySchedule
                                    v-model:weeklySchedule="weeklySchedule"
                                    v-model:weeklyScheduleTime="weeklyScheduleTime"
                                    :readonly="false"
                                    :theme="tripCardTheme"
                                    :hasError="timeError.state"
                                />
                                <span class="error" v-if="timeError.state">
                                    {{ timeError.message }}
                                </span>
                            </div>
                            <div class="trip_seats-available">
                                <fieldset>
                                    <span class="label-for-group">
                                        <svg-item
                                            v-if="tripCardTheme === 'light'"
                                            :size="28"
                                            :icon="'icono-sentado'"
                                        ></svg-item>
                                        {{
                                            trip.is_passenger == 0
                                                ? $t('lugaresDisponibles')
                                                : $t('cuposNecesarios')
                                        }}
                                    </span>
                                    <span v-if="tripCardTheme !== 'light'">
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="seats-one"
                                                :value="1"
                                                v-model.number="trip.total_seats"
                                            />
                                            <label for="seats-one">1</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="seats-two"
                                                :value="2"
                                                v-model.number="trip.total_seats"
                                            />
                                            <label for="seats-two">2</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="seats-three"
                                                :value="3"
                                                v-model.number="trip.total_seats"
                                            />
                                            <label for="seats-three">3</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="seats-four"
                                                :value="4"
                                                v-model.number="trip.total_seats"
                                            />
                                            <label for="seats-four">4</label>
                                        </span>
                                    </span>
                                    <span
                                        class="seats-widget"
                                        v-if="tripCardTheme === 'light'"
                                    >
                                        <button
                                            type="button"
                                            @click="
                                                () =>
                                                    trip.total_seats < 4
                                                        ? trip.total_seats++
                                                        : trip.total_seats
                                            "
                                            class="btn btn-link"
                                            :disabled="trip.total_seats === 4"
                                        >
                                            <svg-item
                                                :size="28"
                                                :icon="'add'"
                                            ></svg-item>
                                        </button>
                                        <span class="total_seats">{{
                                            trip.total_seats
                                        }}</span>
                                        <button
                                            type="button"
                                            @click="
                                                () =>
                                                    trip.total_seats > 1
                                                        ? trip.total_seats--
                                                        : trip.total_seats
                                            "
                                            class="btn btn-link"
                                            :disabled="trip.total_seats === 1"
                                        >
                                            <svg-item
                                                :size="28"
                                                :icon="'remove'"
                                            ></svg-item>
                                        </button>
                                    </span>
                                </fieldset>
                                <span class="error" v-if="seatsError.state">
                                    {{ seatsError.message }}
                                </span>
                            </div>
                            <div
                                class="trip_price"
                                v-if="trip.is_passenger == 0 && !config.module_max_price_enabled && config.module_seat_price_enabled"
                            >
                                <legend class="label-for-group label-tooltip">
                                    {{ $t('precioAsiento') }}
                                <span
                                    class="tooltip-bottom tooltip-seat-price"
                                    :data-tooltip="contribucionPorPersonaTooltipText"
                                >
                                    <img
                                        :src="tripStaticImg('icon-info.svg')"
                                        alt=""
                                        class="trip-form-info-icon"
                                    />
                                </span>
                                </legend>

                                <input
                                    type="number"
                                    v-model="price"
                                    class="form-control form-control-with-icon form-control-price"
                                    id="price"
                                    :class="{ 'has-error': priceError.state }"
                                    :placeholder="price"
                                    @input="onOutboundPriceFieldInput"
                                />
                                <span
                                    class="error trip-form-error-with-icon"
                                    v-if="priceError.state"
                                >
                                    <img
                                        :src="tripStaticImg('icon-warning.svg')"
                                        alt=""
                                        class="trip-form-warning-icon"
                                    />
                                    {{ priceError.message }}
                                </span>
                                <span
                                    class="error"
                                    v-if="hasShownMaxContributionExceededWarning"
                                >
                                    {{
                                        $t(
                                            'recuerdeReglaContribucionMaximaExcedida'
                                        )
                                    }}
                                </span>
                            </div>

                            <div
                                class="list_item"
                                v-if="
                                    trip.is_passenger == 0 &&
                                    config.module_max_price_enabled
                                "
                            >
                                <i
                                    class="fa fa-link"
                                    aria-hidden="true"
                                    v-if="tripCardTheme === 'light'"
                                ></i>
                            </div>
                            <div
                                class="trip_price"
                                v-if="
                                    trip.is_passenger == 0 &&
                                    config.module_max_price_enabled &&
                                    config.module_seat_price_enabled
                                "
                            >
                                <legend class="label-for-group label-tooltip">
                                    {{ $t('precioAsiento') }}
                                    <span
                                        class="tooltip-bottom tooltip-seat-price"
                                        :data-tooltip="contribucionPorPersonaTooltipText"
                                    >
                                        <img
                                            :src="tripStaticImg('icon-info.svg')"
                                            alt=""
                                            class="trip-form-info-icon"
                                        />
                                    </span>
                                </legend>

                                <input
                                    type="number"
                                    v-model="price"
                                    class="form-control form-control-with-icon form-control-price"
                                    id="price"
                                    :class="{ 'has-error': priceError.state }"
                                    :placeholder="price"
                                    :max="maximum_seat_price_cents / 100"
                                    @input="onOutboundPriceFieldInput"
                                />
                                <span
                                    class="error trip-form-error-with-icon"
                                    v-if="priceError.state"
                                >
                                    <img
                                        :src="tripStaticImg('icon-warning.svg')"
                                        alt=""
                                        class="trip-form-warning-icon"
                                    />
                                    {{ priceError.message }}
                                </span>
                                <span
                                    class="error"
                                    v-if="hasShownMaxContributionExceededWarning"
                                >
                                    {{
                                        $t(
                                            'recuerdeReglaContribucionMaximaExcedida'
                                        )
                                    }}
                                </span>
                            </div>

                            <div
                                v-if="
                                    trip.is_passenger == 0 &&
                                    trip.distance > 0 &&
                                    config.module_seat_price_enabled
                                "
                                class="trip-contribucion-recomendada-card"
                            >
                                <div class="trip-contribucion-recomendada-card__main">
                                    <strong
                                        >{{ $t('contribucionRecomendadaLabel') }}:
                                        {{
                                            $n(
                                                recommended_seat_price_cents / 100,
                                                'currency'
                                            )
                                        }}</strong
                                    >
                                </div>
                                <p class="trip-contribucion-recomendada-card__hint">
                                    {{
                                        contribucionRecomendadaCardDescripcionText
                                    }}
                                </p>
                            </div>

                            <div class="trip-comment">
                                <label
                                    for="trip_comment"
                                    class="label-for-group"
                                >
                                    {{
                                        trip.is_passenger == 0
                                            ? $t('comentarioPasajeros')
                                            : $t('comentario')
                                    }}
                                </label>
                                <textarea
                                    maxlength="2000"
                                    v-model="trip.description"
                                    id="trp_comment"
                                    class="form-control"
                                    :placeholder="
                                        $t('placeholderComentarioPasajeros')
                                    "
                                ></textarea>
                                <span class="error" v-if="commentError.state">
                                    {{ commentError.message }}
                                </span>
                            </div>
                        </div>
                        <div class="col-sm-11 col-md-9 preferences-container">
                            <!-- <fieldset class="trip-privacity">
                                <legend class="label-for-group">
                                    {{ $t('privacidadViaje') }}
                                </legend>
                                <ul class="no-bullet">
                                    <li>
                                        <input
                                            type="radio"
                                            id="privacity-public"
                                            value="2"
                                            v-model="trip.friendship_type_id"
                                        />
                                        <label
                                            for="privacity-public"
                                            class="label-soft"
                                        >
                                            {{ $t('publico') }}
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            id="privacity-friendofriend"
                                            value="1"
                                            v-model="trip.friendship_type_id"
                                        />
                                        <label
                                            for="privacity-friendofriend"
                                            class="label-soft"
                                        >
                                            {{ $t('amigosamigos') }}
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            id="privacity-friend"
                                            value="0"
                                            v-model="trip.friendship_type_id"
                                        />
                                        <label
                                            for="privacity-friend"
                                            class="label-soft"
                                        >
                                            {{ $t('soloAmigos') }}
                                        </label>
                                    </li>
                                </ul>
                            </fieldset> -->
                            <legend class="label-for-group">
                                {{ $t('preferenciasViaje') }}
                            </legend>
                            <br />
                            <div class="preferences row trip-pref-cards">
                                <div class="col-xs-8 trip-pref-cards__cell">
                                    <div class="trip-pref-card">
                                        <input
                                            type="checkbox"
                                            id="newtrip-pref-smoking"
                                            v-model="trip.allow_smoking"
                                            class="trip-pref-card__input sr-only"
                                        />
                                        <label
                                            for="newtrip-pref-smoking"
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
                                                    :src="
                                                        tripStaticImg(
                                                            'icon-smoke.svg'
                                                        )
                                                    "
                                                    alt=""
                                                    class="trip-pref-card__icon"
                                                />
                                            </span>
                                            <span
                                                class="trip-pref-card__caption label-soft"
                                            >
                                                {{
                                                    $t(
                                                        'preferenciaPermitidoFumar'
                                                    )
                                                }}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8 trip-pref-cards__cell">
                                    <div class="trip-pref-card">
                                        <input
                                            type="checkbox"
                                            id="newtrip-pref-animals"
                                            v-model="trip.allow_animals"
                                            class="trip-pref-card__input sr-only"
                                        />
                                        <label
                                            for="newtrip-pref-animals"
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
                                                    :src="
                                                        tripStaticImg(
                                                            'icon-pet.svg'
                                                        )
                                                    "
                                                    alt=""
                                                    class="trip-pref-card__icon"
                                                />
                                            </span>
                                            <span
                                                class="trip-pref-card__caption label-soft"
                                            >
                                                {{
                                                    $t(
                                                        'preferenciaPermitidoAnimales'
                                                    )
                                                }}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8 trip-pref-cards__cell">
                                    <div class="trip-pref-card">
                                        <input
                                            type="checkbox"
                                            id="newtrip-pref-kids"
                                            v-model="trip.allow_kids"
                                            class="trip-pref-card__input sr-only"
                                        />
                                        <label
                                            for="newtrip-pref-kids"
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
                                                    :src="
                                                        tripStaticImg(
                                                            'icon-baby.svg'
                                                        )
                                                    "
                                                    alt=""
                                                    class="trip-pref-card__icon"
                                                />
                                            </span>
                                            <span
                                                class="trip-pref-card__caption label-soft"
                                            >
                                                {{
                                                    $t(
                                                        'preferenciaPermitidoNinos'
                                                    )
                                                }}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="!updatingTrip && !isMobile"
                                class="row row-showReturnTrip"
                            >
                                <hr class="col-md-20" />
                                <div class="checkbox-trip-return col-md-24">
                                    <span>
                                        <input
                                            type="checkbox"
                                            v-model="showReturnTrip"
                                            id="cbxShowReturnTrip"
                                        />
                                        <label for="cbxShowReturnTrip">
                                            {{ $t('cargarViajeRegreso') }}
                                        </label>
                                    </span>
                                </div>
                            </div>
                            <button
                                v-if="!showReturnTrip && !isMobile"
                                class="trip-create btn btn-primary btn-lg"
                                :class="{ 'trip-create--update': updatingTrip && !showReturnTrip }"
                                @click="save"
                                :disabled="saving"
                            >
                                <span v-if="!updatingTrip">
                                    <spinner
                                        class="blue"
                                        v-if="saving"
                                    ></spinner>
                                    <span v-else>{{ $t('crear') }}</span>
                                </span>
                                <span v-else>
                                    <spinner
                                        class="blue"
                                        v-if="saving"
                                    ></spinner>
                                    <span v-else>{{ $t('actualizar') }}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="tripCardTheme === 'light' && !isMobile"
                class="trip_information trip_information--light"
            >
                <ul class="no-bullet">
                    <li class="list_item">
                        <i
                            class="fa fa-link"
                            aria-hidden="true"
                            v-if="tripCardTheme === 'light'"
                        ></i>
                        <div class="label-soft">
                            {{ $t('distanciaARecorrer') }}
                        </div>
                        <div>{{ distanceString }}</div>
                    </li>
                    <li class="list_item">
                        <i
                            class="fa fa-clock-o"
                            aria-hidden="true"
                            v-if="tripCardTheme === 'light'"
                        ></i>
                        <div class="label-soft">{{ $t('tiempoEstimado') }}</div>
                        <div>{{ estimatedTimeString }}</div>
                    </li>
                    <li class="list_item">
                        <i
                            class="fa fa-leaf"
                            aria-hidden="true"
                            v-if="tripCardTheme === 'light'"
                        ></i>
                        <div class="label-soft">
                            {{ $t('huellaCarbono') }} (
                            <abbr
                                :title="$t('kilogramosDioxidoDeCarbonoEquivalente')"
                            >
                                kg CO
                                <sub>2eq</sub>
                            </abbr>
                            )
                        </div>
                        <div>{{ CO2String }}</div>
                    </li>
                </ul>
            </div>
            <div
                v-if="showReturnTrip"
                class="row show-return-trip"
            >
                <hr class="col-xs-24 hidden-sm hidden-md hidden-lg" />
                <div v-if="showReturnTrip" :class="columnClass[0]">
                    <div
                        class="new-left trip_points trip_points--left"
                        v-if="!isMobile && tripCardTheme === 'light'"
                    >
                        <div
                            v-for="(m, index) in otherTrip.points"
                            class="trip_point location-autocomplete"
                            :class="{ 'trip-error': m.error.state }"
                            :key="m.id"
                        >
                            <span v-if="index == 0" class="sr-only">{{
                                $t('origen')
                            }}</span>
                            <span
                                v-if="index == otherTrip.points.length - 1"
                                class="sr-only"
                            >
                                {{ $t('destino') }}
                            </span>
                            <autocomplete
                                :placeholder="getPlaceholder(index)"
                                name="'input-return-trip' + index"
                                ref="'input-return-trip' + index"
                                :model-value="m.name"
                                v-on:place_changed="
                                    (data) =>
                                        getPlace(
                                            index,
                                            data,
                                            'returnTrip'
                                        )
                                "
                                :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                                :country="
                                    allowForeignPoints ? null : 'AR'
                                "
                                :class="{ 'has-error': m.error.state }"
                            ></autocomplete>
                            <div
                                @click="resetReturnPoints(m, index)"
                                class="date-picker--cross"
                            >
                                <i
                                    aria-hidden="true"
                                    class="fa fa-times"
                                ></i>
                            </div>
                            <span class="error" v-if="m.error.state">
                                {{ m.error.message }}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="showReturnTrip" :class="columnClass[1]">
                    <div class="row">
                        <div class="panel-other-trip-data">
                            <div
                                class="new-left trip_points col-sm-13 col-md-15"
                                v-if="isMobile || tripCardTheme !== 'light'"
                            >
                                <div
                                    v-for="(m, index) in otherTrip.points"
                                    class="trip_point location-autocomplete"
                                    :class="{ 'trip-error': m.error.state }"
                                    :key="m.id"
                                >
                                    <span v-if="index == 0" class="sr-only">
                                        {{ $t('origen') }}
                                    </span>
                                    <span
                                        v-if="index == otherTrip.points.length - 1"
                                        class="sr-only"
                                    >
                                        {{ $t('destino') }}
                                    </span>
                                    <autocomplete
                                        :placeholder="getPlaceholder(index)"
                                        name="'input-return-trip' + index"
                                        ref="'input-return-trip' + index"
                                        :model-value="m.name"
                                        v-on:place_changed="
                                            (data) =>
                                                getPlace(
                                                    index,
                                                    data,
                                                    'returnTrip'
                                                )
                                        "
                                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                                        :country="
                                            allowForeignPoints ? null : 'AR'
                                        "
                                        :class="{ 'has-error': m.error.state }"
                                    ></autocomplete>
                                    <div
                                        @click="resetReturnPoints(m, index)"
                                        class="date-picker--cross"
                                    >
                                        <i
                                            aria-hidden="true"
                                            class="fa fa-times"
                                        ></i>
                                    </div>
                                    <span class="error" v-if="m.error.state">
                                        {{ m.error.message }}
                                    </span>
                                </div>
                            </div>
                            <div
                                v-if="tripCardTheme !== 'light' || isMobile"
                                class="col-sm-11 col-md-9"
                            >
                                <div class="trip_information">
                                    <ul class="no-bullet">
                                        <li class="list_item">
                                            <i
                                                class="fa fa-link"
                                                aria-hidden="true"
                                                v-if="tripCardTheme === 'light'"
                                            ></i>
                                            <div
                                                class="label-soft"
                                                v-if="tripCardTheme !== 'light'"
                                            >
                                                {{ $t('distanciaARecorrer') }}
                                            </div>
                                            <div>
                                                {{ otherTripDistanceString }}
                                            </div>
                                        </li>
                                        <li class="list_item">
                                            <i
                                                class="fa fa-clock-o"
                                                aria-hidden="true"
                                                v-if="tripCardTheme === 'light'"
                                            ></i>
                                            <div
                                                class="label-soft"
                                                v-if="tripCardTheme !== 'light'"
                                            >
                                                {{ $t('tiempoEstimado') }}
                                            </div>
                                            <div>
                                                {{
                                                    otherTripEstimatedTimeString
                                                }}
                                            </div>
                                        </li>
                                        <li class="list_item">
                                            <i
                                                class="fa fa-leaf"
                                                aria-hidden="true"
                                                v-if="tripCardTheme === 'light'"
                                            ></i>
                                            <div
                                                class="label-soft"
                                                v-if="tripCardTheme !== 'light'"
                                            >
                                                {{ $t('huellaCarbono') }} (
                                                    <abbr
                                                        :title="$t('kilogramosDioxidoDeCarbonoEquivalente')"
                                                    >
                                                    kg CO
                                                    <sub>2eq</sub>
                                                </abbr>
                                                )
                                            </div>
                                            <div>{{ otherTripCO2String }}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="new-left col-sm-13 col-md-15">
                            <div class="trip_schedule-toggle" v-if="config.weekly_schedule">
                                <div class="schedule-toggle-buttons">
                                    <button type="button" class="btn btn-option schedule-tab" @click="useWeeklySchedule = false" :class="!useWeeklySchedule ? 'active' : ''">
                                        {{ $t('unaVez') }}
                                    </button>
                                    <button type="button" class="btn btn-option schedule-tab" @click="useWeeklySchedule = true" :class="useWeeklySchedule ? 'active' : ''">
                                        {{ $t('programaSemanal') }}
                                    </button>
                                </div>
                            </div>
                            <div class="trip_datetime" v-if="!useWeeklySchedule">
                                <div class="trip_date">
                                    <label for="date" class="sr-only">{{
                                        $t('dia')
                                    }}</label>
                                    <DatePicker
                                        :model-value="otherTrip.date"
                                        :minDate="otherTrip.minDate"
                                        :class="{
                                            'has-error':
                                                otherTrip.dateError.state
                                        }"
                                        v-on:date_changed="changeOtherTripDate"
                                    ></DatePicker>
                                    <span
                                        class="error"
                                        v-if="otherTrip.dateError.state"
                                    >
                                        {{ otherTrip.dateError.message }}
                                    </span>
                                </div>
                                <div class="trip_time">
                                    <label for="otherTrip-time" class="sr-only">
                                        {{ $t('hora') }}
                                    </label>
                                    <input
                                        type="time"
                                        v-maska="'##:##'"
                                        v-model="otherTrip.time"
                                        class="form-control form-control-with-icon form-control-time"
                                        id="otherTrip-time"
                                        :class="{
                                            'has-error':
                                                otherTrip.timeError.state
                                        }"
                                        placeholder="Hora (12:00)"
                                    />
                                    <span
                                        class="error"
                                        v-if="otherTrip.timeError.state"
                                    >
                                        {{ otherTrip.timeError.message }}
                                    </span>
                                    <!--<input type="text" v-model="time" />-->
                                </div>
                            </div>
                            <div class="trip-weekly-schedule" v-if="useWeeklySchedule && config.weekly_schedule">
                                <WeeklySchedule
                                    v-model:weeklySchedule="weeklySchedule"
                                    v-model:weeklyScheduleTime="weeklyScheduleReturnTime"
                                    :readonly="false"
                                    :theme="tripCardTheme"
                                    :hasError="otherTrip.timeError.state"
                                    :idPrefix="'return-ws'"
                                />
                                <span class="error" v-if="otherTrip.timeError.state">
                                    {{ otherTrip.timeError.message }}
                                </span>
                            </div>
                            <div
                                class="trip_price"
                                v-if="trip.is_passenger == 0 && 
                                !config.module_max_price_enabled && 
                                config.module_seat_price_enabled"
                            >
                                <legend class="label-for-group label-tooltip">
                                    {{ $t('precioAsiento') }}
                                <span
                                    class="tooltip-bottom tooltip-seat-price"
                                    :data-tooltip="contribucionPorPersonaTooltipText"
                                >
                                    <img
                                        :src="tripStaticImg('icon-info.svg')"
                                        alt=""
                                        class="trip-form-info-icon"
                                    />
                                </span>
                                </legend>

                                <input
                                    type="number"
                                    v-model="returnPrice"
                                    class="form-control form-control-with-icon form-control-price"
                                    id="return-price"
                                    :class="{ 'has-error': returnPriceError.state }"
                                    :placeholder="returnPrice"
                                    @input="onReturnPriceFieldInput"
                                />
                                <span
                                    class="error trip-form-error-with-icon"
                                    v-if="returnPriceError.state"
                                >
                                    <img
                                        :src="tripStaticImg('icon-warning.svg')"
                                        alt=""
                                        class="trip-form-warning-icon"
                                    />
                                    {{ returnPriceError.message }}
                                </span>
                                <span
                                    class="error"
                                    v-if="hasShownReturnMaxContributionExceededWarning"
                                >
                                    {{
                                        $t(
                                            'recuerdeReglaContribucionMaximaExcedida'
                                        )
                                    }}
                                </span>
                            </div>
                            <div
                                class="trip_price"
                                v-if="this.config.module_trip_creation_payment_enabled && config.module_seat_price_enabled"
                            >
                                <legend class="label-for-group label-tooltip">
                                    {{ $t('precioAsiento') }}
                                    <span
                                        class="tooltip-bottom tooltip-seat-price"
                                        :data-tooltip="contribucionPorPersonaTooltipText"
                                    >
                                        <img
                                            :src="tripStaticImg('icon-info.svg')"
                                            alt=""
                                            class="trip-form-info-icon"
                                        />
                                    </span>
                                </legend>
                                <input
                                    type="number"
                                    v-model="returnPrice"
                                    class="form-control form-control-with-icon form-control-price"
                                    id="return-price"
                                    :class="{
                                        'has-error': returnPriceError.state
                                    }"
                                    :placeholder="price"
                                    :max="maximum_seat_price_cents / 100"
                                    @input="onReturnPriceFieldInput"
                                />
                                <span
                                    class="error trip-form-error-with-icon"
                                    v-if="returnPriceError.state"
                                >
                                    <img
                                        :src="tripStaticImg('icon-warning.svg')"
                                        alt=""
                                        class="trip-form-warning-icon"
                                    />
                                    {{ returnPriceError.message }}
                                </span>
                                <span
                                    class="error"
                                    v-if="hasShownReturnMaxContributionExceededWarning"
                                >
                                    {{
                                        $t(
                                            'recuerdeReglaContribucionMaximaExcedida'
                                        )
                                    }}
                                </span>
                            </div>

                            <div
                                v-if="
                                    trip.is_passenger == 0 &&
                                    otherTrip.trip.distance > 0 &&
                                    config.module_seat_price_enabled
                                "
                                class="trip-contribucion-recomendada-card"
                            >
                                <div class="trip-contribucion-recomendada-card__main">
                                    <strong
                                        >{{ $t('contribucionRecomendadaLabel') }}:
                                        {{
                                            $n(
                                                recommended_return_seat_price_cents / 100,
                                                'currency'
                                            )
                                        }}</strong
                                    >
                                </div>
                                <p class="trip-contribucion-recomendada-card__hint">
                                    {{
                                        contribucionRecomendadaCardDescripcionText
                                    }}
                                </p>
                            </div>

                            <div class="trip_seats-available">
                                <fieldset>
                                    <span class="label-for-group">
                                        <svg-item
                                            v-if="tripCardTheme === 'light'"
                                            :size="28"
                                            :icon="'icono-sentado'"
                                        ></svg-item>
                                        {{
                                            trip.is_passenger
                                                ? $t('cuposNecesarios')
                                                : $t('lugaresDisponibles')
                                        }}
                                    </span>
                                    <span v-if="tripCardTheme !== 'light'">
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="otherTrip-seats-one"
                                                :value="1"
                                                v-model.number="
                                                    otherTrip.trip.total_seats
                                                "
                                            />
                                            <label for="otherTrip-seats-one"
                                                >1</label
                                            >
                                        </span>
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="otherTrip-seats-two"
                                                :value="2"
                                                v-model.number="
                                                    otherTrip.trip.total_seats
                                                "
                                            />
                                            <label for="otherTrip-seats-two"
                                                >2</label
                                            >
                                        </span>
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="otherTrip-seats-three"
                                                :value="3"
                                                v-model.number="
                                                    otherTrip.trip.total_seats
                                                "
                                            />
                                            <label for="otherTrip-seats-three"
                                                >3</label
                                            >
                                        </span>
                                        <span class="radio-inline">
                                            <input
                                                type="radio"
                                                id="otherTrip-seats-four"
                                                :value="4"
                                                v-model.number="
                                                    otherTrip.trip.total_seats
                                                "
                                            />
                                            <label for="otherTrip-seats-four"
                                                >4</label
                                            >
                                        </span>
                                    </span>
                                    <span
                                        class="seats-widget"
                                        v-if="tripCardTheme === 'light'"
                                    >
                                        <button
                                            type="button"
                                            @click="
                                                () =>
                                                    otherTrip.trip.total_seats <
                                                    4
                                                        ? otherTrip.trip
                                                              .total_seats++
                                                        : otherTrip.trip
                                                              .total_seats
                                            "
                                            class="btn btn-link"
                                            :disabled="
                                                otherTrip.trip.total_seats === 4
                                            "
                                        >
                                            <svg-item
                                                :size="28"
                                                :icon="'add'"
                                            ></svg-item>
                                        </button>
                                        <span class="total_seats">
                                            {{ otherTrip.trip.total_seats }}
                                        </span>
                                        <button
                                            type="button"
                                            @click="
                                                () =>
                                                    otherTrip.trip.total_seats >
                                                    1
                                                        ? otherTrip.trip
                                                              .total_seats--
                                                        : otherTrip.trip
                                                              .total_seats
                                            "
                                            class="btn btn-link"
                                            :disabled="
                                                otherTrip.trip.total_seats === 1
                                            "
                                        >
                                            <svg-item
                                                :size="28"
                                                :icon="'remove'"
                                            ></svg-item>
                                        </button>
                                    </span>
                                </fieldset>
                                <span
                                    class="error"
                                    v-if="otherTrip.seatsError.state"
                                >
                                    {{ otherTrip.seatsError.message }}
                                </span>
                            </div>
                            <div class="trip-comment">
                                <label
                                    for="otherTrip-trip_comment"
                                    class="label-for-group"
                                >
                                    {{ $t('comentarioPasajeros') }}
                                </label>
                                <textarea
                                    maxlength="2000"
                                    v-model="otherTrip.trip.description"
                                    id="other_trp_comment"
                                    class="form-control"
                                    :placeholder="
                                        $t('placeholderComentarioPasajeros')
                                    "
                                ></textarea>
                                <span class="error" v-if="otherTrip.commentError.state">
                                    {{ otherTrip.commentError.message }}
                                </span>
                            </div>
                        </div>
                        <div class="col-sm-11 col-md-9 preferences-container">
                            <fieldset class="trip-privacity">
                                <legend class="label-for-group">
                                    {{ $t('privacidadViaje') }}
                                </legend>
                                <ul class="no-bullet">
                                    <li>
                                        <input
                                            type="radio"
                                            id="otherTrip-privacity-public"
                                            value="2"
                                            v-model="
                                                otherTrip.trip
                                                    .friendship_type_id
                                            "
                                        />
                                        <label
                                            for="otherTrip-privacity-public"
                                            class="label-soft"
                                        >
                                            {{ $t('publico') }}
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            id="otherTrip-privacity-friendofriend"
                                            value="1"
                                            v-model="
                                                otherTrip.trip
                                                    .friendship_type_id
                                            "
                                        />
                                        <label
                                            for="otherTrip-privacity-friendofriend"
                                            class="label-soft"
                                        >
                                            {{ $t('amigosamigos') }}
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            id="otherTrip-privacity-friend"
                                            value="0"
                                            v-model="
                                                otherTrip.trip
                                                    .friendship_type_id
                                            "
                                        />
                                        <label
                                            for="otherTrip-privacity-friend"
                                            class="label-soft"
                                        >
                                            {{ $t('soloAmigos') }}
                                        </label>
                                    </li>
                                </ul>
                            </fieldset>
                            <legend class="label-for-group">
                                {{ $t('preferenciasViaje') }}
                            </legend>
                            <br />
                            <div class="preferences row trip-pref-cards">
                                <div class="col-xs-8 trip-pref-cards__cell">
                                    <div class="trip-pref-card">
                                        <input
                                            type="checkbox"
                                            id="newtrip-return-pref-smoking"
                                            v-model="
                                                otherTrip.trip.allow_smoking
                                            "
                                            class="trip-pref-card__input sr-only"
                                        />
                                        <label
                                            for="newtrip-return-pref-smoking"
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
                                                    :src="
                                                        tripStaticImg(
                                                            'icon-smoke.svg'
                                                        )
                                                    "
                                                    alt=""
                                                    class="trip-pref-card__icon"
                                                />
                                            </span>
                                            <span
                                                class="trip-pref-card__caption label-soft"
                                            >
                                                {{
                                                    $t(
                                                        'preferenciaPermitidoFumar'
                                                    )
                                                }}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8 trip-pref-cards__cell">
                                    <div class="trip-pref-card">
                                        <input
                                            type="checkbox"
                                            id="newtrip-return-pref-animals"
                                            v-model="
                                                otherTrip.trip.allow_animals
                                            "
                                            class="trip-pref-card__input sr-only"
                                        />
                                        <label
                                            for="newtrip-return-pref-animals"
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
                                                    :src="
                                                        tripStaticImg(
                                                            'icon-pet.svg'
                                                        )
                                                    "
                                                    alt=""
                                                    class="trip-pref-card__icon"
                                                />
                                            </span>
                                            <span
                                                class="trip-pref-card__caption label-soft"
                                            >
                                                {{
                                                    $t(
                                                        'preferenciaPermitidoAnimales'
                                                    )
                                                }}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8 trip-pref-cards__cell">
                                    <div class="trip-pref-card">
                                        <input
                                            type="checkbox"
                                            id="newtrip-return-pref-kids"
                                            v-model="otherTrip.trip.allow_kids"
                                            class="trip-pref-card__input sr-only"
                                        />
                                        <label
                                            for="newtrip-return-pref-kids"
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
                                                    :src="
                                                        tripStaticImg(
                                                            'icon-baby.svg'
                                                        )
                                                    "
                                                    alt=""
                                                    class="trip-pref-card__icon"
                                                />
                                            </span>
                                            <span
                                                class="trip-pref-card__caption label-soft"
                                            >
                                                {{
                                                    $t(
                                                        'preferenciaPermitidoNinos'
                                                    )
                                                }}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button
                                v-if="showReturnTrip && !isMobile"
                                class="trip-create btn btn-primary btn-lg"
                                @click="save"
                                :disabled="saving"
                            >
                                <span v-if="!updatingTrip">
                                    <spinner
                                        class="blue"
                                        v-if="saving"
                                    ></spinner>
                                    <span v-else>{{ $t('crear') }}</span>
                                </span>
                                <span v-else>
                                    <spinner
                                        class="blue"
                                        v-if="saving"
                                    ></spinner>
                                    <span v-else>{{ $t('actualizar') }}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="
                    !updatingTrip &&
                    showReturnTrip &&
                    tripCardTheme === 'light' &&
                    !isMobile
                "
                class="trip_information trip_information--light"
            >
                <ul class="no-bullet">
                    <li class="list_item">
                        <i
                            class="fa fa-link"
                            aria-hidden="true"
                            v-if="tripCardTheme === 'light'"
                        ></i>
                        <div class="label-soft">
                            {{ $t('distanciaARecorrer') }}
                        </div>
                        <div>{{ distanceString }}</div>
                    </li>
                    <li class="list_item">
                        <i
                            class="fa fa-clock-o"
                            aria-hidden="true"
                            v-if="tripCardTheme === 'light'"
                        ></i>
                        <div class="label-soft">{{ $t('tiempoEstimado') }}</div>
                        <div>{{ estimatedTimeString }}</div>
                    </li>
                    <li class="list_item">
                        <i
                            class="fa fa-leaf"
                            aria-hidden="true"
                            v-if="tripCardTheme === 'light'"
                        ></i>
                        <div class="label-soft">
                            {{ $t('huellaCarbono') }} (
                            <abbr
                                :title="$t('kilogramosDioxidoDeCarbonoEquivalente')"
                            >
                                kg CO
                                <sub>2eq</sub>
                            </abbr>
                            )
                        </div>
                        <div>{{ CO2String }}</div>
                    </li>
                </ul>
            </div>
            <div class="row">
                <div class="col-xs-24 map"></div>
            </div>
        </div>
        <div
            v-if="isMobile"
            class="trip-form-mobile-footer"
        >
            <div
                v-if="!updatingTrip"
                class="trip-form-mobile-footer__return checkbox-trip-return"
            >
                <input
                    type="checkbox"
                    v-model="showReturnTrip"
                    id="cbxShowReturnTripMobile"
                />
                <label for="cbxShowReturnTripMobile">
                    {{ $t('cargarViajeRegreso') }}
                </label>
            </div>
            <button
                class="trip-create btn btn-primary btn-lg trip-form-mobile-footer__submit"
                :class="{ 'trip-create--update': updatingTrip && !showReturnTrip }"
                @click="save"
                :disabled="saving"
            >
                <span v-if="!updatingTrip">
                    <spinner
                        class="blue"
                        v-if="saving"
                    ></spinner>
                    <span v-else>{{ $t('crear') }}</span>
                </span>
                <span v-else>
                    <spinner
                        class="blue"
                        v-if="saving"
                    ></spinner>
                    <span v-else>{{ $t('actualizar') }}</span>
                </span>
            </button>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useCarsStore } from '../../stores/car';
import { useDeviceStore } from '../../stores/device';
import { useTripsStore } from '../../stores/trips';
import { useRootStore } from '../../stores/root';
import { appLocaleToRoutingLanguage } from '../../main';
import { leafletOsrmServiceUrl } from '../../utils/osrmRouting';
// import { parseOsmStreet } from '../../services/maps.js';
import DatePicker from '../DatePicker';
import dialogs from '../../services/dialogs.js';
import spinner from '../Spinner.vue';
import dayjs from '../../dayjs';
import { last } from 'lodash';
import TripApi from '../../services/api/Trips';
import UserApi from '../../services/api/User';
import autocomplete from '../Autocomplete';
import SvgItem from '../SvgItem';
import WeeklySchedule from '../elements/WeeklySchedule';
import bus from '../../services/bus-event.js';
import { getMaxContributionExceededMessage } from '../../utils/maxContributionExceededMessage.js';
import { rememberMaxContributionWarning } from '../../utils/maxContributionWarningState.js';

let tripApi = new TripApi();
let userApi = new UserApi();

class Error {
    constructor(state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'new-trip',
    props: {
        id: {
            type: [String, Number],
            required: false
        }
    },
    components: {
        DatePicker,
        WeeklySchedule,
        SvgItem,
        autocomplete,
        spinner
    },
    data() {
        return {
            minDate: dayjs().toDate(),
            lucrarError: new Error(),
            dateError: new Error(),
            timeError: new Error(),
            priceError: new Error(),
            hasShownMaxContributionExceededWarning: false,
            returnPriceError: new Error(),
            hasShownReturnMaxContributionExceededWarning: false,
            commentError: new Error(),
            seatsError: new Error(),
            no_lucrar: false,
            sameCity: false,
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: 0
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: 1
                }
            ],
            date: '',
            dateAnswer: this.date,
            time: '12:00',
            price: '',
            needs_to_pay_for_next_trip: false,
            maximum_trip_price_cents: 0,
            recommended_trip_price_cents: 0,
            maximum_seat_price_cents: 0,
            recommended_seat_price_cents: 0,
            maximum_return_trip_price_cents: 0,
            recommended_return_trip_price_cents: 0,
            maximum_return_seat_price_cents: 0,
            recommended_return_seat_price_cents: 0,
            free_trips_amount: 0,
            trips_created_by_user_amount: 0,
            route_needs_payment: false,
            returnPrice: '',
            duration: 0,
            passengers: 0,
            trip: {
                is_passenger: 0,
                from_town: '',
                to_town: '',
                trip_date: '',
                total_seats: 2,
                friendship_type_id: 2,
                estimated_time: '00:00',
                distance: 0.0,
                co2: 0.0,
                description: '',
                allow_kids: false,
                allow_smoking: false,
                allow_animals: false,
                car_id: null,
                enc_path: '123',
                points: [] /* address json_address lat lng */
            },
            updatingTrip: null,
            saving: false,
            allowForeignPoints: false,
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            showReturnTrip: false,
            otherTrip: {
                minDate: dayjs().toDate(),
                dateError: new Error(),
                timeError: new Error(),
                commentError: new Error(),
                seatsError: new Error(),
                no_lucrar: false,
                sameCity: false,
                points: [
                    {
                        name: '',
                        place: null,
                        json: null,
                        location: null,
                        error: new Error()
                    },
                    {
                        name: '',
                        place: null,
                        json: null,
                        location: null,
                        error: new Error()
                    }
                ],
                date: '',
                dateAnswer: this.date,
                time: '12:00',
                duration: 0,
                passengers: 0,
                trip: {
                    is_passenger: 0,
                    from_town: '',
                    to_town: '',
                    trip_date: '',
                    total_seats: 2,
                    friendship_type_id: 2,
                    estimated_time: '00:00',
                    distance: 0.0,
                    co2: 0.0,
                    description: '',
                    car_id: null,
                    enc_path: '123',
                    allow_kids: false,
                    allow_smoking: false,
                    allow_animals: false,
                    seat_price_cents: 0,
                    points: [] /* address json_address lat lng */
                }
            },
            useWeeklySchedule: false,
            weeklySchedule: 0,
            weeklyScheduleTime: '12:00',
            weeklyScheduleReturnTime: '12:00',
        };
    },
    mounted() {
        let self = this;
        this.time = dayjs().add(1, 'hours').format('HH:00');
        this.otherTrip.time = dayjs().add(2, 'hours').format('HH:00');
        this.weeklyScheduleTime = dayjs().add(1, 'hours').format('HH:00');
        this.weeklyScheduleReturnTime = dayjs().add(2, 'hours').format('HH:00');
        bus.off('clear-click', this.onBackButton);
        bus.on('clear-click', this.onBackButton);

        if (self.id) {
            self.loadTrip();
        }

        userApi.selladoViaje().then((result) => {
            // if user is over the free trips limit, show a message telling them they need to pay for the next trip
            this.needs_to_pay_for_next_trip = this.config.module_trip_creation_payment_enabled && result.data.user_over_free_limit;
            this.free_trips_amount = result.data.free_trips_amount;
            this.trips_created_by_user_amount = result.data.trips_created_by_user_amount;
        });
    },
    beforeUnmount() {},

    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig',
            tripCardTheme: 'tripCardTheme'
        }),
        ...mapState(useCarsStore, {
            cars: 'cars'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        columnClass() {
            return !this.isMobile && this.tripCardTheme === 'light'
                ? ['col-sm-10', 'col-sm-14']
                : ['col-sm-8', 'col-sm-16'];
        },
        distanceString() {
            return Math.floor(this.trip.distance / 1000) + ' Km';
        },
        estimatedTimeString() {
            const totalMinutes = Math.floor(this.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (
                (hour < 10 ? '0' : '') +
                hour +
                ':' +
                (minutes < 10 ? '0' : '') +
                minutes
            );
        },
        CO2String() {
            return (Math.floor(this.trip.distance / 1000) * 0.15).toFixed(1)  + ' Kg';
        },
        otherTripDistanceString() {
            return Math.floor(this.otherTrip.trip.distance / 1000) + ' Km';
        },
        otherTripEstimatedTimeString() {
            const totalMinutes = Math.floor(this.otherTrip.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (
                (hour < 10 ? '0' : '') +
                hour +
                ':' +
                (minutes < 10 ? '0' : '') +
                minutes
            );
        },
        otherTripCO2String() {
            return (
                Math.floor(this.otherTrip.trip.distance / 1000) * 0.15 + ' Kg'
            );
        },
        tripCardTheme() {
            return this.config ? this.config.trip_card_design : '';
        },
        remainingFreeTrips() {
            return this.free_trips_amount - this.trips_created_by_user_amount;
        },
        center() {
            return this.config.map_coordinates;
        },
        zoom() {
            return this.config.map_zoom;
        },
        contribucionPorPersonaTooltipText() {
            if (this.config && this.config.module_trip_creation_payment_enabled) {
                return this.$t('contribucionPorPersonaTooltipConSellado');
            }
            return this.$t('contribucionPorPersonaTooltipSinSellado');
        },
        contribucionRecomendadaCardDescripcionText() {
            if (this.config && this.config.module_trip_creation_payment_enabled) {
                return this.$t('contribucionRecomendadaCardDescripcionConSellado');
            }
            return this.$t('contribucionRecomendadaCardDescripcionSinSellado');
        }
    },
    watch: {
        no_lucrar: function () {
            this.lucrarError.state = false;
        },
        'trip.total_seats': function(newValue) {
            if (this.trip.distance > 0) {
                // The maximum_trip_price_cents is constant based on distance
                // We just need to recalculate the per-seat prices
                this.recalculateRecommendedPrice();
            }
        },
        'otherTrip.trip.total_seats': function(newValue) {
            if (this.otherTrip.trip.distance > 0) {
                this.recalculateRecommendedReturnPrice();
            }
        },
        dateAnswer: function (value) {
            if (!this.showReturnTrip || !this.otherTrip.dateAnswer) {
                // const v = dayjs(value);
                // let date = '';
                /* if (v.isValid()) {
                    date = value;
                } */
                // this.otherTrip.date = date;
                // this.otherTrip.dateAnswer = date;
            }
            // this.dateError.state = false;
        },
        time: function () {
            this.timeError.state = false;
        },
        weeklyScheduleTime: function () {
            this.timeError.state = false;
        },
        weeklyScheduleReturnTime: function () {
            this.otherTrip.timeError.state = false;
        },
        'otherTrip.dateAnswer': function () {
            this.otherTrip.dateError.state = false;
        },
        'otherTrip.time': function () {
            this.otherTrip.timeError.state = false;
        },
        'otherTrip.trip.description': function () {
            this.otherTrip.commentError.state = false;
        },
        'trip.friendship_type_id': function () {
            this.otherTrip.trip.friendship_type_id =
                this.trip.friendship_type_id;
        },
        // 'trip.distance': function () {
        //     // TODO: FIX THIS
        //     if (this.config.module_trip_creation_payment_enabled) {
        //         let data = {
        //             from: this.points[0].place,
        //             to: last(this.points).place,
        //             distance: this.trip.distance
        //         };
        //         this.getPrice(data).then((price) => {
        //             this.price = price;
        //             console.log(this.price);
        //         });
        //     }
        // },
        // 'otherTrip.distance': function () {
        //     let data = {
        //         from: this.otherTrip.points[0].place,
        //         to: last(this.otherTrip.points).place,
        //         distance: this.otherTrip.distance
        //     };
        //     this.getPrice(data).then((price) => {
        //         this.returnPrice = price;
        //         console.log(this.returnPrice);
        //     });
        // }
    },
    methods: {
        getMaxContributionExceededMessage(maxContributionCents) {
            return getMaxContributionExceededMessage({
                t: this.$t,
                n: this.$n,
                maxContributionCents
            });
        },
        markMaxContributionExceededWarningAsShown() {
            this.hasShownMaxContributionExceededWarning = rememberMaxContributionWarning(
                {
                    hasBeenShown: this.hasShownMaxContributionExceededWarning,
                    hasExceededMaxContribution: true
                }
            );
        },
        markReturnMaxContributionExceededWarningAsShown() {
            this.hasShownReturnMaxContributionExceededWarning = rememberMaxContributionWarning(
                {
                    hasBeenShown: this.hasShownReturnMaxContributionExceededWarning,
                    hasExceededMaxContribution: true
                }
            );
        },
        ...mapActions(useTripsStore, {
            createTrip: 'create',
            updateTrip: 'update',
            getPrice: 'price'
        }),
        ...mapActions(useRootStore, {
            getTrip: 'getTrip'
        }),
        tripStaticImg(filename) {
            const base = process.env.ROUTE_BASE || '/';
            const normalized = base.endsWith('/') ? base : `${base}/`;
            return `${normalized}img/${filename}`;
        },
        normalizeAllowFlagsForApi(trip) {
            trip.allow_kids = trip.allow_kids ? 1 : 0;
            trip.allow_animals = trip.allow_animals ? 1 : 0;
            trip.allow_smoking = trip.allow_smoking ? 1 : 0;
        },
        setIsPassenger(value) {
            this.trip.is_passenger = value;
        },
        changeOtherTripDate(date) {
            this.otherTrip.dateError.state = false;
            this.otherTrip.dateAnswer = date;
        },
        changeDate(date) {
            this.dateError.state = false;
            this.dateAnswer = date;
        },
        jumpToError() {
            let hasError = document.getElementsByClassName('has-error');
            if (hasError.length) {
                let element = hasError[0];
                this.$scrollToElement(element);
            }
        },
    restoreData(trip) {
        this.no_lucrar = true;
        this.points = [];
        trip.points.forEach((p) => {
            let point = {
                name: p.address,
                json: p.json_address,
                location: {
                    lat: p.lat,
                    lng: p.lng
                },
                place: JSON.stringify(p.json_address),
                error: new Error()
            };
            this.points.push(point);
        });

        // In update mode, add an empty point for adding new intermediary locations
        if (this.updatingTrip && this.points.length >= 2) {
            let newPoint = {
                name: '',
                place: null,
                json: null,
                location: null,
                error: new Error()
            };
            this.points.splice(this.points.length - 1, 0, newPoint);
        }

        // Restore weekly schedule FIRST before date/time
        if (trip.weekly_schedule > 0) {
            this.useWeeklySchedule = true;
            this.weeklySchedule = trip.weekly_schedule;
            console.log('restoreData: set weeklySchedule to', this.weeklySchedule, 'from trip.weekly_schedule', trip.weekly_schedule);

            // Restore weekly schedule time
            if (trip.weekly_schedule_time) {
                this.weeklyScheduleTime = dayjs(trip.weekly_schedule_time).format('HH:mm');
            }
        } else {
            this.useWeeklySchedule = false;

            // Only restore date/time if NOT using weekly schedule
            if (trip.trip_date) {
                this.date = dayjs(trip.trip_date.split(' ')[0]).format('YYYY-MM-DD');
                this.dateAnswer = dayjs(trip.trip_date.split(' ')[0]).format('YYYY-MM-DD');
                this.time = trip.trip_date.split(' ')[1];
            }
        }
        
        this.trip.is_passenger = trip.is_passenger ? 1 : 0;
        this.passengers = trip.passenger_count;
        this.trip.total_seats = trip.total_seats;
        this.trip.friendship_type_id = trip.friendship_type_id;
        this.trip.distance = trip.distance;
        this.trip.description = trip.description;
        
        this.trip.allow_kids = Number(trip.allow_kids) > 0;
        this.trip.allow_animals = Number(trip.allow_animals) > 0;
        this.trip.allow_smoking = Number(trip.allow_smoking) > 0;
        
        if (trip.seat_price_cents != null) {
            this.price = trip.seat_price_cents / 100;
            this.trip.seat_price_cents = trip.seat_price_cents;
        }
        
        this.calcRoute();
    },

        loadTrip() {
            this.getTrip(this.id)
                .then((trip) => {
                    if (this.user.id === trip.user.id) {
                        this.updatingTrip = trip;
                        this.restoreData(trip);
                    } else {
                        this.$router.replace({
                            name: 'trips'
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error) {
                        this.$router.replace({
                            name: 'trips'
                        });
                    }
                });
        },

        parseSeatPriceInput(value) {
            if (value === '' || value === null || value === undefined) {
                return null;
            }
            if (typeof value === 'string' && value.trim() === '') {
                return null;
            }
            const n = Number(value);
            return Number.isFinite(n) ? n : null;
        },

        seatPriceCentsForApi(raw) {
            const p = this.parseSeatPriceInput(raw);
            if (p === null) {
                return 0;
            }
            return Math.round(p * 100);
        },

        onOutboundPriceFieldInput() {
            this.validatePrice();
            const p = this.parseSeatPriceInput(this.price);
            if (
                p !== null &&
                this.priceError.message ===
                    this.$t('contribucionPorPersonaRequerida')
            ) {
                this.priceError.state = false;
            }
        },

        onReturnPriceFieldInput() {
            this.validateReturnPrice();
            const p = this.parseSeatPriceInput(this.returnPrice);
            if (
                p !== null &&
                this.returnPriceError.message ===
                    this.$t('contribucionPorPersonaRequerida')
            ) {
                this.returnPriceError.state = false;
            }
        },

        validate() {
            let globalError = false;
            let foreignPoints = 0;
            let validTime = false;
            let validDate = false;
            let validOtherTripTime = false;
            let validOtherTripDate = false;
            let validWeeklySchedule = false;
            this.points = this.points.filter((point) => point.place);
            for (let index = this.points.length; index < 2; index++) {
                this.addPoint(true);
            }
            this.points = this.points.map((point) => {
                delete point.id;
                return point;
            });
            this.points.forEach((p) => {
                if (!p.json) {
                    p.error.state = true;
                    p.error.message = this.$t('localidadValida');
                    globalError = true;
                } else {
                    foreignPoints +=
                        p.json.country === this.config.osm_country ? 0 : 1;
                }
            });
            if (foreignPoints > 1) {
                globalError = true;
                this.points[0].error.state = true;
                this.points[0].error.message = this.$t(
                    'origenDestinoArgentina'
                );
            }

            if (this.showReturnTrip) {
                foreignPoints = 0;
                this.otherTrip.points.forEach((p) => {
                    if (!p.json) {
                        p.error.state = true;
                        p.error.message = this.$t('seleccioneLocalidadValida');
                        globalError = true;
                    } else {
                        foreignPoints +=
                            p.json.country === this.config.osm_country ? 0 : 1;
                    }
                });
                if (foreignPoints > 1) {
                    globalError = true;
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = this.$t(
                        'origenDestinoArgentina'
                    );
                }
            }

            if (!this.time || !dayjs(this.time, 'HH mm').isValid()) {
                this.timeError.state = true;
                this.timeError.message = this.$t('noHorarioValido');
                globalError = true;
            } else {
                validTime = true;
            }

            if (
                this.points[0].json &&
                last(this.points).json &&
                this.points[0].name === last(this.points).name
            ) {
                this.points[0].error.state = true;
                this.points[0].error.message = this.$t(
                    'origenDestinoDistintos'
                );
                last(this.points).error.state = true;
                last(this.points).error.message = this.$t(
                    'origenDestinoDistintos'
                );
                this.sameCity = true;
                globalError = true;
            }

            if (this.useWeeklySchedule) {
                // Check if at least one day is selected for weekly schedule
                if (this.weeklySchedule === 0) {
                    globalError = true;
                    this.dateError.state = true;
                    this.dateError.message = this.$t('faltaFechaOProgramaSemanal');
                } else {
                    validWeeklySchedule = true;
                }
                
                // Validate weekly schedule time
                if (!this.weeklyScheduleTime || !dayjs(this.weeklyScheduleTime, 'HH:mm').isValid()) {
                    this.timeError.state = true;
                    this.timeError.message = this.$t('noHorarioValido');
                    globalError = true;
                }
            } else if (
                !(this.dateAnswer && this.dateAnswer.length) ||
                !dayjs(this.dateAnswer).isValid()
            ) {
                globalError = true;
                this.dateError.state = true;
                this.dateError.message = this.$t('faltaFecha');
            } else {
                validDate = true;
            }
            if (this.trip.total_seats < this.passengers) {
                globalError = true;
                this.seatsError.state = true;
                this.seatsError.message =
                    this.$t('yaTienes') +
                    this.trip.passengers +
                    this.$t('pasajerosSubidos');
                dialogs.message(
                    this.$t('yaTienes') +
                        this.trip.passengers +
                        this.$t('pasajerosSubidos'),
                    {
                        estado: 'error'
                    }
                );
            } else if (globalError) {
                dialogs.message(this.$t('algunosDatosNoValidos'), {
                    estado: 'error'
                });
            } else if (
                !this.no_lucrar &&
                this.trip.is_passenger.toString() !== '1'
            ) {
                this.lucrarError.state = true;
                this.lucrarError.message = this.$t('teComprometesANoLucrar');
                dialogs.message(this.$t('teComprometesANoLucrar'), {
                    estado: 'error'
                });
                globalError = true;
            } else if (!this.trip.description) {
                this.commentError.state = true;
                this.commentError.message = this.$t('olvidasteDescripcion');
                dialogs.message(this.$t('olvidasteDescripcion'), {
                    estado: 'error'
                });
            }
            if (validDate && validTime) {
                if (
                    dayjs(this.dateAnswer).format('YYYY-MM-DD') ===
                    dayjs().format('YYYY-MM-DD')
                ) {
                    // la fecha es de hoy, la hora no debería poder ser anterior
                    if (
                        dayjs(this.time, 'HH mm').format('HH mm') <
                        dayjs().format('HH mm')
                    ) {
                        this.timeError.state = true;
                        this.timeError.message = this.$t('viajesPasado');
                        globalError = true;
                    }
                }
            }

            if (this.trip.is_passenger == 0 && this.config.module_seat_price_enabled) {
                const seatP = this.parseSeatPriceInput(this.price);
                if (seatP === null) {
                    globalError = true;
                    this.priceError.state = true;
                    this.priceError.message = this.$t(
                        'contribucionPorPersonaRequerida'
                    );
                } else if (
                    this.config.module_max_price_enabled &&
                    seatP > this.maximum_seat_price_cents / 100
                ) {
                    globalError = true;
                    this.priceError.state = true;
                    this.priceError.message = this.getMaxContributionExceededMessage(
                        this.maximum_seat_price_cents
                    );
                    this.markMaxContributionExceededWarningAsShown();
                } else {
                    this.priceError.state = false;
                }
            } else {
                this.priceError.state = false;
            }

            if (this.showReturnTrip) {
                if (this.useWeeklySchedule) {
                    // Check if at least one day is selected for weekly schedule
                    if (this.weeklySchedule === 0) {
                        globalError = true;
                        this.otherTrip.dateError.state = true;
                        this.otherTrip.dateError.message = this.$t('faltaFechaOProgramaSemanal');
                    } else {
                        validOtherTripDate = true;
                    }
                    
                    // Validate weekly schedule time
                    if (!this.weeklyScheduleReturnTime || !dayjs(this.weeklyScheduleReturnTime, 'HH:mm').isValid()) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message = this.$t('noHorarioValido');
                        globalError = true;
                    } else {
                        validOtherTripTime = true;
                    }
                } else {
                    if (
                        !this.otherTrip.time ||
                        !dayjs(this.otherTrip.time, 'HH mm').isValid()
                    ) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message =
                            this.$t('noHorarioValido');
                        globalError = true;
                    } else {
                        validOtherTripTime = true;
                    }
                }

                if (
                    this.otherTrip.points[0].json &&
                    last(this.otherTrip.points).json &&
                    this.otherTrip.points[0].name ===
                        last(this.otherTrip.points).name
                ) {
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = this.$t(
                        'origenDestinoDistintos'
                    );
                    last(this.otherTrip.points).error.state = true;
                    last(this.otherTrip.points).error.message = this.$t(
                        'origenDestinoDistintos'
                    );
                    this.otherTrip.sameCity = true;
                    globalError = true;
                }

                if (
                    !(
                        this.otherTrip.dateAnswer &&
                        this.otherTrip.dateAnswer.length
                    ) ||
                    !dayjs(this.otherTrip.dateAnswer).isValid()
                ) {
                    globalError = true;
                    this.otherTrip.dateError.state = true;
                    this.otherTrip.dateError.message = this.$t('faltaFecha');
                } else {
                    validOtherTripDate = true;
                }

                if (validOtherTripTime && validOtherTripDate && !this.useWeeklySchedule) {
                    if (
                        dayjs(this.otherTrip.dateAnswer).format(
                            'YYYY-MM-DD'
                        ) === dayjs().format('YYYY-MM-DD')
                    ) {
                        // la fecha es de hoy, la hora no debería poder ser anterior
                        if (
                            dayjs(this.otherTrip.time, 'HH mm').format(
                                'HH mm'
                            ) < dayjs().format('HH mm')
                        ) {
                            this.otherTrip.timeError.state = true;
                            this.otherTrip.timeError.message =
                                this.$t('viajesPasado');
                            globalError = true;
                        }
                    }

                    let time = dayjs(this.time, 'HH:mm');
                    const tripDate = dayjs(this.dateAnswer)
                        .hour(time.hour())
                        .minute(time.minute())
                        .second(time.second());

                    time = dayjs(this.otherTrip.time, 'HH:mm');
                    const otherTripDate = dayjs(this.otherTrip.dateAnswer)
                        .hour(time.hour())
                        .minute(time.minute())
                        .second(time.second());

                    if (
                        otherTripDate.isBefore(tripDate) ||
                        otherTripDate.isSame(tripDate)
                    ) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message =
                            this.$t('fechaHoraLogicas');
                        globalError = true;
                    }
                }

                if (!this.otherTrip.trip.description) {
                    this.otherTrip.commentError.state = true;
                    this.otherTrip.commentError.message = this.$t('olvidasteDescripcion');
                    dialogs.message(this.$t('olvidasteDescripcion'), {
                        estado: 'error'
                    });
                }

                if (
                    this.trip.is_passenger == 0 &&
                    this.config.module_seat_price_enabled &&
                    (!this.config.module_max_price_enabled ||
                        this.config.module_trip_creation_payment_enabled)
                ) {
                    const returnSeatP = this.parseSeatPriceInput(
                        this.returnPrice
                    );
                    if (returnSeatP === null) {
                        globalError = true;
                        this.returnPriceError.state = true;
                        this.returnPriceError.message = this.$t(
                            'contribucionPorPersonaRequerida'
                        );
                    } else if (
                        this.config.module_trip_creation_payment_enabled &&
                        this.config.module_max_price_enabled &&
                        returnSeatP >
                            this.maximum_return_seat_price_cents / 100
                    ) {
                        globalError = true;
                        this.returnPriceError.state = true;
                        this.returnPriceError.message = this.getMaxContributionExceededMessage(
                            this.maximum_return_seat_price_cents
                        );
                        this.markReturnMaxContributionExceededWarningAsShown();
                    } else {
                        this.returnPriceError.state = false;
                    }
                } else {
                    this.returnPriceError.state = false;
                }
            }

            if (!this.showReturnTrip) {
                this.returnPriceError.state = false;
            }

            return globalError;
        },

        getSaveInfo(tripObj, estimatedTime, useWeeklySchedule = this.useWeeklySchedule, weeklyScheduleTime = this.weeklyScheduleTime) {
            const points = tripObj.points.map((p) => {
                return {
                    address: p.name,
                    json_address: p.json,
                    lat: p.location.lat,
                    lng: p.location.lng,
                    node_id: p.place.id
                };
            });

            const tripInfo = {
                points,
                from_town: points[0].address,
                to_town: last(points).address,
                estimated_time: estimatedTime,
                car_id: this.cars.length > 0 ? this.cars[0].id : undefined
            };

            if (!useWeeklySchedule) {
                // Only include trip_date when in specific date view (not using weekly schedule)
                tripInfo.trip_date = tripObj.dateAnswer + ' ' + tripObj.time + ':00';
            } else {
                // Only include weekly_schedule when in weekly schedule view
                tripInfo.weekly_schedule = this.weeklySchedule;
                tripInfo.weekly_schedule_time = weeklyScheduleTime + ':00';
            }

            const result = Object.assign({}, tripObj.trip, tripInfo);
            
            return result;
        },

        save() {
            const validationResult = this.validate();
            if (validationResult) {
                // Jump To Error
                this.$nextTick(() => {
                    this.jumpToError();
                });
                return;
            }
            /* eslint-disable no-unreachable */
            this.saving = true;
            if (!this.updatingTrip) {
                if (this.$redirectToIdentityValidationIfRequired()) {
                    this.saving = false;
                    return;
                }
                let trip = this.getSaveInfo(this, this.estimatedTimeString);
                trip.is_passenger = trip.is_passenger ? 1 : 0;
                this.normalizeAllowFlagsForApi(trip);

                trip.seat_price_cents = this.seatPriceCentsForApi(this.price);
                
                if (trip.is_passenger === 1) {
                    trip.no_lucrar = 1;
                }
                this.createTrip(trip)
                    .then((t) => {
                        return new Promise((resolve, reject) => {
                            if (!this.showReturnTrip) {
                                return resolve();
                            } else {
                                let otherTrip = this.getSaveInfo(
                                    this.otherTrip,
                                    this.otherTripEstimatedTimeString,
                                    this.useWeeklySchedule,
                                    this.weeklyScheduleReturnTime
                                );
                                otherTrip.parent_trip_id = t.id;
                                otherTrip = JSON.parse(
                                    JSON.stringify(otherTrip)
                                );
                                this.normalizeAllowFlagsForApi(otherTrip);
                                otherTrip.seat_price_cents =
                                    this.seatPriceCentsForApi(this.returnPrice);
                                this.createTrip(otherTrip).then((ot) => {
                                    return resolve(ot);
                                });
                            }
                        }).then((ot) => {
                            this.saving = false;
                            this.$router.replace({
                                name: 'detail_trip',
                                params: {
                                    id: t.id
                                }
                            });
                        });
                    })
                    .catch((err) => {
                        console.log('error_creating', err);
                        if (this.$checkError(err, 'identity_validation_required')) {
                            this.$router.push({ name: 'identity_validation' });
                            dialogs.message(this.$t('debesValidarIdentidadParaAccion'), {
                                estado: 'error'
                            });
                        } else if (
                            err &&
                            err.data &&
                            err.data.errors &&
                            err.data.errors.driver_is_verified
                        ) {
                            dialogs.message(this.$t('tienesQueSerConductor'), {
                                estado: 'error'
                            });
                        } else if (this.$checkError(err, 'routing_service_unavailable')) {
                            dialogs.message(this.$t('routingServiceTemporaryError'), {
                                estado: 'error'
                            });
                        } else {
                            dialogs.message(
                                this.$t('problemaAlCargarElViaje'),
                                {
                                    estado: 'error'
                                }
                            );
                        }
                        this.jumpToError();
                        this.saving = false;
                    });
            } else {
                this.trip.id = this.updatingTrip.id;
                let trip = JSON.parse(JSON.stringify(this.trip));
                this.normalizeAllowFlagsForApi(trip);
                trip.seat_price_cents = this.seatPriceCentsForApi(this.price);
                this.updateTrip(trip)
                    .then(() => {
                        this.saving = false;
                        this.$router.replace({
                            name: 'detail_trip',
                            params: { id: this.trip.id }
                        });
                    })
                    .catch((err) => {
                        this.saving = false;
                        if (this.$checkError(err, 'routing_service_unavailable')) {
                            dialogs.message(this.$t('routingServiceTemporaryError'), {
                                estado: 'error'
                            });
                        } else {
                            dialogs.message(this.$t('problemaAlCargarElViaje'), {
                                estado: 'error'
                            });
                        }
                    });
            }
        },

        getPlace(i, data, type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            trip.points[i].place = data;
            trip.points[i].name = data.name;
            // TODO: Recordar parseStreet
            trip.points[i].json = data;
            trip.points[i].error.state = false;
            trip.center = trip.points[i].location = {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            };
            if ((i === 0 || i === trip.points.length - 1) && trip.sameCity) {
                trip.points[0].error.state = false;
                last(trip.points).error.state = false;
            }

            if (type === 'trip') {
                this.addPoint();
                // Mirror the entire points array
                this.otherTrip.points = this.points.slice().reverse().map(point => ({
                    name: point.name,
                    place: point.place,
                    json: point.json,
                    location: point.location,
                    error: new Error(),
                    id: point.id  // Preserve the original ID
                }));
                
                // Update the center to the first point of the return trip
                this.otherTrip.center = this.otherTrip.points[0].location;
                this.calcRoute('returnTrip');
            } else {
                this.addReturnPoint();
            }

            this.calcRoute(type);
            this.recalculateRecommendedPrice();
        },

        getPlaceholder(index) {
            if (this.points.length - 1 === index) {
                return this.$t('destino');
            } else if (index === 0) {
                return this.$t('origen');
            } else {
                return this.$t('ingresePuntoIntermedio');
            }
        },

        onBackButton() {
            this.$router.replace({
                name: 'trips'
            });
        },

        addPoint(force) {
            if (
                this.points.filter((point) => point.name === '').length === 0 ||
                force
            ) {
                let newArr = this.points.splice(0);
                let newp = {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: new Date().getTime()
                };
                newArr.splice(this.points.length - 1, 0, newp);
                this.points = newArr;
            }
        },
        addReturnPoint(force) {
            if (
                this.otherTrip.points.filter((point) => point.name === '').length === 0 ||
                force
            ) {
                let newArr = this.otherTrip.points.splice(0);
                let newp = {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: new Date().getTime()
                };
                newArr.splice(this.otherTrip.points.length - 1, 0, newp);
                this.otherTrip.points = newArr;
            }
        },
        resetPoints(m, index) {
            if (index === 0 || index === this.points.length - 1) {
                // If removing origin or destination, clear the point
                m.name = '';
                m.place = null;
                m.json = null;
                m.location = null;
            } else {
                // If removing intermediate point, remove it and shift remaining points
                this.points.splice(index, 1);
            }
            // Always recalculate trip info
            this.calcRoute('trip');
        },

        calcRoute(type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            let points = trip.points.filter((point) => point.name);

            // Only proceed if we have at least 2 points with names
            if (points.length < 2) {
                return;
            }

            let data = {
                points: points.map((point) => point.location)
            };

            tripApi.getTripInfo(data).then((result) => {
                if (result.status === true) {
                    trip.trip.distance = result.data.distance;
                    trip.duration = result.data.duration;
                    trip.trip.co2 = result.data.co2;
                    trip.route_needs_payment = result.data.route_needs_payment;
                    
                    if (type === 'trip') {
                        this.maximum_trip_price_cents = result.data.maximum_trip_price_cents;
                        this.recommended_trip_price_cents = result.data.recommended_trip_price_cents;
                        this.recalculateRecommendedPrice();
                    } else {
                        this.maximum_return_trip_price_cents = result.data.maximum_trip_price_cents;
                        this.recommended_return_trip_price_cents = result.data.recommended_trip_price_cents;
                        this.recalculateRecommendedReturnPrice();
                    }
                } else if (result.error_code === 'routing_service_unavailable') {
                    dialogs.message(this.$t('routingServiceTemporaryError'), {
                        estado: 'error'
                    });
                }
            });

            if (this.$refs.map && this.$refs.map.mapObject) {
                let map = this.$refs.map.mapObject;
                const waypointsMeta = points.map((point) => ({
                    lat: point.location.lat,
                    lng: point.location.lng
                }));
                const routingLang = appLocaleToRoutingLanguage[this.$i18n.locale] || 'es';
                const osrmServiceUrl = leafletOsrmServiceUrl();
                console.debug('[Carpoolear][L.Routing] NewTrip calcRoute: Routing.control via backend OSRM proxy', {
                    type: type || 'trip',
                    waypointCount: points.length,
                    waypoints: waypointsMeta,
                    language: routingLang,
                    serviceUrl: osrmServiceUrl
                });

                /* eslint-disable no-undef */
                L.Routing.control({
                    router: L.Routing.osrmv1({
                        serviceUrl: osrmServiceUrl,
                        language: routingLang,
                        suppressDemoServerWarning: true
                    }),
                    waypoints: points.map(point => L.latLng(point.location.lat, point.location.lng)),
                    language: routingLang
                }).addTo(map);
            } else {
                console.debug('[Carpoolear][L.Routing] NewTrip calcRoute: skip Routing.control (no map ref yet)', {
                    type: type || 'trip',
                    waypointCount: points.length,
                    hasMapRef: !!(this.$refs.map && this.$refs.map.mapObject)
                });
            }
        },
        validatePrice() {
            const p = this.parseSeatPriceInput(this.price);
            if (
                p !== null &&
                this.config.module_max_price_enabled &&
                p > this.maximum_seat_price_cents / 100
            ) {
                this.priceError.state = true;
                this.priceError.message = this.getMaxContributionExceededMessage(
                    this.maximum_seat_price_cents
                );
                this.markMaxContributionExceededWarningAsShown();
            } else if (
                this.priceError.message ===
                this.getMaxContributionExceededMessage(
                    this.maximum_seat_price_cents
                )
            ) {
                this.priceError.state = false;
            }
            if (
                p !== null &&
                this.priceError.message ===
                    this.$t('contribucionPorPersonaRequerida')
            ) {
                this.priceError.state = false;
            }
        },
        recalculateRecommendedPrice() {
            // The maximum_trip_price_cents is the total price for the entire trip (including driver)
            this.maximum_seat_price_cents = Math.round(this.maximum_trip_price_cents / (this.trip.total_seats + 1));
            this.recommended_seat_price_cents = Math.round(this.recommended_trip_price_cents / (this.trip.total_seats + 1));
            this.validatePrice();
        },
        recalculateRecommendedReturnPrice() {
            this.maximum_return_seat_price_cents = Math.round(this.maximum_return_trip_price_cents / (this.otherTrip.trip.total_seats + 1));
            this.recommended_return_seat_price_cents = Math.round(this.recommended_return_trip_price_cents / (this.otherTrip.trip.total_seats + 1));
            this.validateReturnPrice();
        },
        validateReturnPrice() {
            const p = this.parseSeatPriceInput(this.returnPrice);
            if (
                p !== null &&
                p > this.maximum_return_seat_price_cents / 100
            ) {
                this.returnPriceError.state = true;
                this.returnPriceError.message = this.getMaxContributionExceededMessage(
                    this.maximum_return_seat_price_cents
                );
                this.markReturnMaxContributionExceededWarningAsShown();
            } else if (
                this.returnPriceError.message ===
                this.getMaxContributionExceededMessage(
                    this.maximum_return_seat_price_cents
                )
            ) {
                this.returnPriceError.state = false;
            }
            if (
                p !== null &&
                this.returnPriceError.message ===
                    this.$t('contribucionPorPersonaRequerida')
            ) {
                this.returnPriceError.state = false;
            }
        },
        resetReturnPoints(m, index) {
            if (index === 0 || index === this.otherTrip.points.length - 1) {
                // If removing origin or destination, clear the point
                m.name = '';
                m.place = null;
                m.json = null;
                m.location = null;
            } else {
                // If removing intermediate point, remove it and shift remaining points
                this.otherTrip.points.splice(index, 1);
            }
            // Always recalculate trip info
            this.calcRoute('returnTrip');
        }
    }
};
</script>

<style scoped>
hr {
    border-top: 1px solid var(--primary-color);
    margin: 1em;
}
.no-padding {
    padding: 0;
}
.show-return-trip {
    margin-top: 1em;
}
.preferences-text {
    font-size: 0.8em;
}
.preferences {
    margin-right: 0px;
}

.trip_terms--lucrar-card {
    margin-top: 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    max-width: 100%;
    background: var(--form-background, #fff);
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    box-sizing: border-box;
}

.trip_terms--lucrar-card__label.trip_terms_label,
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

.trip_terms--lucrar-card__label.trip_terms_label.has-error {
    color: #111;
}

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

.trip_terms--lucrar-card__box.checkbox-box:after {
    width: 11px;
    height: 7px;
    left: 3px;
    top: 5px;
    border: 2px solid #444;
    border-top: none;
    border-right: none;
}

.trip_terms--lucrar-card__copy {
    flex: 1;
    min-width: 0;
}

.trip_terms--lucrar-card__title-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 0.35rem;
}

.trip_terms--lucrar-card__tooltip {
    flex-shrink: 0;
    margin-top: 0.15em;
}

.trip_terms--lucrar-card__title {
    flex: 1 1 0;
    min-width: 0;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.35;
    color: #111;
}

.trip_terms--lucrar-card__lead {
    margin: 0.65rem 0 0 0;
    font-weight: 700;
    font-size: 0.9375rem;
    color: #111;
    line-height: 1.35;
}

.trip_terms--lucrar-card__text {
    margin: 0.4rem 0 0 0;
    font-weight: 400;
    font-size: 0.8125rem;
    color: #111;
    line-height: 1.45;
}

.trip_terms--lucrar-card__label.has-error .trip_terms--lucrar-card__title {
    color: var(--main-error, #d72521);
}

.container {
    padding-top: 0;
}
.trip-type-selection {
    margin-top: 1.4rem;
}
span.error {
    display: block;
    font-size: 12px;
    margin-top: -5px;
    font-weight: bold;
    color: red;
    margin-bottom: 0.4em;
}
span.error.textarea {
    margin-top: 0.8em;
}
.trip_points--left {
    margin-left: 0.5rem;
}
.title--desktop {
    margin-left: 0.5em;
    margin-bottom: 20px;
    color: var(--primary-color);
}
@media only screen and (min-width: 768px) {
    .row-showReturnTrip hr {
        padding-top: 1em;
    }
    hr {
        width: 68%;
    }
    .container {
        padding-top: 1.5em;
    }
    .trip-type-selection {
        margin-top: 0;
    }
    span.error {
        font-weight: 300;
    }
    .row-showReturnTrip {
        margin-bottom: 1.5rem;
    }
}
.tooltip-bottom {
    color: var(--trip-almost-fill-color);
}
textarea.form-control {
    min-height: 14em;
    height: auto;
}
.alert-sellado-viaje {
    margin-top: -1em;
}

.label-tooltip {
    width: 100%;
}

.new-trip-tooltips--left .tooltip-seat-price.tooltip-bottom::before {
    width: auto;
    min-width: 20vw;
    max-width: 40vw;
}

/* Bottom tooltips: anchor to the trigger’s right edge and expand leftward */
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:before) {
    left: auto;
    right: 0;
    margin-left: 0;
    transform: translate(0, 20px);
    text-align: left;
    width: auto;
    min-width: 20vw;
    max-width: 40vw;
}

.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:after) {
    left: auto;
    right: 10px;
    margin-left: 0;
    transform: translate(0, 20px);
}

/* Long legal copy next to “Me comprometo…” */
.new-trip-tooltips--left
    :deep(.trip_terms--lucrar-card__tooltip[data-tooltip].tooltip-bottom:before) {
    min-width: min(28rem, 92vw);
    max-width: min(36rem, 92vw);
}

.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:hover:before),
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:hover:after),
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:focus:before),
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:focus:after) {
    transform: translate(0, 20px);
}

@media only screen and (max-width: 768px) {
    .new-trip-tooltips--left .tooltip-seat-price.tooltip-bottom::before {
        min-width: 40vw;
        max-width: 60vw;
    }

    .new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:before) {
        min-width: 40vw;
        max-width: 60vw;
    }
}

.trip_schedule-toggle {
    margin-bottom: 1em;
}

.schedule-toggle-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 0.5em;
}

.schedule-toggle-buttons .schedule-tab {
    flex: 1;
    padding: 8px 16px;
    border: 1px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.schedule-toggle-buttons .schedule-tab:hover {
    background: var(--secondary-background);
    color: white;
}

.schedule-toggle-buttons .schedule-tab.active {
    background: var(--secondary-background);
    color: white;
}

.trip-weekly-schedule {
    margin-bottom: 1em;
}

.trip-create--update {
    margin-top: 2em;
}

.trip-form-info-icon {
    width: 1.1em;
    height: 1.1em;
    vertical-align: middle;
    display: inline-block;
}

.trip-pref-cards__cell {
    text-align: center;
    margin-bottom: 0.35rem;
}

.trip-pref-card {
    display: inline-block;
    max-width: 100%;
}

.trip-pref-card__label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin: 0;
    font-weight: normal;
}

.trip-pref-card__surface {
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

.trip-pref-card__input:checked + .trip-pref-card__label .trip-pref-card__surface {
    border-color: var(--primary-color, #0070b8);
    background: #fffef8;
}

.trip-pref-card__badge {
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

.trip-pref-card__badge .fa-check {
    opacity: 0;
    transform: scale(0.75);
    transition:
        opacity 0.12s ease,
        transform 0.12s ease;
}

.trip-pref-card__input:checked + .trip-pref-card__label .trip-pref-card__badge {
    border-color: var(--primary-color, #0070b8);
    background: var(--primary-color, #0070b8);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.trip-pref-card__input:checked + .trip-pref-card__label .trip-pref-card__badge .fa-check {
    opacity: 1;
    transform: scale(1.12);
}

.trip-pref-card__icon {
    display: block;
    object-fit: contain;
    width: 1.4rem;
    height: 1.4rem;
}

.trip-pref-card__caption {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.8rem;
    text-align: center;
    color: var(--main-font-color, #555);
    max-width: 7.5rem;
    line-height: 1.25;
}

.trip-pref-card__input:focus-visible + .trip-pref-card__label .trip-pref-card__surface {
    outline: 2px solid var(--primary-color, #0070b8);
    outline-offset: 2px;
}

.trip-form-error-with-icon {
    display: flex;
    align-items: flex-start;
    gap: 0.35em;
}

.trip-form-warning-icon {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    margin-top: 0.15em;
    object-fit: contain;
}

.trip-form-mobile-footer {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 11;
    bottom: calc(52px + env(safe-area-inset-bottom, 0px));
    padding: 0.75rem 1rem;
    background: var(--main-background, #fff);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.trip-form-mobile-footer__return {
    margin-bottom: 0.5rem;
}

.trip-form-mobile-footer__submit {
    margin: 0 !important;
    width: 100%;
    min-width: 100%;
}

.trip-contribucion-recomendada-card {
    background: #f0f9eb;
    border: 1px solid var(--trip-mostly-free-color, #91b64c);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    margin: 0.75rem 0 1rem;
}

.trip-contribucion-recomendada-card__main {
    font-size: 1rem;
    line-height: 1.35;
    margin-bottom: 0.35rem;
    color: #2d5016;
}

.trip-contribucion-recomendada-card__main strong {
    font-weight: 700;
}

.trip-contribucion-recomendada-card__hint {
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: #5c6d3a;
    opacity: 0.95;
}
</style>
