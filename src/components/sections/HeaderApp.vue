<template>
    <header class="header header-component">
        <IdentityValidationCountdownBanner />
        <div
            class="actionbar actionbar-top visible-xs"
            :class="{ 'actionbar-top--with-ratings': headerRatings }"
        >
            <div class="actionbar_section actionbar_icon">
                <span v-if="showLogo">
                    <router-link
                        :to="{ name: 'trips', query: { clearSearch: 'true' } }"
                        v-on:click.native="tripsClick"
                    >
                        <img :src="app_logo" />
                    </router-link>
                </span>
                <template
                    v-else
                    v-for="item in leftHeaderButton"
                    :key="item.id"
                >
                    <span v-if="item.show" @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
            <div
                class="actionbar_section actionbar_title"
                :class="[
                    subTitle !== '' ? 'header--with-subtitle' : '',
                    headerRatings ? 'header--with-ratings' : '',
                    actionbarTitleWidthClass
                ]"
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
                <UserRatingsCounts
                    v-if="headerRatings"
                    :ratings="headerRatings"
                    class="header--ratings"
                />
            </div>
            <div class="actionbar_section actionbar_icon pull-right">
                <template v-for="item in rightHeaderButton" :key="item.id">
                    <span v-if="item.show" @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
                <div class="dropdown-right" v-if="showMenu || isMobile">
                    <dropdown type="icon">
                        <template #button>
                            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </template>
                        <li>
                            <router-link tag="a" :to="{ name: 'acerca_de' }">
                                {{ $t('acercaDe') }}
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'terms' }" tag="a">
                                {{ $t('tyc') }}
                            </router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <a @click="setLocale('arg')">Español</a>
                        </li>
                        <li>
                            <a @click="setLocale('en')">English</a>
                        </li>
                        <li v-if="user">
                            <router-link
                                :to="{ name: 'profile', params: { id: 'me' } }"
                            >
                                {{ $t('perfil') }}
                            </router-link>
                        </li>
                        <!-- /soporte (mesa de ayuda), mobile -->
                        <li v-if="user">
                            <router-link :to="{ name: 'tickets' }">{{
                                $t('soporte')
                            }}</router-link>
                        </li>
                        <li v-if="showChangelogNav">
                            <a @click="openChangelog">{{ $t('ultimosCambios') }}</a>
                        </li>
                        <li
                            v-if="user"
                            role="separator"
                            class="divider"
                        ></li>
                        <li v-if="user">
                            <a @click="logout" v-if="!isFacebokApp">{{
                                $t('cerrarSesion')
                            }}</a>
                        </li>
                    </dropdown>
                </div>
            </div>

            <div
                class="actionbar_section actionbar_icon pull-right"
                v-if="isMobile && user && !shouldHideDonationOnIOSCapacitor(user)"
            >
                <a
                    href="/donar"
                    class="btn btn-primary btn-donar-header btn-header-small btn-lg"
                >
                    {{ $t('donar') }}
                </a>
            </div>
            <div
                class="actionbar_section actionbar_icon pull-right"
                v-if="isMobile && !user"
            >
                <router-link
                    v-if="isTripsPage"
                    tag="a"
                    :to="{ name: 'login' }"
                    class="btn btn-primary btn-login-header btn-header-small btn-lg"
                >
                    Ingresar
                </router-link>
            </div>
        </div>
        <div class="header_content hidden-xs">
            <router-link
                :to="{ name: 'trips', query: { clearSearch: 'true' } }"
                v-on:click.native="tripsClick"
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
                <div class="header-social-links">
                    <a
                        href="https://www.instagram.com/carpoolear/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="header-social-link"
                        aria-label="Instagram Carpoolear"
                    >
                        <img :src="instagram_logo" alt="" />
                    </a>
                    <a
                        href="https://www.facebook.com/Carpoolear"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="header-social-link"
                        aria-label="Facebook Carpoolear"
                    >
                        <img :src="facebook_logo" alt="" />
                    </a>
                </div>
                <router-link
                    v-if="config.trip_card_design !== 'light'"
                    class="btn btn-link trips-link"
                    :to="{ name: 'trips', query: { clearSearch: 'true' } }"
                >
                    {{ $t('viajes') }}
                </router-link>
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">Información</router-link>-->
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'register'}">Registrarme</router-link>-->
                <dropdown type="link" v-if="!logged">
                    <template #button>
                        {{ currentLocaleShortLabel }}
                    </template>
                    <li>
                        <a @click="setLocale('arg')">Español</a>
                    </li>
                    <li>
                        <a @click="setLocale('en')">English</a>
                    </li>
                </dropdown>
                <router-link
                    class="btn btn-primary"
                    btn-lg
                    v-if="!logged"
                    :to="{ name: 'login' }"
                >
                    {{ $t('inicio') }}
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
                    <dropdown type="info" v-if="logged">
                        <template #button>
                            <div
                                class="circle-box header_profile_image"
                                v-imgSrc:profile="user.image"
                            ></div>
                        </template>
                        <li>
                            <router-link :to="{ name: 'my-trips' }">
                                {{ $t('misViajes') }}
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'conversations-list' }">
                                {{ $t('mensajes') }}
                            </router-link>
                        </li>
                        <li>
                            <router-link
                                :to="{ name: 'profile', params: { id: 'me' } }"
                            >
                                {{ $t('perfil') }}
                            </router-link>
                        </li>
                        <!-- /soporte (mesa de ayuda), desktop -->
                        <li>
                            <router-link :to="{ name: 'tickets' }">{{
                                $t('soporte')
                            }}</router-link>
                        </li>
                        <li v-if="showChangelogNav">
                            <a @click="openChangelog">{{ $t('ultimosCambios') }}</a>
                        </li>
                        <li v-if="user.is_admin">
                            <router-link :to="{ name: 'admin-dashboard' }">
                                {{ $t('administracion') }}
                            </router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <a @click="setLocale('arg')">Español</a>
                        </li>
                        <li>
                            <a @click="setLocale('en')">English</a>
                        </li>
                        <li role="separator" class="divider"></li>
                        <!--<li>
                            <router-link :to="{name: 'acerca_de'}">Acerca</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <router-link :to="{name: 'profile_update'}">Configuración</router-link>
                        </li>-->
                        <li>
                            <a @click="logout" v-if="!isFacebokApp">{{
                                $t('cerrarSesion')
                            }}</a>
                        </li>
                    </dropdown>
                </div>

                <a
                    v-if="!shouldHideDonationOnIOSCapacitor(user)"
                    href="/donar"
                    class="btn btn-primary btn-donar-header btn-lg"
                    >{{ $t('donar') }}</a
                >
                <router-link
                    v-if="logged"
                    :to="{ name: 'new-trip' }"
                    id="btn-create-trip"
                    class="btn btn-primary btn-lg"
                >
                    {{ $t('crearViaje') }}
                </router-link>
            </div>
            <div class="cf"></div>
        </div>
    </header>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useNotificationsStore } from '../../stores/notifications';
