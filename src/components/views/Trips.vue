<template>
    <div class="trips">
        <SearchBox :params="searchParams" v-on:trip-search="research" ></SearchBox>
        <h2>Viajes</h2> 
        <Loading :data="trips">
            <div id="trips-list">
                <Trip v-for="trip in trips" :trip="trip" :user="user" ></Trip>
            </div>
            <div v-if="morePages">
                <button class="btn btn-primary" @click="nextPage">Más resultados</button>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay viajes</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando viajes ...</p>
        </Loading>
    </div>    
</template>
<script>
import Trip from '../sections/Trip.vue';
import SearchBox from '../sections/SearchTrip.vue';
import Loading from '../Loading.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'trips',
    methods: {
        ...mapActions({
            search: 'trips/tripsSearch' 
        }),
        research (params) {
            this.search(params);
        },
        nextPage () {
            this.search({next: true});
        }
    },
    mounted () {
        // this.search();
    },
    computed: {
        ...mapGetters({
            trips: 'trips/trips',
            morePages: 'trips/tripsMorePage',
            user: 'auth/user',
            searchParams: 'trips/tripsSearchParam'
        })
    },
    components: {
        Trip,
        Loading,
        SearchBox
    }
};
</script>
