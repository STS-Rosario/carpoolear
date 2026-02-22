<template>
    <div class="trips container" :class="!user ? 'not-logged' : ''">
        <template v-if="appConfig && appConfig.banner && appConfig.banner.url">
            <a :href="appConfig.banner.url" target="_blank" class="banner">
                <img alt="" :src="appConfig.banner.image" />
            </a>
        </template>
        <div v-show="!user && isMobile">
            <router-link :to="{ name: 'login' }" class="login_usuario">
                {{ t('ingresaORegistrate') }}
                <span class="underline">{{ t('aqui') }}</span>
                {{ t('paraComenzar') }}
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
                    <template #header>
                        <h3>
                            <span>{{ t('donaA') }}</span>
                            <br class="hidden-sm hidden-md hidden-lg" />
                            <small>{{ t('proyectoDe') }}</small>
                            <img
                                width="90"
                                alt="STS Rosario"
                                src="https://carpoolear.com.ar/img/logo_sts_nuevo_color.png"
                            />
                        </h3>
                    </template>
                    <template #body>
                        <div class="donation">
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
                                    <span>{{ t('elegirPropiaAventuraSoloMensual') }}</span>
                                </label>
                            </div>
                            <div>
                                <button
                                    class="btn btn-success btn-unica-vez"
                                    @click="onDonateOnceTime"
                                >
                                    {{ t('unicaVez') }}
                                </button>
                                <button
                                    class="btn btn-info btn-mensualmente"
                                    @click="onDonateMonthly"
                                >
                                    {{ t('MENSUAL') }}
                                    <br />
                                    ( {{ t('cancelaCuando') }})
                                </button>
                            </div>
                        </div>
                    </template>
                </modal>
                <modal
                    :name="'modal'"
                    v-if="showModalInstallApp && shouldShowInstallModal()"
                    @close="closeInstallModal()"
                    :title="'Test'"
                    :body="'Body'"
                >
                    <template #header>
                        <h3>
                            <span>{{ getInstallModalContent() && getInstallModalContent().title || t('instalarApp') }}</span>
                        </h3>
                    </template>
                    <template #body>
                        <div class="">
                            <p style="white-space: pre-line;" v-html="getInstallModalContent() && getInstallModalContent().message || t('instalarWebAppPWA')">
                            </p>
                            <div style="margin-bottom: 10px">
                                <button
                                    v-if="getInstallModalContent() && getInstallModalContent().showInstallButton"
                                    class="btn btn-danger"
                                    @click="installApp()"
                                >
                                    {{ t('instalar') }}
                                </button>
                                <button
                                    v-if="getInstallModalContent() && getInstallModalContent().showCloseButton"
                                    class="btn btn-primary"
                                    @click="closeInstallModal()"
                                >
                                    {{ t('entendido') }}
                                </button>
                                <button
                                    v-if="getInstallModalContent() && getInstallModalContent().showDontShowAgainButton"
                                    class="btn btn-default"
                                    @click="dontShowAgainInstallModal()"
                                    style="margin-left: 10px;"
                                >
                                    {{ t('noMostrarDeNuevo') }}
                                </button>
                            </div>
                        </div>
                    </template>
                </modal>
                <template v-for="(trip, index) in trips">
                    <template
                        v-if="
                            isDonationTime() &&
                            (!user || !user.monthly_donate) &&
                            !shouldHideDonationOnIOSCapacitorFn(user)
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
                                    {{ t('donar') }}
                                </button>
                                <h2>{{ t('ayudanos') }}</h2>

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
                                    {{ t('porQueDonar') }}
                                </a>
                            </div>
                        </div>
                    </template>
                    <template v-if="isComplementary(trip, searchParams, index)">
                        <div class="trip-complementary">
                            <h2>{{ t('resultadosCercanos') }}</h2>
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
                            {{ t('podesSubscribirte') }}
                        </strong>
                        <button
                            class="btn btn-primary"
                            v-if="user"
                            @click="subscribeSearch"
                        >
                            {{ t('crearAlerta') }}
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
                {{ t('cargandoMasResultados') }}
            </div>
            <template #no-data>
                <p
                    class="alert alert-warning"
                    role="alert"
                    :class="isMobile ? 'mobile-alert' : ''"
                >
                    <template v-if="filtered">
                        <span class="sentence">{{ t('noHayViajes') }}</span>
                        <span class="sentence" v-if="!alreadySubscribe">
                            <strong :class="isMobile ? 'sentence' : ''">
                                {{ t('subscribirteAViajes') }}
                            </strong>
                            <button
                                class="btn btn-primary"
                                v-if="user"
                                @click="subscribeSearch"
                            >
                                {{ t('crearAlerta') }}
                            </button>
                        </span>
                    </template>
                    <template v-else>
                        <span class="sentence">{{
                            t('noHayViajesCargadosAun')
                        }}</span>
                    </template>
                </p>
            </template>
            <template #loading>
                <p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ t('cargandoViajes') }}
                </p>
            </template>
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
<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useDeviceStore } from '@/stores/device';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import { useProfileStore } from '@/stores/profile';
import Trip from '../sections/Trip.vue';
import SearchBox from '../sections/SearchTrip.vue';
import Loading from '../Loading.vue';
import bus from '../../services/bus-event.js';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';
import modal from '../Modal';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import {
    isIOSCapacitor,
    shouldHideDonationOnIOSCapacitor
} from '../../services/capacitor.js';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const tripsStore = useTripsStore();
const deviceStore = useDeviceStore();
const subscriptionsStore = useSubscriptionsStore();
const profileStore = useProfileStore();

