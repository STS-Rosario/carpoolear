<template>
    <div class="trips container" :class="!user ? 'not-logged' : ''"> 
        <template v-if="showAppBanner">
            <a
                :href="bannerHref"
                :target="bannerTarget"
                class="banner"
                @click.prevent="onBannerClick"
            >
                <img alt="" :src="bannerImageSrc" />
            </a>
        </template>
        <OngoingTripCard v-if="ongoingTrip" :trip="ongoingTrip" />
        <TripCreationDraftCard v-if="user" ref="tripCreationDraftCard" />
        <PendingFriendRequestsCard v-if="user" />
        <div
            v-if="user && notificationsEnabledForPlatform && !hasNotificationPermission && showNotificationWarning"
            class="alert alert-warning ios-notification-warning"
            style="text-align: center"
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
        <div v-if="isMobile && !lookSearch" class="trips-mobile-home">
            <div class="trips-mobile-home__role-grid">
                <button
                    type="button"
                    class="trips-mobile-home__role-card"
                    @click="openMobileSearch(false)"
                >
                    <i class="fa fa-car" aria-hidden="true"></i>
                    <span>{{ $t('buscoConductor') }}</span>
                </button>
                <button
                    type="button"
                    class="trips-mobile-home__role-card"
                    @click="openMobileSearch(true)"
                >
                    <img :src="pasajeroSearchIcon" alt="" />
                    <span>{{ $t('buscoPasajeros') }}</span>
                </button>
            </div>
            <AppButton
                class="trips-mobile-home__create"
                variant="primary"
                block
                icon-left="fa fa-plus"
                :to="{ name: 'new-trip' }"
            >
                {{ $t('crearViaje') }}
            </AppButton>
        </div>
        <SearchBox
            :params="searchParams"
            v-on:trip-search="research"
            v-show="!isMobile || lookSearch"
            ref="searchBox"
        ></SearchBox>
        <Loading :data="trips" v-if="showingTrips">
            <div class="trips-list">
                <h2
                    v-if="isMobile && !lookSearch && !showSplitDonationPanel"
                    class="trips-mobile-home__heading"
                >
                    {{ $t('viajesPublicados') }}
                </h2>
                <modal
                    :name="'modal'"
                    v-if="showModal"
                    @close="showModal = false"
                    :title="'Test'"
                    :body="'Body'"
                >
                    <template #header><h3>
                        <span>{{ $t('donaA') }}</span>
                        <br class="hidden-sm hidden-md hidden-lg" />
                        <small>{{ $t('proyectoDe') }}</small>
                        <img
                            width="90"
                            alt="STS Rosario"
                            :src="$publicImg('logo_sts_nuevo_color.png')"
                        />
                    </h3></template>
                    <template #body><div class="donation">
                        <DonationAmountPicker v-model="donateValue">
                            <label class="radio-inline">
                                <input
                                    type="radio"
                                    name="donationValor"
                                    id="donation-custom-monthly"
                                    value="50"
                                    v-model="donateValue"
                                />
                                <span>{{
                                    $t('elegirPropiaAventuraSoloMensual')
                                }}</span>
                            </label>
                        </DonationAmountPicker>
                        <div class="donation-actions">
                            <AppButton
                                class="donation-actions__btn"
                                variant="primary"
                                @click="onDonateMonthly"
                            >
                                <span class="donation-actions__label">
                                    {{ $t('MENSUAL') }}
                                </span>
                                <span class="donation-actions__hint">
                                    ({{ $t('cancelaCuando') }})
                                </span>
                            </AppButton>
                            <AppButton
                                class="donation-actions__btn"
                                variant="secondary"
                                @click="onDonateOnceTime"
                            >
                                {{ $t('unicaVez') }}
                            </AppButton>
                        </div>
                    </div></template>
                </modal>
                <modal
                    :name="'modal'"
                    v-if="showModalInstallApp && shouldShowInstallModal()"
                    @close="closeInstallModal()"
                    :title="'Test'"
                    :body="'Body'"
                >
                    <template #header><h3>
                        <span>{{ getInstallModalContent() && getInstallModalContent().title || $t('instalarApp') }}</span>
                    </h3></template>
                    <template #body><div class="">
                        <p style="white-space: pre-line;" v-html="getInstallModalContent() && getInstallModalContent().message || $t('instalarWebAppPWA')">
                        </p>
                        <div class="install-modal-actions">
                            <AppButton
                                v-if="getInstallModalContent() && getInstallModalContent().showInstallButton"
                                variant="primary"
                                @click="installApp()"
                            >
                                {{ $t('instalar') }}
                            </AppButton>
                            <AppButton
                                v-if="getInstallModalContent() && getInstallModalContent().showCloseButton"
                                variant="secondary"
                                @click="closeInstallModal()"
                            >
                                {{ $t('entendido') }}
                            </AppButton>
                            <AppButton
                                v-if="getInstallModalContent() && getInstallModalContent().showDontShowAgainButton"
                                variant="tertiary"
                                @click="dontShowAgainInstallModal()"
                            >
                                {{ $t('noMostrarDeNuevo') }}
                            </AppButton>
                        </div>
                    </div></template>
                </modal>
                <template v-if="user">
                    <div
                        v-if="showSplitDonationPanel"
                        class="panel panel-default panel-donar trips-donation-banner"
                    >
                        <div class="panel-body panel-donar__body">
                            <AppButton
                                class="btn-donar"
                                variant="header-donate"
                                @click="onDonate"
                            >
                                {{ $t('donar') }}
                                <template #iconRight>
                                    <img
                                        :src="$publicImg('gift.svg')"
                                        alt=""
                                        class="app-button__gift-icon"
                                    />
                                </template>
                            </AppButton>
                            <i18n-t
                                keypath="ayudanos"
                                tag="h2"
                                class="panel-donar__title"
                            >
                                <template #lead>
                                    <strong>{{ $t('ayudanosLead') }}</strong>
                                </template>
                                <template #open>
                                    <strong>{{ $t('ayudanosOpen') }}</strong>
                                </template>
                                <template #collab>
                                    <strong>{{ $t('ayudanosCollab') }}</strong>
                                </template>
                                <template #nonprofit>
                                    <strong>{{
                                        $t('ayudanosNonprofit')
                                    }}</strong>
                                </template>
                            </i18n-t>
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
                    <template v-if="showFriendTripSections">
                        <section
                            v-if="friendTripsList.length"
                            class="trips-section"
                        >
                            <h2 class="trips-section-heading">
                                {{ $t('viajesDeMisAmigos') }}
                            </h2>
                            <div
                                class="trips-section__list row"
                                :class="{
                                    'trips-section__list--start':
                                        friendTripsList.length < 4
                                }"
                            >
                                <template
                                    v-for="(trip, index) in friendTripsList"
                                    :key="'friend-' + (trip.id != null ? trip.id : index)"
                                >
                                    <div
                                        v-if="
                                            isComplementary(
                                                trip,
                                                searchParams,
                                                index
                                            )
                                        "
                                        class="col-xs-24"
                                    >
                                        <div class="trip-complementary">
                                            <h2>{{ $t('resultadosCercanos') }}</h2>
                                        </div>
                                    </div>
                                    <Trip :trip="trip" :user="user"></Trip>
                                </template>
                            </div>
                        </section>
                        <section
                            v-if="otherTripsList.length"
                            class="trips-section"
                        >
                            <h2 class="trips-section-heading">
                                {{ $t('viajesPublicados') }}
                            </h2>
                            <div
                                class="trips-section__list row"
                                :class="{
                                    'trips-section__list--start':
                                        otherTripsList.length < 4
                                }"
                            >
                                <template
                                    v-for="(trip, index) in otherTripsList"
                                    :key="'other-' + (trip.id != null ? trip.id : index)"
                                >
                                    <div
                                        v-if="
                                            isComplementary(
                                                trip,
                                                searchParams,
                                                friendTripsList.length + index
                                            )
                                        "
                                        class="col-xs-24"
                                    >
                                        <div class="trip-complementary">
                                            <h2>{{ $t('resultadosCercanos') }}</h2>
                                        </div>
                                    </div>
                                    <Trip :trip="trip" :user="user"></Trip>
                                </template>
                            </div>
                        </section>
                    </template>
                    <div
                        v-else-if="otherTripsList.length"
                        class="trips-section__list row"
                        :class="{
                            'trips-section__list--start':
                                otherTripsList.length < 4
                        }"
                    >
                        <template
                            v-for="(trip, index) in otherTripsList"
                            :key="'flat-' + (trip.id != null ? trip.id : index)"
                        >
                            <div
                                v-if="
                                    isComplementary(trip, searchParams, index)
                                "
                                class="col-xs-24"
                            >
                                <div class="trip-complementary">
                                    <h2>{{ $t('resultadosCercanos') }}</h2>
                                </div>
                            </div>
                            <Trip :trip="trip" :user="user"></Trip>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="trips-section__list row"
                        :class="{
                            'trips-section__list--start': trips.length < 4
                        }"
                    >
                    <template
                        v-for="(trip, index) in trips"
                        :key="trip.id != null ? trip.id : index"
                    >
                        <template
                            v-if="
                                isDonationTime() &&
                                (!user || !user.monthly_donate) &&
                                !shouldHideDonationOnIOSCapacitor(user)
                            "
                        >
                            <div
                                class="col-xs-24"
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
                            <div
                                class="panel panel-default panel-donar"
                            >
                                <div class="panel-body panel-donar__body">
                                    <AppButton
                                        class="btn-donar"
                                        variant="header-donate"
                                        @click="onDonate"
                                    >
                                        {{ $t('donar') }}
                                        <template #iconRight>
                                            <img
                                                :src="$publicImg('gift.svg')"
                                                alt=""
                                                class="app-button__gift-icon"
                                            />
                                        </template>
                                    </AppButton>
                                    <i18n-t
                                        keypath="ayudanos"
                                        tag="h2"
                                        class="panel-donar__title"
                                    >
                                        <template #lead>
                                            <strong>{{
                                                $t('ayudanosLead')
                                            }}</strong>
                                        </template>
                                        <template #open>
                                            <strong>{{
                                                $t('ayudanosOpen')
                                            }}</strong>
                                        </template>
                                        <template #collab>
                                            <strong>{{
                                                $t('ayudanosCollab')
                                            }}</strong>
                                        </template>
                                        <template #nonprofit>
                                            <strong>{{
                                                $t('ayudanosNonprofit')
                                            }}</strong>
                                        </template>
                                    </i18n-t>
                                    <a
                                        href="/donar"
                                        target="_blank"
                                        v-on:click.prevent="
                                            onOpenLink(
                                                'https://carpoolear.com.ar/donar'
                                            )
                                        "
                                    >
                                        {{ $t('porQueDonar') }}
                                    </a>
                                </div>
                            </div>
                            </div>
                        </template>
                        <template
                            v-if="isComplementary(trip, searchParams, index)"
                        >
                            <div class="col-xs-24">
                                <div class="trip-complementary">
                                    <h2>{{ $t('resultadosCercanos') }}</h2>
                                </div>
                            </div>
                        </template>
                        <Trip :trip="trip" :user="user"></Trip>
                    </template>
                    </div>
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
                        <AppButton
                            variant="secondary"
                            v-if="user"
                            @click="subscribeSearch"
                        >
                            {{ $t('crearAlerta') }}
                        </AppButton>
                    </span>
                </p>
            </div>
            <div v-if="runningSearch" class="more-trips-loading">
                <img
                    :src="$publicImg('loader.gif')"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoMasResultados') }}
            </div>
            <template #no-data><p
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
                        <AppButton
                            variant="secondary"
                            v-if="user"
                            @click="subscribeSearch"
                        >
                            {{ $t('crearAlerta') }}
                        </AppButton>
                    </span>
                </template>
                <template v-else>
                    <span class="sentence">{{
                        $t('noHayViajesCargadosAun')
                    }}</span>
                </template>
            </p></template>
            <template #loading><p class="alert alert-info" role="alert">
                <img
                    :src="$publicImg('loader.gif')"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoViajes') }}
            </p></template>
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

