<template>
    <div class="container">
        <template v-if="trip">
            <div
                class="trip-detail-component trip-detail"
                :class="{
                    'trip-detail--mobile': isMobile,
                    'trip-detail--desktop': !isMobile
                }"
            >
                <div class="alert alert-info alert-sellado-viaje" v-if="this.trip.state == 'payment_failed'">
                    <p>{{ $t('pagoFallo') }}</p>
                    <p>{{ $t('viajeNoVisiblePagoFallo') }}</p>
                    <p>{{ $t('pagarSelladoViaje', { amount: $n(this.config.module_trip_creation_payment_amount_cents / 100, 'currency') }) }}</p>
                    <div id="walletBrick_container"></div>
                </div>
                <div class="alert alert-info alert-sellado-viaje" v-if="this.trip.state == 'pending_payment'">
                    <p>{{ $t('pagoRapiPago') }}</p>
                    <p>{{ $t('viajeNoVisibleRapiPago') }}</p>
                </div>
                <div class="alert alert-info alert-sellado-viaje" v-if="this.trip.state == 'awaiting_payment'">
                    <p>{{ $t('viajeNoVisible') }}</p>
                    <p>{{ $t('pagarSelladoViaje', { amount: $n(this.config.module_trip_creation_payment_amount_cents / 100, 'currency') }) }}</p>
                    <div id="walletBrick_container"></div>
                </div>
                <div
                    class="alert alert-warning trip-seat-requests-warning"
                    role="alert"
                    v-if="showSeatRequestLimitWarning"
                >
                    <i
                        class="fa fa-exclamation-triangle trip-seat-requests-warning__icon"
                        aria-hidden="true"
                    ></i>
                    <router-link :to="{ name: 'my-trips' }">
                        {{ $t('tripSeatRequestLimitDriverWarning') }}
                    </router-link>
                </div>
                <div
                    class="alert alert-warning trip-seat-requests-warning"
                    role="alert"
                    v-if="showSeatRequestsWarning"
                >
                    <i
                        class="fa fa-exclamation-triangle trip-seat-requests-warning__icon"
                        aria-hidden="true"
                    ></i>
                    <router-link :to="{ name: 'my-trips' }">
                        {{ $t('tripSeatRequestsDriverWarning') }}
                    </router-link>
                </div>
                <modal
                    :name="'modal'"
                    v-if="showModalRequestSeat"
                    @close="onModalClose"
                >
                    <template #header><h3>
                        <span>{{ $t('carpoodatos') }}</span>
                    </h3></template>
                    <template #body><div>
                        <div class="text-left carpoodatos">
                            <p>
                                {{ $t('carpoodatosAntesSolicitud') }}
                            </p>
                            <p>
                                {{ $t('carpoodatosCompromisoViaje') }}
                            </p>
                            <p>
                                {{ $t('carpoodatosCalificarCancelar') }}
                            </p>
                            <p>
                                {{ $t('carpoodatosNoPidasAsiento') }}
                            </p>
                            <p>
                                <span>{{ $t('mesaAyudaContactoLead') }}</span>
                                <router-link :to="{ name: 'tickets' }">{{ $t('mesaAyuda') }}</router-link>{{ $t('mesaAyudaContactoTail') }}
                            </p>
                        </div>
                        <div
                            class="check"
                            style="margin-bottom: 10px"
                        >
                            <label class="check-inline">
                                <input
                                    type="checkbox"
                                    name="acceptPassengerValor"
                                    value="0"
                                    v-model="acceptPassengerValue"
                                />
                                <span
                                    >{{ $t('noVolverAMostrarMensaje') }}</span
                                >
                            </label>
                        </div>
                        <div class="trip-detail__modal-actions">
                            <template
                                v-if="
                                    config.module_coordinate_by_message
                                "
                            >
                                <AppButton
                                    variant="primary"
                                    @click="toMakeRequest"
                                    v-if="!owner"
                                >
                                    {{ $t('enviarMensaje') }}
                                </AppButton>
                            </template>
                            <template v-else>
                                <AppButton
                                    variant="primary"
                                    @click="toMessages"
                                    v-if="!owner"
                                >
                                    {{ $t('enviarMensaje') }}
                                </AppButton>
                                <AppButton
                                    variant="primary"
                                    @click="toMakeRequest"
                                >
                                    {{ $t('solicitarAsiento') }}
                                </AppButton>
                            </template>
                        </div>
                    </div></template>
                </modal>
                <modal
                    :name="'modal'"
                    v-if="showModalPricing"
                    @close="onModalClose"
                >
                    <template #header><h3>
                        <span>{{ $t('carpoodatos') }}</span>
                    </h3></template>
                    <template #body><div>
                        <div class="text-left carpoodatos">
                            <p>
                                {{ $t('carpoodatosAntesConfirmar') }}
                            </p>
                            <ul>
                                <li>{{ $t('carpoodatosAntesConfirmarBullet1') }}</li>
                                <li>{{ $t('carpoodatosAntesConfirmarBullet2') }}</li>
                                <li>{{ $t('carpoodatosAntesConfirmarBullet3') }}</li>
                                <li>{{ $t('carpoodatosAntesConfirmarBullet4') }}</li>
                                <li>{{ $t('carpoodatosAntesConfirmarBullet5') }}</li>
                            </ul>
                            <p>
                                {{ $t('carpoodatosContribucionMaxima') }}
                            </p>
                            <p>
                                {{ $t('carpoodatosContribucionComprobantes') }}
                            </p>
                            <p>
                                <span>{{ $t('carpoodatosAntesConfirmarDudaLead') }}</span>
                                <router-link :to="{ name: 'tickets' }">{{ $t('carpoodatosAntesConfirmarDudaLink') }}</router-link>{{ $t('carpoodatosAntesConfirmarDudaTail') }}
                            </p>
                        </div>
                        <div
                            class="check"
                            style="margin-bottom: 10px"
                        >
                            <label class="check-inline">
                                <input
                                    type="checkbox"
                                    name="acceptPricing"
                                    value="0"
                                    v-model="acceptPricing"
                                />
                                <span
                                    >{{ $t('noVolverAMostrarMensaje') }}</span
                                >
                            </label>
                        </div>
                        <div class="trip-detail__modal-actions">
                            <AppButton
                                variant="primary"
                                @click="toMessageForce"
                                v-if="!owner"
                            >
                                {{ $t('enviarMensaje') }}
                            </AppButton>
                        </div>
                    </div></template>
                </modal>
                <div
                    v-if="trip && !isPassengersView"
                    class="trip-detail__stack"
                >
                    <div class="trip-detail__card">
                    <header
                        v-if="!isMobile"
                        class="trip-detail__page-header"
                    >
                        <h1 class="trip-detail__page-title">
                            {{ $t('tripDetailPageTitle') }}
                        </h1>
                    </header>
                    <TripDriver />
                    <section class="trip-detail__section">
                        <h3 class="trip-detail__section-title">
                            {{ $t('tripDetailSection') }}
                        </h3>
                        <div class="trip-detail__detalle-grid">
                            <div class="trip-detail__detalle-main">
                                <TripDetailRoute />
                            </div>
                            <div class="trip-detail__detalle-stats">
                                <TripStats />
                            </div>
                            <div
                                v-if="!isMobile"
                                class="trip-detail__detalle-aside"
                            >
                                <div class="trip-detail__condiciones">
                                    <h3 class="trip-detail__section-title">
                                        {{ $t('tripDetailConditions') }}
                                    </h3>
                                    <TripData />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section
                        v-if="trip.description"
                        class="trip-detail__section"
                    >
                        <h3 class="trip-detail__section-title">
                            {{ $t('tripDetailDriverMessage') }}
                        </h3>
                        <p class="trip-detail__driver-message">
                            {{ trip.description }}
                        </p>
                    </section>

                    <template v-if="isMobile">
                        <section class="trip-detail__section">
                            <h3 class="trip-detail__section-title">
                                {{ $t('tripDetailConditions') }}
                            </h3>
                            <div class="trip-detail__condiciones">
                                <TripPrice />
                                <TripData />
                            </div>
                        </section>
                        <TripPassengers
                            :section-title="$t('tripDetailJoined')"
                        />
                        <div class="trip-detail__cta">
                            <TripButtons
                                @deleteTrip="deleteTrip()"
                                @toMessages="toMessages()"
                                @toGroupChat="toGroupChat()"
                                @onMakeRequest="onMakeRequest()"
                                @cancelRequest="cancelRequest()"
                                :sending="sending"
                                :isPassengersView="isPassengersView"
                            />
                        </div>
                    </template>
                    <template v-else>
                        <section
                            class="trip-detail__section trip-detail__actions-grid"
                        >
                            <div class="trip-detail__lugares-col">
                                <div
                                    v-if="tripCardTheme === 'light' || !trip.is_passenger"
                                    class="trip-detail__lugares"
                                >
                                    <h3 class="trip-detail__section-title">
                                        {{ $t('lugaresLibres') }}
                                    </h3>
                                    <div
                                        class="trip-detail__seats-pill"
                                        :class="
                                            'trip-detail__seats-pill--' +
                                            seatsTone
                                        "
                                    >
                                        <i
                                            class="fa fa-user"
                                            aria-hidden="true"
                                        ></i>
                                        {{ seatsLabel }}
                                    </div>
                                    <div
                                        v-if="isTripExpired"
                                        class="trip-detail__finished-pill"
                                    >
                                        {{ $t('viajeFinalizado') }}
                                    </div>
                                </div>
                                <div class="trip-detail__joined">
                                    <TripPassengers
                                        :section-title="$t('tripDetailJoined')"
                                    />
                                </div>
                            </div>
                            <div class="trip-detail__contribucion">
                                <TripPrice />
                            </div>
                            <div class="trip-detail__cta">
                                <TripButtons
                                    @deleteTrip="deleteTrip()"
                                    @toMessages="toMessages()"
                                    @toGroupChat="toGroupChat()"
                                    @onMakeRequest="onMakeRequest()"
                                    @cancelRequest="cancelRequest()"
                                    :sending="sending"
                                    :isPassengersView="isPassengersView"
                                />
                            </div>
                        </section>
                    </template>

                    <div
                        ref="tripMapEl"
                        class="trip-route-map"
                        :style="
                            isMobile
                                ? {
                                      width: 'calc(100% + 20px)',
                                      height: '461px',
                                      overflow: 'hidden',
                                      marginLeft: '-10px',
                                      zIndex: 0
                                  }
                                : undefined
                        "
                    ></div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div>{{ $t('buscandoViaje') }}</div>
        </template>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useTripsStore } from '../../stores/trips';
