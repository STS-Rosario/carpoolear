<template>
    <div class="trips container" :class="!user ? 'not-logged' : ''">
        <!-- iOS Safari Notification Permission Warning -->
        <div 
            v-if="isSafari() && isPWA() && !hasNotificationPermission && showNotificationWarning" 
            class="alert alert-warning ios-notification-warning"
            role="alert"
        >
            <h4>⚠️ {{ $t('notificacionesNoHabilitadas') }}</h4>
            <p>
                {{ $t('notificacionesNoAceptastePermisos') }}
            </p>
            <div class="notification-warning-buttons">
                <button 
                    class="btn btn-success" 
                    @click="requestNotificationPermission"
                >
                    {{ $t('otorgarPermisos') }}
                </button>
                <button 
                    class="btn btn-default" 
                    @click="dismissNotificationWarning"
                    style="margin-left: 10px;"
                >
                    {{ $t('noMostrarDeNuevo') }}
                </button>
            </div>
        </div>
        <template v-if="appConfig && appConfig.banner && appConfig.banner.url">
            <a :href="appConfig.banner.url" target="_blank" class="banner">
                <img alt="" :src="appConfig.banner.image" />
            </a>
        </template>
        <div v-show="!user && isMobile">
            <router-link :to="{ name: 'login' }" class="login_usuario">
                {{ $t('ingresaORegistrate') }}
                <span class="underline">{{ $t('aqui') }}</span>
                {{ $t('paraComenzar') }}
            </router-link>
        </div>
        <SearchBox
            :params="searchParams"
            v-on:trip-search="research"
            v-show="!isMobile || lookSearch"
            ref="searchBox"
        ></SearchBox>
        <Loading :data="trips" v-if="showingTrips">
            <div class="trips-list row">                
                <modal
                    :name="'modal'"
                    v-if="showModal"
                    @close="showModal = false"
                    :title="'Test'"
                    :body="'Body'"
                >
                    <h3 slot="header">
                        <span>{{ $t('donaA') }}</span>
                        <br class="hidden-sm hidden-md hidden-lg" />
                        <small>{{ $t('proyectoDe') }}</small>
                        <img
                            width="90"
                            alt="STS Rosario"
                            src="https://carpoolear.com.ar/img/logo_sts_nuevo_color.png"
                        />
                    </h3>
                    <div slot="body" class="donation">
                        <div class="radio">
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation50"
                                    value="2000"
                                    v-model="donateValue"
                                />
                                <span>$ 2000</span>
                            </label>
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation100"
                                    value="5000"
                                    v-model="donateValue"
                                />
                                <span>$ 5000</span>
                            </label>
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation200"
                                    value="10000"
                                    v-model="donateValue"
                                />
                                <span>$ 10000</span>
                            </label>
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation500"
                                    value="50"
                                    v-model="donateValue"
                                />
                                <span
                                    >{{ $t('elegirPropiaAventuraSoloMensual') }}</span
                                >
                            </label>
                        </div>
                        <div>
                            <button
                                class="btn btn-success btn-unica-vez"
                                @click="onDonateOnceTime"
                            >
                                {{ $t('unicaVez') }}
                            </button>
                            <button
                                class="btn btn-info btn-mensualmente"
                                @click="onDonateMonthly"
                            >
                                {{ $t('MENSUAL') }}
                                <br />
                                ( {{ $t('cancelaCuando') }})
                            </button>
                        </div>
                    </div>
                </modal>
                <modal
                    :name="'modal'"
                    v-if="showModalInstallApp && shouldShowInstallModal()"
                    @close="closeInstallModal()"
                    :title="'Test'"
                    :body="'Body'"
                >
                    <h3 slot="header">
                        <span>{{ getInstallModalContent() && getInstallModalContent().title || $t('instalarApp') }}</span>
                    </h3>
                    <div slot="body" class="">
                        <p style="white-space: pre-line;" v-html="getInstallModalContent() && getInstallModalContent().message || $t('instalarWebAppPWA')">
                        </p>
                        <div style="margin-bottom: 10px">
                            <button
                                v-if="getInstallModalContent() && getInstallModalContent().showInstallButton"
                                class="btn btn-danger"
                                @click="installApp()"
                            >
                                {{ $t('instalar') }}
                            </button>
                            <button
                                v-if="getInstallModalContent() && getInstallModalContent().showCloseButton"
                                class="btn btn-primary"
                                @click="closeInstallModal()"
                            >
                                {{ $t('entendido') }}
                            </button>
                            <button
                                v-if="getInstallModalContent() && getInstallModalContent().showDontShowAgainButton"
                                class="btn btn-default"
                                @click="dontShowAgainInstallModal()"
                                style="margin-left: 10px;"
                            >
                                {{ $t('noMostrarDeNuevo') }}
                            </button>
                        </div>
                    </div>
                </modal>
                <template v-for="(trip, index) in trips">
                    <template
                        v-if="
                            isDonationTime() && (!user || !user.monthly_donate)
                        "
                    >
                        <!-- solo si el usuario no es donador mensual -->
                        <div
                            class="panel panel-default panel-donar"
                            v-if="
                                (index +
                                    parseFloat(
                                        appConfig.donation.trips_offset
                                    )) %
                                    parseFloat(
                                        appConfig.donation.trips_count
                                    ) ===
                                0
                            "
                        >
                            <div class="panel-body">
                                <button
                                    class="btn btn-success pull-right btn-donar"
                                    @click="onDonate"
                                >
                                    {{ $t('donar') }}
                                </button>
                                <h2>{{ $t('ayudanos') }}</h2>

                                <a
                                    href="/donar"
                                    target="_blank"
                                    v-on:click.prevent="
                                        onOpenLink(
                                            'https://carpoolear.com.ar/donar?u=' +
                                                user.id
                                        )
                                    "
                                >
                                    {{ $t('porQueDonar') }}
                                </a>
                            </div>
                        </div>
                    </template>
                    <template v-if="isComplementary(trip, searchParams, index)">
                        <div class="trip-complementary">
                            <h2>{{ $t('resultadosCercanos') }}</h2>
                        </div>
                    </template>
                    <Trip :trip="trip" :user="user"></Trip>
                </template>
            </div>
            <div class="row">
                <p
                    class="alert alert-warning"
                    role="alert"
                    :class="isMobile ? 'mobile-alert' : ''"
                    v-if="resultaOfSearch && !alreadySubscribe"
                >
                    <span class="sentence">
                        <strong :class="isMobile ? 'sentence' : ''">
                            {{ $t('podesSubscribirte') }}
                        </strong>
                        <button
                            class="btn btn-primary"
                            v-if="user && !searchParams.data.is_passenger"
                            @click="subscribeSearch"
                        >
                            {{ $t('crearAlerta') }}
                        </button>
                    </span>
                </p>
            </div>
            <div v-if="runningSearch" class="more-trips-loading">
                <img
                    src="https://carpoolear.com.ar/static/img/loader.gif"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoMasResultados') }}
            </div>
            <p
                slot="no-data"
                class="alert alert-warning"
                role="alert"
                :class="isMobile ? 'mobile-alert' : ''"
            >
                <template v-if="filtered">
                    <span class="sentence">{{ $t('noHayViajes') }}</span>
                    <span class="sentence" v-if="!alreadySubscribe">
                        <strong :class="isMobile ? 'sentence' : ''">
                            {{ $t('subscribirteAViajes') }}
                        </strong>
                        <button
                            class="btn btn-primary"
                            v-if="user"
                            @click="subscribeSearch"
                        >
                            {{ $t('crearAlerta') }}
                        </button>
                    </span>
                </template>
                <template v-else>
                    <span class="sentence">{{
                        $t('noHayViajesCargadosAun')
                    }}</span>
                </template>
            </p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img
                    src="https://carpoolear.com.ar/static/img/loader.gif"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoViajes') }}
            </p>
        </Loading>
    </div>
