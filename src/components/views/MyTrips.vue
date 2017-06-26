<template>
  <div class="trips">
        <div class="col-xs-24">
            <h2>Pendiente de contestar</h2>
            <Loading :data="pendingRequest">
                <div id="trips-list">
                    <PendingRequest v-for="r in pendingRequest" :user="r.user" :trip="findTrip(r.trip_id)"></PendingRequest>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay pedientes de contestar</p> 
                <p slot="loading" class="alert alert-info" role="alert">Cargando...</p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <h2>Calificaciones pendientes</h2> 
            <Loading :data="pendingRates">
                <div id="trips-list">
                    <RatePending v-for="rate in pendingRates" :rate="rate" />
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay calificaciones pendientes</p> 
                <p slot="loading" class="alert alert-info" role="alert">Cargando calificaciones ...</p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <h2>Viajes Creados</h2> 
            <Loading :data="trips">
                <div id="trips-list">
                    <Trip v-for="trip in trips" :trip="trip" :user="user" ></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p> 
                <p slot="loading" class="alert alert-info" role="alert">Cargando viajes ...</p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <h2>Viajes Subido</h2> 
            <Loading :data="passengerTrips">
                <div id="trips-list">
                    <Trip v-for="trip in passengerTrips" :trip="trip" :user="user" ></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p> 
                <p slot="loading" class="alert alert-info" role="alert">Cargando viajes ...</p>
            </Loading>
        </div>

        
    </div> 
</template>

<script>
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import PendingRequest from '../PendingRequest';
import RatePending from '../RatePending';
import { mapGetters } from 'vuex';

import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';

export default {
    name: 'my-trips',

    mounted () {

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
        }
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
