<template>
    <header class="header header-component">
        <div class="actionbar actionbar-top visible-xs">
            <div class="actionbar_section actionbar_icon">
                <span v-if="showLogo">
                    <router-link
                        :to="{ name: 'trips', params: { clearSearch: true } }"
                        @click="tripsClick"
                    >
                        <img :src="app_logo" />
                    </router-link>
                </span>
                <template
                    v-for="item in leftHeaderButton"
                >
                    <span v-if="item.show" @click="onClick(item)" :key="item.id">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
            <div
                class="actionbar_section actionbar_title"
                :class="subTitle !== '' ? 'header--with-subtitle' : ''"
            >
                <div
                    class="header--image circle-box"
                    v-imgSrc="imgTitle"
                    v-show="imgTitle"
                ></div>
                <span v-if="!titleLink.name" class="header--title">{{
                    title
                }}</span>
                <router-link
                    v-if="titleLink.name"
                    :to="{ name: titleLink.name, params: titleLink.params }"
                    class="header--title"
                >
                    <span>{{ title }}</span>
                </router-link>
                <span class="header--subtitle">{{ subTitle }}</span>
            </div>
            <div class="actionbar_section actionbar_icon pull-right">
                <template v-for="item in rightHeaderButton">
                    <span v-if="item.show" @click="onClick(item)" :key="item.id">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
                <div class="dropdown-right" v-if="showMenu || isMobile">
                    <div class="dropdown">
                        <button class="btn btn-link dropdown-toggle" type="button" @click="toggleMobileMenu">
                            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </button>
                        <ul class="dropdown-menu" :class="{ show: mobileMenuOpen }" v-if="mobileMenuOpen">
                            <li>
                                <router-link :to="{ name: 'acerca_de' }" @click="mobileMenuOpen = false">
                                    {{ t('acercaDe') }}
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{ name: 'terms' }" @click="mobileMenuOpen = false">
                                    {{ t('tyc') }}
                                </router-link>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li>
                                <a @click="setLocale('arg'); mobileMenuOpen = false">Espanol</a>
                            </li>
                            <li>
                                <a @click="setLocale('en'); mobileMenuOpen = false">English</a>
                            </li>
                            <li
                                v-if="user"
                                role="separator"
                                class="divider"
                            ></li>
                            <li v-if="user">
                                <a @click="logout(); mobileMenuOpen = false" v-if="!isFacebokApp">{{
                                    t('cerrarSesion')
                                }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                class="actionbar_section actionbar_icon pull-right"
                v-if="isMobile && user && !shouldHideDonationOnIOSCapacitorFn(user)"
            >
                <a
                    href="/donar"
                    class="btn btn-primary btn-donar-header btn-header-small btn-lg"
                >
                    {{ t('donar') }}
                </a>
            </div>
            <div
                class="actionbar_section actionbar_icon pull-right"
                v-if="isMobile && !user"
            >
                <router-link
                    v-if="isTripsPage"
                    :to="{ name: 'login' }"
                    class="btn btn-primary btn-login-header btn-header-small btn-lg"
                >
                    Ingresar
                </router-link>
            </div>
        </div>
        <div class="header_content hidden-xs">
            <router-link
                :to="{ name: 'trips', params: { clearSearch: true } }"
                @click="tripsClick"
            >
                <div class="header_panel-left" v-if="logoHeaderVisibility">
                    <img
                        :src="background_desktop_mini"
                        v-if="
                            isNotLargeDesktop ||
                            (config && config.trip_card_design === 'light')
                        "
                    />
                    <img
                        :src="background_desktop"
                        v-if="
                            !isNotLargeDesktop &&
                            config &&
                            config.trip_card_design !== 'light'
                        "
                    />
                    <img :src="app_logo" />
                </div>
            </router-link>
            <div class="header_panel-right">
                <modal
                    :name="'modal'"
                    v-if="showModal"
                    @close="showModal = false"
                    :title="'Test'"
                    :body="'Body'"
                >
                    <template #header><h3>{{ t('invitarAmigos') }}</h3></template>
                    <template #body>
                        <div class="social-share">
                            <a
                                :href="'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl"
                                target="_blank"
                                aria-label="Compartir en Facebook"
                                class="lnk lnk-social-network lnk-facebook"
                            >
                                <i class="fa fa-facebook" aria-hidden="true"></i>
                            </a>
                            <a
                                :href="'https://twitter.com/intent/tweet/?text=' + encodeURIComponent(t('compartirPlataforma')) + '&url=' + shareUrl + '&via=' + config.name_app.toLowerCase() + '&hashtags=carpooling'"
                                target="_blank"
                                aria-label="Compartir en Twitter"
                                class="lnk lnk-social-network lnk-twitter"
                            >
                                <i class="fa fa-twitter" aria-hidden="true"></i>
                            </a>
                            <a
                                :href="'whatsapp://send?text=' + encodeURIComponent(t('compartirPlataforma')) + '%20' + shareUrl"
                                target="_blank"
                                aria-label="Compartir en Whats App"
                                class="lnk lnk-social-network lnk-whatsapp"
                                v-if="isMobile"
                            >
                                <i class="fa fa-whatsapp" aria-hidden="true"></i>
                            </a>
                        </div>
                    </template>
                </modal>
                <button
                    v-if="config.trip_card_design !== 'light'"
                    @click="share"
                    type="button"
                    class="btn btn-link"
                >
                    {{ t('invitarAmigos') }}
                </button>
                <router-link
                    v-if="config.trip_card_design !== 'light'"
                    class="btn btn-link trips-link"
                    :to="{ name: 'trips', params: { clearSearch: true } }"
                >
                    {{ t('viajes') }}
                </router-link>
                <div class="dropdown" v-if="!logged" style="display: inline-block">
                    <button class="btn btn-link dropdown-toggle" type="button" @click="toggleLocaleMenu">
                        {{ currentLocaleShortLabel }}
                    </button>
                    <ul class="dropdown-menu" :class="{ show: localeMenuOpen }" v-if="localeMenuOpen">
                        <li>
                            <a @click="setLocale('arg'); localeMenuOpen = false">Espanol</a>
                        </li>
                        <li>
                            <a @click="setLocale('en'); localeMenuOpen = false">English</a>
                        </li>
                    </ul>
                </div>
                <router-link
                    class="btn btn-primary btn-lg"
                    v-if="!logged"
                    :to="{ name: 'login' }"
                >
                    {{ t('inicio') }}
                </router-link>

                <span
                    class="header_notifications"
                    @click="toNotifications"
                    v-if="logged"
                >
                    <span class="fa-container">
                        <i class="fa fa-bell background" aria-hidden="true"></i>
                        <i
                            :style="
                                notificationsCount > 0 ? 'color: white' : ''
                            "
                            class="fa fa-bell"
                            aria-hidden="true"
                        ></i>
                    </span>
                    <span class="badge" v-if="notificationsCount > 0">
                        {{ notificationsCount }}
                    </span>
                </span>

                <div class="header_profile" v-if="user">
                    <span>{{ user.name }}</span>
                    <div class="dropdown" v-if="logged" style="display: inline-block">
                        <button class="btn btn-link dropdown-toggle" type="button" @click="toggleProfileMenu">
                            <div
                                class="circle-box header_profile_image"
                                v-imgSrc:profile="user.image"
                            ></div>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right" :class="{ show: profileMenuOpen }" v-if="profileMenuOpen">
                            <li>
                                <router-link :to="{ name: 'my-trips' }" @click="profileMenuOpen = false">
                                    {{ t('misViajes') }}
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{ name: 'conversations-list' }" @click="profileMenuOpen = false">
                                    {{ t('mensajes') }}
                                </router-link>
                            </li>
                            <li>
                                <router-link
                                    :to="{ name: 'profile', params: { id: 'me' } }"
                                    @click="profileMenuOpen = false"
                                >
                                    {{ t('perfil') }}
                                </router-link>
                            </li>
                            <li v-if="user.is_admin">
                                <router-link :to="{ name: 'admin-page' }" @click="profileMenuOpen = false">
                                    {{ t('administracion') }}
                                </router-link>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li>
                                <a @click="setLocale('arg'); profileMenuOpen = false">Espanol</a>
                            </li>
                            <li>
                                <a @click="setLocale('en'); profileMenuOpen = false">English</a>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li>
                                <a @click="logout(); profileMenuOpen = false" v-if="!isFacebokApp">{{
                                    t('cerrarSesion')
                                }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <a
                    v-if="!shouldHideDonationOnIOSCapacitorFn(user)"
                    href="/donar"
                    class="btn btn-primary btn-donar-header btn-lg"
                    >{{ t('donar') }}</a
                >
                <router-link
                    v-if="logged"
                    :to="{ name: 'new-trip' }"
                    id="btn-create-trip"
                    class="btn btn-primary btn-lg"
                >
                    {{ t('crearViaje') }}
                </router-link>
            </div>
            <div class="cf"></div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { useActionbarsStore } from '@/stores/actionbars';
import { useDeviceStore } from '@/stores/device';
import { useTripsStore } from '@/stores/trips';
import bus from '../../services/bus-event.js';
import modal from '../Modal';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const actionbarsStore = useActionbarsStore();
const deviceStore = useDeviceStore();
const tripsStore = useTripsStore();

const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';
const TARGET_APP = import.meta.env.VITE_TARGET_APP || 'carpoolear';
const WEB_URL = import.meta.env.VITE_WEB_URL || 'https://carpoolear.com.ar';

const background_desktop_mini = ROUTE_BASE + 'static/img/' + TARGET_APP + '_background_desktop_mini.png';
const background_desktop = ROUTE_BASE + 'static/img/' + TARGET_APP + '_background_desktop.png';
const app_logo = ROUTE_BASE + 'static/img/' + TARGET_APP + '_logo.png';
const showModal = ref(false);
const shareUrl = encodeURIComponent(new URL(WEB_URL).origin);

const mobileMenuOpen = ref(false);
const localeMenuOpen = ref(false);
const profileMenuOpen = ref(false);

const logged = computed(() => authStore.checkLogin);
const user = computed(() => authStore.user);
const notificationsCount = computed(() => notificationsStore.count);
const title = computed(() => actionbarsStore.title);
const titleLink = computed(() => actionbarsStore.titleLink);
const subTitle = computed(() => actionbarsStore.subTitle);
const imgTitle = computed(() => actionbarsStore.imgTitle);
const showMenu = computed(() => actionbarsStore.showMenu);
const leftHeaderButton = computed(() => actionbarsStore.leftHeaderButton);
const rightHeaderButton = computed(() => actionbarsStore.rightHeaderButton);
const logoHeaderVisibility = computed(() => actionbarsStore.headerLogoVisibility);
const isNotLargeDesktop = computed(() => deviceStore.isNotLargeDesktop);
const isFacebokApp = computed(() => deviceStore.isFacebokApp);
const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);

const showLogo = computed(() => {
    for (let i = 0; i < leftHeaderButton.value.length; i++) {
        if (leftHeaderButton.value[i].show) {
            return false;
        }
    }
    return true;
});

const isTripsPage = computed(() => {
    return route.name === 'trips';
});

const currentLocaleLabel = computed(() => {
    const labels = { arg: 'Espanol', en: 'English' };
    return labels[locale.value] || 'Espanol';
});

const currentLocaleShortLabel = computed(() => {
    const short = { arg: 'ES', en: 'EN' };
    return short[locale.value] || 'ES';
});

function shouldHideDonationOnIOSCapacitorFn(u) {
    return shouldHideDonationOnIOSCapacitor(u);
}

function share() {
    showModal.value = true;
}

function logout() {
    authStore.logout();
}

function toNotifications() {
    router.push({ name: 'notifications' });
}

function onClick(item) {
    bus.emit(item.id + '-click');
}

function tripsClick() {
    tripsStore.refreshList(true);
    tripsStore.tripsSearch({ is_passenger: false });
}

function onHeaderChange() {
    // console.log('header-change', title.value);
}

function setLocale(loc) {
    locale.value = loc;
    localStorage.setItem('app_locale', loc);
}

function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    localeMenuOpen.value = false;
    profileMenuOpen.value = false;
}

