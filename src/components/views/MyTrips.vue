<template>
    <div class="trips container">
        <div class="col-xs-24">
            <Loading :data="pendingPaymentRequests" :hideOnEmpty="true">
                <template #title>
                    <h2>
                        <strong>{{ t('pagoPendiente') }}</strong>
                        {{ t('pagoPendienteParaConfirmar') }}
                    </h2>
                </template>
                <div class="request-list">
                    <PendingPaymentRequest
                        v-for="r in pendingPaymentRequests"
                        v-bind:key="r.id"
                        :request="r"
                    ></PendingPaymentRequest>
                </div>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargando') }}
                    </p>
                </template>
            </Loading>
        </div>
        <div class="col-xs-24">
            <Loading :data="pendingRequest" :hideOnEmpty="true">
                <template #title>
                    <h2>
                        <strong>{{ t('pendientesDeContestar') }}</strong>
                    </h2>
                </template>
                <div class="request-list">
                    <PendingRequest
                        v-for="r in pendingRequest"
                        v-bind:key="r.id"
                        :user="r.user"
                        :trip="findTrip(r.trip_id)"
                    ></PendingRequest>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noHayPendientesDeContestar') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargando') }}
                    </p>
                </template>
            </Loading>
        </div>

        <div class="col-xs-24">
            <modal
                :name="'modal'"
                v-if="showModalPendingRates"
                @close="toPendingRates"
                :title="t('carpoodatos')"
                :body="'Body'"
                :hide-footer="true"
            >
                <template #header>
                    <h3>
                        <span>{{ t('carpoodatos') }}</span>
                        <i
                            v-on:click="toPendingRates"
                            class="fa fa-times float-right-close"
                        ></i>
                    </h3>
                </template>
                <template #body>
                    <div class="text-left carpoodatos">
                        <p>
                            <b>{{ t('carpoodatosImportanteCalificar').split('.')[0] }}</b>
                            {{ t('carpoodatosImportanteCalificar').split('.')[1] }}
                        </p>
                        <p>
                            <b>{{ t('carpoodatosTiempoCalificar').split('.')[0] }}</b>
                            {{ t('carpoodatosTiempoCalificar').split('.')[1] }}
                        </p>
                        <p>
                            <b>{{ t('carpoodatosNoBorrar').split('.')[0] }}</b>
                            {{ t('carpoodatosNoBorrar').split('.')[1] }}
                        </p>
                        <p>
                            <b>{{ t('carpoodatosDeciLoQuePensas').split('.')[0] }}</b>
                            {{ t('carpoodatosDeciLoQuePensas').split('.')[1] }}
                        </p>
                        <p>
                            {{ t('carpoodatosContacto') }}
                            <a :href="'mailto:' + config.admin_email">
                                {{ config.admin_email }}
                            </a>
                            {{ t('oNuestrasRedesSociales') }}
                        </p>
                    </div>
                    <div class="check" style="margin-bottom: 10px">
                        <label class="check-inline">
                            <input
                                type="checkbox"
                                name="pendingRatesValor"
                                value="0"
                                v-model="pendingRatesValue"
                            />
                            <span>{{ t('carpoodatosNoVolverAMostrar') }}</span>
                        </label>
                    </div>
                    <div class="text-center">
                        <button
                            class="btn btn-accept-request"
                            @click="toPendingRates"
                        >
                            {{ t('carpoodatosEntiendo') }}
                        </button>
                    </div>
                </template>
            </modal>
            <modal
                :name="'modal'"
                v-if="showModalRequestDonation"
                @close="onModalClose"
                :title="'Test'"
                :body="'Body'"
            >
                <template #header>
                    <h3>
                        <span>{{ t('donaACarpoolear') }}</span>
                        <br class="hidden-sm hidden-md hidden-lg" />
                        <small>{{ t('proyectoDe') }}</small>
                        <img
                            width="90"
                            alt="STS Rosario"
                            src="https://carpoolear.com.ar/img/logo_sts_nuevo_color.png"
                        />
                    </h3>
                </template>
                <template #body>
                    <div class="donation">
                        <div class="text-center donation-text">
                            <p>
                                {{ t('buenisimoCompartirViaje') }}
                            </p>
                            {{ t('ayudanosPlataforma') }}
                        </div>
                        <div class="radio">
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation50"
                                    value="2000"
                                    v-model="donateValue"
                                />
                                <span>$ 2000</span>
                            </label>
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation100"
                                    value="5000"
                                    v-model="donateValue"
                                />
                                <span>$ 5000</span>
                            </label>
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation200"
                                    value="10000"
                                    v-model="donateValue"
                                />
                                <span>$ 10000</span>
                            </label>
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation500"
                                    value="10000"
                                    v-model="donateValue"
                                />
                                <span>{{ t('elegiPropiaAventura') }}</span>
                            </label>
                        </div>
                        <div>
                            <button
                                class="btn btn-success btn-unica-vez"
                                @click="onDonateOnceTime"
                            >
                                {{ t('unicaVez') }}
                            </button>
                            <button
                                class="btn btn-info btn-mensualmente"
                                @click="onDonateMonthly"
                            >
                                {{ t('MENSUAL') }}
                                <br />
                                {{ t('cancelaCuando') }}
                            </button>
                        </div>
                        <div class="text-center">
                            <br />
                            <a
                                href="/donar"
                                target="_blank"
                                v-on:click.prevent="
                                    openDonationLink()
                                "
                            >
                                {{ t('conoceMasDonar') }}
                            </a>
                        </div>
                    </div>
                </template>
            </modal>
            <Loading :data="pendingRates" :hideOnEmpty="true">
                <template #title>
                    <h2>
                        {{ t('calificacionesPendientes') }}
                    </h2>
                </template>
                <div class="request-list">
                    <RatePending
                        v-for="rate in pendingRates"
                        v-bind:key="rate.id"
                        :rate="rate"
                        @rated="onUserRated"
                    />
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noHayCalificacionesPendientes') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoCalificaciones') }}
                    </p>
                </template>
            </Loading>
        </div>

        <div class="col-xs-24">
            <h2 v-html="t('misProximosViajes')">
            </h2>
            <Loading :data="trips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in trips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                        :enableChangeSeats="true"
                    ></Trip>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noTenesViajesCreados') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoViajes') }}
                    </p>
                </template>
            </Loading>
        </div>

        <div class="col-xs-24">
            <Loading :data="passengerTrips" :hideOnEmpty="true">
                <template #title>
                    <h2 v-html="t('viajesEstoySubido')"></h2>
                </template>
                <div class="trips-list">
                    <Trip
                        v-for="trip in passengerTrips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noEstasSubidoViaje') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoViajes') }}
                    </p>
                </template>
            </Loading>
        </div>
        <div
            class="col-xs-24"
            v-if="subscriptions && subscriptions.length"
            id="suscriptions"
        >
            <Loading :data="subscriptions" :hideOnEmpty="true">
                <template #title>
                    <h2>{{ t('suscripcionesViajes') }}</h2>
                </template>
                <div class="trips-list row">
                    <div
                        class="col-xs-24 col-md-12"
                        v-for="subs in subscriptions"
                        :key="subs.id"
                    >
                        <subscriptionItem
                            :subscription="subs"
                            :user="user"
                        ></subscriptionItem>
                    </div>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noTienesSuscripcion') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoSuscripciones') }}
                    </p>
                </template>
            </Loading>
        </div>

        <div class="col-xs-24" v-if="oldTrips">
            <h2>{{ t('misViajesPasados') }}</h2>
            <Loading :data="oldTrips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in oldTrips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noHasRealizadoViaje') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoViajes') }}
                    </p>
                </template>
            </Loading>
        </div>

        <div class="col-xs-24" v-if="oldPassengerTrips">
            <Loading :data="oldPassengerTrips" :hideOnEmpty="true">
                <template #title>
                    <h2 v-html="t('viajesMeSubi')"></h2>
                </template>
                <div class="trips-list">
                    <Trip
                        v-for="trip in oldPassengerTrips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noTeHasSubidoViaje') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoViajes') }}
                    </p>
                </template>
            </Loading>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useMyTripsStore } from '@/stores/myTrips';