import { useActionbarsStore } from '../../stores/actionbars';
import { useDeviceStore } from '../../stores/device';
import { useTripsStore } from '../../stores/trips';
import { useChangelogStore } from '../../stores/changelog';
import dropdown from '../Dropdown';
import router from '../../router';
import bus from '../../services/bus-event.js';
import IdentityValidationCountdownBanner from '../IdentityValidationCountdownBanner.vue';
import UserRatingsCounts from '../elements/UserRatingsCounts.vue';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';

export default {
    name: 'headerApp',

    data() {
        return {
            background_desktop_mini:
                process.env.ROUTE_BASE +
                'img/' +
                process.env.TARGET_APP +
                '_background_desktop_mini.png',
            background_desktop:
                process.env.ROUTE_BASE +
                'img/' +
                process.env.TARGET_APP +
                '_background_desktop.png',
            app_logo:
                process.env.ROUTE_BASE +
                'img/' +
                process.env.TARGET_APP +
                '_logo.png',
            facebook_logo: process.env.ROUTE_BASE + 'img/fb_logo.png',
            instagram_logo: process.env.ROUTE_BASE + 'img/instagram-logo.png'
        };
    },

    mounted() {
        bus.on('header-title-change', this.onHeaderChange);
    },

    computed: {
        ...mapState(useAuthStore, {
            logged: 'checkLogin',
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useNotificationsStore, {
            notificationsCount: 'count'
        }),
        ...mapState(useActionbarsStore, {
            title: 'title',
            titleLink: 'titleLink',
            subTitle: 'subTitle',
            headerRatings: 'headerRatings',
            imgTitle: 'imgTitle',
            showMenu: 'showMenu',
            leftHeaderButton: 'leftHeaderButton',
            rightHeaderButton: 'rightHeaderButton',
            logoHeaderVisibility: 'headerLogoVisibility'
        }),
        ...mapState(useDeviceStore, {
            isNotLargeDesktop: 'isNotLargeDesktop',
            isFacebokApp: 'isFacebokApp',
            isMobile: 'isMobile'
        }),
        ...mapState(useChangelogStore, {
            hasAnyChangelog: 'hasAnyChangelog'
        }),
        showChangelogNav() {
            return this.logged && this.hasAnyChangelog;
        },

        showLogo() {
            for (let i = 0; i < this.leftHeaderButton.length; i++) {
                if (this.leftHeaderButton[i].show) {
                    return false;
                }
            }
            return true;
        },
        isTripsPage() {
            return this.$route.name === 'trips';
        },
        currentLocaleLabel() {
            const labels = { arg: 'Español', en: 'English' };
            return labels[this.$i18n.locale] || 'Español';
        },
        currentLocaleShortLabel() {
            const short = { arg: 'ES', en: 'EN' };
            return short[this.$i18n.locale] || 'ES';
        },
        actionbarTitleWidthClass() {
            const n = this.$route && this.$route.name;
            return n === 'identity_validation' || n === 'identity_validation_manual'
                ? 'actionbar_title--settings-wide'
                : '';
        }
    },

    methods: {
        openChangelog() {
            bus.emit('changelog:open');
        },
        shouldHideDonationOnIOSCapacitor(user) {
            return shouldHideDonationOnIOSCapacitor(user);
        },
        logout() {
            useAuthStore().logout();
        },

        toNotifications() {
            router.push({ name: 'notifications' });
        },

        onClick(item) {
            bus.emit(item.id + '-click');
        },

        tripsClick() {
            useTripsStore().refreshListAction(true);
            useTripsStore().tripsSearch({ is_passenger: false });
        },

        onHeaderChange() {
            // console.log('header-change', this.title);
        },

        setLocale(locale) {
            this.$root.$i18n.locale = locale;
            localStorage.setItem('app_locale', locale);
        }
    },
    watch: {
        title(_old, _new) {
        }
    },
    components: {
        dropdown,
        IdentityValidationCountdownBanner,
        UserRatingsCounts
    }
};
</script>

<style scoped>
.trips-link {
    font-weight: bold;
}
.header-social-links {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-right: 3rem;
    vertical-align: middle;
}
.header-social-link img {
    width: 22px;
    height: 22px;
    display: block;
    object-fit: contain;
    vertical-align: middle;
    margin-right: 1rem;
}
.header-social-link:hover img {
    opacity: 0.85;
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
</style>
