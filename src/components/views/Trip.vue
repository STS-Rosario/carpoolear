<template>
    <div class="container">
        <template v-if="trip">
            <div class="trip-detail-component">
                <div class="alert alert-info alert-sellado-viaje" v-if="trip.state == 'payment_failed'">
                    <p>{{ t('pagoFallo') }}</p>
                    <p>{{ t('viajeNoVisiblePagoFallo') }}</p>
                    <p>{{ t('pagarSelladoViaje', { amount: $n(config.module_trip_creation_payment_amount_cents / 100, 'currency') }) }}</p>
                    <div id="walletBrick_container"></div>
                </div>
                <div class="alert alert-info alert-sellado-viaje" v-if="trip.state == 'pending_payment'">
                    <p>{{ t('pagoRapiPago') }}</p>
                    <p>{{ t('viajeNoVisibleRapiPago') }}</p>
                </div>
                <div class="alert alert-info alert-sellado-viaje" v-if="trip.state == 'awaiting_payment'">
                    <p>{{ t('viajeNoVisible') }}</p>
                    <p>{{ t('pagarSelladoViaje', { amount: $n(config.module_trip_creation_payment_amount_cents / 100, 'currency') }) }}</p>
                    <div id="walletBrick_container"></div>
                </div>
                <div class="row form">
                    <div
                        ref="rightPanel"
                        class="white-background"
                        :class="themeClasses"
                    >
                        <div class="row">
                            <div
                                :class="columnClass[0]"
                                class="column"
                                v-if="
                                    columnComponent[0] &&
                                    columnComponent[0].length
                                "
                            >
                                <template
                                    v-for="childComponent in columnComponent[0]"
                                    :key="childComponent._scopeId"
                                >
                                    <component
                                        :is="childComponent"
                                    ></component>
                                </template>
                            </div>
                            <div
                                :class="columnClass[1]"
                                class="column"
                                v-if="
                                    columnComponent[1] &&
                                    columnComponent[1].length
                                "
                            >
                                <template
                                    v-for="childComponent in columnComponent[1]"
                                    :key="childComponent._scopeId"
                                >
                                    <component
                                        :is="childComponent"
                                    ></component>
                                </template>
                            </div>
                            <div
                                :class="columnClass[2]"
                                class="column"
                                v-if="
                                    columnComponent[2] &&
                                    columnComponent[2].length
                                "
                            >
                                <template
                                    v-for="childComponent in columnComponent[2]"
                                    :key="childComponent._scopeId"
                                >
                                    <component
                                        :is="childComponent"
                                    ></component>
                                </template>
                            </div>
                            <modal
                                :name="'modal'"
                                v-if="showModalRequestSeat"
                                @close="onModalClose"
                                :title="t('carpoodatos')"
                                :body="'Body'"
                            >
                                <template #header>
                                    <h3>
                                        <span>{{ t('carpoodatos') }}</span>
                                        <i
                                            v-on:click="onModalClose"
                                            class="fa fa-times float-right-close"
                                        ></i>
                                    </h3>
                                </template>
                                <template #body>
                                    <div class="text-left carpoodatos">
                                        <p>
                                            {{ t('carpoodatosAntesSolicitud') }}
                                        </p>
                                        <p>
                                            {{ t('carpoodatosCompromisoViaje') }}
                                        </p>
                                        <p>
                                            {{ t('carpoodatosCalificarCancelar') }}
                                        </p>
                                        <p>
                                            {{ t('carpoodatosNoPidasAsiento') }}
                                        </p>
                                        <p>
                                            {{ t('carpoodatosContactoEmail', { email: config.admin_email }) }}
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
                                            <span>{{ t('noVolverAMostrarMensaje') }}</span>
                                        </label>
                                    </div>
                                    <div class="text-center">
                                        <template
                                            v-if="
                                                config.module_coordinate_by_message
                                            "
                                        >
                                            <button
                                                class="btn btn-primary"
                                                @click="toMakeRequest"
                                                v-if="!owner"
                                            >
                                                {{ t('enviarMensaje') }}
                                            </button>
                                        </template>
                                        <template v-else>
                                            <button
                                                class="btn btn-primary"
                                                @click="toMessages"
                                                v-if="!owner"
                                            >
                                                {{ t('enviarMensaje') }}
                                            </button>
                                            <button
                                                class="btn btn-primary"
                                                @click="toMakeRequest"
                                            >
                                                {{ t('solicitarAsiento') }}
                                            </button>
                                        </template>
                                    </div>
                                </template>
                            </modal>
                            <modal
                                :name="'modal'"
                                v-if="showModalPricing"
                                @close="onModalClose"
                                :title="t('carpoodatos')"
                                :body="'Body'"
                            >
                                <template #header>
                                    <h3>
                                        <span>{{ t('carpoodatos') }}</span>
                                        <i
                                            v-on:click="onModalClose"
                                            class="fa fa-times float-right-close"
                                        ></i>
                                    </h3>
                                </template>
                                <template #body>
                                    <div class="text-left carpoodatos">
                                        <p>
                                            {{ t('carpoodatosAntesConfirmar') }}
                                        </p>
                                        <p>
                                            {{ t('carpoodatosContribucionMaxima') }}
                                        </p>
                                        <p>
                                            {{ t('carpoodatosContactoRedes', { email: config.admin_email }) }}
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
                                            <span>{{ t('noVolverAMostrarMensaje') }}</span>
                                        </label>
                                    </div>
                                    <div class="text-center">
                                        <button
                                            class="btn btn-primary"
                                            @click="toMessageForce"
                                            v-if="!owner"
                                        >
                                            {{ t('enviarMensaje') }}
                                        </button>
                                    </div>
                                </template>
                            </modal>
                        </div>
                        <TripButtons
                            @deleteTrip="deleteTripAction()"
                            @toMessages="toMessages()"
                            @onMakeRequest="onMakeRequest()"
                            @cancelRequest="cancelRequest()"
                            :sending="sending"
                            :isPassengersView="isPassengersView"
                        />
                        <TripStats
                            v-if="!isMobile && tripCardTheme === 'light'"
                        />
                    </div>
                    <div
                        :style="calculatedHeight"
                        class="col-xs-24 col-sm-9 col-sm-pull-15 col-md-8 col-md-pull-16 col-lg-7 col-lg-pull-17 driver-container"
                        v-if="!isPassengersView && tripCardTheme !== 'light'"
                    >
                        <TripDriver />
                    </div>

                    <div
                        class="col-xs-24 structure-div"
                        v-if="!isPassengersView"
                    >
                        <div
                            class="col-xs-24 col-sm-12 col-md-9 matcheo-passengers"
                            v-if="matchingUsers && matchingUsers.length > 0"
                        >
                            <div>
                                <div v-if="owner">
                                    <h3 class="title-margined">
                                        {{ t('matcheosDelViaje') }}
                                    </h3>
                                    <div class="row matching-user-list">
                                        <div
                                            v-for="p in matchingUsers"
                                            class="list-item col-sm-24"
                                            v-bind:key="p.id"
                                        >
                                            <div class="passenger-match">
                                                <input
                                                    type="checkbox"
                                                    v-model="
                                                        selectedMatchingUser
                                                    "
                                                    v-bind:id="p.id"
                                                    v-bind:value="p.id"
                                                />
                                                <span
                                                    @click="toUserProfile(p)"
                                                    class="trip_driver_img circle-box passenger trip_passenger_image"
                                                    v-imgSrc:profile="p.image"
                                                ></span>
                                                <a
                                                    href="#"
                                                    @click="toUserProfile(p)"
                                                    class="trip_passenger_name"
                                                >
                                                    {{ p.name }}
                                                </a>
                                                <button
                                                    @click="toUserMessages(p)"
                                                    :aria-label="t('irAMensajes')"
                                                    class="trip_passenger-chat"
                                                >
                                                    <i
                                                        class="fa fa-comments"
                                                        aria-hidden="true"
                                                    ></i>
                                                </button>
                                            </div>
                                            <div>
                                                <small>
                                                    {{ t('viajaEl') }}
                                                    {{ formatDate(p.tripMatch.trip_date, 'DD/MM') }}
                                                    <strong>
                                                        {{ formatDate(p.tripMatch.trip_date, 'HH:mm') }}
                                                    </strong>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div
                                            class="form-inline col-xs-24 send_to_all-form"
                                        >
                                            <div class="input-group">
                                                <label
                                                    for="message_all"
                                                    class="sr-only"
                                                >
                                                    {{ t('mensajeParaUsuariosSeleccionados') }}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="message_all"
                                                    class="form-control"
                                                    :placeholder="t('enviaASeleccionados')"
                                                    v-model="messageToUsers"
                                                />
                                                <span class="input-group-btn">
                                                    <button
                                                        class="btn btn-success"
                                                        @click="onSendToAll"
                                                    >
                                                        <i
                                                            class="fa fa-arrow-right"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </button>
                                                </span>
                                            </div>
                                            <!-- /input-group -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <l-map
                            :zoom="zoom"
                            :center="center"
                            style="
                                width: calc(100% + 20px);
                                height: 461px;
                                overflow: hidden;
                                margin-left: -10px;
                                z-index: 0;
                            "
                            ref="mapRef"
                        >
                            <l-tile-layer
                                :url="tileUrl"
                                :attribution="attribution"
                            ></l-tile-layer>
                        </l-map>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div>{{ t('buscandoViaje') }}</div>
        </template>
    </div>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useMyTripsStore } from '@/stores/myTrips';
