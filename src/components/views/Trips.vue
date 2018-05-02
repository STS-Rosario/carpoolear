<template>
    <div class="trips container" :class="!user ? 'not-logged' : ''">
        <div class="trips_title" v-show="!isMobile">
            <h1>Buscá con quién compartir tu próximo viaje!</h1>
            <h3>¡Elegí fecha, origen o destino y encontralo!</h3>
        </div>
        <div v-show="!user && isMobile">
            <router-link :to="{name: 'login'}" class="login_usuario"> Ingresá con tu usuario o registrate <span class='underline'>aquí</span> para comenzar a Carpoolear!</router-link>
        </div>
        <SearchBox :params="searchParams" v-on:trip-search="research" v-show="!isMobile || lookSearch" ref="searchBox"></SearchBox>
        <Loading :data="trips" v-if="showingTrips">
            <div class="trips-list">
                <template v-for="(trip, index) in trips">
                    <template v-if="isComplementary(trip, searchParams, index)">
                        <div class="trip-complementary">
                            <h2>Resultados cercanos</h2>
                        </div>
                    </template>
                    <Trip :trip="trip" :user="user"></Trip>
                </template>
            </div>
            <!--
            <div v-if="morePages">
                <button class="btn btn-primary" @click="nextPage">Más resultados</button>
            </div>
            -->
            <div v-if="runningSearch" class="more-trips-loading">
                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                Cargando más resultados
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">
                ¡Ups! No hay viajes con los criterios indicados en la búsqueda, intenta en otra fecha o ¡crea uno!
                <button class="btn btn-primary btn-search" v-if="user && !searchParams.data.is_passenger" @click="subscribeSearch">Suscribirse</button>
            </p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                Cargando viajes ...
            </p>
        </Loading>
    </div>
</template>
<script>
import Trip from '../sections/Trip.vue';
import SearchBox from '../sections/SearchTrip.vue';
import Loading from '../Loading.vue';
import bus from '../../services/bus-event.js';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import router from '../../router';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'trips',
    data () {
        return {
            lookSearch: false,
            filtered: false,
            runningSearch: false
        };
    },
    props: [
        'clearSearch', 'keepSearch'
    ],
    methods: {
        ...mapActions({
            search: 'trips/tripsSearch',
            refreshTrips: 'trips/refreshList',
            subscribeToSearch: 'subscriptions/create'
            // morePagesActions: 'trips/tripMorePage',
            // setActionButton: 'actionbars/setHeaderButtons'
        }),
        research (params) {
            this.lookSearch = false;
            this.filtered = true;
            this.search(params);
            // this.setActionButton(['clear']);
        },
        nextPage () {
            this.search({next: true});
        },
        isComplementary (trip, searchParams, index) {
            let isComplementary = false;
            if (searchParams.data && searchParams.data.date) {
                var searchDate = moment(searchParams.data.date).toDate();
                var tripDate = moment(trip.trip_date).toDate();
                tripDate.setHours(0);
                tripDate.setMinutes(0);
                tripDate.setSeconds(0);
                if (searchDate.getTime() === tripDate.getTime()) {
                    isComplementary = false;
                } else {
                    isComplementary = true;
                }
            }
            return isComplementary;
        },

        onSearchButton () {
            this.lookSearch = true;
            // this.setActionButton(['clear']);
            bus.on('backbutton', this.onBackBottom);
            // Desactivo reaccionar al Scroll
        },

        onClearButton () {
            bus.off('backbutton', this.onBackBottom);
            bus.on('scroll-bottom', this.onScrollBottom);
            // this.setActionButton(['search']);
            this.filtered = false;
            this.lookSearch = false;
            this.search({ is_passenger: false });
            if (this.$refs.searchBox) {
                this.$refs.searchBox.clear();
            }
        },
        onScrollBottom () {
            if (this.morePages && !this.lookSearch) { // Hay páginas y no estoy en búsquedas;
                if (!this.runningSearch) {
                    this.runningSearch = true;
                    let done = () => {
                        this.runningSearch = false;
                    };
                    this.search({next: true}).then(done, done);
                }
            }
        },
        onBackBottom () {
            bus.off('backbutton', this.onBackBottom);
            this.lookSearch = false;
        },
        subscribeSearch () {
            let params = this.searchParams.data;
            let data = {};
            if (params.date) {
                data.trip_date = params.date;
            }
            if (params.origin_name) {
                data.from_address = params.origin_name;
                data.from_lat = params.origin_lat;
                data.from_lng = params.origin_lng;
                data.from_radio = params.origin_radio;
                data.from_json_address = [];
            }
            if (params.destination_name) {
                data.to_address = params.destination_name;
                data.to_lat = params.destination_lat;
                data.to_lng = params.destination_lng;
                data.to_radio = params.destination_radio;
                data.to_json_address = [];
            }
            this.subscribeToSearch(data).then(() => {
                dialogs.message('Te subscribiste correctamente. Te avisaremos cuando hayan viajes similares', { duration: 10, estado: 'success' });
            });
        }
    },
    mounted () {
        // Clear search
        if (this.clearSearch) {
            this.onClearButton();
        } else {
            // Tendria que recargar desde la búsqueda anterior
            if (this.$refs.searchBox) {
                this.$refs.searchBox.loadParams(this.searchParams.data);
            }
        }
        if (!this.keepSearch) {
            this.$refs.searchBox.clear();
        }

        // bus.event
        bus.off('search-click', this.onSearchButton);
        bus.on('search-click', this.onSearchButton);
        bus.off('clear-click', this.onClearButton);
        bus.on('clear-click', this.onClearButton);
        bus.off('scroll-bottom', this.onScrollBottom);
        bus.on('scroll-bottom', this.onScrollBottom);

        router.stack = [];
    },
    updated (a) {

        // Pendiente, no se limpia el buscador, si los search params están vacios
    },
    beforeDestroy () {
        bus.off('search-click', this.onSearchButton);
        bus.off('clear-click', this.onClearButton);
        bus.off('scroll-bottom', this.onScrollBottom);
        bus.off('backbutton', this.onBackBottom);
    },
    watch: {
        trips: function (oldValue, newValue) {
            if (this.refreshList) {
                this.refreshTrips(false);
                this.lookSearch = false;
                this.$refs.searchBox.clear();
            }
        }
    },
    computed: {
        ...mapGetters({
            trips: 'trips/trips',
            morePages: 'trips/tripsMorePage',
            user: 'auth/user',
            searchParams: 'trips/tripsSearchParam',
            isMobile: 'device/isMobile',
            isBrowser: 'device/isBrowser',
            refreshList: 'trips/refreshList'
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