.mobile-alert .btn,
.mobile-alert .app-button {
    margin: 0 auto;
    display: block;
}
</style>
<script>
import Trip from '../sections/Trip.vue';
import OngoingTripCard from '../elements/OngoingTripCard.vue';
import TripCreationDraftCard from '../elements/TripCreationDraftCard.vue';
import PendingFriendRequestsCard from '../elements/PendingFriendRequestsCard.vue';
import SearchBox from '../sections/SearchTrip.vue';
import Loading from '../Loading.vue';
import bus from '../../services/bus-event.js';
import { mapState, mapActions } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useMyTripsStore } from '../../stores/myTrips';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import { useSubscriptionsStore } from '../../stores/subscriptions';
import { useProfileStore } from '../../stores/profile';
import { useFriendsStore } from '../../stores/friends';
import dayjs from '../../dayjs';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import push from '../../cordova/push-capacitor.js';
import modal from '../Modal';
import DonationAmountPicker from '../elements/DonationAmountPicker.vue';
import {
    appendDonationTrackingUserId,
    getDonationMonthlyUrl,
    getDonationOnceUrl
} from '../../utils/donationOptions.js';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import {
    isIOSCapacitor,
    shouldHideDonationOnIOSCapacitor
} from '../../services/capacitor.js';
import {
    shouldShowAppBanner,
    resolveAppBannerAsset
} from '../../utils/appBanner.js';
import { resolveCapacitorBundledHostUrl } from '../../utils/capacitorRemoteUrl.js';
import {
    isNativePlatform,
    isPWA,
    getNotificationPermissionStatus,
    requestNotificationPermission as requestPermissionStatus
} from '../../utils/notificationPermission.js';
import { splitFriendTrips } from '../../utils/splitFriendTrips.js';
import { shouldShowSplitDonationPanel } from '../../utils/tripsSplitDonationBanner.js';
import { readAllowPreferenceParamsFromQuery } from '../../utils/searchAdvancedFilters.js';
import AppButton from '../ui/AppButton.vue';
import { useActionbarsStore } from '../../stores/actionbars';