import { useRatesStore } from '@/stores/rates';
import { usePassengerStore } from '@/stores/passenger';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import { useProfileStore } from '@/stores/profile';
import subscriptionItem from '../sections/SubscriptionItem.vue';
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import PendingRequest from '../PendingRequest';
import PendingPaymentRequest from '../PendingPaymentRequest';
import RatePending from '../RatePending';
import Tab from '../elements/Tab';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event.js';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const myTripsStore = useMyTripsStore();
const ratesStore = useRatesStore();
const passengerStore = usePassengerStore();
const subscriptionsStore = useSubscriptionsStore();
const profileStore = useProfileStore();

const showModalRequestDonation = ref(false);
const donateValue = ref(0);
const modalTripId = ref(0);
const showModalPendingRates = ref(false);
const pendingRatesValue = ref(0);
const alreadyAlerted = ref(false);

const trips = computed(() => myTripsStore.driverTrips);
const passengerTrips = computed(() => myTripsStore.passengerTrips);
const pendingRates = computed(() => ratesStore.pendingRates);
const pendingRequest = computed(() => passengerStore.pendingRequest);
const pendingPaymentRequests = computed(() => passengerStore.pendingPaymentRequests);
const user = computed(() => authStore.user);
const oldTrips = computed(() => myTripsStore.driverOldTrips);
const oldPassengerTrips = computed(() => myTripsStore.passengerOldTrips);
const subscriptions = computed(() => subscriptionsStore.subscriptions);
const config = computed(() => authStore.appConfig);

