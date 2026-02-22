<template>
    <div class="new-trip-component container">
        <div class="alert alert-info alert-sellado-viaje" v-if="config.module_trip_creation_payment_enabled">
            <p>{{ $t('mensajeContandoSobreSelladoViaje') }}</p>
            <p>{{ $t('podesHacerViajesGratis', { free_trips_amount: free_trips_amount }) }}</p>
            <div v-if="trips_created_by_user_amount >= free_trips_amount">
                <p>{{ $t('yaCreasteViajes', { trips_created_by_user_amount: trips_created_by_user_amount }) }} {{ $t('luegoTendrasQuePagarSelladoViaje') }}</p>
            </div>
            <div v-if="trips_created_by_user_amount < free_trips_amount">
                <p>{{ $t('teQuedaViajesGratis', { remainingFreeTrips: remainingFreeTrips }) }} viaje{{ (remainingFreeTrips) === 1 ? '' : 's' }} gratis, {{ $t('luegoTendrasQuePagarSelladoViaje') }}</p>
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
                                <i
                                    class="fa fa-info-circle"
                                    aria-hidden="true"
                                ></i>
                            </span>
                        </span>
                    </div>
                    <div
                        class="new-left trip_points trip_points--left"
                        v-if="!isMobile && tripCardTheme === 'light'"
                    >
                        <div
                            v-for="(m, index) in points"
                            class="trip_point gmap-autocomplete"
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
                                :value="m.name"
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
                    <div class="trip_terms" v-if="trip.is_passenger == 0">
                        <input
                            type="checkbox"
                            id="no-lucrar"
                            v-model="no_lucrar"
                            class="checkbox-button"
                        />
                        <label
                            for="no-lucrar"
                            class="trip_terms_label checkbox-click-target"
                            :class="{ 'has-error': lucrarError.state }"
                        >
                            <span class="checkbox-box"></span>
                            <span>
                                {{ $t('meComprometo') }}
                                <span
                                    class="tooltip-bottom"
                                    :data-tooltip="$t('contribucionMaximaPista')"
                                >
                                    <i
                                        class="fa fa-info-circle"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                                <br />
                                <small>{{ $t('contribucionMaxima') }}</small>
                            </span>
                        </label>
                    </div>
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
                                        <i
                                            class="fa fa-info-circle"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </span>
                            </div>
                            <div
                                class="new-left trip_points col-sm-13 col-md-15"
                                v-if="isMobile || tripCardTheme !== 'light'"
                            >
                                <div
                                    v-for="(m, index) in points"
                                    class="trip_point gmap-autocomplete"
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
                                        :value="m.name"
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
                                        :value="date"
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
                                        v-mask="'##:##'"
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
                                    :data-tooltip="$t('precioAsientoTooltip', { sellado: config.module_trip_creation_payment_enabled ? ' y Sellado de Viaje.' : '' })"
                                >
                                    <i
                                        class="fa fa-info-circle"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                                </legend>

                                <input
                                    type="number"
                                    v-model="price"
                                    class="form-control form-control-with-icon form-control-price"
                                    id="price"
                                    :class="{ 'has-error': priceError.state }"
                                    :placeholder="price"
                                />
                                <span class="error" v-if="priceError.state">
                                    {{ priceError.message }}
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
                                        :data-tooltip="$t('precioAsientoTooltip', { sellado: config.module_trip_creation_payment_enabled ? ' y Sellado de Viaje.' : '' })"
                                    >
                                        <i
                                            class="fa fa-info-circle"
                                            aria-hidden="true"
                                        ></i>
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
                                    @input="validatePrice"
                                />
                                <span class="error" v-if="priceError.state">
                                    {{ priceError.message }}
                                </span>
                            </div>

                            <div v-if="trip.is_passenger == 0 && trip.distance > 0 && config.module_seat_price_enabled">
                                <div
                                class="label-soft"
                                v-if="tripCardTheme !== 'light'"
                                style="
                                    color: var(--trip-mostly-free-color);
                                    font-weight: bold;
                                    margin-bottom: 10px;
                                    font-size: 1.1rem;
                                "
                                >
                                    {{ $t('contribucionRecomendadaLabel') }}

                                    <span
                                        style="
                                            color: var(
                                                --trip-almost-fill-color
                                            );
                                        "
                                    >
                                        $ {{ recommendedSeatPrice }}

                                    <span>

                                        <span
                                            class="tooltip-seat-price"
                                            :data-tooltip="$t('calculadoEnBaseNaftaTooltip')"
                                        >
                                            <i
                                                class="fa fa-info-circle"
                                                aria-hidden="true"
                                            ></i>
                                        </span>
                                    </span>
                                    </span>
                                </div>
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
                            <legend class="label-for-group">
                                {{ $t('preferenciasViaje') }}
                            </legend>
                            <br />
                            <div
                                class="preferences row"
                                v-if="tripCardTheme !== 'light' || isMobile"
                            >
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input
                                            type="checkbox"
                                            id="smoking"
                                            v-model="trip.allow_smoking"
                                        />
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem
                                            icon="no-smoking"
                                            :size="24"
                                        ></SvgItem>
                                    </div>
                                    <div class="col-xs-24">
                                        <label
                                            for="allow-smoking"
                                            class="label-soft preferences-text"
                                        >
                                            {{ $t('nofumar') }}
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input
                                            type="checkbox"
                                            id="animals"
                                            v-model="trip.allow_animals"
                                        />
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem
                                            icon="no-animals"
                                            :size="24"
                                        ></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label
                                            for="allow-animals"
                                            class="label-soft preferences-text"
                                        >
                                            {{ $t('noanimales') }}
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input
                                            type="checkbox"
                                            id="kids"
                                            v-model="trip.allow_kids"
                                        />
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem
                                            icon="no-kids"
                                            :size="24"
                                        ></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label
                                            for="allow-kids"
                                            class="label-soft preferences-text"
                                        >
                                            {{ $t('noninos') }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <ul
                                class="no-bullet preferences row"
                                v-if="tripCardTheme === 'light' && !isMobile"
                            >
                                <li>
                                    <input
                                        type="checkbox"
                                        id="smoking"
                                        v-model="trip.allow_smoking"
                                        class="checkbox-button"
                                    />
                                    <label
                                        for="smoking"
                                        class="label-soft preferences-text checkbox-click-target"
                                    >
                                        <span class="checkbox-box"></span>
                                        <SvgItem
                                            icon="no-smoking"
                                            :size="24"
                                        ></SvgItem>
                                        {{ $t('nofumar') }}
                                    </label>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        id="animals"
                                        v-model="trip.allow_animals"
                                        class="checkbox-button"
                                    />
                                    <label
                                        for="animals"
                                        class="label-soft preferences-text checkbox-click-target"
                                    >
                                        <span class="checkbox-box"></span>
                                        <SvgItem
                                            icon="no-animals"
                                            :size="24"
                                        ></SvgItem>
                                        {{ $t('noanimales') }}
                                    </label>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        id="kids"
                                        v-model="trip.allow_kids"
                                        class="checkbox-button"
                                    />
                                    <label
                                        for="allow-kids"
                                        class="label-soft preferences-text checkbox-click-target"
                                    >
                                        <span class="checkbox-box"></span>
                                        <SvgItem
                                            icon="kids"
                                            :size="24"
                                        ></SvgItem>
                                        {{ $t('noninos') }}
                                    </label>
                                </li>
                            </ul>
                            <div v-if="!updatingTrip" class="row row-showReturnTrip">
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
                                v-if="!showReturnTrip"
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
                            class="trip_point gmap-autocomplete"
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
                                :value="m.name"
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
                                    class="trip_point gmap-autocomplete"
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
                                        :value="m.name"
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
                                        :value="otherTrip.date"
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
                                        v-mask="'##:##'"
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
                                    :data-tooltip="$t('precioAsientoTooltip', { sellado: config.module_trip_creation_payment_enabled ? ' y Sellado de Viaje.' : '' })"
                                >
                                    <i
                                        class="fa fa-info-circle"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                                </legend>

                                <input
                                    type="number"
                                    v-model="returnPrice"
                                    class="form-control form-control-with-icon form-control-price"
                                    id="return-price"
                                    :class="{ 'has-error': returnPriceError.state }"
                                    :placeholder="returnPrice"
                                />
                                <span class="error" v-if="returnPriceError.state">
                                    {{ returnPriceError.message }}
                                </span>
                            </div>
                            <div
                                class="trip_price"
                                v-if="config.module_trip_creation_payment_enabled && config.module_seat_price_enabled"
                            >
                                <legend class="label-for-group label-tooltip">
                                    {{ $t('precioAsiento') }}
                                    <span
                                        class="tooltip-bottom tooltip-seat-price"
                                        :data-tooltip="$t('precioAsientoTooltip', { sellado: config.module_trip_creation_payment_enabled ? ' y Sellado de Viaje.' : '' })"
                                    >
                                        <i
                                            class="fa fa-info-circle"
                                            aria-hidden="true"
                                        ></i>
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
                                    @input="validatePrice"
                                />
                                <span
                                    class="error"
                                    v-if="returnPriceError.state"
                                >
                                    {{ returnPriceError.message }}
                                </span>
                            </div>

                            <div v-if="trip.is_passenger == 0 && trip.distance > 0 && config.module_seat_price_enabled">
                                <div
                                class="label-soft"
                                v-if="tripCardTheme !== 'light'"
                                style="
                                    color: var(--trip-mostly-free-color);
                                    font-weight: bold;
                                    margin-bottom: 10px;
                                    font-size: 1.1rem;
                                "
                                >
                                    {{ $t('contribucionRecomendadaLabel') }}

                                    <span
                                        style="
                                            color: var(
                                                --trip-almost-fill-color
                                            );
                                        "
                                    >
                                        $ {{ recommendedReturnSeatPrice }}

                                    <span>

                                        <span
                                            class="tooltip-seat-price"
                                            :data-tooltip="$t('calculadoEnBaseNaftaTooltip')"
                                        >
                                            <i
                                                class="fa fa-info-circle"
                                                aria-hidden="true"
                                            ></i>
                                        </span>
                                    </span>
                                    </span>
                                </div>
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
                            <div
                                class="preferences row"
                                v-if="tripCardTheme !== 'light' || isMobile"
                            >
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input
                                            type="checkbox"
                                            id="smoking"
                                            v-model="
                                                otherTrip.trip.allow_smoking
                                            "
                                        />
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem
                                            icon="no-smoking"
                                            :size="24"
                                        ></SvgItem>
                                    </div>
                                    <div class="col-xs-24">
                                        <label
                                            for="allow-smoking"
                                            class="label-soft preferences-text"
                                        >
                                            {{ $t('nofumar') }}
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input
                                            type="checkbox"
                                            id="animals"
                                            v-model="
                                                otherTrip.trip.allow_animals
                                            "
                                        />
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem
                                            icon="no-animals"
                                            :size="24"
                                        ></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label
                                            for="allow-animals"
                                            class="label-soft preferences-text"
                                        >
                                            {{ $t('noanimales') }}
                                        </label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input
                                            type="checkbox"
                                            id="kids"
                                            v-model="otherTrip.trip.allow_kids"
                                        />
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem
                                            icon="no-kids"
                                            :size="24"
                                        ></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label
                                            for="allow-kids"
                                            class="label-soft preferences-text"
                                        >
                                            {{ $t('noninos') }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <ul
                                class="no-bullet preferences row"
                                v-if="tripCardTheme === 'light' && !isMobile"
                            >
                                <li>
                                    <input
                                        type="checkbox"
                                        id="smoking"
                                        v-model="otherTrip.trip.allow_smoking"
                                    />
                                    <SvgItem
                                        icon="no-smoking"
                                        :size="24"
                                    ></SvgItem>
                                    <label
                                        for="allow-smoking"
                                        class="label-soft preferences-text"
                                    >
                                        {{ $t('nofumar') }}
                                    </label>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        id="animals"
                                        v-model="otherTrip.trip.allow_animals"
                                    />
                                    <SvgItem
                                        icon="no-animals"
                                        :size="24"
                                    ></SvgItem>
                                    <label
                                        for="allow-animals"
                                        class="label-soft preferences-text"
                                    >
                                        {{ $t('noanimales') }}
                                    </label>
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        id="kids"
                                        v-model="otherTrip.trip.allow_kids"
                                    />
                                    <SvgItem
                                        icon="no-kids"
                                        :size="24"
                                    ></SvgItem>
                                    <label
                                        for="allow-kids"
                                        class="label-soft preferences-text"
                                    >
                                        {{ $t('noninos') }}
                                    </label>
                                </li>
                            </ul>
                            <button
                                v-if="showReturnTrip"
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
    </div>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useCarsStore } from '@/stores/cars';
import { useDeviceStore } from '@/stores/device';
import { getTrip as getTripFn } from '@/stores/index';
import { useMyTripsStore } from '@/stores/myTrips';
import DatePicker from '../DatePicker';
import dialogs from '../../services/dialogs.js';
import spinner from '../Spinner.vue';
import moment from 'moment';
import { last } from 'lodash';
import TripApi from '../../services/api/Trips';
import UserApi from '../../services/api/User';
import autocomplete from '../Autocomplete';
import SvgItem from '../SvgItem';
import WeeklySchedule from '../elements/WeeklySchedule';
import bus from '../../services/bus-event.js';

const tripApi = new TripApi();
const userApi = new UserApi();

class FieldError {
    constructor(state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const tripsStore = useTripsStore();
const carsStore = useCarsStore();
const deviceStore = useDeviceStore();
const myTripsStore = useMyTripsStore();

const props = defineProps({
    id: {
        type: [String, Number],
        required: false
    }
});

const user = computed(() => authStore.user);
const cars = computed(() => carsStore.cars);
const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);
const tripCardTheme = computed(() => {
    return config.value ? config.value.trip_card_design : '';
});

const minDate = ref(moment().toDate());
const lucrarError = reactive(new FieldError());
const dateError = reactive(new FieldError());
const timeError = reactive(new FieldError());
const priceError = reactive(new FieldError());
const returnPriceError = reactive(new FieldError());
const commentError = reactive(new FieldError());
const seatsError = reactive(new FieldError());
const no_lucrar = ref(false);
const sameCity = ref(false);
const points = ref([
    {
        name: '',
        place: null,
        json: null,
        location: null,
        error: new FieldError(),
        id: 0
    },
    {
        name: '',
        place: null,
        json: null,
        location: null,
        error: new FieldError(),
        id: 1
    }
]);
const date = ref('');
const dateAnswer = ref('');
const time = ref('12:00');
const price = ref(0);
const needs_to_pay_for_next_trip = ref(false);
const maximum_trip_price_cents = ref(0);
const recommended_trip_price_cents = ref(0);
const maximum_seat_price_cents = ref(0);
const recommended_seat_price_cents = ref(0);
const maximum_return_trip_price_cents = ref(0);
const recommended_return_trip_price_cents = ref(0);
const maximum_return_seat_price_cents = ref(0);
const recommended_return_seat_price_cents = ref(0);
const free_trips_amount = ref(0);
const trips_created_by_user_amount = ref(0);
const route_needs_payment = ref(false);
const returnPrice = ref(0);
const duration = ref(0);
const passengers = ref(0);
const trip = reactive({
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
    allow_kids: true,
    allow_smoking: true,
    allow_animals: true,
    car_id: null,
    enc_path: '123',
    points: []
});
const updatingTrip = ref(null);
const saving = ref(false);
const allowForeignPoints = ref(false);
const showReturnTrip = ref(false);
const otherTrip = reactive({
    minDate: moment().toDate(),
    dateError: new FieldError(),
    timeError: new FieldError(),
    commentError: new FieldError(),
    seatsError: new FieldError(),
    no_lucrar: false,
    sameCity: false,
    points: [
        {
            name: '',
            place: null,
            json: null,
            location: null,
            error: new FieldError()
        },
        {
            name: '',
            place: null,
            json: null,
            location: null,
            error: new FieldError()
        }
    ],
    date: '',
    dateAnswer: '',
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
        allow_kids: true,
        allow_smoking: true,
        allow_animals: true,
        seat_price_cents: 0,
        points: []
    }
});
const useWeeklySchedule = ref(false);
const weeklySchedule = ref(0);
const weeklyScheduleTime = ref('12:00');
const weeklyScheduleReturnTime = ref('12:00');

const columnClass = computed(() => {
    return !isMobile.value && tripCardTheme.value === 'light'
        ? ['col-sm-10', 'col-sm-14']
        : ['col-sm-8', 'col-sm-16'];
});

const distanceString = computed(() => {
    return Math.floor(trip.distance / 1000) + ' Km';
});

const recommendedSeatPrice = computed(() => {
    return Math.floor(recommended_seat_price_cents.value / 100);
});

const recommendedReturnSeatPrice = computed(() => {
    return Math.floor(recommended_return_seat_price_cents.value / 100);
});

const estimatedTimeString = computed(() => {
    const totalMinutes = Math.floor(duration.value / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const hour = Math.floor(totalMinutes / 60);
    return (
        (hour < 10 ? '0' : '') +
        hour +
        ':' +
        (minutes < 10 ? '0' : '') +
        minutes
    );
});

const CO2String = computed(() => {
    return (Math.floor(trip.distance / 1000) * 0.15).toFixed(1) + ' Kg';
});

const otherTripDistanceString = computed(() => {
    return Math.floor(otherTrip.trip.distance / 1000) + ' Km';
});

const otherTripEstimatedTimeString = computed(() => {
    const totalMinutes = Math.floor(otherTrip.duration / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const hour = Math.floor(totalMinutes / 60);
    return (
        (hour < 10 ? '0' : '') +
        hour +
        ':' +
        (minutes < 10 ? '0' : '') +
        minutes
    );
});

const otherTripCO2String = computed(() => {
    return (
        Math.floor(otherTrip.trip.distance / 1000) * 0.15 + ' Kg'
    );
});

const remainingFreeTrips = computed(() => {
    return free_trips_amount.value - trips_created_by_user_amount.value;
});

const center = computed(() => {
    return config.value.map_coordinates;
});

const zoom = computed(() => {
    return config.value.map_zoom;
});

// Watchers
watch(no_lucrar, () => {
    lucrarError.state = false;
});

watch(() => trip.total_seats, (newValue) => {
    if (trip.distance > 0) {
        recalculateRecommendedPrice();
    }
});

watch(() => otherTrip.trip.total_seats, (newValue) => {
    if (otherTrip.trip.distance > 0) {
        recalculateRecommendedReturnPrice();
    }
});

watch(dateAnswer, (value) => {
    if (!showReturnTrip.value || !otherTrip.dateAnswer) {
        // placeholder for future logic
    }
});

watch(time, () => {
    timeError.state = false;
});

watch(weeklyScheduleTime, () => {
    timeError.state = false;
});

watch(weeklyScheduleReturnTime, () => {
    otherTrip.timeError.state = false;
});

watch(() => otherTrip.dateAnswer, () => {
    otherTrip.dateError.state = false;
});

watch(() => otherTrip.time, () => {
    otherTrip.timeError.state = false;
});

watch(() => otherTrip.trip.description, () => {
    otherTrip.commentError.state = false;
});

watch(() => trip.friendship_type_id, () => {
    otherTrip.trip.friendship_type_id = trip.friendship_type_id;
});

// Methods
const setIsPassenger = (value) => {
    trip.is_passenger = value;
};

const changeOtherTripDate = (dateVal) => {
    otherTrip.dateError.state = false;
    otherTrip.dateAnswer = dateVal;
};

const changeDate = (dateVal) => {
    dateError.state = false;
    dateAnswer.value = dateVal;
};

const jumpToError = () => {
    let hasError = document.getElementsByClassName('has-error');
    if (hasError.length) {
        let element = hasError[0];
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

const restoreData = (tripData) => {
    no_lucrar.value = true;
    points.value = [];
    tripData.points.forEach((p) => {
        let point = {
            name: p.address,
            json: p.json_address,
            location: {
                lat: p.lat,
                lng: p.lng
            },
            place: JSON.stringify(p.json_address),
            error: new FieldError()
        };
        points.value.push(point);
    });

    // In update mode, add an empty point for adding new intermediary locations
    if (updatingTrip.value && points.value.length >= 2) {
        let newPoint = {
            name: '',
            place: null,
            json: null,
            location: null,
            error: new FieldError()
        };
        points.value.splice(points.value.length - 1, 0, newPoint);
    }

    // Restore weekly schedule FIRST before date/time
    if (tripData.weekly_schedule > 0) {
        useWeeklySchedule.value = true;
        weeklySchedule.value = tripData.weekly_schedule;
        console.log('restoreData: set weeklySchedule to', weeklySchedule.value, 'from trip.weekly_schedule', tripData.weekly_schedule);

        if (tripData.weekly_schedule_time) {
            weeklyScheduleTime.value = moment(tripData.weekly_schedule_time).format('HH:mm');
        }
    } else {
        useWeeklySchedule.value = false;

        if (tripData.trip_date) {
            date.value = moment(tripData.trip_date.split(' ')[0]).format('YYYY-MM-DD');
            dateAnswer.value = moment(tripData.trip_date.split(' ')[0]).format('YYYY-MM-DD');
            time.value = tripData.trip_date.split(' ')[1];
        }
    }

    trip.is_passenger = tripData.is_passenger ? 1 : 0;
    passengers.value = tripData.passenger_count;
    trip.total_seats = tripData.total_seats;
    trip.friendship_type_id = tripData.friendship_type_id;
    trip.distance = tripData.distance;
    trip.description = tripData.description;

    trip.allow_kids = !(tripData.allow_kids > 0);
    trip.allow_animals = !(tripData.allow_animals > 0);
    trip.allow_smoking = !(tripData.allow_smoking > 0);

    if (tripData.seat_price_cents != null) {
        price.value = tripData.seat_price_cents / 100;
        trip.seat_price_cents = tripData.seat_price_cents;
    }

    calcRoute();
};

const loadTrip = () => {
    getTripFn(tripsStore, myTripsStore, props.id)
        .then((tripData) => {
            if (user.value.id === tripData.user.id) {
                updatingTrip.value = tripData;
                restoreData(tripData);
            } else {
                router.replace({
                    name: 'trips'
                });
            }
        })
        .catch((error) => {
            console.log(error);
            if (error) {
                router.replace({
                    name: 'trips'
                });
            }
        });
};

const validate = () => {
    let globalError = false;
    let foreignPoints = 0;
    let validTime = false;
    let validDate = false;
    let validOtherTripTime = false;
    let validOtherTripDate = false;
    let validWeeklySchedule = false;
    points.value = points.value.filter((point) => point.place);
    for (let index = points.value.length; index < 2; index++) {
        addPoint(true);
    }
    points.value = points.value.map((point) => {
        delete point.id;
        return point;
    });
    points.value.forEach((p) => {
        if (!p.json) {
            p.error.state = true;
            p.error.message = t('localidadValida');
            globalError = true;
        } else {
            foreignPoints +=
                p.json.country === config.value.osm_country ? 0 : 1;
        }
    });
    if (foreignPoints > 1) {
        globalError = true;
        points.value[0].error.state = true;
        points.value[0].error.message = t('origenDestinoArgentina');
    }

    if (showReturnTrip.value) {
        foreignPoints = 0;
        otherTrip.points.forEach((p) => {
            if (!p.json) {
                p.error.state = true;
                p.error.message = t('seleccioneLocalidadValida');
                globalError = true;
            } else {
                foreignPoints +=
                    p.json.country === config.value.osm_country ? 0 : 1;
            }
        });
        if (foreignPoints > 1) {
            globalError = true;
            otherTrip.points[0].error.state = true;
            otherTrip.points[0].error.message = t('origenDestinoArgentina');
        }
    }

    if (!time.value || !moment(time.value, 'HH mm').isValid()) {
        timeError.state = true;
        timeError.message = t('noHorarioValido');
        globalError = true;
    } else {
        validTime = true;
    }

    if (
        points.value[0].json &&
        last(points.value).json &&
        points.value[0].name === last(points.value).name
    ) {
        points.value[0].error.state = true;
        points.value[0].error.message = t('origenDestinoDistintos');
        last(points.value).error.state = true;
        last(points.value).error.message = t('origenDestinoDistintos');
        sameCity.value = true;
        globalError = true;
    }

    if (useWeeklySchedule.value) {
        if (weeklySchedule.value === 0) {
            globalError = true;
            dateError.state = true;
            dateError.message = t('faltaFechaOProgramaSemanal');
        } else {
            validWeeklySchedule = true;
        }

        if (!weeklyScheduleTime.value || !moment(weeklyScheduleTime.value, 'HH:mm').isValid()) {
            timeError.state = true;
            timeError.message = t('noHorarioValido');
            globalError = true;
        }
    } else if (
        !(dateAnswer.value && dateAnswer.value.length) ||
        !moment(dateAnswer.value).isValid()
    ) {
        globalError = true;
        dateError.state = true;
        dateError.message = t('faltaFecha');
    } else {
        validDate = true;
    }
    if (trip.total_seats < passengers.value) {
        globalError = true;
        seatsError.state = true;
        seatsError.message =
            t('yaTienes') +
            trip.passengers +
            t('pasajerosSubidos');
        dialogs.message(
            t('yaTienes') +
                trip.passengers +
                t('pasajerosSubidos'),
            {
                estado: 'error'
            }
        );
    } else if (globalError) {
        dialogs.message(t('algunosDatosNoValidos'), {
            estado: 'error'
        });
    } else if (
        !no_lucrar.value &&
        trip.is_passenger.toString() !== '1'
    ) {
        lucrarError.state = true;
        lucrarError.message = t('teComprometesANoLucrar');
        dialogs.message(t('teComprometesANoLucrar'), {
            estado: 'error'
        });
        globalError = true;
    } else if (!trip.description) {
        commentError.state = true;
        commentError.message = t('olvidasteDescripcion');
        dialogs.message(t('olvidasteDescripcion'), {
            estado: 'error'
        });
    }
    if (validDate && validTime) {
        if (
            moment(dateAnswer.value).format('YYYY-MM-DD') ===
            moment().format('YYYY-MM-DD')
        ) {
            if (
                moment(time.value, 'HH mm').format('HH mm') <
                moment().format('HH mm')
            ) {
                timeError.state = true;
                timeError.message = t('viajesPasado');
                globalError = true;
            }
        }
    }

    if (config.value.module_max_price_enabled
        && trip.is_passenger == 0) {
        if (price.value > maximum_seat_price_cents.value / 100) {
            globalError = true;
            priceError.state = true;
            priceError.message = t('precioMaximoExcedido');
        } else {
            priceError.state = false;
        }
    }

    if (showReturnTrip.value) {
        if (useWeeklySchedule.value) {
            if (weeklySchedule.value === 0) {
                globalError = true;
                otherTrip.dateError.state = true;
                otherTrip.dateError.message = t('faltaFechaOProgramaSemanal');
            } else {
                validOtherTripDate = true;
            }

            if (!weeklyScheduleReturnTime.value || !moment(weeklyScheduleReturnTime.value, 'HH:mm').isValid()) {
                otherTrip.timeError.state = true;
                otherTrip.timeError.message = t('noHorarioValido');
                globalError = true;
            } else {
                validOtherTripTime = true;
            }
        } else {
            if (
                !otherTrip.time ||
                !moment(otherTrip.time, 'HH mm').isValid()
            ) {
                otherTrip.timeError.state = true;
                otherTrip.timeError.message = t('noHorarioValido');
                globalError = true;
            } else {
                validOtherTripTime = true;
            }
        }

        if (
            otherTrip.points[0].json &&
            last(otherTrip.points).json &&
            otherTrip.points[0].name ===
                last(otherTrip.points).name
        ) {
            otherTrip.points[0].error.state = true;
            otherTrip.points[0].error.message = t('origenDestinoDistintos');
            last(otherTrip.points).error.state = true;
            last(otherTrip.points).error.message = t('origenDestinoDistintos');
            otherTrip.sameCity = true;
            globalError = true;
        }

        if (
            !(
                otherTrip.dateAnswer &&
                otherTrip.dateAnswer.length
            ) ||
            !moment(otherTrip.dateAnswer).isValid()
        ) {
            globalError = true;
            otherTrip.dateError.state = true;
            otherTrip.dateError.message = t('faltaFecha');
        } else {
            validOtherTripDate = true;
        }

        if (validOtherTripTime && validOtherTripDate && !useWeeklySchedule.value) {
            if (
                moment(otherTrip.dateAnswer).format(
                    'YYYY-MM-DD'
                ) === moment().format('YYYY-MM-DD')
            ) {
                if (
                    moment(otherTrip.time, 'HH mm').format(
                        'HH mm'
                    ) < moment().format('HH mm')
                ) {
                    otherTrip.timeError.state = true;
                    otherTrip.timeError.message = t('viajesPasado');
                    globalError = true;
                }
            }

            const tripDate = moment(dateAnswer.value);
            const otherTripDate = moment(otherTrip.dateAnswer);
            let timeVal = moment(time.value, 'HH:mm');

            tripDate.set({
                hour: timeVal.get('hour'),
                minute: timeVal.get('minute'),
                second: timeVal.get('second')
            });

            timeVal = moment(otherTrip.time, 'HH:mm');

            otherTripDate.set({
                hour: timeVal.get('hour'),
                minute: timeVal.get('minute'),
                second: timeVal.get('second')
            });

            if (
                otherTripDate.isBefore(tripDate) ||
                otherTripDate.isSame(tripDate)
            ) {
                otherTrip.timeError.state = true;
                otherTrip.timeError.message = t('fechaHoraLogicas');
                globalError = true;
            }
        }

        if (!otherTrip.trip.description) {
            otherTrip.commentError.state = true;
            otherTrip.commentError.message = t('olvidasteDescripcion');
            dialogs.message(t('olvidasteDescripcion'), {
                estado: 'error'
            });
        }
    }

    return globalError;
};

const getSaveInfo = (tripObj, estimatedTimeVal, useWeekly = useWeeklySchedule.value, weeklySchedTime = weeklyScheduleTime.value) => {
    const pts = tripObj.points.map((p) => {
        return {
            address: p.name,
            json_address: p.json,
            lat: p.location.lat,
            lng: p.location.lng,
            node_id: p.place.id
        };
    });

    const tripInfo = {
        points: pts,
        from_town: pts[0].address,
        to_town: last(pts).address,
        estimated_time: estimatedTimeVal,
        car_id: cars.value.length > 0 ? cars.value[0].id : undefined
    };

    if (!useWeekly) {
        tripInfo.trip_date = tripObj.dateAnswer + ' ' + tripObj.time + ':00';
    } else {
        tripInfo.weekly_schedule = weeklySchedule.value;
        tripInfo.weekly_schedule_time = weeklySchedTime + ':00';
    }

    const result = Object.assign({}, tripObj.trip, tripInfo);

    return result;
};

const save = () => {
    if (validate()) {
        nextTick(() => {
            jumpToError();
        });
        return;
    }
    saving.value = true;

    // Build a temporary object that looks like `this` for getSaveInfo
    const selfLike = {
        points: points.value,
        dateAnswer: dateAnswer.value,
        time: time.value,
        trip: trip
    };
    const tripData = getSaveInfo(selfLike, estimatedTimeString.value);
    // Copy back to trip reactive
    Object.assign(trip, tripData);

    if (!updatingTrip.value) {
        let tripCopy = JSON.parse(JSON.stringify(trip));
        tripCopy.allow_kids = !(tripCopy.allow_kids > 0);
        tripCopy.allow_animals = !(tripCopy.allow_animals > 0);
        tripCopy.allow_smoking = !(tripCopy.allow_smoking > 0);

        tripCopy.seat_price_cents = price.value * 100;

        if (tripCopy.is_passenger === 1) {
            tripCopy.no_lucrar = 1;
        }
        tripsStore.create(tripCopy)
            .then((createdTrip) => {
                return new Promise((resolve, reject) => {
                    if (!showReturnTrip.value) {
                        return resolve();
                    } else {
                        let otherTripData = getSaveInfo(
                            otherTrip,
                            otherTripEstimatedTimeString.value,
                            useWeeklySchedule.value,
                            weeklyScheduleReturnTime.value
                        );
                        otherTripData.parent_trip_id = createdTrip.id;
                        otherTripData = JSON.parse(
                            JSON.stringify(otherTripData)
                        );
                        otherTripData.allow_kids = !otherTripData.allow_kids;
                        otherTripData.allow_animals =
                            !otherTripData.allow_animals;
                        otherTripData.allow_smoking =
                            !otherTripData.allow_smoking;
                        otherTripData.seat_price_cents = returnPrice.value * 100;
                        tripsStore.create(otherTripData).then((ot) => {
                            return resolve(ot);
                        });
                    }
                }).then((ot) => {
                    saving.value = false;
                    router.replace({
                        name: 'detail_trip',
                        params: {
                            id: createdTrip.id
                        }
                    });
                });
            })
            .catch((err) => {
                console.log('error_creating', err);
                if (
                    err &&
                    err.data &&
                    err.data.errors &&
                    err.data.errors.driver_is_verified
                ) {
                    dialogs.message(t('tienesQueSerConductor'), {
                        estado: 'error'
                    });
                } else {
                    dialogs.message(
                        t('problemaAlCargarElViaje'),
                        {
                            estado: 'error'
                        }
                    );
                }
                jumpToError();
                saving.value = false;
            });
    } else {
        trip.id = updatingTrip.value.id;
        let tripCopy = JSON.parse(JSON.stringify(trip));
        tripCopy.allow_kids = !(tripCopy.allow_kids > 0);
        tripCopy.allow_animals = !(tripCopy.allow_animals > 0);
        tripCopy.allow_smoking = !(tripCopy.allow_smoking > 0);
        tripCopy.seat_price_cents = Math.round(price.value * 100);
        tripsStore.update(tripCopy)
            .then(() => {
                saving.value = false;
                router.replace({
                    name: 'detail_trip',
                    params: { id: trip.id }
                });
            })
            .catch(() => {
                saving.value = false;
            });
    }
};

const getPlace = (i, data, type) => {
    type = type || 'trip';

    const tripRef = type === 'trip' ? { points: points.value, sameCity: sameCity } : otherTrip;

    tripRef.points[i].place = data;
    tripRef.points[i].name = data.name;
    tripRef.points[i].json = data;
    tripRef.points[i].error.state = false;
    const loc = {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
    };
    tripRef.points[i].location = loc;
    if ((i === 0 || i === tripRef.points.length - 1) && tripRef.sameCity) {
        tripRef.points[0].error.state = false;
        last(tripRef.points).error.state = false;
    }

    if (type === 'trip') {
        addPoint();
        // Mirror the entire points array
        otherTrip.points = points.value.slice().reverse().map(point => ({
            name: point.name,
            place: point.place,
            json: point.json,
            location: point.location,
            error: new FieldError(),
            id: point.id
        }));

        calcRoute('returnTrip');
    } else {
        addReturnPoint();
    }

    calcRoute(type);
    recalculateRecommendedPrice();
};

const getPlaceholder = (index) => {
    if (points.value.length - 1 === index) {
        return t('destino');
    } else if (index === 0) {
        return t('origen');
    } else {
        return t('ingresePuntoIntermedio');
    }
};

const onBackButton = () => {
    router.replace({
        name: 'trips'
    });
};

const addPoint = (force) => {
    if (
        points.value.filter((point) => point.name === '').length === 0 ||
        force
    ) {
        let newArr = points.value.splice(0);
        let newp = {
            name: '',
            place: null,
            json: null,
            location: null,
            error: new FieldError(),
            id: new Date().getTime()
        };
        newArr.splice(points.value.length - 1, 0, newp);
        points.value = newArr;
    }
};

const addReturnPoint = (force) => {
    if (
        otherTrip.points.filter((point) => point.name === '').length === 0 ||
        force
    ) {
        let newArr = otherTrip.points.splice(0);
        let newp = {
            name: '',
            place: null,
            json: null,
            location: null,
            error: new FieldError(),
            id: new Date().getTime()
        };
        newArr.splice(otherTrip.points.length - 1, 0, newp);
        otherTrip.points = newArr;
    }
};

const resetPoints = (m, index) => {
    if (index === 0 || index === points.value.length - 1) {
        m.name = '';
        m.place = null;
        m.json = null;
        m.location = null;
    } else {
        points.value.splice(index, 1);
    }
    calcRoute('trip');
};

const calcRoute = (type) => {
    type = type || 'trip';

    const tripRef = type === 'trip' ? { points: points.value, trip: trip, duration: duration } : otherTrip;

    let pts = tripRef.points.filter((point) => point.name);

    if (pts.length < 2) {
        return;
    }

    let data = {
        points: pts.map((point) => point.location)
    };

    tripApi.getTripInfo(data).then((result) => {
        if (result.status === true) {
            tripRef.trip.distance = result.data.distance;
            if (type === 'trip') {
                duration.value = result.data.duration;
            } else {
                tripRef.duration = result.data.duration;
            }
            tripRef.trip.co2 = result.data.co2;

            if (type === 'trip') {
                maximum_trip_price_cents.value = result.data.maximum_trip_price_cents;
                recommended_trip_price_cents.value = result.data.recommended_trip_price_cents;
                recalculateRecommendedPrice();
            } else {
                maximum_return_trip_price_cents.value = result.data.maximum_trip_price_cents;
                recommended_return_trip_price_cents.value = result.data.recommended_trip_price_cents;
                recalculateRecommendedReturnPrice();
            }
        }
    });
};

const validatePrice = () => {
    if (price.value > maximum_seat_price_cents.value / 100) {
        priceError.state = true;
        priceError.message = t('precioMaximoExcedido');
    } else {
        priceError.state = false;
    }

    if (returnPrice.value > maximum_seat_price_cents.value / 100) {
        priceError.state = true;
        priceError.message = t('precioMaximoExcedido');
    } else {
        priceError.state = false;
    }
};

const recalculateRecommendedPrice = () => {
    maximum_seat_price_cents.value = Math.round(maximum_trip_price_cents.value / (trip.total_seats + 1));
    recommended_seat_price_cents.value = Math.round(recommended_trip_price_cents.value / (trip.total_seats + 1));
    validatePrice();
};

const recalculateRecommendedReturnPrice = () => {
    maximum_return_seat_price_cents.value = Math.round(maximum_return_trip_price_cents.value / (otherTrip.trip.total_seats + 1));
    recommended_return_seat_price_cents.value = Math.round(recommended_return_trip_price_cents.value / (otherTrip.trip.total_seats + 1));
    validateReturnPrice();
};

const validateReturnPrice = () => {
    if (returnPrice.value > maximum_return_seat_price_cents.value / 100) {
        returnPriceError.state = true;
        returnPriceError.message = t('precioMaximoExcedido');
    } else {
        returnPriceError.state = false;
    }
};

const resetReturnPoints = (m, index) => {
    if (index === 0 || index === otherTrip.points.length - 1) {
        m.name = '';
        m.place = null;
        m.json = null;
        m.location = null;
    } else {
        otherTrip.points.splice(index, 1);
    }
    calcRoute('returnTrip');
};

onMounted(() => {
    time.value = moment().add(1, 'hours').format('HH:00');
    otherTrip.time = moment().add(2, 'hours').format('HH:00');
    weeklyScheduleTime.value = moment().add(1, 'hours').format('HH:00');
    weeklyScheduleReturnTime.value = moment().add(2, 'hours').format('HH:00');
    bus.off('clear-click', onBackButton);
    bus.on('clear-click', onBackButton);

    if (props.id) {
        loadTrip();
    }

    userApi.selladoViaje().then((result) => {
        needs_to_pay_for_next_trip.value = config.value.module_trip_creation_payment_enabled && result.data.user_over_free_limit;
        free_trips_amount.value = result.data.free_trips_amount;
        trips_created_by_user_amount.value = result.data.trips_created_by_user_amount;
    });
});

onBeforeUnmount(() => {
    bus.off('clear-click', onBackButton);
});
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

.tooltip-seat-price::before {
    width: 30em;
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
</style>