const props = defineProps(['clearSearch', 'keepSearch']);

const lookSearch = ref(false);
const filtered = ref(false);
const runningSearch = ref(false);
const alreadySubscribe = ref(false);
const resultaOfSearch = ref(false);
const showModal = ref(false);
const showModalInstallApp = ref(false);
const installAppEvent = ref(null);
const donateValue = ref(0);
const hasNotificationPermission = ref(false);
const showNotificationWarning = ref(true);

const searchBox = ref(null);

const trips = computed(() => tripsStore.trips);
const morePages = computed(() => tripsStore.tripsMorePage);
const user = computed(() => authStore.user);
const searchParams = computed(() => tripsStore.tripsSearchParam);
const isMobile = computed(() => deviceStore.isMobile);
const isBrowser = computed(() => deviceStore.isBrowser);
const refreshList = computed(() => tripsStore.refreshListFlag);
const subscriptions = computed(() => subscriptionsStore.subscriptions);
const appConfig = computed(() => authStore.appConfig);
const scrollPosition = computed(() => tripsStore.scrollOffset);

const showingTrips = computed(() => {
    return !isMobile.value || !lookSearch.value;
});

const isIOSCapacitorComputed = computed(() => {
    return isIOSCapacitor();
});

const shouldHideDonationOnIOSCapacitorFn = (userVal) => {
    return shouldHideDonationOnIOSCapacitor(userVal);
};

const isIOS = () => {
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
};

const isSafari = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) && !/chrome/.test(userAgent);
};

const isPWA = () => {
    return window.navigator.standalone === true ||
           window.matchMedia('(display-mode: standalone)').matches ||
           window.matchMedia('(display-mode: window-controls-overlay)').matches;
};

const shouldShowInstallModal = () => {
    return installAppEvent.value !== null || isIOS();
};

const getInstallModalContent = () => {
    if (installAppEvent.value !== null) {
        return {
            title: t('instalarApp'),
            message: t('instalarWebAppPWA'),
            showInstallButton: true,
            showCloseButton: false,
            showDontShowAgainButton: true
        };
    } else if (isIOS()) {
        return {
            title: t('instalarAppEnIos'),
            message: t('instalarAppEnIosInstrucciones'),
            showInstallButton: false,
            showCloseButton: true,
            showDontShowAgainButton: true
        };
    }
    return null;
};

const isDonationTime = () => {
    if (appConfig.value) {
        return (
            moment().date() <
            parseFloat(appConfig.value.donation.month_days)
        );
    } else {
        return false;
    }
};

const installApp = async () => {
    showModalInstallApp.value = false;
    if (installAppEvent.value !== null) {
        installAppEvent.value.prompt();
        const { outcome } = await installAppEvent.value.userChoice;
    }
};

const closeInstallModal = () => {
    showModalInstallApp.value = false;
};

const dontShowAgainInstallModal = () => {
    showModalInstallApp.value = false;
    localStorage.setItem('pwa_install_modal_dismissed', 'true');
};

const research = (params) => {
    resultaOfSearch.value = true;
    lookSearch.value = false;
    filtered.value = true;
    alreadySubscribe.value = false;
    tripsStore.tripsSearch(params);
    subscriptionsStore.index();
};

const nextPage = () => {
    tripsStore.tripsSearch({ next: true });
};

const onTripClick = () => {
    let scrolloffset = window.scrollY;
    tripsStore.setScrollOffset(scrolloffset);
};

const isComplementary = (trip, searchParamsVal, index) => {
    let result = false;
    if (searchParamsVal.data && searchParamsVal.data.date) {
        var searchDate = moment(searchParamsVal.data.date).toDate();
        var tripDate = moment(trip.trip_date).toDate();
        tripDate.setHours(0);
        tripDate.setMinutes(0);
        tripDate.setSeconds(0);
        if (searchDate.getTime() === tripDate.getTime()) {
            result = false;
        } else {
            result = true;
        }
    }
    return result;
};

const isMainRoute = (trip, searchParamsVal, index) => {
    let result = true;
    if (
        searchParamsVal.data &&
        (searchParamsVal.data.destination_id ||
            searchParamsVal.data.origin_id)
    ) {
        if (trip.points && trip.points.length) {
        }
    }
    return result;
};

const onSearchButton = () => {
    console.log('onSearchButton');
    lookSearch.value = true;
    bus.on('backbutton', onBackBottom);
};

const onClearButton = () => {
    bus.off('backbutton', onBackBottom);
    bus.on('scroll-bottom', onScrollBottom);
    filtered.value = false;
    lookSearch.value = false;
    alreadySubscribe.value = false;
    tripsStore.tripsSearch({ is_passenger: false });
    if (searchBox.value) {
        searchBox.value.clear();
    }
};