const findTrip = (id) => {
    if (trips.value) {
        return trips.value.find((item) => item.id === id);
    }
};

const updateScroll = () => {
    if (route.query.loc) {
        let domNode = document.getElementById(route.query.loc);
        window.scrollTo(0, domNode.offsetTop - 150);
    }
};

const openExternalBrowser = async (url) => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        try {
            await App.openUrl({ url });
        } catch (error) {
            console.error('Error opening URL in external browser:', error);
            window.open(url, '_blank');
        }
    } else {
        window.open(url, '_blank');
    }
};

const openDonationLink = async () => {
    let url = 'https://carpoolear.com.ar/donar';
    if (user.value && user.value.id) {
        url = `${url}?u=${user.value.id}`;
    }
    await openExternalBrowser(url);
};

const onDonateOnceTime = async () => {
    if (donateValue.value > 0) {
        var url = 'http://mpago.la/jgap';
        switch (donateValue.value) {
            case '2000':
                url = 'https://mpago.la/1WhaoLf';
                break;
            case '5000':
                url = 'https://mpago.la/1SB6on8';
                break;
            case '10000':
                url = 'https://mpago.la/2USgEBv';
                break;
            default:
                break;
        }
        if (user.value && user.value.id) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}u=${user.value.id}`;
        }
        await openExternalBrowser(url);
        showModalRequestDonation.value = false;
        let data = {
            has_donated: 1,
            has_denied: 0,
            ammount: parseFloat(donateValue.value),
            trip_id: modalTripId.value
        };
        profileStore.registerDonation(data);
    } else {
        dialogs.message(
            t('tienesQueSeleccionarDonacion'),
            {
                duration: 10,
                estado: 'error'
            }
        );
    }
};

const onDonateMonthly = async () => {
    if (donateValue.value > 0) {
        var url = 'http://mpago.la/2XdoxpF';
        switch (donateValue.value) {
            case '2000':
                url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848a2fd5c9018a33702cc50181';
                break;
            case '5000':
                url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848cee0ea5018d0e9ea71016d7';
                break;
            case '10000':
                url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497030fc7019705478b370068';
                break;
            default:
                break;
        }
        if (user.value && user.value.id) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}u=${user.value.id}`;
        }
        await openExternalBrowser(url);
        showModalRequestDonation.value = false;
        let data = {
            has_donated: 1,
            has_denied: 0,
            ammount: parseFloat(donateValue.value),
            trip_id: modalTripId.value
        };
        profileStore.registerDonation(data);
    } else {
        dialogs.message(
            t('tienesQueSeleccionarDonacion'),
            {
                duration: 10,
                estado: 'error'
            }
        );
    }
};

