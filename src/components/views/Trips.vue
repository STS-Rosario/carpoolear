<template>
    <div class="trips container" :class="!user ? 'not-logged' : ''">
        <div class="trips_title" v-show="!isMobile">
            <h1>Buscá con quién compartir tu próximo viaje!</h1>
            <h3>¡Elegí fecha, origen o destino y encontralo!</h3>
        </div>
        <template v-if="appConfig && appConfig.banner && appConfig.banner.url">
            <a :href="appConfig.banner.url" target="_blank" class="banner">
                <img alt="" :src="appConfig.banner.image" />
            </a>
        </template>
        <div v-show="!user && isMobile">
            <router-link :to="{name: 'login'}" class="login_usuario"> Ingresá con tu usuario o registrate <span class='underline'>aquí</span> para comenzar a Carpoolear!</router-link>
        </div>
        <SearchBox :params="searchParams" v-on:trip-search="research" v-show="!isMobile || lookSearch" ref="searchBox"></SearchBox>
        <Loading :data="trips" v-if="showingTrips">
            <div class="trips-list row">
                <modal :name="'modal'" v-if="showModal" @close="showModal = false" :title="'Test'" :body="'Body'">
                    <h3 slot="header">
                        <span>Doná a Carpoolear</span>
                        <br class="hidden-sm hidden-md hidden-lg">
                        <small>un proyecto de </small>
                        <img width="90" alt="STS Rosario" src="https://carpoolear.com.ar/img/logo_sts_nuevo_color.png">
                    </h3>
                    <div slot="body" class="donation">
                        <div class="text-center">
                            <!-- <a href="/donar" target="_blank" v-on:click.prevent="onOpenLink('https://carpoolear.com.ar/donar')">
                                Conocé más acerca de por qué donar a Carpoolear
                            </a> -->
                        </div>
                        <div class="radio">
                            <label class="radio-inline">
                                <input type="radio" name="donationValor" id="donation50" value="50" v-model="donateValue"><span>$ 50</span>
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="donationValor" id="donation100" value="100" v-model="donateValue"><span>$ 100</span>
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="donationValor" id="donation200" value="200" v-model="donateValue"><span>$ 200</span>
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="donationValor" id="donation500" value="500" v-model="donateValue"><span>$ 500</span>
                            </label>
                        </div>
                        <div>
                            <button class="btn btn-success btn-unica-vez" @click="onDonateOnceTime">ÚNICA VEZ</button>
                            <button class="btn btn-info btn-mensualmente" @click="onDonateMonthly">MENSUAL <br />(cancelá cuando quieras)</button>
                        </div>
                    </div>
                </modal>
                <template v-for="(trip, index) in trips">
                    <template v-if="isDonationTime() && !user.monthly_donate"><!-- solo si el usuario no es donador mensual -->
                        <div class="panel panel-default panel-donar" v-if="((index + parseFloat(appConfig.donation.trips_offset))  % parseFloat(appConfig.donation.trips_count) === 0)">
                            <div class="panel-body">
                                <button class="btn btn-success pull-right btn-donar" @click="onDonate">Donar</button>
                                <h2>Ayudanos a seguir siendo una plataforma abierta, colaborativa y sin fines de lucro</h2>

                                <a href="/donar" target="_blank" v-on:click.prevent="onOpenLink('https://carpoolear.com.ar/donar?u=' + user.id)">
                                    Por qué donar a Carpoolear
                                </a>
                            </div>
                        </div>
                    </template>
                    <template v-if="isComplementary(trip, searchParams, index)">
                        <div class="trip-complementary">
                            <h2>Resultados cercanos</h2>
                        </div>
                    </template>
                    <Trip :trip="trip" :user="user"></Trip>
                </template>
            </div>
            <div class="row">
                <p class="alert alert-warning"  role="alert"  :class="isMobile ? 'mobile-alert' : ''" v-if="resultaOfSearch && !alreadySubscribe">
                    <!-- <span class="sentence">¡Ups! No hay viajes con los criterios indicados en la búsqueda.</span> -->
                    <span class="sentence">
                        <strong :class="isMobile ? 'sentence' : ''">Ahora podés suscribirte para que te avisemos cuando haya un nuevo viaje que concuerde con lo que estas buscando.</strong>
                        <button class="btn btn-primary" v-if="user && !searchParams.data.is_passenger" @click="subscribeSearch" >Crear Alerta</button>
                    </span>
                </p>
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
            <p slot="no-data" class="alert alert-warning"  role="alert"  :class="isMobile ? 'mobile-alert' : ''">
                <span class="sentence">¡Ups! No hay viajes con los criterios indicados en la búsqueda.</span>
                <span class="sentence" v-if="!alreadySubscribe">
                    <strong :class="isMobile ? 'sentence' : ''">Ahora podés suscribirte para que te avisemos cuando haya un nuevo viaje que concuerde con lo que estas buscando.</strong>
                    <button class="btn btn-primary" v-if="user" @click="subscribeSearch" >Crear Alerta</button>
                </span>
            </p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                Cargando viajes ...
            </p>
        </Loading>
    </div>