import { useDeviceStore } from '@/stores/device';
import { useConversationsStore } from '@/stores/conversations';
import { usePassengerStore } from '@/stores/passenger';
import { useProfileStore } from '@/stores/profile';
import { getTrip } from '@/stores/index';
import { formatDate } from '@/composables/useFormatters';
import bus from '../../services/bus-event';
import svgItem from '../SvgItem';
import modal from '../Modal';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';
import TripLocation from '../elements/TripLocation';
import TripDriver from '../elements/TripDriver';
import TripDate from '../elements/TripDate';
import TripSeats from '../elements/TripSeats';
import TripPrice from '../elements/TripPrice';
import TripData from '../elements/TripData';
import TripStats from '../elements/TripStats';
import TripDescription from '../elements/TripDescription';
import TripShare from '../elements/TripShare';
import TripPassengers from '../elements/TripPassengers';
import TripButtons from '../elements/TripButtons';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
// leaflet-routing-machine expects L to be a global
if (typeof window !== 'undefined') window.L = L;
import 'leaflet-routing-machine';

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const tripsStore = useTripsStore();
const myTripsStore = useMyTripsStore();
const deviceStore = useDeviceStore();
const conversationsStore = useConversationsStore();
const passengerStore = usePassengerStore();
const profileStore = useProfileStore();