import { useDeviceStore } from '../../stores/device';
import { useConversationsStore } from '../../stores/conversations';
import { usePassengerStore } from '../../stores/passenger';
import { useProfileStore } from '../../stores/profile';
import { useMyTripsStore } from '../../stores/myTrips';
import { useRootStore } from '../../stores/root';
import router from '../../router';
import bus from '../../services/bus-event';
import svgItem from '../SvgItem';
import modal from '../Modal';
import dayjs from '../../dayjs';
import dialogs from '../../services/dialogs.js';
import {
    shouldShowTripSeatRequestsWarning,
    shouldShowDriverSeatRequestLimitWarning,
} from '../../utils/tripSeatRequestsWarning.js';
import {
    resolveOpenConversationModalState,
    resolvePricingModalConfirm,
    resolveRequestSeatModalConfirm,
    shouldShowPricingHint
} from '../../utils/tripPassengerMessageFlow.js';
import {
    getSeatsPillLabel,
    getSeatsPillTone
} from '../../utils/tripCardDisplay.js';
import TripDriver from '../elements/TripDriver';
import TripDetailRoute from '../elements/TripDetailRoute';
import TripPrice from '../elements/TripPrice';
import TripData from '../elements/TripData';
import TripStats from '../elements/TripStats';
import TripPassengers from '../elements/TripPassengers';
import TripButtons from '../elements/TripButtons';
import AppButton from '../ui/AppButton.vue';

