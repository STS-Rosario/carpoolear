<template>
    <div class="trips margin-header">
        <div class="trips_title" v-show="!isMobile">
            <h1>Buscá con quién compartir tu próximo viaje!</h1>
            <h3>¡Elegí fecha, origen o destino y encontralo!</h3>
        </div>

        <SearchBox :params="searchParams" v-on:trip-search="research" v-show="!isMobile || lookSearch"></SearchBox> 

        <Loading :data="trips" v-if="showingTrips">
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
import bus from '../../services/bus-event.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'trips',
    data () {
        return {
            lookSearch: false,
            filtered: false
        };
    },
    methods: {
        ...mapActions({
            search: 'trips/tripsSearch',
            setActionButton: 'actionbars/setHeaderButtons'
        }),
        research (params) {
            this.lookSearch = false;
            this.filtered = true;
            this.search(params);
            this.setActionButton(['clear']);
        },
        nextPage () {
            this.search({next: true});
        },

        onSearchButton () {
            this.lookSearch = true;
            this.setActionButton(['clear']);
        },

        onClearButton () {
            this.setActionButton(['search']);
            this.filtered = false;
            this.lookSearch = false;
            this.search({});
        }
    },
    mounted () {
        // this.search();
        bus.on('search-click', this.onSearchButton);
        bus.on('clear-click', this.onClearButton);
    },
    beforeDestroy () {
        bus.off('search-click', this.onSearchButton);
        bus.off('clear-click', this.onClearButton);
    },
    computed: {
        ...mapGetters({
            trips: 'trips/trips',
            morePages: 'trips/tripsMorePage',
            user: 'auth/user',
            searchParams: 'trips/tripsSearchParam',
            isMobile: 'device/isMobile'
        }),

        showingTrips () {
            return !this.isMobile || !this.lookSearch;
        }
    },
    components: {
        Trip,
        Loading,
        SearchBox
    }
};
</script>