const props = defineProps(['id', 'location']);

const sending = reactive({
    deleteAction: false,
    requestAction: false,
    sendMessageAction: false
});

const carpoolear_logo = (import.meta.env.VITE_ROUTE_BASE || '/') + 'static/img/carpoolear_logo.png';

const points = ref([
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
]);
const matchingUsers = ref([]);
const messageToUsers = ref('');
const selectedMatchingUser = ref([]);
const tileUrl = ref('https://{s}.tile.osm.org/{z}/{x}/{y}.png');
const attribution = ref('&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors');
const showModalRequestSeat = ref(false);
const showModalPricing = ref(false);
const acceptPassengerValue = ref(0);
const acceptPricing = ref(0);
const calculatedHeight = ref({});
const mp = ref(null);
const rightPanel = ref(null);
const mapRef = ref(null);

const user = computed(() => authStore.user);
const trip = computed(() => tripsStore.currentTrip);
const config = computed(() => authStore.appConfig);
const tripCardTheme = computed(() => authStore.tripCardTheme);
const isMobile = computed(() => deviceStore.isMobile);
const resolution = computed(() => deviceStore.resolution);

const resolutionWidth = computed(() => resolution.value.width);

const themeClasses = computed(() => {
    return tripCardTheme.value === 'light'
        ? 'col-xs-24'
        : 'col-xs-24 col-sm-push-9 col-sm-15 col-md-push-8 col-md-16 col-lg-17 col-lg-push-7';
});