import { useHead } from '@unhead/vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { appLocaleToRoutingLanguage } from '../../main';
import { leafletOsrmServiceUrl } from '../../utils/osrmRouting';
import { ensureLeafletDefaultIconImages, tripWaypointIcon } from '../../utils/leafletIcons';
import 'leaflet-routing-machine';

export default {
    name: 'trip',
    beforeCreate() {
        this._tripLeafletMap = null;
        this._tripRoutingControl = null;
    },
    data() {
        return {
            sending: {
                deleteAction: false,
                requestAction: false,
                sendMessageAction: false,
                groupChatAction: false
            },
            carpoolear_logo:
                process.env.ROUTE_BASE +
                'img/' +
                process.env.TARGET_APP +
                '_logo.png',
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                }
            ],
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            showModalRequestSeat: false,
            showModalPricing: false,
            paymentBrickRendering: false,
            acceptPassengerValue: 0,
            acceptPricing: 0
        };
    },

    methods: {
        dayjs,
        ...mapActions(useRootStore, {
            getTrip: 'getTrip'
        }),
        ...mapActions(useConversationsStore, {
            lookConversation: 'createConversation',
            selectConversation: 'select',
            openTripGroupChat: 'openTripGroupChat'
        }),
        ...mapActions(usePassengerStore, {
            make: 'makeRequest',
            cancel: 'cancel'
        }),
        ...mapActions(useTripsStore, {
            remove: 'remove',
            searchAgain: 'searchAgain'
        }),
        ...mapActions(useProfileStore, {
            changeProperty: 'changeProperty'
        }),
        ...mapActions(useMyTripsStore, {
            removeTrip: 'removeTrip'
        }),
        profileComplete() {
            if (
                !this.user.image ||
                this.user.image.length === 0 ||
                !this.user.description ||
                this.user.description.length === 0
            ) {
                router.replace({ name: 'profile_update', query: { incompleteProfile: 'true' } });
            } else {
                return true;
            }
        },
        deleteTrip() {
            if (window.confirm(this.$t('seguroCancelar'))) {
                this.sending.deleteAction = true;
                this.remove(this.trip.id)
                    .then(() => {
                        dialogs.message(this.$t('viajeCancelado'), {
                            estado: 'success'
                        });
                        this.$router.replace({ name: 'trips' });
                    })
                    .catch((error) => {
                        console.error(error);
                        dialogs.message(this.$t('errorAlCancelar'), {
                            estado: 'error'
                        });
                        this.sending.deleteAction = false;
                    });
            }
        },
        loadTrip() {
            this.getTrip(this.id)
                .then((trip) => {
                    // this.trip = trip;
                    this.points = trip.points;
                    var self = this;
                    this.$nextTick(function () { self.enablePayment(); });
                    self.$nextTick(() => {
                        self.$nextTick(() => {
                            self.syncTripRouteMap();
                        });
                    });
                })
                .catch((error) => {
                    console.log('Error loading trip:', error);
                    if (error) {
                        if (error.status === 422) {
                            if (
                                error.data &&
                                error.data.errors &&
                                error.data.errors.error &&
                                error.data.errors.error.length
                            ) {
                                for (
                                    let i = 0;
                                    i < error.data.errors.error.length;
                                    i++
                                ) {
                                    let errorMessage =
                                        error.data.errors.error[i];
                                    if (errorMessage === 'trip_not_foound') {
                                        this.removeTrip(this.id);
                                        this.searchAgain();
                                    }
                                }
                            }
                        }
                        router.replace({ name: 'trips' });
                    }
                });
        },
        closeCarpoodatosModals() {
            const modalState = resolveOpenConversationModalState();
            this.showModalRequestSeat = modalState.showRequestSeatModal;
            this.showModalPricing = modalState.showPricingModal;
        },
        toMessageForce() {
            const flow = resolvePricingModalConfirm();
            if (flow.closeRequestSeatModal) {
                this.showModalRequestSeat = false;
            }
            if (flow.closePricingModal) {
                this.showModalPricing = false;
            }
            this.toMessages(true);
        },

        toMessages(force) {
            if (this.acceptPricing) {
                let data = {
                    property: 'do_not_alert_pricing',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            if (
                shouldShowPricingHint({
                    user: this.user,
                    config: this.config,
                    force
                })
            ) {
                this.showModalRequestSeat = false;
                this.showModalPricing = true;
                return;
            }

            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }

            if (this.profileComplete()) {
                this.closeCarpoodatosModals();
                this.toUserMessages(this.trip.user);
            }
        },

        toUserMessages(user) {
            this.sending.sendMessageAction = true;
            let data = {
                user: user,
                tripId: this.trip.is_passenger ? undefined : this.trip.id
            };
            this.lookConversation(data)
                .then((conversation) => {
                    router.push({
                        name: 'conversation-chat',
                        params: { id: conversation.id }
                    });
                })
                .catch((error) => {
                    console.error(error);
                    this.sending.sendMessageAction = false;
                });
        },

        toGroupChat() {
            if (!this.profileComplete()) {
                return;
            }
            this.sending.groupChatAction = true;
            this.openTripGroupChat(this.trip.id)
                .then((conversation) => {
                    router.push({
                        name: 'conversation-chat',
                        params: { id: conversation.id }
                    });
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.sending.groupChatAction = false;
                });
        },

        onMakeRequest() {
            if (this.profileComplete()) {
                if (
                    this.user.do_not_alert_request_seat ||
                    this.config.disable_user_hints
                ) {
                    this.toMakeRequest();
                } else {
                    this.showModalRequestSeat = true;
                }
            }
        },

        toMakeRequest() {
            if (this.$redirectToIdentityValidationIfRequired()) return;
            if (this.$redirectToMyTripsIfPendingRatingsRequired()) return;
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            if (this.profileComplete()) {
                if (this.config.module_coordinate_by_message) {
                    const flow = resolveRequestSeatModalConfirm({
                        moduleCoordinateByMessage: true,
                        user: this.user,
                        config: this.config
                    });
                    if (flow.closeRequestSeatModal) {
                        this.showModalRequestSeat = false;
                    }
                    if (flow.showPricingModal) {
                        this.showModalPricing = true;
                    } else if (flow.openConversation) {
                        this.toMessages(true);
                    }
                    return;
                }
                this.sending.requestAction = true;
                this.showModalRequestSeat = false;
                this.make(this.trip.id)
                    .then((response) => {
                        this.trip.request = 'send';
                    })
                    .catch((error) => {
                        if (this.$checkError(error, 'identity_validation_required')) {
                            this.$router.push({ name: 'identity_validation' });
                            dialogs.message(this.$t('debesValidarIdentidadParaAccion'), {
                                estado: 'error'
                            });
                        }
                    })
                    .finally(() => {
                        this.sending.requestAction = false;
                    });
            }
        },

        cancelRequest() {
            if (window.confirm(this.$t('seguroBajarteViaje'))) {
                this.sending.requestAction = true;
                this.cancel({ user: this.user, trip: this.trip })
                    .then(() => {
                        dialogs.message(this.$t('teHasBajadoViaje'));
                        if (this.trip.request === 'send') {
                            this.trip.request = '';
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        dialogs.message(
                            this.$t('problemaSolicitar'),
                            { estado: 'error' }
                        );
                    })
                    .finally(() => {
                        this.sending.requestAction = false;
                    });
            }
        },

        onBackClick() {
            router.back();
        },

        destroyTripRouteMap() {
            if (this._tripRoutingControl && this._tripLeafletMap) {
                try {
                    this._tripLeafletMap.removeControl(this._tripRoutingControl);
                } catch (_) {
                    /* noop */
                }
                this._tripRoutingControl = null;
            }
            if (this._tripLeafletMap) {
                try {
                    this._tripLeafletMap.remove();
                } catch (_) {
                    /* noop */
                }
                this._tripLeafletMap = null;
            }
        },

        syncTripRouteMap() {
            const el = this.$refs.tripMapEl;
            if (this.isPassengersView) {
                this.destroyTripRouteMap();
                return;
            }
            if (!el || !this.trip || !this.trip.points || !this.trip.points.length) {
                return;
            }
            this.destroyTripRouteMap();
            const c = this.center;
            const map = L.map(el).setView([c.lat, c.lng], this.zoom);
            L.tileLayer(this.url, { attribution: this.attribution }).addTo(map);
            this._tripLeafletMap = map;
            const points = this.trip.points.map((point) =>
                L.latLng(point.lat, point.lng)
            );
            const routingLang = appLocaleToRoutingLanguage[this.$i18n.locale] || 'es';
            const osrmServiceUrl = leafletOsrmServiceUrl();
            console.debug(
                '[Carpoolear][L.Routing] Trip.vue syncTripRouteMap: Routing.control via backend OSRM proxy',
                {
                    tripId: this.trip && this.trip.id,
                    waypointCount: points.length,
                    language: routingLang,
                    serviceUrl: osrmServiceUrl
                }
            );
            ensureLeafletDefaultIconImages();
            const waypointCount = points.length;
            this._tripRoutingControl = L.Routing.control({
                router: L.Routing.osrmv1({
                    serviceUrl: osrmServiceUrl,
                    language: routingLang,
                    suppressDemoServerWarning: true
                }),
                waypoints: points,
                language: routingLang,
                draggableWaypoints: false,
                addWaypoints: false,
                createMarker(i, wp) {
                    return L.marker(wp.latLng, {
                        draggable: false,
                        icon: tripWaypointIcon(i, waypointCount)
                    });
                }
            });
            this._tripRoutingControl.addTo(map);
            map.invalidateSize();
        },

        restoreData(trip) {
            this.points = [];
            trip.points.forEach((p) => {
                let point = {
                    name: p.address,
                    json: p.json_address,
                    location: {
                        lat: p.lat,
                        lng: p.lng
                    },
                    place: null
                };
                this.points.push(point);
            });
            this.date = trip.trip_date.split(' ')[0];
            this.time = trip.trip_date.split(' ')[1];
            this.trip.is_passenger = trip.is_passenger ? 1 : 0;
            this.trip.total_seats = trip.total_seats;
            this.trip.friendship_type_id = trip.friendship_type_id;
            this.trip.distance = trip.distance;
            this.trip.description = trip.description;

            this.calcRoute();
        },

        calcRoute() {
            for (let i = 0; i < this.points.length; i++) {
                if (!this.points[i].name) {
                    return;
                }
            }
        },
        onModalClose() {
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            if (this.acceptPricing) {
                let data = {
                    property: 'do_not_alert_pricing',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not prcing success');
                });
            }
            this.showModalRequestSeat = false;
            this.showModalPricing = false;
        },
        enablePayment() {
            if (typeof MercadoPago === 'undefined') return;
            if (!this.trip || !this.trip.payment_id) return;
            if (this.trip.state !== 'awaiting_payment' && this.trip.state !== 'payment_failed') return;
            if (this.paymentBrickRendering) return;
            this.paymentBrickRendering = true;

            // Get or create the container
            var container = document.getElementById('walletBrick_container');
            if (!container) {
                var banner = document.querySelector('.alert-sellado-viaje');
                if (!banner) { this.paymentBrickRendering = false; return; }
                container = document.createElement('div');
                container.id = 'walletBrick_container';
                banner.appendChild(container);
            }
            container.innerHTML = '';

            // Create a fresh MP instance and render the payment button
            var mp = new MercadoPago(process.env.MERCADO_PAGO_PUBLIC_KEY);
            var preferenceId = this.trip.payment_id;
            mp.bricks().create("wallet", "walletBrick_container", {
                initialization: { preferenceId: preferenceId }
            }).catch(function (err) {
                console.error('[MP] brick creation error, retrying...', err);
                setTimeout(function () {
                    var c = document.getElementById('walletBrick_container');
                    if (c && c.children.length > 0) return;
                    if (c) c.innerHTML = '';
                    var mp2 = new MercadoPago(process.env.MERCADO_PAGO_PUBLIC_KEY);
                    mp2.bricks().create("wallet", "walletBrick_container", {
                        initialization: { preferenceId: preferenceId }
                    }).catch(function (err2) {
                        console.error('[MP] brick creation retry failed:', err2);
                    });
                }, 2000);
            });
        }
    },

    mounted() {
        this.loadTrip();
        bus.on('back-click', this.onBackClick);

        // Load Mercado Pago SDK if not already loaded
        if (typeof MercadoPago === 'undefined') {
            var self = this;
            var script = document.createElement('script');
            script.src = 'https://sdk.mercadopago.com/js/v2';
            script.onload = function () {
                self.$nextTick(function () { self.enablePayment(); });
            };
            document.body.appendChild(script);
        }
    },

    beforeUnmount() {
        this.destroyTripRouteMap();
        bus.off('back-click', this.onBackClick);
    },

    watch: {
        id: function (value) {
            this.loadTrip();
        },
        trip: {
            deep: true,
            handler: function () {
                var self = this;
                this.$nextTick(function () { self.enablePayment(); });
                if (this.trip) {
                    useHead({
                        meta: [
                            {
                                name: 'og:description',
                                content: this.trip.description
                            },
                            {
                                name: 'og:title',
                                content:
                                    this.trip.points[0].json_address.ciudad +
                                    ' -> ' +
                                    this.trip.points[
                                        this.trip.points.length - 1
                                    ].json_address.ciudad +
                                    ' | ' +
                                    dayjs(this.trip.trip_date).format(
                                        'dddd DD/MM hh:mm'
                                    )
                            },
                            {
                                name: 'og:image',
                                content: this.carpoolear_logo
                            }
                        ]
                    });
                }
            }
        }
    },

    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig',
            tripCardTheme: 'tripCardTheme'
        }),
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        owner() {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        showSeatRequestLimitWarning() {
            return shouldShowDriverSeatRequestLimitWarning(this.owner, this.trip);
        },
        showSeatRequestsWarning() {
            return shouldShowTripSeatRequestsWarning(
                this.owner,
                this.trip?.passengerPending_count,
                this.trip?.seat_request_limit_reached
            );
        },
        isPassengersView() {
            if (this.location) {
                return this.location === 'passenger';
            }
            return false;
        },
        center() {
            return {
                lat: this.config.map_coordinates[0],
                lng: this.config.map_coordinates[1]
            };
        },
        zoom() {
            return this.config.map_zoom;
        },
        seatsTone() {
            return getSeatsPillTone(this.trip?.seats_available);
        },
        seatsLabel() {
            return getSeatsPillLabel(this.trip?.seats_available, this.$t);
        },
        isTripExpired() {
            if (!this.trip || !this.trip.trip_date) {
                return false;
            }
            return dayjs(this.trip.trip_date).format() < dayjs().format();
        }
    },

    components: {
        svgItem,
        modal,
        TripDriver,
        TripDetailRoute,
        TripData,
        TripStats,
        TripPassengers,
        TripButtons,
        TripPrice,
        AppButton
    },

    props: ['id', 'location']
};
</script>

<style scoped>
.trip-detail__modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: center;
}

.trip-seat-requests-warning {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin: 1rem 0;
}
.trip-seat-requests-warning__icon {
    flex-shrink: 0;
    margin-top: 0.15rem;
    font-size: 1.15em;
}
.trip-seat-requests-warning a {
    color: inherit;
    font-weight: 500;
    text-decoration: underline;
}
.trip-route-map :deep(.leaflet-container) {
    height: 100%;
    width: 100%;
}
.container {
    padding-top: 0;
}
@media only screen and (min-width: 768px) {
    .container {
        padding-top: 1.5em;
    }
}
#walletBrick_container {
    margin-top: 1rem;
}
</style>