export default {
    name: 'trips',
    data() {
        return {
            lookSearch: false,
            filtered: false,
            runningSearch: false,
            alreadySubscribe: false,
            resultaOfSearch: false,
            pendingScrollRestore: null,
            showModal: false,
            showModalInstallApp: false,
            installAppEvent: null,
            donateValue: 0,
            hasNotificationPermission: false,
            showNotificationWarning: true,
            pasajeroSearchIcon:
                process.env.ROUTE_BASE + 'img/icono-pasajero-gris.png'
        };
    },
    props: ['clearSearch', 'keepSearch'],
    beforeMount() {
        // SearchTrip mounts after this hook and runs loadParams(searchParams). If the store still
        // holds a previous narrow search, trips_auto_search watchers emit() and overwrite the
        // default trip list with a 0-result search. Reset the store before the child reads it.
        if (!this.clearSearch && !this.keepSearch && !this.hasRouteSearchParams()) {
            this.search({ is_passenger: false });
        }
    },
    methods: {
        ...mapActions(useTripsStore, {
            search: 'tripsSearch',
            refreshTrips: 'refreshListAction',
            setScrollOffset: 'setScrollOffset'
            // morePagesActions: 'tripMorePage',
        }),
        ...mapActions(useSubscriptionsStore, {
            subscribeToSearch: 'create',
            findSubscriptions: 'index'
        }),
        ...mapActions(useProfileStore, {
            registerDonation: 'registerDonation'
        }),
        ...mapActions(useMyTripsStore, {
            fetchOngoingTrip: 'fetchOngoingTrip'
        }),
        ...mapActions(useFriendsStore, {
            fetchPendingFriends: 'pending'
        }),
        refreshTripCreationDraftCard() {
            this.$refs.tripCreationDraftCard?.refresh?.();
        },
        // setActionButton: 'actionbars/setHeaderButtons'
        isInternalBannerUrl(url) {
            return typeof url === 'string' && url.trim().startsWith('/');
        },
        onBannerClick() {
            const url = this.bannerHref;
            if (!url || typeof url !== 'string' || url === '#') return;
            const normalized = url.trim();
            if (!normalized) return;
            if (this.isInternalBannerUrl(normalized)) {
                this.$router.push(normalized);
                return;
            }
            window.open(normalized, '_blank');
        },
        isIOS() {
            return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
        },
        isSafari() {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) && !/chrome/.test(userAgent);
        },
        isNativePlatform,
        async checkNotificationPermission() {
            const status = await getNotificationPermissionStatus();
            if (status === 'granted') {
                this.hasNotificationPermission = true;
                this.showNotificationWarning = false;
            } else if (status === 'unsupported') {
                this.showNotificationWarning = false;
            } else {
                this.hasNotificationPermission = false;
                const dismissedAt = parseInt(localStorage.getItem('pwa_notification_dismiss'));
                this.showNotificationWarning = !dismissedAt || Date.now() - dismissedAt > 14 * 24 * 3600 * 1000;
            }
        },
        async requestNotificationPermission() {
            const permission = await requestPermissionStatus();
            if (permission === 'granted') {
                this.hasNotificationPermission = true;
                this.showNotificationWarning = false;
                try {
                    push.init();
                } catch (error) {
                    console.log(
                        'Error initializing push notifications:',
                        error
                    );
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
        },
        dismissNotificationWarning() {
            this.showNotificationWarning = false;
            localStorage.setItem('pwa_notification_dismiss', Date.now());
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
                    dayjs().date() <
                    parseFloat(this.appConfig.donation.month_days)
                );
            } else {
                return false;
            }
        },
        shouldHideDonationOnIOSCapacitor(user) {
            return shouldHideDonationOnIOSCapacitor(user);
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
            this.setMobileSearchHeader(false);
            this.filtered = true;
            this.readySub = false;
            this.alreadySubscribe = false;
            this.search(params);
            this.findSubscriptions();
            this.updateTripsQuery(params);
            // this.setActionButton(['clear']);
        },
        nextPage() {
            this.search({ next: true });
        },
        onTripClick() {
            let scrolloffset = window.scrollY;
            this.setScrollOffset(scrolloffset);
            this.updateTripsQuery(this.searchParams.data, scrolloffset);
        },
        hasRouteSearchParams() {
            const query = this.getRouteQuery();
            return Object.keys(query).some((key) => key !== 'scroll' && key !== 'clearSearch' && key !== 'keepSearch');
        },
        getRouteQuery() {
            return this.$route && this.$route.query ? this.$route.query : {};
        },
        getSearchParamsFromQuery() {
            const query = this.getRouteQuery();
            const params = {};
            const textFields = ['origin_name', 'destination_name', 'date'];
            textFields.forEach((field) => {
                if (typeof query[field] === 'string' && query[field].trim()) {
                    params[field] = query[field];
                }
            });
            const numericFields = [
                'origin_lat',
                'origin_lng',
                'origin_radio',
                'origin_id',
                'destination_lat',
                'destination_lng',
                'destination_radio',
                'destination_id'
            ];
            numericFields.forEach((field) => {
                const parsed = this.parseNumericQueryValue(query[field]);
                if (parsed !== null) {
                    params[field] = parsed;
                }
            });
            if (this.parseBooleanQueryValue(query.is_passenger)) {
                params.is_passenger = true;
            }
            if (this.parseBooleanQueryValue(query.hide_carpooleado)) {
                params.hide_carpooleado = true;
            }
            Object.assign(
                params,
                readAllowPreferenceParamsFromQuery(query, (value) =>
                    this.parseBooleanQueryValue(value)
                )
            );
            return params;
        },
        parseNumericQueryValue(value) {
            if (value === undefined || value === null || value === '') {
                return null;
            }
            const parsed = Number.parseFloat(value);
            return Number.isNaN(parsed) ? null : parsed;
        },
        parseBooleanQueryValue(value) {
            return value === 'true' || value === '1' || value === true;
        },
        updateTripsQuery(params = {}, scroll) {
            const nextQuery = {};
            const source = params || {};
            Object.keys(source).forEach((key) => {
                if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
                    nextQuery[key] = source[key];
                }
            });
            if (scroll !== undefined && scroll !== null) {
                nextQuery.scroll = Math.max(0, Math.floor(scroll));
            }
            this.$router.replace({
                name: 'trips',
                query: nextQuery
            });
        },
        maybeRestoreScroll() {
            if (this.pendingScrollRestore === null || this.pendingScrollRestore === undefined) {
                return;
            }
            this.$nextTick(() => {
                this.$nextTick(() => {
                    window.scrollTo(0, this.pendingScrollRestore);
                    this.pendingScrollRestore = null;
                });
            });
        },
        isComplementary(trip, searchParams, index) {
            let isComplementary = false;
            if (searchParams.data && searchParams.data.date) {
                var searchDate = dayjs(searchParams.data.date).toDate();
                var tripDate = dayjs(trip.trip_date).toDate();
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
            this.openMobileSearch(false);
        },

        openMobileSearch(isPassenger) {
            this.lookSearch = true;
            this.$nextTick(() => {
                if (this.$refs.searchBox) {
                    this.$refs.searchBox.setPassengerMode(isPassenger);
                }
            });
            this.setMobileSearchHeader(true);
            bus.on('backbutton', this.onBackBottom);
        },

        setMobileSearchHeader(active) {
            if (!this.isMobile) {
                return;
            }
            const actionbarsStore = useActionbarsStore();
            if (active) {
                actionbarsStore.setTitle(this.$t('buscoTitulo'));
                actionbarsStore.setHeaderButtons(['back']);
                actionbarsStore.showHeaderLogo(false);
                bus.off('back-click', this.onMobileSearchBack);
                bus.on('back-click', this.onMobileSearchBack);
                return;
            }
            actionbarsStore.setHeaderButtons(['search']);
            actionbarsStore.showHeaderLogo(true);
            let appName = import.meta.env.VITE_TARGET_APP || 'Carpoolear';
            const config = this.appConfig;
            if (config) {
                appName = config.app_name ? config.app_name : config.name_app;
            }
            if (appName && appName.length) {
                appName = appName.charAt(0).toUpperCase() + appName.slice(1);
            }
            actionbarsStore.setTitle(appName);
            bus.off('back-click', this.onMobileSearchBack);
        },

        onMobileSearchBack() {
            this.onBackBottom();
        },

        onClearButton() {
            bus.off('backbutton', this.onBackBottom);
            bus.on('scroll-bottom', this.onScrollBottom);
            // this.setActionButton(['search']);
            this.filtered = false;
            this.lookSearch = false;
            this.setMobileSearchHeader(false);
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
            this.setMobileSearchHeader(false);
            this.alreadySubscribe = false;
        },
        async onDonate() {
            // if we're in Capacitor iOS, do not show the modal, just open the link in the browser
            if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
                let url = 'https://carpoolear.com.ar/donar';
                if (this.user && this.user.id) {
                    url = `${url}?u=${this.user.id}`;
                }
                await this.openExternalBrowser(url);
                return;
            }
            this.showModal = true;
        },
        async openExternalBrowser(url) {
            // On iOS Capacitor, use App.openUrl() to open in external browser (Safari)
            // This makes the user leave the app, which is required for donations
            if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
                try {
                    await App.openUrl({ url });
                } catch (error) {
                    console.error('Error opening URL in external browser:', error);
                    // Fallback to window.open if App.openUrl fails
                    window.open(url, '_blank');
                }
            } else {
                // For web or Android, use window.open
                window.open(url, '_blank');
            }
        },
        onOpenLink(link) {
            this.openExternalBrowser(link);
        },
        async onDonateOnceTime() {
            if (this.donateValue > 0) {
                let url = getDonationOnceUrl(this.donateValue);
                url = appendDonationTrackingUserId(
                    url,
                    this.user && this.user.id
                );
                // Open in external browser (required for iOS donations)
                await this.openExternalBrowser(url);
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
        async onDonateMonthly() {
            if (this.donateValue >= 0) {
                let url = getDonationMonthlyUrl(this.donateValue);
                url = appendDonationTrackingUserId(
                    url,
                    this.user && this.user.id
                );
                // Open in external browser (required for iOS donations)
                await this.openExternalBrowser(url);
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
    },
    mounted() {
        // Clear search
        if (this.clearSearch) {
            this.onClearButton();
        } else if (this.keepSearch) {
            if (this.$refs.searchBox) {
                this.$refs.searchBox.loadParams(this.searchParams.data);
            }
            this.search(this.searchParams.data);
        } else {
            if (this.$refs.searchBox) {
                this.$refs.searchBox.clear();
            }
        }

        const queryParams = this.getSearchParamsFromQuery();
        if (Object.keys(queryParams).length) {
            this.resultaOfSearch = true;
            this.filtered = true;
            if (this.$refs.searchBox) {
                this.$refs.searchBox.loadParams(queryParams);
            }
            this.search(queryParams);
        }
        this.pendingScrollRestore = Number.parseInt(this.getRouteQuery().scroll, 10);
        if (Number.isNaN(this.pendingScrollRestore)) {
            this.pendingScrollRestore = null;
        }

        if (this.user && this.notificationsEnabledForPlatform) {
            this.checkNotificationPermission();
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

        if (this.user) {
            this.fetchOngoingTrip();
            this.fetchPendingFriends();
        }

        this.refreshTripCreationDraftCard();
    },
    activated() {
        this.refreshTripCreationDraftCard();
    },
    updated(a) {
        // {{ $t('pendienteNoSeLimpiaBuscador') }}
    },
    beforeUnmount() {
        bus.off('search-click', this.onSearchButton);
        bus.off('clear-click', this.onClearButton);
        bus.off('scroll-bottom', this.onScrollBottom);
        bus.off('backbutton', this.onBackBottom);
    },
    watch: {
        '$route.name'(name) {
            if (name === 'trips') {
                this.refreshTripCreationDraftCard();
            }
        },
        user(value) {
            if (value) {
                this.fetchOngoingTrip();
                this.fetchPendingFriends();
            }
        },
        trips: {
            deep: true,
            handler() {
                this.maybeRestoreScroll();
                if (this.refreshList) {
                    this.refreshTrips(false);
                    this.lookSearch = false;
                    this.resultaOfSearch = false;
                    this.$refs.searchBox.clear();
                }
            }
        }
    },
    computed: {
        ...mapState(useTripsStore, {
            trips: 'trips',
            morePages: 'tripsMorePage',
            searchParams: 'tripsSearchParam',
            refreshList: 'refreshList',
            scrollPosition: 'scrollOffset'
        }),
        ...mapState(useAuthStore, {
            user: 'user',
            appConfig: 'appConfig'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile',
            isBrowser: 'isBrowser'
        }),
        ...mapState(useSubscriptionsStore, {
            subscriptions: 'subscriptions'
        }),
        ...mapState(useMyTripsStore, {
            ongoingTrip: 'ongoingTrip'
        }),

        notificationsEnabledForPlatform() {
            if (isNativePlatform()) {
                return true;
            }
            if (!isPWA()) {
                // Plain web browser: only the /notifications view prompts.
                return false;
            }
            return Boolean(this.appConfig && this.appConfig.web_push_notification);
        },

        showingTrips() {
            return !this.isMobile || !this.lookSearch;
        },
        isIOSCapacitor() {
            return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
        },
        showAppBanner() {
            const banner = this.appConfig && this.appConfig.banner;
            return shouldShowAppBanner(banner, this.user);
        },
        appBannerAsset() {
            const banner = this.appConfig && this.appConfig.banner;
            return resolveAppBannerAsset(banner, this.isMobile);
        },
        bannerImageSrc() {
            const image = this.appBannerAsset && this.appBannerAsset.image;
            return resolveCapacitorBundledHostUrl(image);
        },
        bannerHref() {
            const url = this.appBannerAsset && this.appBannerAsset.url;
            return typeof url === 'string' ? url : '#';
        },
        bannerTarget() {
            return this.isInternalBannerUrl(this.bannerHref) ? null : '_blank';
        },
        friendTripsList() {
            if (!this.user) {
                return [];
            }
            return splitFriendTrips(this.trips).friendTrips;
        },
        otherTripsList() {
            if (!this.user) {
                return [];
            }
            return splitFriendTrips(this.trips).otherTrips;
        },
        showFriendTripSections() {
            return this.friendTripsList.length > 0;
        },
        showSplitDonationPanel() {
            return shouldShowSplitDonationPanel({
                isDonationTime: this.isDonationTime(),
                user: this.user,
                hideOnIos: this.shouldHideDonationOnIOSCapacitor(this.user),
                friendTripsCount: this.friendTripsList.length,
                otherTripsCount: this.otherTripsList.length,
                tripsOffset: this.appConfig.donation.trips_offset,
                tripsCount: this.appConfig.donation.trips_count
            });
        }
    },
    components: {
        Trip,
        OngoingTripCard,
        TripCreationDraftCard,
        PendingFriendRequestsCard,
        Loading,
        SearchBox,
        modal,
        AppButton,
        DonationAmountPicker
    }
};
</script>
<style scoped>
.banner {
    display: block;
    margin: 0 auto 1em;
    text-align: center;
}

.banner img {
    border: 1px solid #999;
    width: 100%;
    max-width: 934px;
}

.donation-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
}

.donation-actions__btn {
    width: 100%;
    min-height: 4.5rem;
    flex-direction: column;
    gap: 0.25rem;
    white-space: normal;
    text-align: center;
}

.donation-actions__btn.app-button--secondary {
    min-height: 0;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
}

.donation-actions__btn :deep(.app-button__label) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    line-height: 1.25;
}

.donation-actions__label {
    display: block;
}

.donation-actions__hint {
    display: block;
    font-size: 0.85em;
    font-weight: var(--ds-font-weight-normal, 400);
    line-height: 1.2;
}

@media (min-width: 768px) {
    .donation-actions {
        flex-direction: row;
    }

    .donation-actions__btn {
        flex: 1 1 0;
        width: auto;
    }
}

.btn-donar {
    float: right;
    margin: 0 0 0.5rem 0.75rem;
}

.panel.panel-donar {
    border: none;
    border-radius: var(--ds-card-radius);
    background: var(--ds-card-bg);
    box-shadow: var(--ds-card-shadow);
    overflow: hidden;
    margin-bottom: 0;
}

.panel-donar > .panel-body.panel-donar__body {
    display: block;
    overflow: visible;
    padding: 1.25rem 1.25rem 1.25rem 1.5rem;
}

.panel-donar > .panel-body.panel-donar__body::after {
    content: '';
    display: block;
    clear: both;
}

.panel.panel-default.panel-donar h2.panel-donar__title,
.panel.panel-default.panel-donar .panel-donar__title {
    margin: 0 0 0.75rem;
    font-weight: var(--ds-font-weight-normal, 400);
    font-size: 1.25rem;
    line-height: 1.35;
    color: var(--ds-action, #1e5f9e);
}

.panel.panel-default.panel-donar .panel-donar__title :deep(strong),
.panel.panel-default.panel-donar .panel-donar__title strong {
    font-weight: var(--ds-font-weight-bold, 700);
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

.install-modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
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

.trips-section {
    display: block;
    width: 100%;
    clear: both;
}

.trips-section-heading {
    display: block;
    width: 100%;
    margin: 0 0 1rem;
}

.trips-section__list {
    width: 100%;
    margin: 0 0 1.5rem;
}

.trips-donation-banner {
    width: 100%;
    margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
    .trips-donation-banner {
        margin-bottom: 0;
    }
}
</style>
