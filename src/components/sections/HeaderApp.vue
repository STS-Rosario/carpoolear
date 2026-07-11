<template>
    <header class="header header-component">
        <IdentityValidationCountdownBanner />
        <PendingRatingsBanner />
        <div
            class="mobile-header-bar visible-xs"
            v-if="$route.name !== 'mobile-menu'"
            :class="{ 'mobile-header-bar--with-ratings': headerRatings }"
        >
            <div class="mobile-header-bar__section mobile-header-bar__icon">
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
                class="mobile-header-bar__section mobile-header-bar__title"
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
            <div class="mobile-header-bar__section mobile-header-bar__icon mobile-header-bar__icon--right">
                <template v-for="item in mobileUtilityHeaderButtons" :key="item.id">
                    <span v-if="item.show" @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
                <div
                    class="mobile-header-bar__actions"
                    v-if="isMobile && logged"
                >
                    <span
                        class="mobile-header-bar__action"
                        @click="toNotifications"
                        aria-label="Notificaciones"
                    >
                        <svgItem size="22" icon="bell"></svgItem>
                        <span
                            class="mobile-header-bar__badge"
                            v-if="notificationsCount > 0"
                        ></span>
                    </span>
                </div>
                <div class="dropdown-right" v-if="showMenu && !isMobile">
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
                class="mobile-header-bar__section mobile-header-bar__icon mobile-header-bar__icon--right"
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
                    aria-label="Notificaciones"
                >
                    <svgItem size="22" icon="bell"></svgItem>
                    <span class="badge" v-if="notificationsCount > 0">
                        {{ notificationsCount }}
                    </span>
                </span>

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
                <header-menu-dropdown />
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
import PendingRatingsBanner from '../PendingRatingsBanner.vue';
import HeaderMenuDropdown from './HeaderMenuDropdown.vue';
import svgItem from '../SvgItem';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';
import { UserApi } from '../../services/api';
import {
    persistLocaleChoice,
    syncLocaleToBackend,
} from '../../utils/userLocale.js';
import { installAppHeaderOffsetObserver } from '../../utils/appHeaderOffset.js';

const userApi = new UserApi();

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
        this.stopHeaderOffsetObserver = installAppHeaderOffsetObserver(
            this.$el
        );
    },

    beforeUnmount() {
        bus.off('header-title-change', this.onHeaderChange);
        if (this.stopHeaderOffsetObserver) {
            this.stopHeaderOffsetObserver();
        }
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
                ? 'mobile-header-bar__title--settings-wide'
                : '';
        },
        mobileUtilityHeaderButtons() {
            if (!this.isMobile) {
                return this.rightHeaderButton;
            }
            return this.rightHeaderButton.filter((item) => item.id !== 'search');
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
            persistLocaleChoice(locale);
            syncLocaleToBackend(userApi, locale, this.logged).catch(() => {});
        }
    },
    watch: {
        title(_old, _new) {
        }
    },
    components: {
        dropdown,
        IdentityValidationCountdownBanner,
        UserRatingsCounts,
        PendingRatingsBanner,
        HeaderMenuDropdown,
        svgItem
    }
};
</script>

<style scoped>
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
.header_notifications {
    display: inline-flex;
    align-items: center;
    position: relative;
    padding-left: 10px;
    padding-right: 6px;
    cursor: pointer;
    vertical-align: middle;
    line-height: 0;
}
.header_notifications :deep(svg) {
    fill: #fff;
    display: block;
}
.mobile-header-bar__actions {
    display: inline-flex;
    align-items: center;
    gap: 2.5rem;
    margin-left: 0.5rem;
    padding-right: 1.3rem;
    vertical-align: middle;
}
.mobile-header-bar__action {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 0;
    vertical-align: middle;
}
.mobile-header-bar__action :deep(svg) {
    fill: #fff;
    display: block;
}
.mobile-header-bar__badge {
    position: absolute;
    top: -2px;
    right: -4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #e53935;
}
.mobile-header-bar__icon img {
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
