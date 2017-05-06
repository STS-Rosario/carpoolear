<template>
  <div class="trips">
        <h2>Viajes Creados</h2> 
        <Loading :data="trips">
            <div id="trips-list">
                <Trip v-for="trip in trips" :trip="trip" :user="user" ></Trip>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando viajes ...</p>
        </Loading>

        <h2>Viajes Subido</h2> 
        <Loading :data="passengerTrips">
            <div id="trips-list">
                <Trip v-for="trip in passengerTrips" :trip="trip" :user="user" ></Trip>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando viajes ...</p>
        </Loading>

        <h2>Calificaciones pendientes</h2> 
        <Loading :data="pendingRates">
            <div id="trips-list">
                <div v-for="rate in pendingRates">
                    {{rate.id}}
                </div>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando viajes ...</p>
        </Loading>
    </div> 
</template>

<script>
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'trips',
    methods: {
    },
    mounted () {
        // this.search();
    },
    computed: {
        ...mapGetters({
            trips: 'myTrips/myTrips',
            passengerTrips: 'myTrips/passengerTrips',
            pendingRates: 'myTrips/pendingRates',
            user: 'auth/user'
        })
    },
    components: {
        Trip,
        Loading
    }
};
</script>
