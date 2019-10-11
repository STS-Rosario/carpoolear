<template>
  <div class="profile-trip-component container">
        <div class="col-xs-24">
            <h2>Viajes <strong>Creados</strong></h2>
            <Loading :data="driverTrips">
                <div class="trips-list">
                    <Trip v-for="trip in driverTrips" v-bind:key="trip.id" :clickModal="user.is_admin" :trip="trip" :user="user" ></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
            </Loading>
        </div v-if="user.is_admin">
            <div>
                <div class="col-xs-24">
                <h2>Viajes <strong>Pasajero</strong></h2>
                <Loading :data="passengerTrips">
                    <div class="trips-list">
                        <Trip v-for="trip in passengerTrips" v-bind:key="trip.id" :trip="trip" :clickModal="user.is_admin"  :user="user"></Trip>
                    </div>
                    <p slot="no-data" class="alert alert-warning"  role="alert">No estas subido a ningún viaje.</p>
                    <p slot="loading" class="alert alert-info" role="alert">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        Cargando viajes ...
                    </p>
                </Loading>
            </div>
            <div class="col-xs-24" v-if="oldDriverTrips">
                <h2>Mis viajes pasados</h2>
                <Loading :data="oldDriverTrips">
                    <div class="trips-list">
                        <Trip v-for="trip in oldDriverTrips" v-bind:key="trip.id" :clickModal="user.is_admin" :trip="trip" :user="user"></Trip>
                    </div>
                    <p slot="no-data" class="alert alert-warning"  role="alert">No hay ningún viaje pasado</p>
                    <p slot="loading" class="alert alert-info" role="alert">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        Cargando viajes ...
                    </p>
                </Loading>
            </div>

            <div class="col-xs-24" v-if="oldPassengerTrips">
                <Loading :data="oldPassengerTrips">
                    <h2 slot="title" > Viajes a los que me <strong>subí</strong> </h2>
                    <div class="trips-list">
                        <Trip v-for="trip in oldPassengerTrips" v-bind:key="trip.id" :clickModal="user.is_admin" :trip="trip" :user="user"></Trip>
                    </div>
                    <p slot="no-data" class="alert alert-warning"  role="alert">No te has subido a ningún viaje.</p>
                    <p slot="loading" class="alert alert-info" role="alert">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        Cargando viajes ...
                    </p>
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
import Tabset from '../elements/Tabset';

export default {
    name: 'profile-trip',
    data () {
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
    mounted () {
        this.loadTrips();
    },

    methods: {
        ...mapActions({
            tripAsDriver: 'trips/tripsAsDriver',
            tripAsPassenger: 'trips/tripsAsPassenger',
            oldTripsAsDriver: 'trips/oldTripsAsDriver',
            oldTripsAsPassenger: 'trips/oldTripsAsPassenger'
        }),

        async loadTrips () {
            this.driverTrips = await this.tripAsDriver(this.userId);
            if (this.user.is_admin) {
                this.passengerTrips = await this.tripAsPassenger(this.userId);
                this.oldDriverTrips = await this.oldTripsAsDriver(this.userId);
                this.oldPassengerTrips = await this.oldTripsAsPassenger(this.userId);
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
        Tab,
        Tabset
    }
};
</script>

<style scoped>
    h2 {
        font-weight: 300;
    }
</style>
