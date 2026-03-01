<template>
    <div class="profile-trip-component container">
        <div class="col-xs-24">
            <h2>
                {{ $t('viajes') }}
                <strong>{{ $t('creados') }}</strong>
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
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHayViajes') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoViajes') }}
                </p></template>
            </Loading>
        </div>
        <div v-if="user.is_admin">
            <div class="col-xs-24">
                <h2>
                    {{ $t('viajes') }}
                    <strong>{{ $t('pasajero') }}</strong>
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
                    <template #no-data><p class="alert alert-warning" role="alert">
                        {{ $t('noEstasSubidoViaje') }}
                    </p></template>
                    <template #loading><p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoViajes') }}
                    </p></template>
                </Loading>
            </div>
            <div class="col-xs-24" v-if="oldDriverTrips">
                <h2>{{ $t('misViajesPasados') }}</h2>
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
                    <template #no-data><p class="alert alert-warning" role="alert">
                        {{ $t('noHayNingunViajePasado') }}
                    </p></template>
                    <template #loading><p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoViajes') }}
                    </p></template>
                </Loading>
            </div>

            <div class="col-xs-24" v-if="oldPassengerTrips">
                <Loading :data="oldPassengerTrips">
                    <template #title><h2 v-html="$t('viajesMeSubi')"></h2></template>
                    <div class="trips-list">
                        <Trip
                            v-for="trip in oldPassengerTrips"
                            v-bind:key="trip.id"
                            :clickModal="user.is_admin"
                            :trip="trip"
                            :user="user"
                        ></Trip>
                    </div>
                    <template #no-data><p class="alert alert-warning" role="alert">
                        {{ $t('noTeHasSubidoViaje') }}
                    </p></template>
                    <template #loading><p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoViajes') }}
                    </p></template>
                </Loading>
            </div>
        </div>
    </div>
</template>

<script>
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import { mapGetters, mapActions } from 'vuex';

import Tab from '../elements/Tab';

export default {
    name: 'profile-trip',
    data() {
        return {
            driverTrips: [],
            passengerTrips: [],
            oldDriverTrips: [],
            oldPassengerTrips: []
        };
    },
    props: {
        userId: {
            required: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },
    mounted() {
        this.loadTrips();
    },

    methods: {
        ...mapActions({
            tripAsDriver: 'trips/tripsAsDriver',
            tripAsPassenger: 'trips/tripsAsPassenger',
            oldTripsAsDriver: 'trips/oldTripsAsDriver',
            oldTripsAsPassenger: 'trips/oldTripsAsPassenger'
        }),

        async loadTrips() {
            this.driverTrips = await this.tripAsDriver(this.userId);
            if (this.user.is_admin) {
                this.passengerTrips = await this.tripAsPassenger(this.userId);
                this.oldDriverTrips = await this.oldTripsAsDriver(this.userId);
                this.oldPassengerTrips = await this.oldTripsAsPassenger(
                    this.userId
                );
            }
            console.log(this.passengerTrips);
            console.log(this.oldPassengerTrips);
            console.log(this.driverTrips);
            console.log(this.oldDriverTrips);
        }
    },

    components: {
        Trip,
        Loading,
        Tab
    }
};
</script>

<style scoped>
h2 {
    font-weight: 300;
}
</style>