function toggleLocaleMenu() {
    localeMenuOpen.value = !localeMenuOpen.value;
    mobileMenuOpen.value = false;
    profileMenuOpen.value = false;
}

function toggleProfileMenu() {
    profileMenuOpen.value = !profileMenuOpen.value;
    mobileMenuOpen.value = false;
    localeMenuOpen.value = false;
}

watch(title, (_new, _old) => {
    console.log('title change', title.value);
});

onMounted(() => {
    bus.on('header-title-change', onHeaderChange);
    console.log('app_logo', app_logo);
    console.log('ROUTE_BASE', ROUTE_BASE);
});

onBeforeUnmount(() => {
    bus.off('header-title-change', onHeaderChange);
});
</script>

<style scoped>
.trips-link {
    font-weight: bold;
}
.actionbar_icon img {
    margin-bottom: 2px;
    width: 26px;
    margin-left: 0.3em;
}
.header_panel-right {
    min-width: 50%;
    text-align: right;
}
@media (max-width: 1050px) {
    .header_panel-right {
        min-width: 70%;
    }
}
.dropdown {
    position: relative;
    display: inline-block;
}
.dropdown-menu.show {
    display: block;
}
.dropdown-menu {
    position: absolute;
    right: 0;
    z-index: 1000;
}
</style>