const toPendingRates = () => {
    if (pendingRatesValue.value) {
        let data = {
            property: 'do_not_alert_pending_rates',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }
    showModalPendingRates.value = false;
};

const onMessageModalClose = () => {
    showModalRequestDonation.value = false;
    let data = {
        has_donated: 0,
        has_denied: 1,
        ammount: 0,
        trip_id: modalTripId.value
    };
    profileStore.registerDonation(data);
};

const onModalClose = () => {
    showModalRequestDonation.value = false;
    let data = {
        has_donated: 0,
        has_denied: 1,
        ammount: 0,
        trip_id: modalTripId.value
    };
    profileStore.registerDonation(data);
};

const hasToShowModal = (tripId) => {
    if (shouldHideDonationOnIOSCapacitor(user.value)) {
        return;
    }
    let tripRateds = parseFloat(config.value.donation.trips_rated);
    if (user.value && !user.value.monthly_donate) {
        if (!user.value.donations) {
            showModalRequestDonation.value = true;
            modalTripId.value = tripId;
        } else {
            let donation = user.value.donations.find(
                (d) => d.trip_id === tripId
            );
            if (!donation) {
                let donations = user.value.donations.filter(
                    (d) => d.trip_id !== null
                );
                if (donations && donations.length < tripRateds) {
                    showModalRequestDonation.value = true;
                    modalTripId.value = tripId;
                } else {
                    console.log(
                        'hasToShowModal: ya interactue con al menos dos viajes'
                    );
                }
            } else {
                console.log(
                    'hasToShowModal: ya interactue con este viaje'
                );
            }
        }
    }
};

const onUserRated = (data) => {
    console.log('onUserRated', data);
    if (data.rating) {
        if (
            config.value &&
            config.value.donation &&
            config.value.donation.month_days > 0 &&
            !data.trip.needs_sellado
        ) {
            hasToShowModal(data.trip_id);
        }
    }
};

const onRequestStatusChanged = () => {
    passengerStore.getPendingRequest().then(() => {
        myTripsStore.oldTripsAsDriver();
        myTripsStore.oldTripsAsPassenger();
    });
};

watch(trips, () => { updateScroll(); });
watch(passengerTrips, () => { updateScroll(); });
watch(pendingRates, (newValue, oldValue) => {
    updateScroll();
    if (
        !user.value.do_not_alert_pending_rates &&
        !config.value.disable_user_hints
    ) {
        console.log('pendingRates', newValue, oldValue);
        if (newValue && newValue.length > 0 && !alreadyAlerted.value) {
            alreadyAlerted.value = true;
            showModalPendingRates.value = true;
        }
    }
});
watch(pendingRequest, () => { updateScroll(); });
watch(user, () => { updateScroll(); });
watch(oldTrips, () => { updateScroll(); });
watch(oldPassengerTrips, () => { updateScroll(); });

onMounted(() => {
    myTripsStore.tripAsDriver();
    myTripsStore.tripAsPassenger();
    ratesStore.fetchPendingRates();
    passengerStore.getPendingRequest().then(() => {
        myTripsStore.oldTripsAsDriver();
        myTripsStore.oldTripsAsPassenger();
    });
    passengerStore.getPendingPaymentRequests();
    subscriptionsStore.index();

    bus.on('request-status-changed', onRequestStatusChanged);
});

onBeforeUnmount(() => {
    bus.off('request-status-changed', onRequestStatusChanged);
});
</script>

<style scoped>
h2 {
    font-weight: 300;
}
.donation-text {
    margin-bottom: 1.5rem;
}
.donation-text p {
    margin-top: -1rem;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}
</style>
