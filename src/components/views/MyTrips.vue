<template>
  <div class="trips container">
        <div class="col-xs-24">

            <Loading :data="pendingRequest" :hideOnEmpty="true">
                <h2 slot="title"> Pendientes <strong>de contestar</strong> </h2>
                <div class="request-list">
                    <PendingRequest v-for="r in pendingRequest" :user="r.user" :trip="findTrip(r.trip_id)"></PendingRequest>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay pedientes de contestar</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <Loading :data="pendingRates" :hideOnEmpty="true">
                <h2 slot="title"> Calificaciones <strong>pendientes </strong></h2>
                <div class="request-list">
                    <RatePending v-for="rate in pendingRates" :rate="rate" />
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay calificaciones pendientes</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando calificaciones ...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <h2>Viajes <strong>Creados</strong></h2>
            <Loading :data="trips">
                <div class="trips-list">
                    <Trip v-for="trip in trips" :trip="trip" :user="user" ></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No tenés viajes creados</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <Loading :data="passengerTrips" :hideOnEmpty="true">
                <h2 slot="title" > Viajes <strong>subidos</strong> </h2>
                <div class="trips-list">
                    <Trip v-for="trip in passengerTrips" :trip="trip" :user="user" ></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No estas subido a ningún viaje.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
            </Loading>
        </div>


    </div>
</template>

<script>
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import PendingRequest from '../PendingRequest';
import RatePending from '../RatePending';
import { mapGetters, mapActions } from 'vuex';

import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';

export default {
    name: 'my-trips',

    mounted () {
        this.tripAsDriver();
        this.tripAsPassenger();
        this.pendingRate();
        this.getPendingRequest();
    },

    computed: {
        ...mapGetters({
            trips: 'myTrips/myTrips',
            passengerTrips: 'myTrips/passengerTrips',
            pendingRates: 'rates/pendingRates',
            pendingRequest: 'passenger/pendingRequest',
            user: 'auth/user'
        })
    },

    methods: {
        findTrip (id) {
            return this.trips.find(item => item.id === id);
        },
        ...mapActions({
            tripAsDriver: 'myTrips/tripAsDriver',
            tripAsPassenger: 'myTrips/tripAsPassenger',
            pendingRate: 'rates/pendingRates',
            getPendingRequest: 'passenger/getPendingRequest'
        })
    },

    components: {
        Trip,
        Loading,
        PendingRequest,
        RatePending,
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