const columnClass = computed(() => {
    return tripCardTheme.value === 'light'
        ? [
              'col-sm-8 col-md-8 col-lg-7',
              'col-sm-9 col-md-10 col-lg-11',
              'col-sm-7 col-md-6 col-lg-5'
          ]
        : ['col-sm-14 col-md-14', 'col-sm-10 col-md-10'];
});

const columnComponent = computed(() => {
    if (tripCardTheme.value === 'light' && isMobile.value) {
        return [
            [TripDriver, TripLocation],
            [
                TripData,
                TripStats,
                TripDescription,
                TripShare,
                TripPassengers
            ]
        ];
    } else if (tripCardTheme.value === 'light') {
        return [
            [TripDriver, TripDescription],
            [TripLocation, TripDate, TripPrice, TripSeats, TripPassengers],
            [TripData]
        ];
    } else {
        return [
            [TripLocation, TripDate, TripPrice, TripSeats],
            [TripData, TripStats, TripShare, TripPassengers]
        ];
    }
});

const owner = computed(() => {
    return trip.value && user.value && user.value.id === trip.value.user.id;
});

const isPassengersView = computed(() => {
    if (props.location) {
        return props.location === 'passenger';
    }
    return false;
});

const center = computed(() => {
    return {
        lat: config.value.map_coordinates[0],
        lng: config.value.map_coordinates[1]
    };
});

const zoom = computed(() => {
    return config.value.map_zoom;
});

const calculateHeight = () => {
    nextTick(() => {
        calculatedHeight.value = !isMobile.value
            ? {
                  'min-height': rightPanel.value
                      ? rightPanel.value.clientHeight + 'px'
                      : '440px'
              }
            : {};
    });
};

const profileComplete = () => {
    if (
        !user.value.image ||
        user.value.image.length === 0 ||
        !user.value.description ||
        user.value.description.length === 0
    ) {
        router.replace({ name: 'profile_update' });
    } else {
        return true;
    }
};

const deleteTripAction = () => {
    if (window.confirm(t('seguroCancelar'))) {
        sending.deleteAction = true;
        tripsStore.remove(trip.value.id)
            .then(() => {
                dialogs.message(t('viajeCancelado'), {
                    estado: 'success'
                });
                router.replace({ name: 'trips' });
            })
            .catch((error) => {
                console.error(error);
                dialogs.message(t('errorAlCancelar'), {
                    estado: 'error'
                });
                sending.deleteAction = false;
            });
    }
};

const loadTrip = () => {
    getTrip(tripsStore, myTripsStore, props.id)
        .then((tripData) => {
            points.value = tripData.points;
            calculateHeight();
            setTimeout(() => {
                renderMap();
            }, 500);
            if (owner.value) {
                tripsStore.searchMatchers({ trip: trip.value }).then(
                    (users) => {
                        matchingUsers.value = users;
                        if (users && users.length) {
                            selectedMatchingUser.value = users.map(
                                (u) => u.id
                            );
                        }
                    }
                );
            }
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
                                myTripsStore.deleteTrip(props.id);
                                tripsStore.searchAgain();
                            }
                        }
                    }
                }
                router.replace({ name: 'trips' });
            }
        });
};

const toMessageForce = () => {
    toMessages(true);
};