</template>
<style scoped>
.sentence {
    display: block;
    margin-bottom: .5em;
}
.mobile-alert .sentence {
    margin-bottom: 1em;
}
.mobile-alert .btn {
    margin: 0 auto;
    display: block;
}
</style>
<script>
import Trip from '../sections/Trip.vue';
import SearchBox from '../sections/SearchTrip.vue';
import Loading from '../Loading.vue';
import bus from '../../services/bus-event.js';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import modal from '../Modal';

export default {
    name: 'trips',
    data () {
        return {
            lookSearch: false,
            filtered: false,
            runningSearch: false,
            alreadySubscribe: false,
            resultaOfSearch: false,
            showModal: false,
            donateValue: 0
        };
    },
    props: [
        'clearSearch', 'keepSearch'
    ],
    methods: {
        ...mapActions({
            search: 'trips/tripsSearch',
            refreshTrips: 'trips/refreshList',
            subscribeToSearch: 'subscriptions/create',
            findSubscriptions: 'subscriptions/index',
            registerDonation: 'profile/registerDonation'
            // morePagesActions: 'trips/tripMorePage',
            // setActionButton: 'actionbars/setHeaderButtons'
        }),
        isDonationTime () {
            if (this.appConfig) {
                return moment().date() < parseFloat(this.appConfig.donation.month_days);
            } else {
                return false;
            }
        },
        research (params) {
            this.resultaOfSearch = true;
            this.lookSearch = false;
            this.filtered = true;
            this.readySub = false;
            this.alreadySubscribe = false;
            this.search(params);
            this.findSubscriptions();
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
            console.log('onSearchButton');
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
            this.alreadySubscribe = false;
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
            this.alreadySubscribe = false;
        },
        onDonate () {
            this.showModal = true;
        },
        onOpenLink (link) {
            window.open(link, '_blank');
        },
        onDonateOnceTime () {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/jgap'; // 50
                switch (this.donateValue) {
                case '100':
                    url = 'http://mpago.la/CaSZ';
                    break;
                case '200':
                    url = 'http://mpago.la/xntw';
                    break;
                case '500':
                    url = 'http://mpago.la/QEiN';
                    break;
                default:
                    break;
                }
                window.open(url, '_blank');
                this.showModal = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue)
                };
                this.registerDonation(data);
            } else {
                dialogs.message('Tienes que seleccionar un valor de donación.', { duration: 10, estado: 'error' });
            }
        },
        onDonateMonthly () {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/1w3aci'; // 50
                switch (this.donateValue) {
                case '100':
                    url = 'http://mpago.la/BfZ';
                    break;
                case '200':
                    url = 'http://mpago.la/P02H';
                    break;
                case '500':
                    url = 'http://mpago.la/k8Xp';
                    break;
                default:
                    break;
                }
                window.open(url, '_blank');
                this.showModal = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue)
                };
                this.registerDonation(data);
            } else {
                dialogs.message('Tienes que seleccionar un valor de donación.', { duration: 10, estado: 'error' });
            }
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

            data.is_passenger = params.is_passenger;

            this.subscribeToSearch(data).then(() => {
                this.alreadySubscribe = true;
                dialogs.message('Te subscribiste correctamente. Te avisaremos cuando hayan viajes similares', { duration: 10, estado: 'success' });
            }).catch((response) => {
                console.log(response);
                if (response.data.errors && response.data.errors.error) {
                    if (response.data.errors.error[0] === 'subscription_exist') {
                        dialogs.message('Ya tienes una suscripción para esta búsqueda.', { duration: 10, estado: 'error' });
                    }
                }
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
                this.resultaOfSearch = false;
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
            refreshList: 'trips/refreshList',
            subscriptions: 'subscriptions/subscriptions',
            appConfig: 'auth/appConfig'
        }),

        showingTrips () {
            return !this.isMobile || !this.lookSearch;
        }
    },
    components: {
        Trip,
        Loading,
        SearchBox,
        modal
    }
};
</script>
<style scoped>
    .banner {
        display: block;
        margin: -1em auto 1em;
        text-align: center;
    }
    .banner img {
        border: 1px solid #999;
        width: 100%;
        max-width: 934px;
    }
    .btn-donar {
        margin-left: 2em;
        margin-right: 2em;
        margin-top: 1em;
        padding: 1em 2em;
        font-size: 1.3em;
    }
</style>
