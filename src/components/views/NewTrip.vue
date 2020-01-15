<template>
    <div class="new-trip-component container">
        <div class="form form-trip">
            <div class="row">
                <div :class="columnClass[0]">
                    <h2 class="title--desktop" v-if="tripCardTheme === 'light' && !isMobile">Crear viaje</h2>
                    <fieldset class="trip-type-selection" v-if="tripCardTheme !== 'light'">
                        <div class="radio-option">
                            <input type="radio" id="type-driver" value="0" v-model="trip.is_passenger" :disabled="updatingTrip">
                            <label for="type-driver"  class="control-label">{{ $t('comoConductor') }}</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="type-passenger" value="1" v-model="trip.is_passenger" :disabled="updatingTrip">
                            <label for="type-passenger" class="control-label">{{ $t('comoPasajero') }}</label>
                        </div>
                    </fieldset>
                    <fieldset class="trip-type-selection--light" v-if="tripCardTheme === 'light'">
                        <div class="row">
                            <div class="col-xs-12 col-md-12 col-lg-12">
                                <button class="btn btn-option" @click="$set(trip, is_passenger, 0)" :disabled="updatingTrip" :class="trip.is_passenger === 0 ? 'active' : ''">{{ $t('buscoConductor') }}</button>
                            </div>
                            <div class="col-xs-12 col-md-12 col-lg-12">
                                <button class="btn btn-option" @click="$set(trip, is_passenger, 1)" :disabled="updatingTrip" :class="trip.is_passenger === 1 ? 'active' : ''">{{ $t('buscoPasajero') }}</button>
                            </div>
                        </div>
                    </fieldset>
                    <div class="trip_allow-foreign" v-if="!isMobile && tripCardTheme === 'light'">
                        <span>
                            <input type="checkbox" v-model="allowForeignPoints" id="cbxAllowForeignPoints" class="checkbox-button" />
                            <label for="cbxAllowForeignPoints" class="checkbox-click-target">
                                <span class="checkbox-box"></span>
                                <span>{{ $t('origenOdestino') }} {{ config.country_name }}</span>
                            </label>
                            <span class="tooltip-bottom" :data-tooltip="$t('habilitaOrigen')">
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                        </span>
                        </span>
                    </div>
                    <div class="new-left trip_points trip_points--left"  v-if="!isMobile && tripCardTheme === 'light'">
                        <div v-for="(m, index) in points" class="trip_point gmap-autocomplete" :class="{'trip-error' : m.error.state}" :key="m.id">
                            <span v-if="index == 0" class="sr-only">{{ $t('origen') }}</span>
                            <span v-if="index == points.length - 1" class="sr-only">{{ $t('destino') }}</span>
                            <autocomplete :placeholder="getPlaceholder(index)" name="'input-' + index" ref="'input-' + index" :value="m.name" v-on:place_changed="(data) =>  getPlace(index, data)" :classes="'form-control form-control-with-icon form-control-map-autocomplete'" :country="allowForeignPoints ? null : 'AR'"  :class="{'has-error': m.error.state}"></autocomplete>
                            <!-- <GmapAutocomplete  :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" :name="'input-' + index" :ref="'input-' + index" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icon form-control-map-autocomplete" :class="{'has-error': m.error.state}"> </GmapAutocomplete> -->
                            <div @click="resetPoints(m, index)" class="date-picker--cross"><i aria-hidden="true" class="fa fa-times"></i></div>
                            <span class="error" v-if="m.error.state"> {{m.error.message}} </span>
                        </div>
                    </div>
                    <div class="trip_terms" v-if="trip.is_passenger === 0">
                        <input type="checkbox" id="no-lucrar" v-model="no_lucrar" class="checkbox-button" />
                        <label for="no-lucrar" class="trip_terms_label checkbox-click-target" :class="{'has-error': lucrarError.state }">
                            <span class="checkbox-box"></span>
                            <span>
                                {{ $t('meComprometo') }}
                                <span class="tooltip-bottom" data-tooltip="Al pedir una contribución por encima de la máxima, es posible que el viaje sea considerado con fin de lucro y por lo tanto un transporte ilegal de pasajeros, pudiendo ser invalidado el seguro particular automotor y la cobertura contra terceros asociada. Tengamos un buen viaje cuidándonos entre todos :-D">
                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
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
                            <div class="col-md-24" v-show="isMobile && !tripCardTheme === 'light'">
                                <hr />
                            </div>
                            <div class="trip_allow-foreign col-md-24" v-if="isMobile || tripCardTheme !== 'light'">
                                <span>
                                    <input type="checkbox" v-model="allowForeignPoints" id="cbxAllowForeignPoints" />
                                    <label for="cbxAllowForeignPoints">
                                        {{ $t('origenOdestino') }} {{ config.country_name }}
                                    </label>
                                    <span class="tooltip-bottom" :data-tooltip="$t('habilitaOrigen')">
                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                </span>
                                </span>
                            </div>
                            <div class="new-left trip_points col-sm-13 col-md-15" v-if="isMobile || tripCardTheme !== 'light'">
                                <div v-for="(m, index) in points" class="trip_point gmap-autocomplete" :class="{'trip-error' : m.error.state}" :key="m.id">
                                    <span v-if="index == 0" class="sr-only">{{ $t('origen') }}</span>
                                    <span v-if="index == points.length - 1" class="sr-only">{{ $t('destino') }}</span>
                                    <autocomplete :placeholder="getPlaceholder(index)" name="'input-' + index" ref="'input-' + index" :value="m.name" v-on:place_changed="(data) =>  getPlace(index, data)" :classes="'form-control form-control-with-icon form-control-map-autocomplete'" :country="allowForeignPoints ? null : 'AR'"  :class="{'has-error': m.error.state}"></autocomplete>
                                    <!-- <GmapAutocomplete  :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" :name="'input-' + index" :ref="'input-' + index" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icon form-control-map-autocomplete" :class="{'has-error': m.error.state}"> </GmapAutocomplete> -->
                                    <div @click="resetPoints(m, index)" class="date-picker--cross"><i aria-hidden="true" class="fa fa-times"></i></div>
                                    <span class="error" v-if="m.error.state"> {{m.error.message}} </span>
                                </div>
                            </div>
                            <div v-if="tripCardTheme !== 'light' || isMobile" class="col-sm-11 col-md-9">
                                <div class="trip_information">
                                    <ul class="no-bullet">
                                        <li class="list_item">
                                            <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                            <div class="label-soft" v-if="tripCardTheme !== 'light'">{{ $t('distanciaARecorrer') }}</div>
                                            <div>{{distanceString}}</div>
                                        </li>
                                        <li class="list_item">
                                            <i class="fa fa-clock-o" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                            <div class="label-soft" v-if="tripCardTheme !== 'light'">{{ $t('tiempoEstimado') }}</div>
                                            <div>{{estimatedTimeString}}  </div>
                                        </li>
                                        <li class="list_item">
                                            <i class="fa fa-leaf" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                            <div class="label-soft" v-if="tripCardTheme !== 'light'">{{ $t('huellaCarbono') }} (<abbr title="Kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr>)</div>
                                            <div>{{CO2String}}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="new-left col-sm-13 col-md-15">
                            <div class="trip_datetime">
                                <div class="trip_date">
                                    <label for="date" class="sr-only">{{ $t('dia') }} </label>
                                    <DatePicker
                                        :value="date"
                                        :minDate="minDate"
                                        :class="{'has-error': dateError.state}"
                                        v-on:date_changed="changeDate">
                                      </DatePicker>
                                    <span class="error" v-if="dateError.state"> {{dateError.message}} </span>
                                </div>
                                <div class="trip_time">
                                    <label for="time" class="sr-only">{{ $t('hora') }}</label>
                                    <input type="time" v-mask="'##:##'" v-model="time" class="form-control form-control-with-icon form-control-time" id="time" :class="{'has-error': timeError.state}" placeholder="Hora (12:00)" >
                                    <span class="error" v-if="timeError.state"> {{timeError.message}} </span>
                                    <!--<input type="text" v-model="time" />-->
                                </div>
                            </div>
                            <div class="trip_price">
                                <legend class="label-for-group">{{ $t('precioAsiento') }}</legend>

                                <input type="number" v-model="price" class="form-control form-control-with-icon form-control-price" id="price" :class="{'has-error': priceError.state}" :placeholder="price" >
                                <span class="error" v-if="priceError.state"> {{priceError.message}} </span>
                            </div>
                            <div class="trip_seats-available">
                                <fieldset>
                                    <span class="label-for-group"><svg-item v-if="tripCardTheme === 'light'" :size="28" :icon="'icono-sentado'"></svg-item>{{ $t('lugaresDisponibles') }}</span>
                                    <span v-if="tripCardTheme !== 'light'">
                                        <span class="radio-inline">
                                            <input type="radio" id="seats-one" value="1" v-model="trip.total_seats">
                                            <label for="seats-one">1</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input type="radio" id="seats-two" value="2" v-model="trip.total_seats">
                                            <label for="seats-two">2</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input type="radio" id="seats-three" value="3" v-model="trip.total_seats">
                                            <label for="seats-three">3</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input type="radio" id="seats-four" value="4" v-model="trip.total_seats">
                                            <label for="seats-four">4</label>
                                        </span>
                                    </span>
                                    <span class="seats-widget" v-if="tripCardTheme === 'light'">
                                        <button type="button" @click="() => trip.total_seats < 4 ? trip.total_seats++ : trip.total_seats" class="btn btn-link" :disabled="trip.total_seats === 4"><svg-item :size="28" :icon="'add'"></svg-item></button>
                                        <span class="total_seats">{{ trip.total_seats }}</span>
                                        <button type="button" @click="() => trip.total_seats > 1 ? trip.total_seats-- : trip.total_seats" class="btn btn-link" :disabled="trip.total_seats === 1"><svg-item :size="28" :icon="'remove'"></svg-item></button>
                                    </span>
                                </fieldset>
                                <span class="error" v-if="seatsError.state"> {{seatsError.message}} </span>
                            </div>
                            <div class="trip-comment">
                                <label for="trip_comment"  class="label-for-group"> {{ $t('comentarioPasajeros') }} </label>
                                <textarea maxlength="1000" v-model="trip.description" id="trp_comment" class="form-control"></textarea>
                                <span class="error" v-if="commentError.state"> {{commentError.message}} </span>
                            </div>
                        </div>
                        <div class="col-sm-11 col-md-9 preferences-container">
                            <fieldset class="trip-privacity">
                                <legend class="label-for-group"> {{ $t('privacidadViaje') }} </legend>
                                <ul class="no-bullet">
                                    <li>
                                        <input type="radio" id="privacity-public" value="2" v-model="trip.friendship_type_id">
                                        <label for="privacity-public" class="label-soft">{{ $t('publico') }}</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="privacity-friendofriend" value="1" v-model="trip.friendship_type_id">
                                        <label for="privacity-friendofriend" class="label-soft">{{ $t('amigosamigos') }}</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="privacity-friend" value="0" v-model="trip.friendship_type_id">
                                        <label for="privacity-friend" class="label-soft">{{ $t('soloAmigos') }}</label>
                                    </li>
                                </ul>
                            </fieldset>
                            <legend class="label-for-group"> {{ $t('preferenciasViaje') }} </legend>
                            <br>
                            <div class="preferences row" v-if="tripCardTheme !== 'light' || isMobile">
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input type="checkbox" id="smoking" v-model="trip.allow_smoking"/>
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem icon="no-smoking" :size="24"></SvgItem>
                                    </div>
                                    <div class="col-xs-24">
                                        <label for="allow-smoking" class="label-soft preferences-text">{{ $t('nofumar') }}</label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input type="checkbox" id="animals" v-model="trip.allow_animals"/>
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem icon="no-animals" :size="24"></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label for="allow-animals" class="label-soft preferences-text">{{ $t('noanimales') }}</label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input type="checkbox" id="kids" v-model="trip.allow_kids"/>
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem icon="no-kids" :size="24"></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label for="allow-kids" class="label-soft preferences-text">{{ $t('noninos') }}</label>
                                    </div>
                                </div>
                            </div>
                            <ul class="no-bullet preferences row" v-if="tripCardTheme === 'light' && !isMobile">
                                <li>
                                    <input type="checkbox" id="smoking" v-model="trip.allow_smoking" class="checkbox-button" />
                                    <label for="smoking" class="label-soft preferences-text checkbox-click-target">
                                        <span class="checkbox-box"></span>
                                        <SvgItem icon="no-smoking" :size="24"></SvgItem>
                                        {{ $t('nofumar') }}
                                    </label>
                                </li>
                                <li>
                                    <input type="checkbox" id="animals" v-model="trip.allow_animals" class="checkbox-button"/>
                                    <label for="animals" class="label-soft preferences-text checkbox-click-target">
                                        <span class="checkbox-box"></span>
                                        <SvgItem icon="no-animals" :size="24"></SvgItem>
                                        {{ $t('noanimales') }}
                                    </label>
                                </li>
                                <li>
                                    <input type="checkbox" id="kids" v-model="trip.allow_kids" class="checkbox-button"/>
                                    <label for="allow-kids" class="label-soft preferences-text checkbox-click-target">
                                        <span class="checkbox-box"></span>
                                        <SvgItem icon="kids" :size="24"></SvgItem>
                                        {{ $t('noninos') }}
                                    </label>
                                </li>
                            </ul>
                            <div class="row row-showReturnTrip">
                                <hr class="col-md-20" />
                                <div class="checkbox-trip-return col-md-24">
                                    <span>
                                        <input type="checkbox" v-model="showReturnTrip" id="cbxShowReturnTrip" />
                                        <label for="cbxShowReturnTrip">
                                            {{ $t('cargarViajeRegreso') }}
                                        </label>
                                    </span>
                                </div>
                            </div>
                            <button v-if="!showReturnTrip" class="trip-create btn btn-primary btn-lg" @click="save" :disabled="saving">
                                <span v-if="!updatingTrip">{{ $t('crear') }}</span>
                                <span v-else>{{ $t('actualizar') }}</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <div v-if="tripCardTheme === 'light' && !isMobile" class="trip_information trip_information--light">
                <ul class="no-bullet">
                    <li class="list_item">
                        <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                        <div class="label-soft">{{ $t('distanciaARecorrer') }}</div>
                        <div>{{distanceString}}</div>
                    </li>
                    <li class="list_item">
                        <i class="fa fa-clock-o" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                        <div class="label-soft">{{ $t('tiempoEstimado') }}</div>
                        <div>{{estimatedTimeString}}  </div>
                    </li>
                    <li class="list_item">
                        <i class="fa fa-leaf" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                        <div class="label-soft">{{ $t('huellaCarbono') }} (<abbr title="Kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr>)</div>
                        <div>{{CO2String}}</div>
                    </li>
                </ul>
            </div>
            <div class="row show-return-trip" v-if="!updatingTrip && showReturnTrip">
                <hr  class="col-xs-24 hidden-sm hidden-md hidden-lg" />
                <div v-if="showReturnTrip" :class="columnClass[0]">
                    <div class="new-left trip_points trip_points--left"  v-if="!isMobile && tripCardTheme === 'light'">
                        <div v-for="(m, index) in otherTrip.points" class="trip_point gmap-autocomplete" :class="{'trip-error' : m.error.state}" :key="m.id">
                            <span v-if="index == 0" class="sr-only">{{ $t('origen') }}</span>
                            <span v-if="index == points.length - 1" class="sr-only">{{ $t('destino') }}</span>
                            <autocomplete
                                :placeholder="getPlaceholder(index)"
                                name="'input-return-trip' + index"
                                ref="'input-return-trip' + index"
                                :value="m.name"
                                v-on:place_changed="(data) => getPlace(index, data, 'returnTrip')"
                                :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                                :country="allowForeignPoints ? null : 'AR'" :class="{'has-error': m.error.state}"
                                >
                            </autocomplete>                            <!-- <GmapAutocomplete  :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" :name="'input-' + index" :ref="'input-' + index" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icon form-control-map-autocomplete" :class="{'has-error': m.error.state}"> </GmapAutocomplete> -->
                            <div @click="m.name = ''" class="date-picker--cross"><i aria-hidden="true" class="fa fa-times"></i></div>
                            <span class="error" v-if="m.error.state"> {{m.error.message}} </span>
                        </div>
                    </div>
                </div>
                <div v-if="showReturnTrip" :class="columnClass[1]">
                    <div class="row">
                        <div class="panel-other-trip-data">
                            <div class="new-left trip_points col-sm-13 col-md-15" v-if="isMobile || tripCardTheme !== 'light'">
                                <div v-for="(m, index) in otherTrip.points" class="trip_point gmap-autocomplete" :class="{'trip-error' : m.error.state}" :key="m.id">
                                    <span v-if="index == 0" class="sr-only">{{ $t('origen') }}</span>
                                    <span v-if="index == points.length - 1" class="sr-only">{{ $t('destino') }}</span>
                                    <autocomplete
                                        :placeholder="getPlaceholder(index)"
                                        name="'input-return-trip' + index"
                                        ref="'input-return-trip' + index"
                                        :value="m.name"
                                        v-on:place_changed="(data) => getPlace(index, data, 'returnTrip')"
                                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                                        :country="allowForeignPoints ? null : 'AR'" :class="{'has-error': m.error.state}"
                                        >
                                    </autocomplete>                                      <!-- <GmapAutocomplete  :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" :name="'input-' + index" :ref="'input-' + index" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icon form-control-map-autocomplete" :class="{'has-error': m.error.state}"> </GmapAutocomplete> -->
                                    <div @click="m.name = ''" class="date-picker--cross"><i aria-hidden="true" class="fa fa-times"></i></div>
                                    <span class="error" v-if="m.error.state"> {{m.error.message}} </span>
                                </div>
                            </div>
                            <div v-if="tripCardTheme !== 'light' || isMobile" class="col-sm-11 col-md-9">
                                <div class="trip_information">
                                    <ul class="no-bullet">
                                        <li class="list_item">
                                            <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                            <div class="label-soft" v-if="tripCardTheme !== 'light'">{{ $t('distanciaARecorrer') }}</div>
                                            <div>{{otherTripDistanceString}}</div>
                                        </li>
                                        <li class="list_item">
                                            <i class="fa fa-clock-o" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                            <div class="label-soft" v-if="tripCardTheme !== 'light'">{{ $t('tiempoEstimado') }}</div>
                                            <div>{{otherTripEstimatedTimeString}}  </div>
                                        </li>
                                        <li class="list_item">
                                            <i class="fa fa-leaf" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                            <div class="label-soft" v-if="tripCardTheme !== 'light'">{{ $t('huellaCarbono') }} (<abbr title="Kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr>)</div>
                                            <div>{{otherTripCO2String}}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="new-left col-sm-13 col-md-15">
                            <div class="trip_datetime">
                                <div class="trip_date">
                                    <label for="date" class="sr-only">{{ $t('dia') }} </label>
                                    <DatePicker
                                        :value="otherTrip.date"
                                        :minDate="otherTrip.minDate"
                                        :class="{'has-error': otherTrip.dateError.state}"
                                        v-on:date_changed="changeOtherTripDate">
                                      </DatePicker>
                                    <span class="error" v-if="otherTrip.dateError.state"> {{otherTrip.dateError.message}} </span>
                                </div>
                                <div class="trip_time">
                                    <label for="otherTrip-time" class="sr-only">{{ $t('hora') }}</label>
                                    <input type="time" v-mask="'##:##'" v-model="otherTrip.time" class="form-control form-control-with-icon form-control-time" id="otherTrip-time" :class="{'has-error': otherTrip.timeError.state}" placeholder="Hora (12:00)" >
                                    <span class="error" v-if="otherTrip.timeError.state"> {{otherTrip.timeError.message}} </span>
                                    <!--<input type="text" v-model="time" />-->
                                </div>
                            </div>
                            <div class="trip_price">
                                <legend class="label-for-group">{{ $t('precioAsiento') }}</legend>
                                <input type="number" v-model="returnPrice" class="form-control form-control-with-icon form-control-price" id="return-price" :class="{'has-error': returnPriceError.state}" :placeholder="price" >
                                <span class="error" v-if="returnPriceError.state"> {{returnPriceError.message}} </span>
                            </div>
                            <div class="trip_seats-available">
                                <fieldset>
                                    <span class="label-for-group"><svg-item v-if="tripCardTheme === 'light'" :size="28" :icon="'icono-sentado'"></svg-item>{{ $t('lugaresDisponibles') }}</span>
                                    <span v-if="tripCardTheme !== 'light'">
                                        <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-one" value="1" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-one">1</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-two" value="2" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-two">2</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-three" value="3" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-three">3</label>
                                        </span>
                                        <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-four" value="4" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-four">4</label>
                                        </span>
                                    </span>
                                    <span class="seats-widget" v-if="tripCardTheme === 'light'">
                                        <button type="button" @click="() => otherTrip.trip.total_seats < 4 ? otherTrip.trip.total_seats++ : otherTrip.trip.total_seats" class="btn btn-link" :disabled="otherTrip.trip.total_seats === 4"><svg-item :size="28" :icon="'add'"></svg-item></button>
                                        <span class="total_seats">{{ otherTrip.trip.total_seats }}</span>
                                        <button type="button" @click="() => otherTrip.trip.total_seats > 1 ? otherTrip.trip.total_seats-- : otherTrip.trip.total_seats" class="btn btn-link" :disabled="otherTrip.trip.total_seats === 1"><svg-item :size="28" :icon="'remove'"></svg-item></button>
                                    </span>
                                </fieldset>
                                <span class="error" v-if="otherTrip.seatsError.state"> {{otherTrip.seatsError.message}} </span>
                            </div>
                            <div class="trip-comment">
                                <label for="otherTrip-trip_comment"  class="label-for-group"> {{ $t('comentarioPasajeros') }} </label>
                                <textarea maxlength="1000" v-model="trip.description" id="trp_comment" class="form-control"></textarea>
                                <span class="error" v-if="commentError.state"> {{commentError.message}} </span>
                            </div>
                        </div>
                        <div class="col-sm-11 col-md-9 preferences-container">
                            <fieldset class="trip-privacity">
                                <legend class="label-for-group"> {{ $t('privacidadViaje') }} </legend>
                                <ul class="no-bullet">
                                    <li>
                                        <input type="radio" id="otherTrip-privacity-public" value="2" v-model="otherTrip.trip.friendship_type_id">
                                        <label for="otherTrip-privacity-public" class="label-soft">{{ $t('publico') }}</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="otherTrip-privacity-friendofriend" value="1" v-model="otherTrip.trip.friendship_type_id">
                                        <label for="otherTrip-privacity-friendofriend" class="label-soft">{{ $t('amigosamigos') }}</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="otherTrip-privacity-friend" value="0" v-model="otherTrip.trip.friendship_type_id">
                                        <label for="otherTrip-privacity-friend" class="label-soft">{{ $t('soloAmigos') }}</label>
                                    </li>
                                </ul>
                            </fieldset>
                            <legend class="label-for-group"> {{ $t('preferenciasViaje') }} </legend>
                            <br>
                            <div class="preferences row" v-if="tripCardTheme !== 'light' || isMobile">
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input type="checkbox" id="smoking" v-model="otherTrip.trip.allow_smoking"/>
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem icon="no-smoking" :size="24"></SvgItem>
                                    </div>
                                    <div class="col-xs-24">
                                        <label for="allow-smoking" class="label-soft preferences-text">{{ $t('nofumar') }}</label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input type="checkbox" id="animals" v-model="otherTrip.trip.allow_animals"/>
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem icon="no-animals" :size="24"></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label for="allow-animals" class="label-soft preferences-text">{{ $t('noanimales') }}</label>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="col-xs-12">
                                        <input type="checkbox" id="kids" v-model="otherTrip.trip.allow_kids"/>
                                    </div>
                                    <div class="col-xs-12">
                                        <SvgItem icon="no-kids" :size="24"></SvgItem>
                                    </div>
                                    <div class="col-xs-24 no-padding">
                                        <label for="allow-kids" class="label-soft preferences-text">{{ $t('noninos') }}</label>
                                    </div>
                                </div>
                            </div>
                            <ul class="no-bullet preferences row" v-if="tripCardTheme === 'light' && !isMobile">
                                <li>
                                    <input type="checkbox" id="smoking" v-model="otherTrip.trip.allow_smoking" />
                                    <SvgItem icon="no-smoking" :size="24"></SvgItem>
                                    <label for="allow-smoking" class="label-soft preferences-text">{{ $t('nofumar') }}</label>
                                </li>
                                <li>
                                    <input type="checkbox" id="animals" v-model="otherTrip.trip.allow_animals"/>
                                    <SvgItem icon="no-animals" :size="24"></SvgItem>
                                    <label for="allow-animals" class="label-soft preferences-text">{{ $t('noanimales') }}</label>
                                </li>
                                <li>
                                    <input type="checkbox" id="kids" v-model="otherTrip.trip.allow_kids"/>
                                    <SvgItem icon="no-kids" :size="24"></SvgItem>
                                    <label for="allow-kids" class="label-soft preferences-text">{{ $t('noninos') }}</label>
                                </li>
                            </ul>
                            <button v-if="showReturnTrip" class="trip-create btn btn-primary btn-lg" @click="save" :disabled="saving">
                                <span v-if="!updatingTrip">{{ $t('crear') }}</span>
                                <span v-else>{{ $t('actualizar') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!updatingTrip && showReturnTrip && tripCardTheme === 'light' && !isMobile" class="trip_information trip_information--light">
                <ul class="no-bullet">
                    <li class="list_item">
                        <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                        <div class="label-soft">{{ $t('distanciaARecorrer') }}</div>
                        <div>{{distanceString}}</div>
                    </li>
                    <li class="list_item">
                        <i class="fa fa-clock-o" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                        <div class="label-soft">{{ $t('tiempoEstimado') }}</div>
                        <div>{{estimatedTimeString}}  </div>
                    </li>
                    <li class="list_item">
                        <i class="fa fa-leaf" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                        <div class="label-soft">{{ $t('huellaCarbono') }} (<abbr title="Kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr>)</div>
                        <div>{{CO2String}}</div>
                    </li>
                </ul>
            </div>
            <div class="row">
                <div class="col-xs-24 map">
                </div>
            </div>
        </div>
  </div>
</template>
<script>
import {
    mapActions,
    mapGetters
} from 'vuex';
// import { parseOsmStreet } from '../../services/maps.js';
import DatePicker from '../DatePicker';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';
import {
    last
} from 'lodash';
import OsmApi from '../../services/api/Osm';
import autocomplete from '../Autocomplete';
import SvgItem from '../SvgItem';
import bus from '../../services/bus-event.js';

let osmApi = new OsmApi();

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'new-trip',
    props: {
        'id': {
            type: [String, Number],
            required: false
        }
    },
    components: {
        DatePicker,
        SvgItem,
        autocomplete
    },
    data () {
        return {
            minDate: moment().toDate(),
            lucrarError: new Error(),
            dateError: new Error(),
            timeError: new Error(),
            priceError: new Error(),
            returnPriceError: new Error(),
            commentError: new Error(),
            seatsError: new Error(),
            no_lucrar: false,
            sameCity: false,
            zoom: 4,
            center: [-29.0, -60.0],
            points: [{
                name: '',
                place: null,
                json: null,
                location: null,
                error: new Error(),
                id: 0
            }, {
                name: '',
                place: null,
                json: null,
                location: null,
                error: new Error(),
                id: 1
            }],
            date: '',
            dateAnswer: this.date,
            time: '12:00',
            price: 0,
            returnPrice: 0,
            duration: 0,
            passengers: 0,
            trip: {
                'is_passenger': 0,
                'from_town': '',
                'to_town': '',
                'trip_date': '',
                'total_seats': 2,
                'friendship_type_id': 2,
                'estimated_time': '00:00',
                'distance': 0.0,
                'co2': 0.0,
                'description': '',
                'allow_kids': true,
                'allow_smoking': true,
                'allow_animals': true,
                'car_id': null,
                'enc_path': '123',
                'points': [] /* address json_address lat lng */
            },
            updatingTrip: null,
            saving: false,
            allowForeignPoints: false,
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            showReturnTrip: false,
            otherTrip: {
                minDate: moment().toDate(),
                dateError: new Error(),
                timeError: new Error(),
                commentError: new Error(),
                seatsError: new Error(),
                no_lucrar: false,
                sameCity: false,
                zoom: 4,
                center: [-29.0, -60.0],
                points: [{
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
                    'is_passenger': 0,
                    'from_town': '',
                    'to_town': '',
                    'trip_date': '',
                    'total_seats': 2,
                    'friendship_type_id': 2,
                    'estimated_time': '00:00',
                    'distance': 0.0,
                    'co2': 0.0,
                    'description': '',
                    'car_id': null,
                    'enc_path': '123',
                    'allow_kids': true,
                    'allow_smoking': true,
                    'allow_animals': true,
                    'seat_price': 0,
                    'points': [] /* address json_address lat lng */
                }
            }
        };
    },
    mounted () {
        let self = this;
        this.time = moment().add(1, 'hours').format('HH:00');
        this.otherTrip.time = moment().add(2, 'hours').format('HH:00');
        bus.off('clear-click', this.onBackButton);
        bus.on('clear-click', this.onBackButton);

        if (self.id) {
            self.loadTrip();
        }
    },
    beforeDestroy () {},

    computed: {
        ...mapGetters({
            user: 'auth/user',
            cars: 'cars/cars',
            isMobile: 'device/isMobile',
            config: 'auth/appConfig',
            tripCardTheme: 'auth/tripCardTheme'
        }),
        columnClass () {
            return !this.isMobile && this.tripCardTheme === 'light' ? [
                'col-sm-10', 'col-sm-14'
            ] : [
                'col-sm-8', 'col-sm-16'
            ];
        },
        distanceString () {
            return Math.floor(this.trip.distance / 1000) + ' Km';
        },

        estimatedTimeString () {
            const totalMinutes = Math.floor(this.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        CO2String () {
            return Math.floor(this.trip.distance / 1000) * 1.5 + ' Kg';
        },
        otherTripDistanceString () {
            return Math.floor(this.otherTrip.trip.distance / 1000) + ' Km';
        },
        otherTripEstimatedTimeString () {
            const totalMinutes = Math.floor(this.otherTrip.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        otherTripCO2String () {
            return Math.floor(this.otherTrip.trip.distance / 1000) * 1.5 + ' Kg';
        },
        tripCardTheme () {
            return this.config ? this.config.trip_card_design : '';
        }
    },
    watch: {
        'no_lucrar': function () {
            this.lucrarError.state = false;
        },
        'dateAnswer': function (value) {
            if (!this.showReturnTrip || !this.otherTrip.dateAnswer) {
                // const v = moment(value);
                // let date = '';
                /* if (v.isValid()) {
                    date = value;
                } */
                // this.otherTrip.date = date;
                // this.otherTrip.dateAnswer = date;
            }
            // this.dateError.state = false;
        },
        'time': function () {
            this.timeError.state = false;
        },
        'otherTrip.dateAnswer': function () {
            this.otherTrip.dateError.state = false;
        },
        'otherTrip.time': function () {
            this.otherTrip.timeError.state = false;
        },
        'trip.friendship_type_id': function () {
            console.log('change');
            this.otherTrip.trip.friendship_type_id = this.trip.friendship_type_id;
        },
        'trip.distance': function () {
            let data = {
                from: this.points[0].place,
                to: last(this.points).place,
                distance: this.trip.distance
            };
            this.getPrice(data).then(price => {
                this.price = price;
                console.log(this.price);
            });
        },
        'otherTrip.distance': function () {
            let data = {
                from: this.otherTrip.points[0].place,
                to: last(this.otherTrip.points).place,
                distance: this.otherTrip.distance
            };
            this.getPrice(data).then(price => {
                this.returnPrice = price;
                console.log(this.returnPrice);
            });
        }
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create',
            'updateTrip': 'trips/update',
            'getTrip': 'getTrip',
            'getPrice': 'trips/price'
        }),
        changeOtherTripDate (date) {
            this.$set(this.otherTrip.dateError, 'state', false);
            this.otherTrip.dateAnswer = date;
        },
        changeDate (date) {
            this.$set(this.dateError, 'state', false);
            this.dateAnswer = date;
        },
        jumpToError () {
            let hasError = document.getElementsByClassName('has-error');
            if (hasError.length) {
                let element = hasError[0];
                this.$scrollToElement(element);
            }
        },
        restoreData (trip) {
            this.no_lucrar = true;
            this.points = [];
            console.log(trip);
            trip.points.forEach(p => {
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
            this.date = moment(trip.trip_date.split(' ')[0]).format('YYYY-MM-DD');
            this.time = trip.trip_date.split(' ')[1];
            this.trip.is_passenger = trip.is_passenger ? 1 : 0;
            this.passengers = trip.passenger_count;
            this.trip.total_seats = trip.total_seats;
            this.trip.friendship_type_id = trip.friendship_type_id;
            this.trip.distance = trip.distance;
            this.trip.description = trip.description;

            // this.calcRoute();
        },

        loadTrip () {
            this.getTrip(this.id).then(trip => {
                if (this.user.id === trip.user.id) {
                    this.updatingTrip = trip;
                    this.restoreData(trip);
                } else {
                    this.$router.replace({
                        name: 'trips'
                    });
                }
            }).catch(error => {
                console.log(error);
                if (error) {
                    this.$router.replace({
                        name: 'trips'
                    });
                }
            });
        },

        validate () {
            let globalError = false;
            let foreignPoints = 0;
            let validTime = false;
            let validDate = false;
            let validOtherTripTime = false;
            let validOtherTripDate = false;
            this.points = this.points.filter(point => point.place);
            for (let index = this.points.length; index < 2; index++) {
                this.addPoint(true);
            }
            this.points = this.points.map(point => {
                delete point.id;
                return point;
            });
            this.points.forEach(p => {
                if (!p.json) {
                    p.error.state = true;
                    p.error.message = this.$t('localidadValida');
                    globalError = true;
                } else {
                    console.log('COUNTRY', p.json.country);
                    foreignPoints += (p.json.country === this.config.osm_country ? 0 : 1);
                }
            });
            if (foreignPoints > 1) {
                globalError = true;
                this.points[0].error.state = true;
                this.points[0].error.message = this.$t('origenDestinoArgentina');
            }

            if (this.showReturnTrip) {
                foreignPoints = 0;
                this.otherTrip.points.forEach(p => {
                    if (!p.json) {
                        p.error.state = true;
                        p.error.message = this.$t('seleccioneLocalidadValida');
                        globalError = true;
                    } else {
                        console.log('COUNTRY', p.json.country);
                        foreignPoints += (p.json.country === this.config.osm_country ? 0 : 1);
                    }
                });
                if (foreignPoints > 1) {
                    globalError = true;
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = this.$t('origenDestinoArgentina');
                }
            }

            if (!this.time || !moment(this.time, 'HH mm').isValid()) {
                this.timeError.state = true;
                this.timeError.message = this.$t('noHorarioValido');
                globalError = true;
            } else {
                validTime = true;
            }

            if (this.points[0].json && last(this.points).json && this.points[0].name === last(this.points).name) {
                this.points[0].error.state = true;
                this.points[0].error.message = this.$t('origenDestinoDistintos');
                last(this.points).error.state = true;
                last(this.points).error.message = this.$t('origenDestinoDistintos');
                this.sameCity = true;
                globalError = true;
            }

            if (!(this.dateAnswer && this.dateAnswer.length) || !moment(this.dateAnswer).isValid()) {
                globalError = true;
                this.dateError.state = true;
                this.dateError.message = this.$t('faltaFecha');
            } else {
                validDate = true;
            }
            if (this.trip.total_seats < this.passengers) {
                globalError = true;
                this.seatsError.state = true;
                this.seatsError.message = this.$t('yaTienes') + this.trip.passengers + this.$t('pasajerosSubidos');
                dialogs.message(this.$t('yaTienes') + this.trip.passengers + this.$t('pasajerosSubidos'), {
                    estado: 'error'
                });
            } else if (globalError) {
                dialogs.message(this.$t('algunosDatosNoValidos'), {
                    estado: 'error'
                });
            } else if (!this.no_lucrar && this.trip.is_passenger !== 1) {
                this.lucrarError.state = true;
                this.lucrarError.message = this.$t('teComprometesANoLucrar');
                dialogs.message(this.$t('teComprometesANoLucrar'), {
                    estado: 'error'
                });
                globalError = true;
            }
            if (validDate && validTime) {
                console.log('valid date time');
                if (moment(this.dateAnswer).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                    console.log('es hoy', moment(this.time, 'HH mm').format('HH mm'), moment().format('HH mm'));
                    // la fecha es de hoy, la hora no debería poder ser anterior
                    if (moment(this.time, 'HH mm').format('HH mm') < moment().format('HH mm')) {
                        console.log('es antes de ahora');
                        this.timeError.state = true;
                        this.timeError.message = this.$t('viajesPasado');
                        globalError = true;
                    }
                }
            }

            if (this.showReturnTrip) {
                if (!this.otherTrip.time || !moment(this.otherTrip.time, 'HH mm').isValid()) {
                    this.otherTrip.timeError.state = true;
                    this.otherTrip.timeError.message = this.$t('noHorarioValido');
                    globalError = true;
                } else {
                    validOtherTripTime = true;
                }

                if (this.otherTrip.points[0].json && last(this.otherTrip.points).json && this.otherTrip.points[0].name === last(this.otherTrip.points).name) {
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = this.$t('origenDestinoDistintos');
                    last(this.otherTrip.points).error.state = true;
                    last(this.otherTrip.points).error.message = this.$t('origenDestinoDistintos');
                    this.otherTrip.sameCity = true;
                    globalError = true;
                }

                if (!(this.otherTrip.dateAnswer && this.otherTrip.dateAnswer.length) || !moment(this.otherTrip.dateAnswer).isValid()) {
                    globalError = true;
                    this.otherTrip.dateError.state = true;
                    this.otherTrip.dateError.message = this.$t('faltaFecha');
                } else {
                    validOtherTripDate = true;
                }
                if (globalError) {
                    dialogs.message(this.$t('algunosDatosNoValidos'), {
                        estado: 'error'
                    });
                }

                if (validOtherTripTime && validOtherTripDate) {
                    console.log('valid date time');
                    if (moment(this.otherTrip.dateAnswer).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                        console.log('es hoy', moment(this.otherTrip.time, 'HH mm').format('HH mm'), moment().format('HH mm'));
                        // la fecha es de hoy, la hora no debería poder ser anterior
                        if (moment(this.otherTrip.time, 'HH mm').format('HH mm') < moment().format('HH mm')) {
                            console.log('es antes de ahora');
                            this.otherTrip.timeError.state = true;
                            this.otherTrip.timeError.message = this.$t('viajesPasado');
                            globalError = true;
                        }
                    }

                    const tripDate = moment(this.dateAnswer);
                    const otherTripDate = moment(this.otherTrip.dateAnswer);
                    let time = moment(this.time, 'HH:mm');

                    tripDate.set({
                        hour: time.get('hour'),
                        minute: time.get('minute'),
                        second: time.get('second')
                    });

                    time = moment(this.otherTrip.time, 'HH:mm');

                    otherTripDate.set({
                        hour: time.get('hour'),
                        minute: time.get('minute'),
                        second: time.get('second')
                    });

                    if (otherTripDate.isBefore(tripDate) || otherTripDate.isSame(tripDate)) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message = this.$t('fechaHoraLogicas');
                        globalError = true;
                    }
                }
            }

            return globalError;
        },

        getSaveInfo (tripObj, estimatedTime) {
            const points = tripObj.points.map(p => {
                console.log('p point', p);
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
                trip_date: tripObj.dateAnswer + ' ' + tripObj.time + ':00',
                estimated_time: estimatedTime,
                car_id: this.cars.length > 0 ? this.cars[0].id : undefined
            };

            return Object.assign({}, tripObj.trip, tripInfo);
        },

        save () {
            if (this.validate()) {
                // Jump To Error
                this.$nextTick(() => {
                    this.jumpToError();
                });
                return;
            }
            /* eslint-disable no-unreachable */
            this.saving = true;

            this.trip = this.getSaveInfo(this, this.estimatedTimeString);
            if (!this.updatingTrip) {
                let trip = JSON.parse(JSON.stringify(this.trip));
                trip.allow_kids = !trip.allow_kids;
                trip.allow_animals = !trip.allow_animals;
                trip.allow_smoking = !trip.allow_smoking;
                trip.seat_price = this.price;
                if (trip.is_passenger === 1) {
                    trip.no_lucrar = 1;
                }
                console.log('tt', trip);
                this.createTrip(trip).then((t) => {
                    return new Promise((resolve, reject) => {
                        if (!this.showReturnTrip) {
                            return resolve();
                        } else {
                            let otherTrip = this.getSaveInfo(this.otherTrip, this.otherTripEstimatedTimeString);
                            otherTrip.parent_trip_id = t.id;
                            otherTrip = JSON.parse(JSON.stringify(otherTrip));
                            otherTrip.allow_kids = !otherTrip.allow_kids;
                            otherTrip.allow_animals = !otherTrip.allow_animals;
                            otherTrip.allow_smoking = !otherTrip.allow_smoking;
                            otherTrip.seat_price = this.returnPrice;
                            console.log(otherTrip);
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
                }).catch((err) => {
                    console.log('error_creating', err);
                    if (err && err.data && err.data.errors && err.data.errors.driver_is_verified) {
                        dialogs.message(this.$t('tienesQueSerConductor'), {
                            estado: 'error'
                        });
                    } else {
                        dialogs.message(this.$t('problemaAlCargarElViaje'), {
                            estado: 'error'
                        });
                    }
                    this.jumpToError();
                    this.saving = false;
                });
            } else {
                console.log(this.trip);
                this.trip.id = this.updatingTrip.id;
                this.updateTrip(this.trip).then(() => {
                    this.saving = false;
                    this.$router.replace({ name: 'detail_trip', params: { id: this.trip.id } });
                }).catch(() => {
                    this.saving = false;
                });
            }
        },

        getPlace (i, data, type) {
            console.log('getPlace', i, data, type);
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

            this.addPoint();

            if (type === 'trip') {
                let point = this.otherTrip.points[0];

                if (i === 0) {
                    point = last(this.otherTrip.points);
                }

                point.place = data;
                point.name = data.name;
                point.json = data;
                // point.json = parseOsmStreet(data);
                point.error.state = false;
                this.otherTrip.center = point.location = {
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                };
                this.calcRoute('returnTrip');
            }
            this.calcRoute(type);
        },

        getPlaceholder (index) {
            if (this.points.length - 1 === index) {
                return this.$t('destino');
            } else if (index === 0) {
                return this.$t('origen');
            } else {
                return this.$t('ingresePuntoIntermedio');
            }
        },

        onBackButton () {
            this.$router.replace({
                name: 'trips'
            });
        },

        addPoint (force) {
            if ((this.points.filter(point => point.name === '')).length === 0 || force) {
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
        resetPoints (m, index) {
            if (index === 0 || index === this.points.length - 1) {
                m.name = '';
            } else {
                console.log(index);
                this.points.splice(index, 1);
            }
        },

        calcRoute (type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            console.log('calc route', trip.points);

            let points = trip.points.filter(point => point.name);

            if (points.length < 2) {
                return;
            }
            let data = {
                points: points.map(point => point.location)
            };
            osmApi.route(data).then((result) => {
                console.log('osm route result', result);
                if (result.code === 'Ok' && result.routes && result.routes.length) {
                    let route = result.routes[0];
                    trip.trip.distance = route.distance;
                    trip.duration = route.duration;
                    trip.trip.co2 = route.distance * 0.15; /* distancia por 0.15 kilos co2 en promedio por KM recorrido  */
                }
            });

            if (this.$refs.map && this.$refs.map.mapObject) {
                let map = this.$refs.map.mapObject;

                /* eslint-disable no-undef */
                L.Routing.control({
                    waypoints: [
                        L.latLng(data.origin.lat, data.origin.lng),
                        L.latLng(data.destiny.lat, data.destiny.lng)
                    ]
                }).addTo(map);
            }
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
        margin-bottom: .4em;
    }
    span.error.textarea {
        margin-top: .8em;
    }
    .trip_points--left {
        margin-left: .5rem;
    }
    .title--desktop {
        margin-left: .5em;
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
</style>
