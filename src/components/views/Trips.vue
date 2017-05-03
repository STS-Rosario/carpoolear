<template>
    <div class="trips">
        <h2>Viajes</h2> 
        <Loading :data="trips">
            <div id="trips-list">
                <Trip v-for="trip in trips" :trip="trip" :user="user" ></Trip>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando viajes ...</p>
        </Loading>
    </div>    
</template>
<script>
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'trips',
    methods: {
        ...mapActions({
            search: 'trips/search'
        })
    },
    mounted () {
        // this.search();
    },
    computed: {
        ...mapGetters({
            trips: 'trips/trips',
            morePages: 'trips/morePage',
            user: 'auth/user'
        })
    },
    components: {
        Trip,
        Loading
    }
};
</script>