</template>
<style scoped>
.sentence {
    display: block;
    margin-bottom: 0.5em;
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
import push from '../../cordova/push.js';

export default {
    name: 'trips',
    data() {
        return {
            lookSearch: false,
            filtered: false,
            runningSearch: false,
            alreadySubscribe: false,
            resultaOfSearch: false,
            showModal: false,
            showModalInstallApp: false,
            installAppEvent: null,
            donateValue: 0,
            hasNotificationPermission: false, // New state variable
            showNotificationWarning: true // New state variable
        };
    },
    props: ['clearSearch', 'keepSearch'],
    methods: {
        ...mapActions({
            search: 'trips/tripsSearch',
            refreshTrips: 'trips/refreshList',
            subscribeToSearch: 'subscriptions/create',
            findSubscriptions: 'subscriptions/index',
            registerDonation: 'profile/registerDonation',
            setScrollOffset: 'trips/setScrollOffset'
            // morePagesActions: 'trips/tripMorePage',
            // setActionButton: 'actionbars/setHeaderButtons'
        }),
        isIOS() {
            return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
        },
        isSafari() {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) && !/chrome/.test(userAgent);
        },
        isPWA() {
            // Check if running as PWA (standalone mode)
            return window.navigator.standalone === true || 
                   window.matchMedia('(display-mode: standalone)').matches ||
                   window.matchMedia('(display-mode: window-controls-overlay)').matches;
        },
        shouldShowInstallModal() {
            // Show modal if we have install event (Android) or if we're on iOS
            return this.installAppEvent !== null || this.isIOS();
        },
        getInstallModalContent() {
            if (this.installAppEvent !== null) {
                // Android - show install button
                return {
                    title: $t('instalarApp'),
                    message: $t('instalarWebAppPWA'),
                    showInstallButton: true,
                    showCloseButton: false,
                    showDontShowAgainButton: true
                };
            } else if (this.isIOS()) {
                // iOS - show installation instructions
                return {
                    title: $t('instalarAppEnIos'),
                    message: $t('instalarAppEnIosInstrucciones'),
                    showInstallButton: false,
                    showCloseButton: true,
                    showDontShowAgainButton: true
                };
            }
            return null;
        },
        isDonationTime() {
            if (this.appConfig) {
                return (
                    moment().date() <
                    parseFloat(this.appConfig.donation.month_days)
                );
            } else {
                return false;
            }
        },
        async installApp() {
            this.showModalInstallApp = false;
            if (this.installAppEvent !== null) {
                this.installAppEvent.prompt();
                // Espera a que el usuario responda al mensaje
                const { outcome } = await this.installAppEvent.userChoice;
                // {{ $t('esperaUsuarioResponda') }}
            }
        },
        closeInstallModal() {
            this.showModalInstallApp = false;
            // For iOS, this just closes temporarily - no localStorage flag
        },
        dontShowAgainInstallModal() {
            this.showModalInstallApp = false;
            // Mark that we've shown the install modal to this user permanently
            localStorage.setItem('pwa_install_modal_dismissed', 'true');
        },
        research(params) {
            this.resultaOfSearch = true;
            this.lookSearch = false;
            this.filtered = true;
            this.readySub = false;
            this.alreadySubscribe = false;
            this.search(params);
            this.findSubscriptions();
            // this.setActionButton(['clear']);
        },
        nextPage() {
            this.search({ next: true });
        },
        onTripClick() {
            let scrolloffset = window.scrollY;
            this.setScrollOffset(scrolloffset);
        },
        isComplementary(trip, searchParams, index) {
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
        // TODO filter trips that not are main route
        // REVIEW wich is the best way to do it?
        // maybe rethink render
        isMainRoute(trip, searchParams, index) {
            let isMainRoute = true;
            if (
                searchParams.data &&
                (searchParams.data.destination_id ||
                    searchParams.data.origin_id)
            ) {
                // trip.points[i].json_address.id
                if (trip.points && trip.points.length) {
                }
            }
            return isMainRoute;
        },

        onSearchButton() {
            console.log('onSearchButton');
            this.lookSearch = true;
            // this.setActionButton(['clear']);
            bus.on('backbutton', this.onBackBottom);
            // Desactivo reaccionar al Scroll
        },

        onClearButton() {
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
        onScrollBottom() {
            if (this.morePages && !this.lookSearch) {
                // Hay páginas y no estoy en búsquedas;
                if (!this.runningSearch) {
                    this.runningSearch = true;
                    let done = () => {
                        this.runningSearch = false;
                    };
                    this.search({ next: true }).then(done, done);
                }
            }
        },
        onBackBottom() {
            bus.off('backbutton', this.onBackBottom);
            this.lookSearch = false;
            this.alreadySubscribe = false;
        },
        onDonate() {
            this.showModal = true;
        },
        onOpenLink(link) {
            window.open(link, '_blank');
        },
        onDonateOnceTime() {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/jgap'; // 50
                switch (this.donateValue) {
                    case '2000':
                        url =
                            'https://mpago.la/1WhaoLf';
                        break;
                    case '5000':
                        url =
                            'https://mpago.la/1SB6on8';
                        break;
                    case '10000':
                        url =
                            'https://mpago.la/2USgEBv';
                        break;
                    default:
                        url = 'https://mpago.la/jgap';
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
                dialogs.message(this.$t('valorDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        onDonateMonthly() {
            if (this.donateValue >= 0) {
                var url = 'http://mpago.la/2XdoxpF'; // 50
                switch (this.donateValue) {
                    case '2000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848a2fd5c9018a33702cc50181';
                        break;
                    case '5000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848cee0ea5018d0e9ea71016d7';
                        break;
                    case '10000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497030fc7019705478b370068';
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
                dialogs.message(this.$t('valorDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        subscribeSearch() {
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
                data.from_id = params.origin_id;
                data.from_json_address = [];
            }
            if (params.destination_name) {
                data.to_address = params.destination_name;
                data.to_lat = params.destination_lat;
                data.to_lng = params.destination_lng;
                data.to_radio = params.destination_radio;
                data.to_id = params.destination_id;
                data.to_json_address = [];
            }

            data.is_passenger = params.is_passenger;

            this.subscribeToSearch(data)
                .then(() => {
                    this.alreadySubscribe = true;
                    dialogs.message(this.$t('correctamenteSubscripto'), {
                        duration: 10,
                        estado: 'success'
                    });
                })
                .catch((response) => {
                    console.log(response);
                    if (response.data.errors && response.data.errors.error) {
                        if (
                            response.data.errors.error[0] ===
                            'subscription_exist'
                        ) {
                            dialogs.message(this.$t('yaTienesSubscripcion'), {
                                duration: 10,
                                estado: 'error'
                            });
                        }
                    }
                });
        },
        checkNotificationPermission() {
            if (window.Notification && window.Notification.permission) {
                if (window.Notification.permission === 'granted') {
                    this.hasNotificationPermission = true;
                    this.showNotificationWarning = false;
                } else if (window.Notification.permission === 'denied') {
                    this.hasNotificationPermission = false;
                    // Check if user has dismissed this warning before
                    const hasDismissedNotificationWarning = localStorage.getItem('pwa_notification_warning_dismissed');
                    this.showNotificationWarning = !hasDismissedNotificationWarning;
                } else if (window.Notification.permission === 'default') {
                    this.hasNotificationPermission = false;
                    // Check if user has dismissed this warning before
                    const hasDismissedNotificationWarning = localStorage.getItem('pwa_notification_warning_dismissed');
                    this.showNotificationWarning = !hasDismissedNotificationWarning;
                }
            }
        },
        requestNotificationPermission() {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.hasNotificationPermission = true;
                    this.showNotificationWarning = false;
                    // Initialize push.js after permission is granted
                    try {
                        push.init();
                    } catch (error) {
                        console.log('Error initializing push notifications:', error);
                    }
                    dialogs.message(this.$t('notificacionesPermitidas'), {
                        duration: 10,
                        estado: 'success'
                    });
                } else {
                    dialogs.message(this.$t('notificacionesDenegadas'), {
                        duration: 10,
                        estado: 'error'
                    });
                }
            });
        },
        dismissNotificationWarning() {
            this.showNotificationWarning = false;
            localStorage.setItem('pwa_notification_warning_dismissed', 'true');
        }
    },
    mounted() {
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

        if (this.scrollPosition) {
            this.$nextTick(() => {
                setTimeout(() => {
                    window.scrollTo(0, this.scrollPosition);
                }, 2);
            });
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            // {{ $t('previeneMiniBarraInformacion') }}
            e.preventDefault();
            // {{ $t('guardaEventoDispareMasTarde') }}
            this.installAppEvent = e;
            
            // Check if user has permanently dismissed the install modal
            const hasDismissedInstallModal = localStorage.getItem('pwa_install_modal_dismissed');
            if (!hasDismissedInstallModal) {
                // {{ $t('actualizarIUNotificarUsuario') }}
                this.showModalInstallApp = true;
            }
            // De manera opcional, envía el evento de analíticos para saber si se mostró la promoción a a instalación del PWA
            console.log(`'beforeinstallprompt' event was fired.`);
        });

        // Show install modal for iOS users (since beforeinstallprompt doesn't fire on iOS)
        if (this.isIOS()) {
            // Check if user hasn't permanently dismissed this before
            const hasDismissedInstallModal = localStorage.getItem('pwa_install_modal_dismissed');
            if (!hasDismissedInstallModal) {
                // Show modal after a short delay to ensure the page is loaded
                setTimeout(() => {
                    this.showModalInstallApp = true;
                }, 2000);
            }
        }
        
        // Check notification permission status for Safari users
        if (this.isSafari() && this.isPWA()) {
            this.checkNotificationPermission();
        }

        // bus.event
        bus.off('search-click', this.onSearchButton);
        bus.on('search-click', this.onSearchButton);
        bus.off('clear-click', this.onClearButton);
        bus.on('clear-click', this.onClearButton);
        bus.off('scroll-bottom', this.onScrollBottom);
        bus.on('scroll-bottom', this.onScrollBottom);
        bus.off('trip-click', this.onTripClick);
        bus.on('trip-click', this.onTripClick);

        router.stack = [];
    },
    updated(a) {
        // {{ $t('pendienteNoSeLimpiaBuscador') }}
    },
    beforeDestroy() {
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
            appConfig: 'auth/appConfig',
            scrollPosition: 'trips/scrollOffset'
        }),

        showingTrips() {
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

.ios-safari-warning {
    color: red;
    font-weight: bold;
    margin-bottom: 0;
    font-size: 1.6em;
}

.ios-notification-warning {
    margin-top: 1em;
    padding: 1em;
    text-align: center;
    border: 2px solid orange;
    border-radius: 20px;
}

.ios-notification-warning h4 {
    margin-bottom: 0.5em;
}

.ios-notification-warning p {
    margin-bottom: 1em;
}

.notification-warning-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.notification-warning-buttons .btn {
    margin: 0;
}

@media (max-width: 768px) {
    .notification-warning-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .notification-warning-buttons .btn {
        margin-bottom: 10px;
        width: 100%;
        max-width: 200px;
    }
}
</style>