const toMessages = (force) => {
    if (acceptPricing.value) {
        let data = {
            property: 'do_not_alert_pricing',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }
    if (
        user.value.do_not_alert_pricing ||
        config.value.disable_user_hints ||
        force
    ) {
        if (acceptPassengerValue.value) {
            let data = {
                property: 'do_not_alert_request_seat',
                value: 1
            };
            profileStore.changeProperty(data).then(() => {
                console.log('do not alert success');
            });
        }

        if (profileComplete()) {
            toUserMessages(trip.value.user);
        }
    } else {
        showModalPricing.value = true;
    }
};

const toUserMessages = (userObj) => {
    sending.sendMessageAction = true;
    let data = {
        user: userObj,
        tripId: trip.value.is_passenger ? undefined : trip.value.id
    };
    conversationsStore.createConversation(data)
        .then((conversation) => {
            router.push({
                name: 'conversation-chat',
                params: { id: conversation.id }
            });
        })
        .catch((error) => {
            console.error(error);
            sending.sendMessageAction = false;
        });
};

const toUserProfile = (userObj) => {
    router.replace({
        name: 'profile',
        params: {
            id: userObj.id,
            userProfile: userObj,
            activeTab: 1
        }
    });
};

const onMakeRequest = () => {
    if (profileComplete()) {
        if (
            user.value.do_not_alert_request_seat ||
            config.value.disable_user_hints
        ) {
            toMakeRequest();
        } else {
            showModalRequestSeat.value = true;
        }
    }
};

const toMakeRequest = () => {
    if (acceptPassengerValue.value) {
        let data = {
            property: 'do_not_alert_request_seat',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }
    if (profileComplete()) {
        if (config.value.module_coordinate_by_message) {
            toMessages();
            return;
        }
        sending.requestAction = true;
        showModalRequestSeat.value = false;
        passengerStore.makeRequest(trip.value.id)
            .then((response) => {
                trip.value.request = 'send';
            })
            .finally(() => {
                sending.requestAction = false;
            });
    }
};

const cancelRequest = () => {
    if (window.confirm(t('seguroBajarteViaje'))) {
        sending.requestAction = true;
        passengerStore.cancel({ user: user.value, trip: trip.value })
            .then(() => {
                dialogs.message(t('teHasBajadoViaje'));
                if (trip.value.request === 'send') {
                    trip.value.request = '';
                }
            })
            .catch((error) => {
                console.error(error);
                dialogs.message(
                    t('problemaSolicitar'),
                    { estado: 'error' }
                );
            })
            .finally(() => {
                sending.requestAction = false;
            });
    }
};

const onBackClick = () => {
    router.back();
};

const renderMap = () => {
    if (mapRef.value) {
        let map = mapRef.value.leafletObject;
        if (map && trip.value) {
            /* eslint-disable no-undef */
            let pts = trip.value.points.map((point) =>
                L.latLng(point.lat, point.lng)
            );
            let control = L.Routing.control({
                waypoints: pts,
                language: locale.value
            });
            control.addTo(map);
        }
    }
};

const restoreData = (tripData) => {
    points.value = [];
    tripData.points.forEach((p) => {
        let point = {
            name: p.address,
            json: p.json_address,
            location: {
                lat: p.lat,
                lng: p.lng
            },
            place: null
        };
        points.value.push(point);
    });
};

const calcRoute = () => {
    for (let i = 0; i < points.value.length; i++) {
        if (!points.value[i].name) {
            return;
        }
    }
};

const onSendToAll = () => {
    let users = matchingUsers.value.filter(
        (u) => selectedMatchingUser.value.indexOf(u.id) >= 0
    );
    if (messageToUsers.value && users && users.length) {
        conversationsStore.sendToAll({
            message: messageToUsers.value,
            users: users
        }).then(() => {
            messageToUsers.value = '';
            dialogs.message(t('mensajeEnviado'));
        });
    }
};

const onModalClose = () => {
    if (acceptPassengerValue.value) {
        let data = {
            property: 'do_not_alert_request_seat',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }
    if (acceptPricing.value) {
        let data = {
            property: 'do_not_alert_pricing',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not prcing success');
        });
    }
    showModalRequestSeat.value = false;
    showModalPricing.value = false;
};

const enablePayment = () => {
    if (!trip.value.payment_id || trip.value.state !== 'awaiting_payment') {
        return;
    }

    const container = document.getElementById('walletBrick_container');
    if (container && container.children.length > 0) {
        return;
    }

    const bricksBuilder = mp.value.bricks();
    const renderWalletBrick = async (bricksBuilder) => {
        await bricksBuilder.create("wallet", "walletBrick_container", {
            initialization: {
                preferenceId: trip.value.payment_id
            }
        });
    };
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'walletBrick_container';
        document.querySelector('.alert-sellado-viaje').appendChild(newContainer);
    }

    renderWalletBrick(bricksBuilder);
};

watch(() => props.id, () => {
    loadTrip();
});

watch(resolutionWidth, () => {
    calculateHeight();
});

onMounted(() => {
    loadTrip();
    bus.on('back-click', onBackClick);
    bus.on('calculate-height', calculateHeight);
    nextTick(() => {
        calculateHeight();
    });

    // Initialize Mercado Pago SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
        mp.value = new MercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);
        if (trip.value && trip.value.payment_id && (trip.value.state === 'awaiting_payment' || trip.value.state === 'payment_failed')) {
            enablePayment();
        }
    };
    document.body.appendChild(script);
});

