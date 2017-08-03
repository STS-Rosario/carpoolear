<template>
  <div class="profile-trip-component container">
        <div class="col-xs-24">
            <h2>Viajes Creados</h2>
            <Loading :data="driverTrip">
                <div id="trips-list">
                    <Trip v-for="trip in driverTrip" :trip="trip" :user="user" ></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    img src="/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
            </Loading>
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

    mounted () {
        this.tripAsDriver();
        this.tripAsPassenger();
    },

    computed: {
        ...mapGetters({
            driverTrip: 'userTrips/driverTrip',
            passengerTrip: 'userTrips/passengerTrip',
            user: 'auth/user'
        })
    },

    methods: {
        ...mapActions({
            tripAsDriver: 'userTrips/tripAsDriver',
            tripAsPassenger: 'userTrips/tripAsPassenger'
        })
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