const onScrollBottom = () => {
    if (morePages.value && !lookSearch.value) {
        if (!runningSearch.value) {
            runningSearch.value = true;
            let done = () => {
                runningSearch.value = false;
            };
            tripsStore.tripsSearch({ next: true }).then(done, done);
        }
    }
};

const onBackBottom = () => {
    bus.off('backbutton', onBackBottom);
    lookSearch.value = false;
    alreadySubscribe.value = false;
};

const openExternalBrowser = async (url) => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        try {
            await App.openUrl({ url });
        } catch (error) {
            console.error('Error opening URL in external browser:', error);
            window.open(url, '_blank');
        }
    } else {
        window.open(url, '_blank');
    }
};

const onDonate = async () => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        let url = 'https://carpoolear.com.ar/donar';
        if (user.value && user.value.id) {
            url = `${url}?u=${user.value.id}`;
        }
        await openExternalBrowser(url);
        return;
    }
    showModal.value = true;
};

const onOpenLink = (link) => {
    openExternalBrowser(link);
};

const onDonateOnceTime = async () => {
    if (donateValue.value > 0) {
        var url = 'http://mpago.la/jgap';
        switch (donateValue.value) {
            case '2000':
                url = 'https://mpago.la/1WhaoLf';
                break;
            case '5000':
                url = 'https://mpago.la/1SB6on8';
                break;
            case '10000':
                url = 'https://mpago.la/2USgEBv';
                break;
            default:
                url = 'https://mpago.la/jgap';
                break;
        }
        if (user.value && user.value.id) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}u=${user.value.id}`;
        }
        await openExternalBrowser(url);
        showModal.value = false;
        let data = {
            has_donated: 1,
            has_denied: 0,
            ammount: parseFloat(donateValue.value)
        };
        profileStore.registerDonation(data);
    } else {
        dialogs.message(t('valorDonacion'), {
            duration: 10,
            estado: 'error'
        });
    }
};

const onDonateMonthly = async () => {
    if (donateValue.value >= 0) {
        var url = 'http://mpago.la/2XdoxpF';
        switch (donateValue.value) {
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
        if (user.value && user.value.id) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}u=${user.value.id}`;
        }
        await openExternalBrowser(url);
        showModal.value = false;
        let data = {
            has_donated: 1,
            has_denied: 0,
            ammount: parseFloat(donateValue.value)
        };
        profileStore.registerDonation(data);
    } else {
        dialogs.message(t('valorDonacion'), {
            duration: 10,
            estado: 'error'
        });
    }
};

const subscribeSearch = () => {
    let params = searchParams.value.data;
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

    subscriptionsStore.create(data)
        .then(() => {
            alreadySubscribe.value = true;
            dialogs.message(t('correctamenteSubscripto'), {
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
                    dialogs.message(t('yaTienesSubscripcion'), {
                        duration: 10,
                        estado: 'error'
                    });
                }
            }
        });
};

watch(trips, (newValue, oldValue) => {
    if (refreshList.value) {
        tripsStore.refreshList(false);
        lookSearch.value = false;
        resultaOfSearch.value = false;
        if (searchBox.value) {
            searchBox.value.clear();
        }
    }
});

onMounted(() => {
    // Clear search
    if (props.clearSearch) {
        onClearButton();
    } else {
        if (searchBox.value) {
            searchBox.value.loadParams(searchParams.value.data);
        }
    }
    if (!props.keepSearch) {
        if (searchBox.value) {
            searchBox.value.clear();
        }
    }

    if (scrollPosition.value) {
        nextTick(() => {
            setTimeout(() => {
                window.scrollTo(0, scrollPosition.value);
            }, 2);
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installAppEvent.value = e;

        const hasDismissedInstallModal = localStorage.getItem('pwa_install_modal_dismissed');
        if (!hasDismissedInstallModal) {
            showModalInstallApp.value = true;
        }
        console.log(`'beforeinstallprompt' event was fired.`);
    });

    // Show install modal for iOS users
    if (isIOS()) {
        const hasDismissedInstallModal = localStorage.getItem('pwa_install_modal_dismissed');
        if (!hasDismissedInstallModal) {
            setTimeout(() => {
                showModalInstallApp.value = true;
            }, 2000);
        }
    }

    // bus.event
    bus.off('search-click', onSearchButton);
    bus.on('search-click', onSearchButton);
    bus.off('clear-click', onClearButton);
    bus.on('clear-click', onClearButton);
    bus.off('scroll-bottom', onScrollBottom);
    bus.on('scroll-bottom', onScrollBottom);
    bus.off('trip-click', onTripClick);
    bus.on('trip-click', onTripClick);

    router.stack = [];
});

onBeforeUnmount(() => {
    bus.off('search-click', onSearchButton);
    bus.off('clear-click', onClearButton);
    bus.off('scroll-bottom', onScrollBottom);
    bus.off('backbutton', onBackBottom);
});
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