onBeforeUnmount(() => {
    bus.off('back-click', onBackClick);
    bus.off('calculate-height', calculateHeight);
});
</script>

<style scoped>
.trip-detail-component .structure-div {
    margin-top: 1rem;
    z-index: 0;
    position: relative;
    min-height: 418px;
    /* overflow: hidden; */
    top: 0;
}
.trip-detail-component .driver-container {
    margin-top: 0;
}
.trip-detail-component .driver-container::after {
    top: -23px;
    left: 4.4em;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: var(--secondary-background);
    border-width: 12px;
    margin-left: -12px;
    z-index: 1;
}
.container {
    padding-top: 0;
}
.trip-detail-component .column {
    padding: 0 4em;
}
.trip-detail-component .column:first-of-type {
    padding: 0 1em;
}
.trip-detail-component .white-background {
    padding-top: 1.1rem;
}
.matcheo-passengers {
    background: #fff;
    box-shadow: 0 0 4px 1px #ccc;
    border-radius: 0.4em;
    position: absolute;
    left: 1em;
    top: 1em;
    max-height: 400px;
    z-index: 100;
}
.matcheo-passengers h3 {
    font-size: 1.4em;
}
.matcheo-passengers .list-item {
    border: 0;
}
.matcheo-passengers .list-item .trip_passenger_name {
    color: var(--trip-mostly-free-color);
    font-weight: bold;
}
.matcheo-passengers .passenger-match {
    margin: 0 0.5em;
    padding: 0.5em 0;
}
.passenger-match input {
    margin-right: 1em;
}
.passenger-match button {
    color: var(--secondary-background);
}

.passenger-match .trip_driver_img.circle-box.passenger {
    border: 2px solid var(--trip-almost-fill-color);
}
.send_to_all-form {
    padding: 1em;
}
.form-inline .input-group {
    width: 100%;
}
.send_to_all-form .btn {
    min-width: 100%;
}
.matching-user-list {
    max-height: 270px;
    overflow-y: auto;
}
.matching-user-list small {
    margin-left: 50px;
}
.matching-user-list .list-item:after {
    content: ' ';
    display: block;
    width: 90%;
    margin: 0 auto;
    border-bottom: 1px solid #ccc;
    margin-top: 0.5rem;
}
@media only screen and (min-width: 400px) and (max-width: 767px) {
    .trip-detail-component .structure-div {
        top: -15px;
    }
}
@media only screen and (min-width: 768px) {
    .container {
        padding-top: 1.5em;
    }
    .trip-detail-component .white-background {
        padding-top: 0;
        min-height: 440px;
    }
    .trip-detail-component .driver-container {
        margin-top: 0;
    }
    .trip-detail-component .driver-container::after {
        top: 36px;
        right: -23px;
        left: unset;
        border-color: rgba(136, 183, 213, 0);
        border-left-color: var(--secondary-background);
        border-width: 12px;
        margin-left: -12px;
        z-index: 1;
    }
    .trip-detail-component .structure-div {
        margin-top: 0;
        margin-bottom: 2rem;
    }
    .trip-detail-component .column,
    .trip-detail-component .column:first-of-type {
        padding: 2em 1em 2em 1em;
    }
}
@media only screen and (max-width: 768px) {
    .trip-detail-component .driver-container {
        border-radius: 0;
    }
    .trip-detail-component .structure-div {
        overflow: visible;
        padding: 0;
        margin-bottom: 3.5em;
    }
    .matcheo-passengers {
        position: static;
        left: 0;
        top: 0;
        max-height: auto;
        float: none;
        margin: 1.5rem 0 -1rem 0;
        border-radius: 0;
        padding-bottom: 1em;
    }
    .matcheo-passengers .title-margined {
        margin: 0;
        padding: 1em 0;
    }
}
#walletBrick_container {
    margin-top: 1rem;
}
</style>
