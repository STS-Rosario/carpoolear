<template>
    <div class="profile-trip-component container">
        <div class="col-xs-24">
            <h2>
                {{ t('viajes') }}
                <strong>{{ t('creados') }}</strong>
            </h2>
            <Loading :data="driverTrips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in driverTrips"
                        v-bind:key="trip.id"
                        :clickModal="user.is_admin"
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noHayViajes') }}
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
        <div v-if="user.is_admin">
            <div class="col-xs-24">
                <h2>
                    {{ t('viajes') }}
                    <strong>{{ t('pasajero') }}</strong>
                </h2>
                <Loading :data="passengerTrips">
                    <div class="trips-list">
                        <Trip
                            v-for="trip in passengerTrips"
                            v-bind:key="trip.id"
                            :trip="trip"
                            :clickModal="user.is_admin"
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
                            v-bind:key="trip.id"
                            :clickModal="user.is_admin"
                            :trip="trip"
                            :user="user"
                        ></Trip>
                    </div>
                    <template #no-data>
                        <p class="alert alert-warning" role="alert">
                            {{ t('noHayNingunViajePasado') }}
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
                <Loading :data="oldPassengerTrips">
                    <template #title><h2 v-html="t('viajesMeSubi')"></h2></template>
                    <div class="trips-list">
                        <Trip
                            v-for="trip in oldPassengerTrips"
                            v-bind:key="trip.id"
                            :clickModal="user.is_admin"
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const tripsStore = useTripsStore();

const props = defineProps({
    userId: {
        required: false
    }
});

const driverTrips = ref([]);
const passengerTrips = ref([]);
const oldDriverTrips = ref([]);
const oldPassengerTrips = ref([]);

const user = computed(() => authStore.user);

async function loadTrips() {
    driverTrips.value = await tripsStore.tripsAsDriver(props.userId);
    if (user.value.is_admin) {
        passengerTrips.value = await tripsStore.tripsAsPassenger(props.userId);
        oldDriverTrips.value = await tripsStore.oldTripsAsDriver(props.userId);
        oldPassengerTrips.value = await tripsStore.oldTripsAsPassenger(props.userId);
    }
    console.log(passengerTrips.value);
    console.log(oldPassengerTrips.value);
    console.log(driverTrips.value);
    console.log(oldDriverTrips.value);
}

onMounted(() => {
    loadTrips();
});
</script>

<style scoped>
h2 {
    font-weight: 300;
}
</style>
