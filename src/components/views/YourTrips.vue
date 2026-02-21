<template>
    <div class="trips container">
        <div class="col-xs-24">
        <h2>
            {{ t('mis') }}
            <strong>{{ t('proximos') }}</strong>
            {{ t('viajes') }}
        </h2>
        <Loading :data="trips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in trips"
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
        <div class="col-xs-24" v-if="oldDriverTrips">
            <h2>{{ t('misViajesPasados') }}</h2>
            <Loading :data="oldDriverTrips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in oldDriverTrips"
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useMyTripsStore } from '@/stores/myTrips';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import { useProfileStore } from '@/stores/profile';
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import dialogs from '../../services/dialogs.js';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const tripsStore = useTripsStore();
const myTripsStore = useMyTripsStore();
const subscriptionsStore = useSubscriptionsStore();
const profileStore = useProfileStore();

const props = defineProps({
    id: {
        required: false,
        default: 'me'
    }
});

const showModalRequestDonation = ref(false);
const donateValue = ref(0);
const modalTripId = ref(0);
const showModalPendingRates = ref(false);
const pendingRatesValue = ref(0);
const alreadyAlerted = ref(false);
const driverTrips = ref([]);
const passengerTrips = ref([]);
const oldDriverTrips = ref([]);
const oldPassengerTrips_local = ref([]);

const user = computed(() => authStore.user);
const oldTrips = computed(() => myTripsStore.myOldTrips);
const oldPassengerTrips = computed(() => myTripsStore.passengerOldTrips);
const subscriptions = computed(() => subscriptionsStore.subscriptions);
const appConfig = computed(() => authStore.appConfig);

const trips = computed(() => driverTrips.value);

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

const onDonateOnceTime = () => {
    if (donateValue.value > 0) {
        var url = 'http://mpago.la/jgap';
        switch (donateValue.value) {
            case '100':
                url = 'http://mpago.la/CaSZ';
                break;
            case '200':
                url = 'http://mpago.la/xntw';
                break;
            case '500':
                url = 'http://mpago.la/QEiN';
                break;
            default:
                break;
        }
        window.open(url, '_blank');
        showModalRequestDonation.value = false;
        let data = {
            has_donated: 1,
            has_denied: 0,
            ammount: parseFloat(donateValue.value),
            trip_id: modalTripId.value
        };
        profileStore.registerDonation(data);
    } else {
        dialogs.message(t('valorDonacion'), {
            duration: 10,
            estado: 'error'
        });
    }
};

const onDonateMonthly = () => {
    if (donateValue.value > 0) {
        var url = 'http://mpago.la/1w3aci';
        switch (donateValue.value) {
            case '100':
                url = 'http://mpago.la/BfZ';
                break;
            case '200':
                url = 'http://mpago.la/P02H';
                break;
            case '500':
                url = 'http://mpago.la/k8Xp';
                break;
            default:
                break;
        }
        window.open(url, '_blank');
        showModalRequestDonation.value = false;
        let data = {
            has_donated: 1,
            has_denied: 0,
            ammount: parseFloat(donateValue.value),
            trip_id: modalTripId.value
        };
        profileStore.registerDonation(data);
    } else {
        dialogs.message(t('valorDonacion'), {
            duration: 10,
            estado: 'error'
        });
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
    let tripRateds = parseFloat(appConfig.value.donation.trips_rated);
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
                }
            }
        }
    }
};

const onUserRated = (data) => {
    console.log('onUserRated', data);
    if (data.rating) {
        hasToShowModal(data.trip_id);
    }
};

watch(trips, () => { updateScroll(); });
watch(passengerTrips, () => { updateScroll(); });
watch(oldTrips, () => { updateScroll(); });
watch(oldPassengerTrips, () => { updateScroll(); });
watch(user, () => { updateScroll(); });

onMounted(() => {
    driverTrips.value = tripsStore.tripAsDriver();
    passengerTrips.value = tripsStore.tripAsPassenger();
    tripsStore.oldTripsAsDriver();
    tripsStore.oldTripsAsPassenger();
    subscriptionsStore.index();
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
